import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './HomeScreen';
import DetailScreen from './DetailScreen';

const Stack = createNativeStackNavigator();

function RecordStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='FeedHome'
        component={HomeScreen}
        options={() => ({
          title: '활동 기록'
        })}
      />
      <Stack.Screen
        name='FeedDetail'
        component={DetailScreen}
        options={() => ({
          title: '활동 상세'
        })}
      />
    </Stack.Navigator>
  );
}

export default RecordStack;