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
        {user?.isAdmin &&
          <View style={styles.btnWrap}>
              <Pressable style={styles.create} onPress={() => navigation.navigate('ChallengeWrite')}>
                <Text style={styles.createText}>챌린지 만들기</Text>
              </Pressable>
          </View>
        }
        {(challenges.length > 0) && 
          challenges.map((challenge) => (
            <Challenge key={challenge.id} challenge={challenge} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
  },
  btnWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 15,
  },
  create: {
    width: '100%',
    paddingVertical: 17,
    backgroundColor: '#30A9DE',
    borderRadius: 10,
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
  }
});

export default Home