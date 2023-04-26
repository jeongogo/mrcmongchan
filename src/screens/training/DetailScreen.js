import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function DetailScreen() {
  return (
    <View style={styles.container}>
      <Text>페이지 준비중입니다.</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DetailScreen;