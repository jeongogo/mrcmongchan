import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import { useMutation, useQueryClient } from 'react-query';
import storage from '@react-native-firebase/storage';
import useStore from "../../store/store";
import { updateUser } from "../../lib/user";
import {Alert} from 'react-native';
import Write from "../../components/record/Write";

function WriteScreen({navigation}) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState('');
  const record = useStore((state) => state.record);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const captureURL = useStore((state) => state.captureURL);
  let missionExp = 0;

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
      await firestore().collection('Records').add(recordData);
      
      // 챌린지 중일 경우
      let challengeData = {};
      if (user.challenge !== '') {
        const curr = new Date().getTime();
        const res = await firestore().collection('Challenges').doc(user.challenge).get();
        const data = res.data();
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        const kr_curr = new Date(curr + KR_TIME_DIFF);
  
        const start = data.startDate.toDate();
        const end = data.endDate.toDate();
  
        if (kr_curr > start && kr_curr <= end) {
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
          challengeData = {
            challenge: ''
          }
        }
      }
      
      // 레벨업 체크
      let levelupData = {};
      const distanceExp = ((record.distance*10) * 0.6).toFixed(0);
      const currentExp = +user.exPoint + +missionExp + +distanceExp;
      const lv = user.level + 1;
      const nextLvExp = ((lv-1) * (lv-1)) * ((lv * lv) - (13 * lv) + 82);      
      if (currentExp >= nextLvExp) {
        levelupData = {
          level: +user.level + 1,
          exPoint: currentExp - nextLvExp,
          distance: +user.distance + +record.distance,
        }
      } else {
        levelupData = {
          exPoint: currentExp,
          distance: +user.distance + +record.distance,
        }
      }      
      await updateUser(user.uid, {...challengeData, ...levelupData});

      // New Record
      // if (새로운 기록 달성하면) {
      // 축하 Alert
      //   ex += 보너스 경험치 (레벨*10)
      // }
      
      setUser({...user, ...challengeData, ...levelupData});

      queryClient.invalidateQueries('myrecord');
      queryClient.invalidateQueries('feed');

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
