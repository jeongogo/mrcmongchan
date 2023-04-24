import React, {useState} from 'react';
import {View, Text, Button, TextInput, Alert, StyleSheet} from 'react-native';
import Loader from "../../components/common/Loader";
import useStore from "../../store/store";
import { createUser } from "../../lib/user";

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
        challenge: '',
        challengeApplicant: '',
      }
      createUser(newUser)
      setUser(newUser);
      navigation.navigate('Home');
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {isLoading && <Loader />}
      <Text style={styles.title}>환영합니다.</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="이름" />
      <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="몸무게(kg)" />
      <View style={styles.btnWrap}>
        <Button onPress={onSubmit} title="저장" />
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
    marginBottom: 10,
    padding: 10,
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  btnWrap: {
    marginTop: 10,
  },
});

export default WelcomeScreen