import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from "@react-navigation/native";
import {Pressable, SafeAreaView, ScrollView, Text, StyleSheet} from 'react-native';
import Challenge from '../../components/challenge/Challenge';
import Loader from "../../components/common/Loader";

function HomeScreen({navigation}) {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState();
  const [challenges, setChallenges] = useState([]);

  const getChanllenges = async () => {
    setIsLoading(true);
    try {
      const snapshot = await firestore().collection('Challenges').get();
      let data = [];
      snapshot.forEach(doc => {
        const item = {
          ...doc.data(),
          id: doc.id
        }
        data.push(item);
      });
      setChallenges(data);
    } catch (e) {
      Alert.alert("실패", e.message, [
        {
          text: "확인",
          onPress: () => null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getChanllenges();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <Loader />}
      <Pressable style={styles.create} onPress={() => navigation.navigate('ChallengeWrite')}>
        <Text style={styles.createText}>챌린지 만들기</Text>
      </Pressable>
      <ScrollView style={styles.full}>
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
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  create: {
    width: '100%',
    padding: 15,
    backgroundColor: '#222',
  },
  createText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#AEEA00',
  },
  full: {
    width: '100%',
  }
});

export default HomeScreen;