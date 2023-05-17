import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, Text, TextInput, Pressable } from 'react-native';

function FindPassword({handleResetPassword}) {
  const [email, setEmail] = useState('');

  const onSubmit = () => {
    if (email === '') {
      return;
    }
    handleResetPassword(email);
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>비밀번호 찾기</Text>
        <TextInput
          value={email}
          style={styles.input}
          onChangeText={setEmail}
          onSubmitEditing={onSubmit}
          placeholder='이메일'
        />
        <Pressable style={styles.btn} onPress={onSubmit}>
          <Text style={styles.btnText}>인증 메일 보내기</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 700,
    color: '#222',
    textAlign: 'center',
  },
  input: {
    paddingHorizontal: 15,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 5,
  },
  btn: {
    marginTop: 15,
    width: '100%',
    paddingVertical: 17,
    backgroundColor: '#E53A40',
    borderRadius: 10,
  },
  btnText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    fontWeight: 500,
    textAlign: 'center',
    color: '#fff',
  },
});

export default FindPassword;