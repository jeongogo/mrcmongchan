import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import HomeStack from './home/HomeStack';
import RecordStack from './record/RecordStack';
import ChallengeStack from "./challenge/ChallengeStack";
import FeedStack from "./feed/FeedStack";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

const MIcon = (name, color) => {
  return <Icon name={name} color={color} size={24} />;
};

const MainTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      inactiveColor="#aaaaaa"
      activeColor="#AEEA00"
      barStyle={{
        backgroundColor: 'black',
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({color}) => MIcon('home', color),
        }} 
      />
      <Tab.Screen
        name="RecordStack"
        component={RecordStack}
        options={{
          tabBarLabel: '달리기',
          tabBarIcon: ({color}) => MIcon('run', color),
        }}
      />
      <Tab.Screen
        name="ChallengeStack"
        component={ChallengeStack}
        options={{
          tabBarLabel: '챌린지',
          tabBarIcon: ({color}) => MIcon('flag', color),
        }}
      />
      <Tab.Screen
        name="FeedStack"
        component={FeedStack}
        options={{
          tabBarLabel: '활동',
          tabBarIcon: ({color}) => MIcon('format-list-bulleted', color),
        }}
      />
      {/* tabBarIcon: ({color}) => MIcon('account', color), */}
    </Tab.Navigator>
  );
};

export default MainTab;
