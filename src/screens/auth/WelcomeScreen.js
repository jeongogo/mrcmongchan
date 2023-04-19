import React, {useState} from 'react';
import {View, Text, Button, TextInput, Alert, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';

function WelcomeScreen({route}) {
  const {uid} = route.params ?? {};
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const userCollection = firestore().collection('Users');

  const onAddInfo = async () => {
    if (name.length < 1 || weight.length < 1) {
      return;
    }
    setIsLoading(true);
    try {
      const newUser = {
        uid,
        name,
        weight,
        distance: 0,
        record: {
          one: 0,
          five: 0,
          ten: 0,
          fifteen: 0,
          twenty: 0,
          thirty: 0,
          full: 0,
        },
      }
      await userCollection.doc(uid).set(newUser);
      setUser(newUser);
      navigation.navigate('Home');
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
      crashlytics().recordError(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>추가 정보 입력</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="이름" />
      <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="몸무게(kg)" />
      <View style={styles.btnWrap}>
        <Button onPress={onAddInfo} title="저장" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 60,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    padding: 10,
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  btnWrap: {
    marginTop: 20,
  },
});

export default WelcomeScreen