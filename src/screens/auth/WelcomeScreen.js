import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
import Loader from "../../components/common/Loader";
import useStore from "../../store/store";
import { createUser } from "../../lib/user";
import CustomWrap from "../../components/common/CustomWrap";

function WelcomeScreen({route}) {
  const {uid} = route.params ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const setUser = useStore((state) => state.setUser);

  const onSubmit = async () => {
    if (name.length < 1 || weight.length < 1) {
      return;
    }
    setIsLoading(true);
    try {
      const newUser = {
        uid,
        name,
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
      <CustomWrap>
        <View style={styles.wrap}>
          {isLoading && <Loader />}
          <Text style={styles.title}>환영합니다.</Text>
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
      </CustomWrap>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 30,
  },
  wrap: {
    padding: 10,
  },
  title: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: 'black',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  btn: {
    padding: 15,
    backgroundColor: '#E53A40',
    borderRadius: 5,
  },
  btnText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  }
});

export default WelcomeScreen