import React from 'react';
import { useNavigation } from "@react-navigation/native";
import useStore from "../../store/store";
import {Pressable, SafeAreaView, ScrollView, Text, StyleSheet, View} from 'react-native';
import Challenge from './Challenge';
import Loader from "../../components/common/Loader";

// import firestore from '@react-native-firebase/firestore';

function Home({isLoading, challenges}) {
  const navigation = useNavigation();
  const user = useStore((state) => state.user);

  // const onAdd = async () => {
  //   try {
  //     const data = {
  //       title: '하프 완주 12주 프로그램',
  //       program: [
  //         {
  //           day: 1,
  //           content: '크로스 트레이닝 20분',
  //           exPoint: 0,
  //           time: 0,
  //           distance: 0,
  //           isComplete: false,
  //         },
  //       ]
  //     }
  //     await firestore().collection('Trainings').add(data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.full}>
      {isLoading && <Loader />}
      {/* <Pressable style={styles.create} onPress={() => onAdd()}>
        <Text style={styles.createText}>훈련 추가</Text>
      </Pressable> */}
      <View style={styles.btnWrap}>
        {user.isAdmin &&
          <Pressable style={styles.create} onPress={() => navigation.navigate('ChallengeWrite')}>
            <Text style={styles.createText}>챌린지 만들기</Text>
          </Pressable>
        }
      </View>
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
    paddingHorizontal: 15,
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#E53A40',
    borderRadius: 5,
  },
  createText: {
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
    color: '#fff',
  },
  full: {
    width: '100%',
  }
});

export default Home