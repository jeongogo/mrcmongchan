import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import firestore from '@react-native-firebase/firestore';
import useStore from "../../store/store";
import { updateUser } from "../../lib/user";
import {Alert} from 'react-native';
import Detail from "../../components/challenge/Detail";
import Loader from "../../components/common/Loader";

function DetailScreen({route, navigation}) {
  const routeId = route.params.id;
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const docRef = firestore().collection('Challenges').doc(routeId);
  const [isExpired, setIsExpired] = useState(false);

  /** 챌린지 가져오기 */
  const getChallenge = async () => {
    const res = await docRef.get();
    return res.data();
  }

  const challengeQuery = useQuery('challenge', getChallenge, {refetchOnMount: "always"});

  /** 참가 신청하기 */
  const handleAttend = async () => {
    try {
      const newEntry = {
        uid: user.uid,
        name: user.name,
        photoURL: user.photoURL,
        distance: 0,
      }

      // 챌린지에 참가자 추가
      await docRef.update({ entry: [...challengeQuery.data.entry, newEntry] });
      
      // 유저에 챌린지 추가
      await updateUser(user.uid, {challenge: routeId});
      setUser({...user, challenge: routeId});

      queryClient.invalidateQueries('challenge');
      queryClient.invalidateQueries('challenges');

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

  /** 참가자 수정 */
  const handleUpdateAttend = async (data) => {
    try {
      await docRef.update({ entry: data });
      queryClient.invalidateQueries('challenge');
    } catch (e) {
      console.log(e);
    }
  }

  /** 챌린지 나가기 */
  const handleLeave = async () => {
    try {
      let filterEntry = challengeQuery.data.entry.filter((i) => i.uid !== user.uid);

      await docRef.update({ entry: filterEntry });
      await updateUser(user.uid, { challenge: '' });

      setUser({...user, challenge: ''});
      queryClient.invalidateQueries('challenges');
      navigation.navigate('ChallengeHome');
    } catch (e) {
      console.log(e);
    }
  }

  /** 챌린지 삭제하기 */
  const handleDelete = async () => {
    await docRef.delete();
    queryClient.invalidateQueries('challenges');
    navigation.navigate('ChallengeHome');
  }

  useEffect(() => {
    if (challengeQuery.data) {
      const endTime = new Date(challengeQuery.data.endDate.toDate()).getTime();
      const nowTime = new Date().getTime();
      if (nowTime > endTime) {
        updateUser(user.uid, {challenge: ''});
        setUser({...user, challenge: ''})
        setIsExpired(true);
      }
    }
  }, [challengeQuery.data]);

  if (!challengeQuery.data) {
    return <Loader />
  }

  return (
    <Detail
      routeId={routeId}
      challenge={challengeQuery.data}
      isExpired={isExpired}
      handleAttend={handleAttend}
      handleUpdateAttend={handleUpdateAttend}
      handleLeave={handleLeave}
      handleDelete={handleDelete}
    />
  )
};

export default DetailScreen;