import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStack from './home/HomeStack';
import FeedStack from "./feed/FeedStack";
import RecordStack from './record/RecordStack';
import ChallengeStack from "./challenge/ChallengeStack";
import MypageStack from "./mypage/MypageStack";
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const MainTab = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#000',
        tabBarStyle: {
          height: Platform.OS === 'android' ? 52 : 78,
        }
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({color}) => <Icon name='home-filled' color={color} size={26} />,
        }} 
        />
      <Tab.Screen
        name="FeedStack"
        component={FeedStack}
        options={{
          tabBarIcon: ({color}) => <Icon name='view-list' color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="RecordStack"
        component={RecordStack}
        options={{
          tabBarIcon: ({color}) => <Icon name='directions-run' color={color} size={26} />,
        }}
        listeners={() => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('RecordHome');
          },
        })}
      />
      <Tab.Screen
        name="ChallengeStack"
        component={ChallengeStack}
        options={{
          tabBarIcon: ({color}) => <Icon name='outlined-flag' color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="MypageStack"
        component={MypageStack}
        options={{
          tabBarIcon: ({color}) => <Icon name='person' color={color} size={26} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
