import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import useStore from "../store/store";
import { subscribeAuth } from '../lib/auth';
import { getUser } from '../lib/user';
import MainTab from './MainTab';
import LoginScreen from './auth/LoginScreen';
import FindPasswordScreen from './auth/FindPasswordScreen';
import WelcomeScreen from './auth/WelcomeScreen';
import RecordHomeScreen from "./record/HomeScreen";
import RecordWriteScreen from "./record/WriteScreen";
import ProfileScreen from "./mypage/ProfileScreen";
import WeightScreen from "./mypage/WeightScreen";
import PaceScreen from "./mypage/PaceScreen";
import SettingScreen from "./mypage/SettingScreen";
import VDOTScreen from "./mypage/VDOTScreen";
import GarminScreen from "./mypage/GarminScreen";

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
            <Stack.Screen
              name='Profile'
              options={() => ({
                title: '프로필 수정',
              })}
              component={ProfileScreen}
            />
            <Stack.Screen
              name='WeightManage'
              component={WeightScreen}
              options={{
                title: '체중 관리'
              }}
            />
            <Stack.Screen
              name='PaceCalc'
              component={PaceScreen}
              options={{
                title: '페이스 계산'
              }}
            />
            <Stack.Screen
              name='VDOT'
              component={VDOTScreen}
              options={{
                title: '예상 기록 테스트'
              }}
            />
            <Stack.Screen
              name='Garmin'
              component={GarminScreen}
              options={{
                title: 'Garmin Login'
              }}
            />
            <Stack.Screen
              name='Setting'
              component={SettingScreen}
              options={{
                title: '설정'
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
              name='FindPassword'
              component={FindPasswordScreen}
              options={{title: ''}}
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
