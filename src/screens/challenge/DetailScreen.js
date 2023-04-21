import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import useStore from "../../store/store";
import { updateUser } from "../../lib/user";
import {View, Pressable, Text, StyleSheet} from 'react-native';
import Entry from '../../components/challenge/Entry';

function DetailScreen({route}) {
  const [challenge, setChallenge] = useState('');
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  /** 챌린지 가져오기 */
  const getChallenge = async () => {
    try {
      const res = await firestore().collection('Challenges').doc(route.params.id).get();
      setChallenge(res.data());
    } catch (e) {
      console.log(e);
    }
  }

  /** 참가 신청하기 */
  const onApplicant = () => {
    
  }

  /** 참가 신청 취소하기 */
  const onApplicantCancel = () => {

  }

  /** 신청 수락하기 */
  const onAttend = async () => {
    try {
      const newEntry = {
        uid: user.uid,
        name: user.name,
        distance: 0,
      }

      // 챌린지에 참가자 추가
      await firestore().collection('Challenges').doc(route.params.id).update({
        entry: [...challenge.entry, newEntry]
      });
      setChallenge({...challenge, entry: [...challenge.entry, newEntry]});
      
      // 유저에 챌린지 추가
      await updateUser(user.uid, {challenge: route.params.id});
      setUser({...user, challenge: route.params.id});

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getChallenge();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.goal}>목표 거리 : {challenge.goal}km</Text>
        {user.challenge === ''
          ?
            <Pressable style={styles.attendBtn} onPress={onApplicant}>
              <Text style={styles.attendText}>참가 신청하기</Text>
            </Pressable>
          :
            <Pressable style={styles.attendBtn} onPress={ononApplicantCancel}>
              <Text style={styles.attendText}>참가 신청 취소</Text>
            </Pressable>
        }
      </View>
      <View style={styles.entry}>
        {(challenge.entry?.length > 0) && 
          challenge.entry.map((entry) => (
            <Entry key={entry.id} entry={entry} />
        ))}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#000',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  goal: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  attendBtn: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#222',
  },
  attendText: {
    fontSize: 16,
    color: '#AEEA00',
    textAlign: 'center',
  },
  entry: {
    marginTop: 10,
  }
});

export default DetailScreen;