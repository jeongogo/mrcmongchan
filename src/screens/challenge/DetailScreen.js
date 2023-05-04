import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from "@react-navigation/native";
import useStore from "../../store/store";
import { updateUser } from "../../lib/user";
import {Alert} from 'react-native';
import Detail from "../../components/challenge/Detail";

function DetailScreen({route, navigation}) {
  const docRef = firestore().collection('Challenges').doc(route.params.id);
  const isFocused = useIsFocused();
  const [challenge, setChallenge] = useState('');
  const [totalDistance, setTotalDistance] = useState(0);
  const [goalCurrent, setGoalCurrent] = useState(0);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  /** 챌린지 가져오기 */
  const getChallenge = async () => {
    try {
      const res = await docRef.get();
      setChallenge(res.data());
      const total = res.data().entry.reduce((accumulator, current, index, array) => {
        return accumulator + current.distance;
      }, 0);
      setTotalDistance(total);
    } catch (e) {
      console.log(e);
    }
  }

  /** 참가 신청하기 */
  const handleAttend = async () => {
    try {
      const newEntry = {
        uid: user.uid,
        name: user.name,
        distance: 0,
      }

      // 챌린지에 참가자 추가
      await docRef.update({ entry: [...challenge.entry, newEntry] });
      setChallenge({...challenge, entry: [...challenge.entry, newEntry]});
      
      // 유저에 챌린지 추가
      await updateUser(user.uid, {challenge: route.params.id});
      setUser({...user, challenge: route.params.id});

      Alert.alert("", "참가 완료되었습니다.", [
        {
          text: "확인",
          onPress: () => null
        }
      ]);
    } catch (e) {
      console.log('여기', e);
    }
  }

  /** 참가 취소하기 */
  const handleLeave = async () => {
    try {
      let filterEntry = challenge.entry.filter((i) => i.uid !== user.uid);

      await docRef.update({ entry: filterEntry });
      await updateUser(user.uid, { challenge: '' });

      setUser({...user, challenge: ''});

      navigation.navigate('ChallengeHome');
    } catch (e) {
      console.log(e);
    }
  }

  /** 챌린지 삭제하기 */
  const handleDelete = () => {
    docRef.delete();
    navigation.navigate('ChallengeHome');
  }

  useEffect(() => {
    getChallenge();
  }, [isFocused]);

  useEffect(() => {
    setGoalCurrent((totalDistance/challenge.goal)*100);
  }, [totalDistance]);

  return (
    <Detail
      route={route}
      challenge={challenge}
      goalCurrent={goalCurrent}
      handleAttend={handleAttend}
      handleLeave={handleLeave}
      handleDelete={handleDelete}
      totalDistance={totalDistance}
    />
  )
};

export default DetailScreen;