import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './HomeScreen';
import WriteScreen from './WriteScreen';

const Stack = createNativeStackNavigator();

function RecordStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='RecordHome'
        component={HomeScreen}
      />
      <Stack.Screen
        name='RecordWrite'
        component={WriteScreen}
      />
    </Stack.Navigator>
  );
}

export default RecordStack;