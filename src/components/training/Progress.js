import React, {useEffect, useState} from 'react';
import { useNavigation } from "@react-navigation/native";
import { updateUser } from "../../lib/user";
import {View, Text, StyleSheet, Pressable} from 'react-native';
import useStore from "../../store/store";
import CustomWrap from '../common/CustomWrap';

function Progress() {
  const navigation = useNavigation();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const setTrainingMission = useStore((state) => state.setTrainingMission);
  const [mission, setMission] = useState({
    day: '',
    content: '',
    time: '',
    distance: '',
  });

  const onStart = () => {
    setTrainingMission(mission);
    navigation.navigate('RecordHome');
  }

  if (user?.training?.program?.length < 1) {
    return;
  }

  useEffect(() => {
    setTrainingMission('');
    const today = new Date();
    const todayStr = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
    
    const currentProgram = user.training.program.filter((i) => {
      let startDay = new Date(user.trainingStartDate.toDate());
      startDay.setDate(startDay.getDate() + i.day - 1);
      const currentStr = startDay.getFullYear() + '' + (startDay.getMonth() + 1) + '' + startDay.getDate();
      if (todayStr === currentStr) {
        return i;
      }
    });
    if (currentProgram.length < 1) {
      updateUser(user.uid, {...user, training: '', trainingStartDate: ''});
      setUser({...user, training: '', trainingStartDate: ''});
      navigation.navigate('RecordHome');
    }
    setMission({
      day: currentProgram[0].day,
      content: currentProgram[0].content,
      time: currentProgram[0].time,
      distance: currentProgram[0].distance,
      exPoint: currentProgram[0].exPoint,
      isComplete: currentProgram[0].isComplete,
    });
  }, []);

  return (
    <View style={styles.container}>
      <CustomWrap>
        <Text style={styles.title}>{mission.day}일차 미션</Text>
        <Text style={styles.text}>{mission.content}</Text>
        <View style={styles.btnWrap}>
          {mission.isComplete
            ?
              <View style={[styles.btn, styles.complete]}>
                <Text style={styles.btnText}>미션 완료</Text>
              </View>
            :
              <Pressable onPress={onStart} style={styles.btn}>
                <Text style={styles.btnText}>도전하기</Text>
              </Pressable>
          }
        </View>
      </CustomWrap>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
  },
  title: {
    marginTop: 15,
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
  },
  text: {
    marginTop: 10,
    width: '100%',
    fontSize: 15,
    color: '#454545',
    textAlign: 'center',
  },
  btnWrap: {
    marginTop: 20,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#E53A40',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
    textAlign: 'center',
  },
  complete: {
    backgroundColor: '#34314c',
  }
});

export default Progress;