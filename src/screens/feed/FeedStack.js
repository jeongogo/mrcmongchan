import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './HomeScreen';
import DetailScreen from './DetailScreen';

const Stack = createNativeStackNavigator();

function RecordStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='FeedHome' component={HomeScreen} />
      <Stack.Screen name='FeedDetail' component={DetailScreen} />
    </Stack.Navigator>
  );
}

export default RecordStack;