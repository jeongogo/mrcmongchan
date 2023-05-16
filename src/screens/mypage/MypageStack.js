import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './HomeScreen';
import ChallengeDetailScreen from "../challenge/DetailScreen";

const Stack = createNativeStackNavigator();

function MypageStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='MypageHome'
        component={HomeScreen}
        options={() => ({
          title: '마이페이지'
        })}
      />
      <Stack.Screen
        name='ChallengeDetail'
        options={() => ({
          title: '챌린지 상세',
        })}
        component={ChallengeDetailScreen}
      />
    </Stack.Navigator>
  );
}

export default MypageStack;