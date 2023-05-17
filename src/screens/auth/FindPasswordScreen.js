import React from 'react';
import auth from '@react-native-firebase/auth';
import FindPassword from '../../components/auth/FindPassword';
import { Alert } from 'react-native';

function FindPasswordScreen() {
  const handleResetPassword = async (email) => {
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert("", "이메일로 비밀번호 재설정 링크가 발송되었습니다. 이메일을 확인해 주세요.", [
        {
          text: "확인",
          onPress: () => {}
        }
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <FindPassword handleResetPassword={handleResetPassword} />
  )
}

export default FindPasswordScreen;