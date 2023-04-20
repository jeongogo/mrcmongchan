import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

function WriteScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <Text style={styles.subject}>챌린지명</Text>
        <TextInput style={styles.input} />
      </View>
      <View style={styles.wrap}>
        <Text style={styles.subject}>기간</Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  wrap: {
    marginBottom: 20,
  },
  subject: {
    fontSize: 16,
  },
  input: {
    marginTop: 10,
    width: '100%',
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    backgroundColor: 'white',
  }
});

export default WriteScreen;