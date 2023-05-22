import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

function Challenge({ index, entry }) {
  useEffect(() => {
    // 거리 정렬 후 렌더링
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{index+1}. {entry.name}</Text>
      <Text style={styles.text}>{entry.distance}km</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  label: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    fontWeight: 500,
    color: '#222',
  },
  text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#454545',
  },
});

export default Challenge