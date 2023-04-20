import React, { useEffect, useState } from 'react';
import {View, StyleSheet} from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import useStore from "../../store/store";
import { getUser } from '../../lib/user';
//import { GOOGLE_API_KEY } from "@env";
import Loader from "../../components/common/Loader";

function LoginScreen({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useStore((state) => state.setUser);

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

      console.log(profile);

      if (!profile) {
        navigation.navigate('Welcome', {uid: user.uid});
      } else {
        setUser(profile);
      }
    } catch (e) {
      console.log('에러', e)
      crashlytics().recordError(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    googleSigninConfigure();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && <Loader />}
      <View style={styles.login}>
        <GoogleSigninButton onPress={() => onGoogleButtonPress()} style={styles.googleBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 60,
  },
  login: {
    
  },
  googleBtn: {
    width: '100%',
  },
});

export default LoginScreen;
