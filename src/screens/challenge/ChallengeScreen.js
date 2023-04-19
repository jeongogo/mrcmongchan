import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function ChallengeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>페이지 준비중입니다.</Text>
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
  text: {
    color: 'white',
  }
});

export default ChallengeScreen;