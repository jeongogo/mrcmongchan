import React from 'react'
import {View, StyleSheet} from 'react-native';

const CustomWrap = ({children}) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

export default CustomWrap;