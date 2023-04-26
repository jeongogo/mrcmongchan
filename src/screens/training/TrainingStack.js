import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './HomeScreen';
import DetailScreen from "./DetailScreen";
import ProgressScreen from "./ProgressScreen";

const Stack = createNativeStackNavigator();

function TrainingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='TrainingHome'
        component={HomeScreen}
        options={() => ({
          title: '훈련 프로그램'
        })}
      />
      <Stack.Screen
        name='TrainingDetail'
        component={DetailScreen}
        options={() => ({
          title: '훈련 프로그램 상세'
        })}
      />
      <Stack.Screen
        name='TrainingProgress'
        component={ProgressScreen}
        options={() => ({
          title: '진행중 훈련'
        })}
      />
    </Stack.Navigator>
  );
}

export default TrainingStack;