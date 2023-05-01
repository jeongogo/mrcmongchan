import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import useStore from "../store/store";
import MainTab from './MainTab';
import LoginScreen from './auth/LoginScreen';
import WelcomeScreen from './auth/WelcomeScreen';
import RecordHomeScreen from "./record/HomeScreen";
import RecordWriteScreen from "./record/WriteScreen";
import { subscribeAuth } from '../lib/auth';
import { getUser } from '../lib/user';

const Stack = createNativeStackNavigator();

function RootStack() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = subscribeAuth(async currentUser => {
      unsubscribe();
      if (!currentUser) {
        return;
      }
      const profile = await getUser(currentUser.uid);
      if (!profile) {
        return;
      }
      setUser(profile);
    });
  }, [setUser]);
  
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Group>
      {user
        ?
          <>
            <Stack.Screen
              name="MainTab"
              component={MainTab}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name='RecordHome'
              component={RecordHomeScreen}
              options={{
                title: '달리기'
              }}
            />
            <Stack.Screen
              name='RecordWrite'
              component={RecordWriteScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        :
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        }
        </Stack.Group>
    </Stack.Navigator>
  );
}

export default RootStack;
