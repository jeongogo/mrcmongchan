import React from 'react';
import { useNavigation } from "@react-navigation/native";
import {Pressable, SafeAreaView, ScrollView, Text, StyleSheet, View} from 'react-native';
import useStore from "../../store/store";
import Challenge from './Challenge';

function Home({challenges}) {
  const navigation = useNavigation();
  const user = useStore((state) => state.user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.full}>
        {(challenges.length > 0) && 
          challenges.map((challenge) => (
            <Challenge key={challenge.id} challenge={challenge} navigation={navigation} />
            ))}
      </ScrollView>
      {user?.isAdmin &&
        <Pressable style={styles.create} onPress={() => navigation.navigate('ChallengeWrite')}>
          <Text style={styles.createText}>챌린지 만들기</Text>
        </Pressable>
      }
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
  },
  create: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    paddingVertical: 17,
    backgroundColor: '#E53A40',
    zIndex: 2,
  },
  createText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    fontWeight: 500,
    textAlign: 'center',
    color: '#fff',
  },
  full: {
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 50,
  }
});

export default Home