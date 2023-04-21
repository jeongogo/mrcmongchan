import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './HomeScreen';
import WriteScreen from './WriteScreen';
import DetailScreen from "./DetailScreen";

const Stack = createNativeStackNavigator();

function ChallengeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='ChallengeHome'
        options={() => ({
          title: '챌린지'
        })}
        component={HomeScreen}
      />
      <Stack.Screen
        name='ChallengeWrite'
        options={() => ({
          title: '챌린지 만들기'
        })}
        component={WriteScreen}
      />
      <Stack.Screen
        name='ChallengeDetail'
        options={() => ({
          title: '챌린지 상세',
        })}
        component={DetailScreen}
      />
    </Stack.Navigator>
  );
}

export default ChallengeStack;