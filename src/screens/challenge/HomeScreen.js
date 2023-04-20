import React from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';

function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate('ChallengeWrite')}>
        <Text style={styles.text}>챌린지 만들기</Text>
      </Pressable>
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
  text: {
    fontSize: 16,
  }
});

export default HomeScreen;