import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import useStore from "../../store/store";
import { getUser, updateUser } from "../../lib/user";
import {Alert} from 'react-native';
import Write from "../../components/record/Write";

function WriteScreen({navigation}) {
  const [isLoading, setIsLoading] = useState('');
  const record = useStore((state) => state.record);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const trainingMission = useStore((state) => state.trainingMission);
  const setTrainingMission = useStore((state) => state.setTrainingMission);
  const captureURL = useStore((state) => state.captureURL);
  let missionExp = 0;

  /** 도전 성공 */
  const onSuccessMission = () => {
    const updateTraining = user.training.program.map((i) => {
      if (trainingMission.day === i.day) {
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
        onPress: async () => {
          missionExp = trainingMission.exPoint;
          await updateUser(user.uid, {training: updateTraining});
        }
      }
    ]);
  }

  /** 저장하기 */
  const handleSubmit = async (title) => {
    setIsLoading(true);
    try {
      const filename = 'record' + new Date().getTime() + (Math.random()*1000).toFixed(0);
      const reference = storage().ref(filename);
      await reference.putFile(captureURL);
      const url = await storage().ref(filename).getDownloadURL();

      const recordData = {
        ...record,
        title,
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
  
        const start = data.startDate.toDate();
        const end = data.endDate.toDate();
  
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
          await updateUser(user.uid, {challenge: ''});
        }
      }

      // 미션 도전중일 경우
      if (trainingMission?.content?.length > 0) {
        if (trainingMission.time > 0) {
          if (record.totalTime >= trainingMission.time/60) {
            onSuccessMission();
          } else {
            setTrainingMission('');
          }
        }
        if (trainingMission.distance > 0) {
          if (record.distance >= trainingMission.distance) {
            onSuccessMission();
          } else {
            setTrainingMission('');
          }
        }
      }
      
      // 레벨업 체크
      const distanceExp = ((record.distance*10) * 0.6).toFixed(0);
      const currentExp = +user.exPoint + +missionExp + +distanceExp;
      const lv = user.level + 1;
      const nextLvExp = ((lv-1) * (lv-1)) * ((lv * lv) - (13 * lv) + 82);

      if (currentExp >= nextLvExp) {
        await updateUser(user.uid, {
          level: +user.level + 1,
          exPoint: currentExp - nextLvExp,
          distance: +user.distance + +record.distance,
        });
      } else {
        await updateUser(user.uid, {
          exPoint: currentExp,
          distance: +user.distance + +record.distance,
        });
      }

      // New Record
      // if (새로운 기록 달성하면) {
      // 축하 Alert
      //   ex += 보너스 경험치 (레벨*10)
      // }
      
      const u = await getUser(user.uid);
      setUser(u);

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

  return (
    <Write
      navigation={navigation}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
    />
  );
}

export default WriteScreen;
