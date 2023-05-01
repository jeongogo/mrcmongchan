import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from "@react-navigation/native";
import useStore from "../../store/store";
import { getUser, updateUser } from "../../lib/user";
import {View, Pressable, Text, StyleSheet, Alert} from 'react-native';
import Entry from '../../components/challenge/Entry';
import Applicant from '../../components/challenge/Applicant';

function DetailScreen({route, navigation}) {
  const docRef = firestore().collection('Challenges').doc(route.params.id);
  const isFocused = useIsFocused();
  const [challenge, setChallenge] = useState('');
  const [totalDistance, setTotalDistance] = useState(0);
  const [goalCurrent, setGoalCurrent] = useState(0);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  /** Update User */
  const onUpdateUser = async () => {
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

  /** 참가 취소 Alert */
  const onLeave = () => {
    Alert.alert("", "챌린지 참가를 취소하시겠습니까?", [
      {
        text: "취소",
        onPress: () => null,
      },
      {
        text: "확인",
        onPress: () => {
          handleLeave();
        }
      }
    ]);
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

  /** 챌린지 삭제 Aleert */
  const onDelete = () => {
    Alert.alert("", "챌린지를 삭제하시겠습니까?", [
      {
        text: "취소",
        onPress: () => null,
      },
      {
        text: "확인",
        onPress: () => {
          handleDelete();
        }
      }
    ]);
  }

  /** 챌린지 삭제하기 */
  const handleDelete = () => {
    docRef.delete();
    navigation.navigate('ChallengeHome');
  }

  useEffect(() => {
    getChallenge();
    onUpdateUser();
  }, [isFocused]);

  useEffect(() => {
    setGoalCurrent((totalDistance/challenge.goal)*100);
  }, [totalDistance]);

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{challenge.title}</Text>
        <View style={styles.goalTitleWrap}>
          <Text style={styles.goalCurrentText}>{totalDistance}km</Text>
          <Text style={styles.goalText}>{challenge.goal}km</Text>
        </View>
        <View style={styles.goalBarWrap}>
          <View style={[styles.goalCurrent, {width: goalCurrent + '%'}]}></View>
          <View style={styles.goalTotal}></View>
        </View>
        <View style={styles.btnWrap}>
          {(user.challenge === '' && user.challengeApplicant === '')
            ?
              <Pressable style={styles.attendBtn} onPress={onApplicant}>
                <Text style={styles.attendText}>참가 신청하기</Text>
              </Pressable>
            :
              <Pressable style={styles.attendBtn} onPress={onLeave}>
                <Text style={styles.attendText}>참가 취소하기</Text>
              </Pressable>
          }
          {user.isAdmin &&
            <Pressable style={styles.attendBtn} onPress={onDelete}>
              <Text style={styles.attendText}>챌린지 삭제하기</Text>
            </Pressable>
          }
        </View>
      </View>
      <View style={styles.entry}>
        {(challenge.entry?.length > 0) && 
          challenge.entry.map((i) => (
            <Entry key={i.uid} entry={i} />
        ))}
      </View>
      {(user.isAdmin && challenge.applicants?.length > 0)
        ?
          <View style={styles.applicant}>
            <Text style={styles.subTitle}>신청자 목록</Text>
            {challenge.applicants.map((i) => (
              <Applicant key={i.uid} applicant={i} handleAttend={handleAttend} />
            ))}
          </View>
        :
          <></>
      }
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 30,
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
  goalTitleWrap: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  goalCurrentText: {
    fontSize: 20,
    color: '#AEEA00',
    textAlign: 'center',
  },
  goalText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  goalBarWrap: {
    marginTop: 10,
    position: 'relative',
    width: '100%',
    height: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  goalCurrent: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#AEEA00',
    zIndex: 2,
  },
  goalTotal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    zIndex: 1,
  },
  subTitle: {
    marginBottom: 5,
    fontSize: 18,
    color: '#fff',
  },
  btnWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  attendBtn: {
    marginTop: 15,
    marginHorizontal: 5,
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
    marginTop: 30,
  },
  applicant: {
    marginTop: 30,
  }
});

export default DetailScreen;