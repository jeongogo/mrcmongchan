import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './HomeScreen';
import WriteScreen from './WriteScreen';

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
    </Stack.Navigator>
  );
}

export default ChallengeStack;