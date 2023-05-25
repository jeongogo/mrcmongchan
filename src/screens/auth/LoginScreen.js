import React, { useEffect, useState } from 'react';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import useStore from "../../store/store";
import { getUser } from '../../lib/user';
import { signIn, signUp } from '../../lib/auth';
//import { GOOGLE_API_KEY } from "@env";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View, ActivityIndicator } from 'react-native';
import Login from "../../components/auth/Login";
import Loader from "../../components/common/Loader";

function LoginScreen({route, navigation}) {
  const {isSignUp} = route.params ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const [isSnsLoading, setIsSnsLoading] = useState(false);
  const setUser = useStore((state) => state.setUser);
  const setSnsType = useStore((state) => state.setSnsType);

  /** 로그인 */
  const handleLogin = async (form) => {
    Keyboard.dismiss();
    const {email, password, confirmPassword} = form;

    if (isSignUp && password !== confirmPassword) {
      Alert.alert('실패', '비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    const info = {email, password};

    try {
      const {user} = isSignUp ? await signUp(info) : await signIn(info);
      const profile = await getUser(user.uid);
      if (!profile) {
        // setSnsType();
        navigation.navigate('Welcome', {uid: user.uid});
      } else {
        setUser(profile);
      }
    } catch (e) {
      const messages = {
        'auth/email-already-in-use': '이미 가입된 이메일입니다.',
        'auth/wrong-password': '잘못된 비밀번호입니다.',
        'auth/user-not-found': '존재하지 않는 계정입니다.',
        'auth/invalid-email': '유효하지 않은 이메일 주소입니다.',
      };
      const msg = messages[e.code] || `${isSignUp ? '가입' : '로그인'} 실패`;
      Alert.alert('실패', msg);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  /** 구글 로그인 Config */
  const googleSigninConfigure = () => {
    GoogleSignin.configure({
      webClientId: "951452673062-663uraalfcgcpl3at89a4t5dk3eet9dl.apps.googleusercontent.com",
    });
  }
  
  /** 구글 로그인 */
  const onGoogleButtonPress = async () => {
    setIsSnsLoading(true);
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const { user } = await auth().signInWithCredential(googleCredential);
      
      const profile = await getUser(user.uid);

      if (!profile) {
        navigation.navigate('Welcome', {uid: user.uid});
      } else {
        setUser(profile);
      }
    } catch (e) {
      console.log('에러', e);
    } finally {
      setIsSnsLoading(false);
    }
  }

  const onAppleButtonPress = async () => {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
  
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }
  
    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
  
    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  }

  useEffect(() => {
    googleSigninConfigure();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ios: 'padding'})}>
      <SafeAreaView style={styles.container}>
        {isLoading && <Loader />}
        <View style={styles.form}>
          <Login isSignUp={isSignUp} handleLogin={handleLogin} />
        </View>
        <View style={styles.sns}>
          {isSnsLoading
            ? 
              <ActivityIndicator size='large' color="#E53A40" />
            :
              <>
                <GoogleSigninButton onPress={() => onGoogleButtonPress()} style={styles.google} />
                <AppleButton
                  buttonStyle={AppleButton.Style.BLACK}
                  buttonType={AppleButton.Type.SIGN_IN}
                  onPress={() => onAppleButtonPress().then(() => console.log('Apple sign-in complete!'))}
                  style={styles.apple}
                />
              </>
          }
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#f3f3f3',
  },
  sns: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  google: {
    flex: 1,
    height: 48,
  },
  apple: {
    height: 40,
    flex: 1,
    marginLeft: 7,
  }
});

export default LoginScreen;
