import React, { useEffect, useState } from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import { updateUser } from "../../lib/user";
import useStore from "../../store/store";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Record({isRecoding, distance, totalTime, pace, onStart, onPause, onComplete}) {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [color, setColor] = useState(user.recordColor);
  const [visibleColors, setVisibleColors] = useState(false);
  const [time, setTime] = useState(0);

  const onSelectColor = async (selectColor) => {
    try {
      setColor(selectColor);
      setVisibleColors(false);
      await updateUser(user.uid, {recordColor: selectColor});
      setUser({...user, recordColor: selectColor});
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    let hours = Math.floor(totalTime / 60 / 60)
    let mins = Math.floor((totalTime / 60) % 60)
    let seconds = Math.floor(totalTime % 60)
    let displayHours = hours < 1 ? '' : hours + ':';
    let displayMins = mins < 10 ? `0${mins}` : mins
    let displaySecs = seconds < 10 ? `0${seconds}` : seconds
    setTime(displayHours + displayMins + ':' + displaySecs);
  }, [totalTime]);
  
  return (
    <View style={[styles.record_wrap, {backgroundColor: '#' + color}]}>
      <Pressable onPress={() => setVisibleColors(true)} style={styles.record_color_btn}>
        <Icon name='eyedropper' color='#222' size={20} />
      </Pressable>
      {visibleColors &&
        <View style={styles.record_colors}>
          <Pressable style={[styles.record_color, {backgroundColor: '#f8ca00'}]} onPress={() => onSelectColor('f8ca00')} />
          <Pressable style={[styles.record_color, {backgroundColor: '#A593E0'}]} onPress={() => onSelectColor('A593E0')} />
          <Pressable style={[styles.record_color, {backgroundColor: '#6AAFE6'}]} onPress={() => onSelectColor('6AAFE6')} />
          <Pressable style={[styles.record_color, {backgroundColor: '#9baec8'}]} onPress={() => onSelectColor('9baec8')} />
          <Pressable style={[styles.record_color, {backgroundColor: '#fd999a'}]} onPress={() => onSelectColor('fd999a')} />
          <Pressable style={[styles.record_color, {backgroundColor: '#79bd9a'}]} onPress={() => onSelectColor('79bd9a')} />
          <Pressable style={[styles.record_color, {backgroundColor: '#f3f3f3'}]} onPress={() => onSelectColor('f3f3f3')} />
        </View>
      }
      <View style={styles.record_el}>
        <Text style={styles.record_current}>{(distance/1000).toFixed(2)}</Text>
        <Text style={styles.record_title}>거리</Text>
      </View>
      <View style={styles.record_el}>
        <Text style={styles.record_current}>{time}</Text>
        <Text style={styles.record_title}>시간</Text>
      </View>
      <View style={styles.record_el}>
        <Text style={styles.record_current}>{pace}</Text>
        <Text style={styles.record_title}>페이스</Text>
      </View>
      <View style={styles.record_btn_wrap}>
        {isRecoding
          ?
            <Pressable onPress={onPause} style={styles.record_btn}>
              <Icon name='pause' color='#222' size={30} />
            </Pressable>
          :
            <Pressable onPress={onStart} style={styles.record_btn}>
              <Text style={styles.record_btn_text}>
                <Icon name='play-pause' color='#222' size={30} />
              </Text>
            </Pressable>
        }
        <Pressable onPress={onComplete} style={styles.record_btn}>
          <Text style={styles.record_btn_text}>
            <Icon name='stop' color='#222' size={30} />
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  record_wrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 30,
    zIndex: 10,
  },
  record_color_btn: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 15,
    zIndex: 11,
  },
  record_colors: {
    position: 'absolute',
    top: 45,
    right: 15,
    zIndex: 11,
  },
  record_color: {
    marginTop: 7,
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 15,
  },
  record_el: {
    marginBottom: 40,
  },
  record_current: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 60,
    fontWeight: 700,
    color: '#222',
    textAlign: 'center',
  },
  record_title: {
    fontFamily: 'Pretendard-medium',
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
  },
  record_btn_wrap: {
    marginTop: 40,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  record_btn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 40,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#222',
  },
  record_btn_text: {
    textAlign: 'center',
  },
});

export default Record