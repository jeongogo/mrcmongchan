import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './HomeScreen';

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
    </Stack.Navigator>
  );
}

export default MypageStack;