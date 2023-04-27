import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import useStore from "../../store/store";
import { updateUser } from "../../lib/user";
import {View, Text, Button, Image, StyleSheet, Alert} from 'react-native';
import Loader from "../../components/common/Loader";

function WriteScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState('');
  const captureURL = useStore((state) => state.captureURL);
  const record = useStore((state) => state.record);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  let userState = '';

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

  /** 도전 성공 */
  const onSuccessMission = () => {
    const updateTraining = training.program.map((i) => {
      if (user.trainingMission.day === i.day) {
        return {
          ...i,
          isComplete: true,
        }
      }
      return i;
    })
    Alert.alert("축하합니다.", "미션 도전에 성공했습니다.", [
      {
        text: "확인",
        onPress: () => {
          updateUser(user.uid, {
            ...user,
            challenge: userState === 'initChallenge' ? '' : user.challenge,
            exPoint: user.exPoint + user.trainingMission.exPoint,
            training: updateTraining
          });
          setUser({
            ...user,
            challenge: userState === 'initChallenge' ? '' : user.challenge,
            exPoint: user.exPoint + user.trainingMission.exPoint,
            training: updateTraining,
            trainingMission: ''
          });
          navigation.navigate('FeedStack');
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
        captureURL: url,
      }
      const data = await firestore().collection('Records').add(recordData);
      
      // 챌린지 중일 경우
      if (user.challenge !== '') {
        const curr = new Date().getTime();
        const res = await firestore().collection('Challenges').doc(user.challenge).get();
        const data = res.data();
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        const kr_curr = new Date(curr + KR_TIME_DIFF);
  
        const start = new Date(data.startDate.replaceAll(". ", "-"));
        const end = new Date(data.endDate.replaceAll(". ", "-"));
  
        if (kr_curr > start && kr_curr < end) {
          const entry = data.entry.map((i) => {
            if (i.uid === user.uid) {
              const n = {
                ...i,
                distance: +i.distance + +record.distance,
              }
              return n;
            }
            return i;
          });
          await firestore().collection('Challenges').doc(res.id).update({entry});
        }
  
        if (kr_curr > res.endDate) {
          // ex += 챌린지 토탈 거리 경험치;
          await updateUser(user.uid, {challenge: ''});
          userState = 'initChallenge';
        }
      }

      // 미션 도전중일 경우
      if (user?.trainingMission?.content?.length > 0) {
        if (user.trainingMission.time > 0) {
          if (record.totalTime > user.trainingMission.time * 60) {
            onSuccessMission();
          } else {
            if (userState === 'initChallenge') {
              setUser({...user, challenge: '', trainingMission: ''})
            } else {
              setUser({...user, trainingMission: ''})
            }
          }
        }
        if (user.trainingMission.distance > 0) {
          if (record.distance > user.trainingMission.distance) {
            onSuccessMission();
          } else {
            if (userState === 'initChallenge') {
              setUser({...user, challenge: '', trainingMission: ''})
            } else {
              setUser({...user, trainingMission: ''})
            }
          }
        }
      }

      // Level Up Check
      // const lv = user.level + 1;
      // const nextLevelEx = (lv-1 * lv-1) * ((lv * lv) - (13 * lv) + 82);
      // if (user.experience > nextLevelEx) {
      //   alert 레벨업 축하
      //   save for user (level up + 남은 경험치)
      // }

      // New Record
      // if (새로운 기록 달성하면) {
      // 축하 Alert
      //   ex += 보너스 경험치 (레벨*10)
      // }
      
      // save for user 누적 거리 더하기

      navigation.navigate('FeedStack');
    } catch (e) {
      Alert.alert("", e.message, [
        {
          text: "확인",
          onPress: () => null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setMinutes(Math.floor(record.totalTime/60));
    setSeconds(record.totalTime - (Math.floor(record.totalTime/60) * 60));
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
      <View style={styles.wrap}>
        <Text style={styles.text}>칼로리</Text>
        <Text style={styles.text}>{record.calorie}k㎈</Text>
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
    width: 250,
    height: 250,
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
