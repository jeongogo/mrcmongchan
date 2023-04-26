import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './HomeScreen';

const Stack = createNativeStackNavigator();

function RecordStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name='RecordHome'
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
}

export default RecordStack;