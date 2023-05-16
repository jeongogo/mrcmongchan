import React from 'react'
import {View, StyleSheet, Text} from 'react-native';

const Pace = () => {
  return (
    <View style={styles.container}>
      <Text>10K</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Pace;