import React from 'react'
import {View, StyleSheet} from 'react-native';
import { Bubbles } from 'react-native-loader';

const Loader = () => {
  return (
    <View style={styles.container}>
      <Bubbles size={6} color="#ff7473" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 11,
  },
});

export default Loader;