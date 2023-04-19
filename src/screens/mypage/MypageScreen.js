import React from 'react';
import useStore from "../../store/store";
import {View, Text, StyleSheet} from 'react-native';

function MypageScreen() {
  const user = useStore((state) => state.user);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{user.name}</Text>
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

export default MypageScreen;