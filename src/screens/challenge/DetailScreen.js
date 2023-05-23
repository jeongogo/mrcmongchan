import React, {useState} from 'react';
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
  const [challenge, setChallenge] = useState('');
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const docRef = firestore().collection('Challenges').doc(routeId);

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
      await docRef.update({ entry: [...challenge.entry, newEntry] });
      setChallenge({...challenge, entry: [...challenge.entry, newEntry]});
      
      // 유저에 챌린지 추가
      await updateUser(user.uid, {challenge: routeId});
      setUser({...user, challenge: routeId});

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
  const handleDelete = async () => {
    await docRef.delete();
    queryClient.invalidateQueries('challenges');
    navigation.navigate('ChallengeHome');
  }

  if (!challengeQuery.data) {
    return <Loader />
  }

  return (
    <Detail
      routeId={routeId}
      challenge={challengeQuery.data}
      handleAttend={handleAttend}
      handleLeave={handleLeave}
      handleDelete={handleDelete}
    />
  )
};

export default DetailScreen;