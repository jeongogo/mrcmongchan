import React, {useState, useRef, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import useStore from "../../store/store";
import Terms from "./Terms";

function Login({isSignUp, handleLogin}) {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const terms = useStore((state) => state.terms);

  const createChangeTextHandler = (name) => (value) => {
    setForm({...form, [name]: value});
  };

  const onSecondaryButtonPress = () => {
    if (isSignUp) {
      navigation.goBack();
    } else {
      navigation.push('Login', {isSignUp: true});
    }
  }

  const onSubmit = () => {
    if (form.email === '' || form.password === '') {
      return;
    }
    handleLogin(form);
  }

  useEffect(() => {
    if (!terms.service) {
      console.log('약관 동의 받자');
    }
  }, []);

  return (
    <View style={styles.container}>
      {!terms.service &&
        <Terms />
      }
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={createChangeTextHandler('email')}
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="email"
        keyboardType="email-address"
        returnKeyType='next'
        onSubmitEditing={() => passwordRef.current.focus()}
        placeholder='이메일'
        placeholderTextColor='black'
      />
      <TextInput
        style={[styles.input, styles.margin]}
        value={form.password}
        onChangeText={createChangeTextHandler('password')}
        secureTextEntry
        ref={passwordRef}
        returnKeyType={isSignUp ? 'next' : 'done'}
        onSubmitEditing={() => {
          if (isSignUp) {
            confirmPasswordRef.current.focus();
          } else {
            onSubmit();
          }
        }}
        placeholder='비밀번호'
        placeholderTextColor='black'
      />
      {isSignUp && (
        <TextInput
          style={[styles.input, styles.margin]}
          value={form.confirmPassword}
          onChangeText={createChangeTextHandler('confirmPassword')}
          secureTextEntry
          ref={confirmPasswordRef}
          returnKeyType='done'
          onSubmitEditing={onSubmit}
          placeholder='비밀번호 확인'
          placeholderTextColor='black'
        />
      )}
      <Pressable
        onPress={onSubmit}
        style={({pressed}) => [
          styles.wrapper,
          styles.primaryWrapper,
          Platform.OS === 'ios' && pressed && {opacity: 0.5},
        ]}
        android_ripple={{
          color: '#ffffff',
        }}
      >
        <Text style={[styles.text, styles.primaryText]}>{isSignUp ? '회원가입' : '로그인'}</Text>
      </Pressable>
      <Pressable
        onPress={onSecondaryButtonPress}
        style={({pressed}) => [
          styles.wrapper,
          Platform.OS === 'ios' && pressed && {opacity: 0.5},
        ]}
        android_ripple={{
          color: '#ffffff',
        }}
      >
        <Text style={[styles.text]}>{isSignUp ? '로그인' : '회원가입'}</Text>
      </Pressable>
      <View style={styles.hr}></View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  input: {
    borderColor: '#bdbdbd',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 48,
    color: '#000',
    backgroundColor: 'white'
  },
  wrapper: {
    marginTop: 10,
    borderRadius: 4,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E53A40',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  primaryWrapper: {
    backgroundColor: '#E53A40',
  },
  text: {
    color: '#E53A40',
  },
  primaryText: {
    color: 'white',
  },
  margin: {
    marginTop: 10,
  },
  hr: {
    marginTop: 30,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  }
});

export default Login