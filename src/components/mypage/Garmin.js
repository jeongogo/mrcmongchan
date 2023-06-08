import React, {useState, useEffect} from 'react';
import {SafeAreaView, ScrollView, View, StyleSheet, Text, Pressable} from 'react-native';

const Garmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrap}>
        <Text>가민 연동 준비중입니다.</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
});

export default Garmin;