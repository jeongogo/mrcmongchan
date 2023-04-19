import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import useStore from "../../store/store";
import {View, Text, Button, Image, StyleSheet, Alert} from 'react-native';
import Loader from "../../components/common/Loader";

function WriteScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState('');
  const captureURL = useStore((state) => state.captureURL);
  const setCaptureURL = useStore((state) => state.setCaptureURL);
  const record = useStore((state) => state.record);
  const setRecord = useStore((state) => state.setRecord);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

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
          navigation.navigate('Record');
        }
      }
    ]);
  }

  /** 저장하기 */
  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const filename = 'record' + new Date().getTime() + (Math.random()*1000).toFixed(0);
      const reference = storage().ref(filename);
      await reference.putFile(captureURL);
      const url = await storage().ref(filename).getDownloadURL();

      const recordData = {
        ...record,
        // calorie: 칼로리 계산하자
        captureURL: url,
      }
      const data = await firestore().collection('Records').add(recordData);
      setIsLoading(false);
      setRecord('');
      setCaptureURL('');
      navigation.navigate('Feed');
    } catch (e) {
      Alert.alert("", e.message, [
        {
          text: "확인",
          onPress: () => null,
        },
      ]);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setMinutes(Math.floor(record.totalTime/1000/60));
    setSeconds((record.totalTime) - (minutes * 60));
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && <Loader />}
      <View style={styles.imageWrap}>
        {captureURL &&
          <Image style={styles.image} source={{uri: captureURL}} />
        }
      </View>
      <View style={styles.wrap}>
        <Text style={styles.text}>거리</Text>
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
      <View style={styles.btnWrap}>
        <View style={styles.btn}>
          <Button color='#E53935' title="삭제하기" onPress={onDelete} />
        </View>
        <View style={styles.btn}>
          <Button color='#0288D1' title="저장하기" onPress={onSubmit} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#000',
  },
  imageWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    minWidth: 100,
    fontSize: 20,
    color: 'white',
  },
  btnWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 30,
  },
  btn: {
    width: 120,
    marginLeft: 10,
    marginRight: 10,
  }
});

export default WriteScreen;
