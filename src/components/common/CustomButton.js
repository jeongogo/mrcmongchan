import React from 'react'
import {StyleSheet, Pressable, Text} from 'react-native';

const CustomButton = ({title, onPress}) => {
  return (
    <Pressable style={styles.btn} onPress={onPress}>
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    backgroundColor: '#E53A40',
    borderRadius: 24,
  },
  btnText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
  }
});

export default CustomButton;