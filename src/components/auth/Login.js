import React, {useState, useRef} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import { StyleSheet, View, Text, TextInput, Pressable, Linking, Alert } from 'react-native';

function Login({isSignUp, handleLogin}) {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [checkedService, setCheckedService] = React.useState(false);
  const [checkedPolicy, setCheckedPolicy] = React.useState(false);

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
    if (isSignUp) {
      if (!checkedService) {
        Alert.alert("", "서비스 이용약관에 동의해 주세요.", [
          {
            text: "확인",
            onPress: () => null,
          },
        ]);
        return;
      }
      if (!checkedPolicy) {
        Alert.alert("", "개인정보처리방침에 동의해 주세요.", [
          {
            text: "확인",
            onPress: () => null,
          },
        ]);
        return;
      }
    }
    handleLogin(form);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>환영합니다.</Text>
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
        placeholderTextColor='#222222'
      />
      <TextInput
        style={styles.input}
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
        placeholderTextColor='#222222'
      />
      {isSignUp && (
        <>
          <TextInput
            style={styles.input}
            value={form.confirmPassword}
            onChangeText={createChangeTextHandler('confirmPassword')}
            secureTextEntry
            ref={confirmPasswordRef}
            returnKeyType='done'
            onSubmitEditing={onSubmit}
            placeholder='비밀번호 확인'
            placeholderTextColor='#222222'
          />
          <View style={styles.policyCheck}>
            <View style={styles.policyWrap}>
              <Checkbox
                focusable={true}
                status={checkedService ? 'checked' : 'unchecked'}
                uncheckedColor="#E53A40"
                color="#E53A40"
                onPress={() => {
                  setCheckedService(!checkedService);
                }}
              />
              <Text style={styles.policyText}>(필수) </Text>
              <Pressable onPress={() => Linking.openURL('https://mymrc-382104.web.app/policy/service')}>
                <Text style={[styles.policyText, styles.underline]}>서비스 이용약관</Text>
              </Pressable>
              <Text style={styles.policyText}>에 동의합니다.</Text>
            </View>
            <View style={styles.policyWrap}>
              <Checkbox
                focusable={true}
                status={checkedPolicy ? 'checked' : 'unchecked'}
                uncheckedColor="#E53A40"
                color="#E53A40"
                onPress={() => {
                  setCheckedPolicy(!checkedPolicy);
                }}
              />
              <Text style={styles.policyText}>(필수) </Text>
              <Pressable onPress={() => Linking.openURL('https://mymrc-382104.web.app/policy/privacy')}>
                <Text style={[styles.policyText, styles.underline]}>개인정보처리방침</Text>
              </Pressable>
              <Text style={styles.policyText}>에 동의합니다.</Text>
            </View>
          </View>
        </>
      )}
      <View style={styles.btnWrap}>
        <Pressable
          onPress={onSubmit}
          style={({pressed}) => [
            styles.btn,
            styles.primaryBtn,
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
            styles.btn,
            Platform.OS === 'ios' && pressed && {opacity: 0.5},
          ]}
          android_ripple={{
            color: '#ffffff',
          }}
        >
          <Text style={[styles.text]}>{isSignUp ? '로그인' : '회원가입'}</Text>
        </Pressable>
        <Pressable style={styles.find} onPress={() => navigation.navigate('FindPassword')}>
          <Text style={styles.findText}>비밀번호 찾기</Text>
        </Pressable>
      </View>
      <View style={styles.hr}></View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  title: {
    marginBottom: 16,
    fontSize: 28,
    fontFamily: 'Pretendard-Bold',
    color: '#222',
    textAlign: 'center',
  },
  input: {
    marginTop: 10,
    paddingHorizontal: 10,
    height: 48,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
  },
  policyCheck: {
    marginTop: 20,
  },
  policyWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  policyText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#222',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  btnWrap: {
    marginTop: 16,
  },
  btn: {
    marginTop: 15,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E53A40',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
  },
  primaryBtn: {
    backgroundColor: '#E53A40',
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#E53A40',
  },
  primaryText: {
    fontFamily: 'Pretendard-Medium',
    color: 'white',
  },
  hr: {
    marginTop: 35,
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  find: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'flex-end',
  },
  findText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  }
});

export default Login