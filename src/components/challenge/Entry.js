import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

function Challenge({ index, entry }) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Image
          style={styles.circle}
          source={entry.photoURL ? {uri: entry.photoURL} : require('../../assets/images/user.png')}
        />
      </View>
      <Text style={styles.name}>{entry.name}</Text>
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
  avatar: {
    marginRight: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  circle: {
    width: 30,
    height: 30,
  },
  name: {
    marginRight: 'auto',
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