import React, {useEffect, useState} from 'react';
import { useNavigation } from "@react-navigation/native";
import { updateUser } from "../../lib/user";
import {View, Text, StyleSheet, Pressable} from 'react-native';
import useStore from "../../store/store";

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
      <Text style={styles.title}>{mission.day}일차 미션</Text>
      <Text style={styles.text}>{mission.content}</Text>
        {mission.isComplete
          ?
            <View style={styles.btnComplete}>
              <Text style={styles.btnText}>완료</Text>
            </View>
          :
            <Pressable onPress={onStart} style={styles.btn}>
              <Text style={styles.btnText}>도전</Text>
            </Pressable>
        }
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    color: 'white',
  },
  text: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: '#fff',
  },
  btnComplete: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#AEEA00',
  },
  btn: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#AEEA00',
  },
  btnText: {
    fontSize: 18,
    fontWeight: 500,
    color: '#000',
  }
});

export default Progress;