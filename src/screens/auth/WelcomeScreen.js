import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
import Loader from "../../components/common/Loader";
import useStore from "../../store/store";
import { createUser } from "../../lib/user";

function WelcomeScreen({route}) {
  const {uid} = route.params ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const setUser = useStore((state) => state.setUser);
  const snsType = useStore((state) => state.snsType);

  const onSubmit = async () => {
    if (name.length < 1 || weight.length < 1) {
      return;
    }
    setIsLoading(true);
    try {
      const newUser = {
        uid,
        snsType,
        name,
        photoURL: '',
        weight,
        weightList: [{
          weight,
          date: new Date(),
        }],
        level: 1,
        exPoint: 0,
        distance: 0,
        record: {
          five: 0,
          ten: 0,
          half: 0,
          full: 0,
        },
        challenge: '',
        created: new Date(),
        recordColor: 'f8ca00',
      }
      createUser(newUser)
      setUser(newUser);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {isLoading && <Loader />}
      <Text style={styles.title}>추가 정보 입력</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="이름"
        placeholderTextColor='black'
      />
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        placeholder="몸무게(kg)"
        placeholderTextColor='black'
      />
      <Pressable style={styles.btn} onPress={onSubmit}>
        <Text style={styles.btnText}>저장</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 50,
    backgroundColor: '#f3f3f3'
  },
  wrap: {
    padding: 10,
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 24,
    color: '#222',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginTop: 10,
    paddingHorizontal: 10,
    height: 48,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
  },
  btn: {
    marginTop: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E53A40',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    backgroundColor: '#E53A40',
  },
  btnText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  }
});

export default WelcomeScreen