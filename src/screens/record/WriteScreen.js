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
  const [response, setResponse] = useState(null);
  const record = useStore((state) => state.record);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const captureURL = useStore((state) => state.captureURL);
  const feeds = useStore((state) => state.feeds);
  const setFeeds = useStore((state) => state.setFeeds);

  /** 저장하기 */
  const handleSubmit = async (title) => {
    setIsLoading(true);
    try {
      // 캡쳐 이미지
      const filename = 'record' + new Date().getTime() + (Math.random()*1000).toFixed(0);
      const reference = storage().ref(`/record/${filename}`);
      await reference.putFile(captureURL);
      const url = await reference.getDownloadURL();

      // 포토 이미지
      let photoURL = '';    
      if (response) {
        const asset = response.assets[0];
        const extension = asset.fileName.split('.').pop();
        const reference = storage().ref(`/challenge/${new Date().getTime()}.${extension}`);
        if (Platform.OS === 'android') {
          await reference.putString(asset.base64, 'base64', {
            contentType: asset.type,
          });
        } else {
          await reference.putFile(asset.uri);
        }
        photoURL = response ? await reference.getDownloadURL() : null;
      }

      const recordData = {
        ...record,
        title,
        photoURL,
        captureURL: url,
      }
      await firestore().collection('Records').add(recordData);
      setFeeds([recordData, ...feeds]);
      
      // 업데이트용
      let challengeData = {};
      let levelupData = {};
      let bestRecordData = {};

      // 챌린지 중일 경우
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
      
      // 최고기록 체크
      let recordFive = user.record.five;
      let recordTen = user.record.ten;
      let recordHalf = user.record.half;
      let recordFull = user.record.full;
      let bonusPoint = 0;
      const five = user.record.five === 0 ? 30000 : user.record.five;
      const ten = user.record.ten === 0 ? 30000 : user.record.ten;
      const half = user.record.half === 0 ? 30000 : user.record.half;
      const full = user.record.full === 0 ? 30000 : user.record.full;
      if (recordData.distance >= 5) {
        if (recordData.paceDetail[4] < five) {
          bonusPoint = 50;
          recordFive = recordData.paceDetail[4];
        }
      }
      if (recordData.distance >= 10) {
        if (recordData.paceDetail[9] < ten) {
          bonusPoint = 100;
          recordTen = recordData.paceDetail[9];
        }
      }
      if (recordData.distance >= 21) {
        if (recordData.paceDetail[20] < half) {
          bonusPoint = 210;
          recordHalf = recordData.paceDetail[20];
        }
      }
      if (recordData.distance >= 42) {
        if (recordData.paceDetail[41] < full) {
          bonusPoint = 42;
          recordFull = recordData.paceDetail[41];
        }
      }
      bestRecordData = {
        record: {
          five: recordFive,
          ten: recordTen,
          half: recordHalf,
          full: recordFull,
        }
      }

      // 레벨업 체크      
      const distanceExp = ((record.distance*10) * 0.6).toFixed(0);
      const currentExp = +user.exPoint + +distanceExp + bonusPoint;
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
        
      await updateUser(user.uid, {...challengeData, ...levelupData, ...bestRecordData});
      setUser({...user, ...challengeData, ...levelupData, ...bestRecordData});
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

  const submitMutaion = useMutation(handleSubmit, {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('myrecord');
      navigation.navigate('FeedStack');
    },
  });

  return (
    <Write
      navigation={navigation}
      isLoading={isLoading}
      response={response}
      setResponse={setResponse}
      submitMutaion={submitMutaion}
    />
  );
}

export default WriteScreen;
