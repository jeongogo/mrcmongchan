import React, { useEffect, useState } from 'react';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import useStore from "../../store/store";
import { getUser } from '../../lib/user';
import { signIn, signUp } from '../../lib/auth';
//import { GOOGLE_API_KEY } from "@env";
import Login from "../../components/auth/Login";
import Loader from "../../components/common/Loader";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

function LoginScreen({route, navigation}) {
  const {isSignUp} = route.params ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useStore((state) => state.setUser);

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
    setIsLoading(true);
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
      setIsLoading(false);
    }
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
        <View style={styles.google}>
          <GoogleSigninButton onPress={() => onGoogleButtonPress()} style={styles.googleBtn} />
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
    paddingHorizontal: 30,
    backgroundColor: '#f3f3f3',
  },
  google: {
    
  },
  googleBtn: {
    width: '100%',
  },
});

export default LoginScreen;
