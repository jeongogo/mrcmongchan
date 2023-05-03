import React, {useEffect, useState} from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import useStore from "../../store/store";
import {View, Text, TextInput, Image, StyleSheet, Alert, Pressable, useWindowDimensions} from 'react-native';
import Loader from "../../components/common/Loader";

function Write({navigation, isLoading, handleSubmit}) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [title, setTitle] = useState('');
  const width = useWindowDimensions().width;
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const record = useStore((state) => state.record);
  const captureURL = useStore((state) => state.captureURL);

  /** 삭제하기 */
  const onDelete = () => {
    Alert.alert("", "기록을 삭제히겠습니까?", [
      {
        text: "취소",
        onPress: () => null,
      },
      {
        text: "확인",
        onPress: () => {
          setUser({...user, trainingMission: ''});
          navigation.navigate('RecordHome');
        }
      }
    ]);
  }

  const onSubmit = () => {
    handleSubmit(title);
  }

  useEffect(() => {
    setMinutes(Math.floor(record.totalTime/60));
    setSeconds(record.totalTime - (Math.floor(record.totalTime/60) * 60));
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        {isLoading && <Loader />}
        <View style={styles.imageWrap}>
          {captureURL &&
            <Image style={styles.image} width={width} source={{uri: captureURL}} />
          }
        </View>
        <View style={styles.wrap}>
          <TextInput value={title} style={styles.input} onChangeText={setTitle} placeholder="달리기 제목" placeholderTextColor='#aaa' />
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>이동 거리</Text>
          <Text style={styles.text}>{record.distance}km</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>이동 시간</Text>
          <Text style={styles.text}>{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>페이스</Text>
          <Text style={styles.text}>{record.pace}</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>소모 칼로리</Text>
          <Text style={styles.text}>{record.calorie}k㎈</Text>
        </View>
        <View style={styles.btnWrap}>
          <Pressable style={styles.btn} onPress={onDelete}>
            <Text style={[styles.btnText, styles.cancel]}>삭제하기</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={onSubmit}>
            <Text style={[styles.btnText, styles.submit]}>저장하기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  imageWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    height: 200,
  },
  input: {
    marginBottom: 5,
    width: '100%',
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#222',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
  },
  wrap: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#222',
  },
  btnWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 30,
  },
  btn: {
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
  },
  btnText: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },
  cancel: {
    color: '#E53A40',
    backgroundColor: '#fff',
    borderColor: '#E53A40',
  },
  submit: {
    color: 'white',
    backgroundColor: '#E53A40',
    borderColor: '#E53A40',
  },
});

export default Write;