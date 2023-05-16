import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Record({isRecoding, distance, minutes, seconds, pace, onStart, onPause, onComplete}) {
  return (
    <View style={styles.record_wrap}>
      <View style={styles.record_el}>
        <Text style={styles.record_current}>{(distance/1000).toFixed(2)}</Text>
        <Text style={styles.record_title}>거리</Text>
      </View>
      <View style={styles.record_el}>
        <Text style={styles.record_current}>{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}</Text>
        <Text style={styles.record_title}>시간</Text>
      </View>
      <View style={styles.record_el}>
        <Text style={styles.record_current}>{pace}</Text>
        <Text style={styles.record_title}>페이스</Text>
      </View>
      <View style={styles.record_btn_wrap}>
        {isRecoding
          ?
            <Pressable activeOpacity={0.5} onPress={onPause} style={styles.record_btn}>
              <Icon name='pause' color='white' size={30} />
            </Pressable>
          :
            <Pressable activeOpacity={0.5} onPress={onStart} style={styles.record_btn}>
              <Text style={styles.record_btn_text}>
                <Icon name='play-pause' color='white' size={30} />
              </Text>
            </Pressable>
        }
        <Pressable activeOpacity={0.5} onPress={onComplete} style={styles.record_btn}>
          <Text style={styles.record_btn_text}>
            <Icon name='stop' color='white' size={30} />
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
    backgroundColor: '#090707',
    zIndex: 10,
  },
  record_el: {
    marginBottom: 40,
  },
  record_current: {
    fontSize: 60,
    fontWeight: 700,
    color: '#fff',
    textAlign: 'center',
  },
  record_title: {
    fontSize: 20,
    color: '#fff',
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
    borderColor: 'white',
  },
  record_btn_text: {
    textAlign: 'center',
  },
});

export default Record