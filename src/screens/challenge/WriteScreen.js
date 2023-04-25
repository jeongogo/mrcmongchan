import React, {useState} from 'react';
import {View, Text, Pressable, Button, TextInput, StyleSheet, Keyboard} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import useStore from "../../store/store";

function WriteScreen({navigation}) {
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [visibleStartPic, setVisibleStartPic] = useState(false);
  const [visibleEndPic, setVisibleEndPic] = useState(false);
  const user = useStore((state) => state.user);

  const showStartPicker = () => {
    setVisibleStartPic(true);
    Keyboard.dismiss();
  };

  const hideStartPicker = () => {
    setVisibleStartPic(false);
  };

  const showEndPicker = () => {
    setVisibleEndPic(true);
    Keyboard.dismiss();
  };

  const hideEndPicker = () => {
    setVisibleEndPic(false);
  };

  const onStartDate = (current) => {
    const date = new Date(current);
    setStartDate(date.getFullYear() + '. ' + (date.getMonth() + 1) + '. ' + date.getDate());
    hideStartPicker();
  };

  const onEndDate = (current) => {
    const date = new Date(current);
    setEndDate(date.getFullYear() + '. ' + (date.getMonth() + 1) + '. ' + date.getDate());
    hideEndPicker();
  };

  const onSubmit = async () => {
    if (title === '' || startDate === '' || endDate === '') {
      return;
    }
    try {
      const challenge = {
        title,
        creator: user.uid,
        goal,
        startDate,
        endDate,
        entry: [{
          uid: user.uid,
          name: user.name,
          distance: 0,
        }],
        applicants: [],
      };
      
      const data = await firestore().collection('Challenges').add(challenge);

      navigation.navigate('ChallengeHome', {id: data.id})
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <Text style={styles.title}>챌린지명</Text>
        <TextInput value={title} style={styles.input} onChangeText={setTitle} />
      </View>
      <View style={styles.wrap}>
        <Text style={styles.title}>목표 거리</Text>
        <TextInput value={goal} style={styles.input} onChangeText={setGoal} placeholder="km" placeholderTextColor='white' />
      </View>
      <View style={styles.wrap}>
        <Text style={styles.title}>기간</Text>
        <View style={styles.dateWrap}>
          <Pressable style={styles.grow} onPress={showStartPicker}>
            <View style={styles.input}>
              <Text style={styles.text}>{startDate ? startDate : '시작'}</Text>
            </View>
          </Pressable>
          <Text style={styles.text}> ~ </Text>
          <Pressable style={styles.grow} onPress={showEndPicker}>
            <View style={styles.input}>
              <Text style={styles.text}>{endDate ? endDate : '종료'}</Text>
            </View>
          </Pressable>
          <DateTimePickerModal
            isVisible={visibleStartPic}
            mode="date"
            onConfirm={onStartDate}
            onCancel={hideStartPicker}
          />
          <DateTimePickerModal
            isVisible={visibleEndPic}
            mode="date"
            onConfirm={onEndDate}
            onCancel={hideEndPicker}
          />
        </View>
      </View>
      <View>
        <Button onPress={onSubmit} title="만들기" />
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
  wrap: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    color: 'white',
  },
  input: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
    height: 48,
    paddingHorizontal: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: '#333',
  },
  dateWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
  grow: {
    flexGrow: 1,
    width: '40%',
  }
});

export default WriteScreen;