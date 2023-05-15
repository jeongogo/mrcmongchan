import React, {useState} from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import useStore from "../../store/store";
import {View, Text, Pressable, TextInput, StyleSheet, Keyboard} from 'react-native';

function Write({ handleSubmit }) {
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
    setStartDate(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
    hideStartPicker();
  };

  const onEndDate = (current) => {
    const date = new Date(current);
    setEndDate(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
    hideEndPicker();
  };

  const onSubmit = () => {
    if (title === '' || startDate === '' || endDate === '') {
      return;
    }

    const challenge = {
      title,
      creator: user.uid,
      goal,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      entry: [],
    };
    handleSubmit(challenge);
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <Text style={styles.title}>챌린지명</Text>
        <TextInput value={title} style={styles.input} onChangeText={setTitle} />
      </View>
      <View style={styles.wrap}>
        <Text style={styles.title}>목표 거리</Text>
        <TextInput value={goal} style={styles.input} onChangeText={setGoal} placeholder="km" placeholderTextColor='#aaa' />
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
      <View style={styles.btnWrap}>
        <Pressable style={styles.btn} onPress={onSubmit}>
          <Text style={styles.btnText}>만들기</Text>
        </Pressable>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  wrap: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: '#222',
  },
  input: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
    height: 42,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#222',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  dateWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#222',
  },
  grow: {
    flexGrow: 1,
    width: '40%',
  },
  btnWrap: {
    
  },
  btn: {
    paddingVertical: 15,
    backgroundColor: '#E53A40',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 15,
    fontWeight: 500,
    color: 'white',
    textAlign: 'center',
  }
});

export default Write