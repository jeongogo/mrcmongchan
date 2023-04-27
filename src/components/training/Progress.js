import React, {useEffect, useState} from 'react';
import { useNavigation } from "@react-navigation/native";
import { updateUser } from "../../lib/user";
import {View, Text, StyleSheet, Pressable} from 'react-native';
import useStore from "../../store/store";

function Progress() {
  const navigation = useNavigation();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [mission, setMission] = useState({
    day: '',
    content: '',
    time: '',
    distance: '',
  });

  const onStart = () => {
    setUser({...user, trainingMission: mission});
    navigation.navigate('RecordHome');
  }

  useEffect(() => {
    if (user?.training?.program?.length < 1) {
      navigation.navigate('TrainingHome');
    }
    const today = new Date();
    const startDay = new Date(user.trainingStartDate.toDate());
    const todayStr = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();

    const currentProgram = user.training.program.filter((i) => {
      const currentStr = startDay.getFullYear() + '' + (startDay.getMonth() + i.day) + '' + startDay.getDate();
      if (todayStr === currentStr + 1) {
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
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mission.day}일차 미션</Text>
      <Text style={styles.text}>{mission.content}</Text>
      <Pressable onPress={onStart} style={styles.btn}>
        <Text style={styles.btnText}>시작</Text>
      </Pressable>
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
    paddingVertical: 50,
    paddingHorizontal: 30,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: '#fff',
  },
  btn: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#AEEA00',
  },
  btnText: {
    fontSize: 18,
    fontWeight: 700,
    color: '#000',
  }
});

export default Progress;