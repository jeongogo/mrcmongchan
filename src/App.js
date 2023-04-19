import React, {useEffect} from 'react';
import {getFocusedRouteNameFromRoute, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import useStore from "./store/store";
import MainScreen from './screens/MainScreen';
import FeedDetailScreen from "./screens/feed/DetailScreen";
import RecordScreen from './screens/record/RecordScreen';
import WriteScreen from "./screens/record/WriteScreen";
import LoginScreen from './screens/auth/LoginScreen';
import WelcomeScreen from './screens/auth/WelcomeScreen';
import { subscribeAuth } from './lib/auth';
import { getUser } from './lib/user';

const Stack = createNativeStackNavigator();

/** 헤더 타이틀명 */
function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  const nameMap = {
    Home: '모두의 러닝코치',
    Trainning: '훈련',
    Challenge: '챌린지',
    Feed: '활동',
  };
  return nameMap[routeName];
}

function App() {
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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
      <Stack.Group screenOptions={{
        headerStyle: {
          backgroundColor: 'black'
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#fff'
        },
      }}>
        {user
          ?
            <>
              <Stack.Screen
                name="Main"
                component={MainScreen}
                options={({route}) => ({
                  title: getHeaderTitle(route),
                })}
              />
              <Stack.Screen
                name="FeedDetail"
                component={FeedDetailScreen}
                options={{
                  title: '활동 상세보기'
                }}
              />
              <Stack.Screen
                name="Record"
                component={RecordScreen}
                options={{
                  title: '달리기'
                }}
              />
              <Stack.Screen
                name="Write"
                component={WriteScreen}
                options={{
                  title: '기록 저장하기'
                }}
              />
            </>
          :
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  title: '로그인',
                  headerShown: false
                }}
              />
              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{
                  title: '환영합니다.',
                  headerShown: false
                }}
              />
            </>
        }
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
