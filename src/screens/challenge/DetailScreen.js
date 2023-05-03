import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from "@react-navigation/native";
import useStore from "../../store/store";
import { getUser, updateUser } from "../../lib/user";
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

  /** Update User */
  const refreshUser = async () => {
    const profile = await getUser(user.uid);
    setUser(profile);
  }

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
  const onApplicant = async () => {
    try {
      const newApplicant = {
        uid: user.uid,
        name: user.name
      };

      await docRef.update({
        applicants: [...challenge.applicants, newApplicant]
      });

      await updateUser(user.uid, {challengeApplicant: route.params.id});

      Alert.alert("", "챌린지 신청이 완료되었습니다.", [
        {
          text: "확인",
          onPress: () => null
        }
      ]);

      setChallenge({...challenge, applicants: [...challenge.applicants, newApplicant]});

      setUser({...user, challengeApplicant: route.params.id});

    } catch (e) {
      console.log('여기', e);
    }
  }

  /** 참가 취소하기 */
  const handleLeave = async () => {
    try {
      let filterEntry = [];
      let filterApplicants = [];

      if (challenge.entry?.length > 0) {
        filterEntry = challenge.entry.filter((i) => i.uid !== user.uid);
      }
      if (challenge.applicants?.length > 0) {
        filterApplicants = challenge.applicants.filter((i) => i.uid !== user.uid);
      }
      if (user.challenges?.length > 0) {
        filterApplicants = challenge.applicants.filter((i) => i.uid !== user.uid);
      }

      await docRef.update({
        entry: filterEntry,
        applicants: filterApplicants,
      });

      await updateUser(user.uid, { challenge: '', challengeApplicant: '' });

      setUser({...user, challenge: '', challengeApplicant: '' });

      navigation.navigate('ChallengeHome');
    } catch (e) {
      console.log(e);
    }
  }

  /** 신청 수락하기 */
  const handleAttend = async (uid, name) => {
    try {
      const newEntry = {
        uid,
        name,
        distance: 0,
      }

      const filterApplicants = challenge.applicants.filter((i) => i.uid !== uid);

      // 챌린지에 참가자 추가
      await docRef.update({
        entry: [...challenge.entry, newEntry],
        applicants: filterApplicants,
      });
      
      // 유저에 챌린지 추가
      await updateUser(uid, {challenge: route.params.id, challengeApplicant: ''});

      Alert.alert("", "수락 완료되었습니다.", [
        {
          text: "확인",
          onPress: () => null
        }
      ]);

      setUser({...user, challenge: route.params.id});

      // 챌린지 업데이트
      setChallenge({...challenge, entry: [...challenge.entry, newEntry], applicants: filterApplicants});

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
    refreshUser();
  }, [isFocused]);

  useEffect(() => {
    setGoalCurrent((totalDistance/challenge.goal)*100);
  }, [totalDistance]);

  return (
    <Detail
      challenge={challenge}
      goalCurrent={goalCurrent}
      onApplicant={onApplicant}
      handleAttend={handleAttend}
      handleLeave={handleLeave}
      handleDelete={handleDelete}
      totalDistance={totalDistance}
    />
  )
};

export default DetailScreen;