import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, ScrollView, Text, StyleSheet, View} from 'react-native';
import useStore from "../../store/store";
import Challenge from './Challenge';
import CustomButton from "../common/CustomButton";

function Home({challenges}) {
  const navigation = useNavigation();
  const user = useStore((state) => state.user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.full}>
        {user?.isAdmin &&
          <View style={{marginBottom: 15}}>
            <CustomButton title='챌린지 만들기' onPress={() => navigation.navigate('ChallengeWrite')} />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
  },
  create: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    backgroundColor: '#E53A40',
    zIndex: 2,
  },
  createText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
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