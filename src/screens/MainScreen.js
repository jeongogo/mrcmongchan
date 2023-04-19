import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import HomeScreen from './home/HomeScreen';
import FeedScreen from "./feed/FeedScreen";
import ChallengeScreen from './challenge/ChallengeScreen';
import MypageScreen from "./mypage/MypageScreen";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

const MIcon = (name, color) => {
  return <Icon name={name} color={color} size={24} />;
};

const MainScreen = ({navigation}) => {
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
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({color}) => MIcon('home', color),
        }} 
      />
      <Tab.Screen
        name="NewRecord"
        component={HomeScreen}
        options={{
          tabBarLabel: '달리기',
          tabBarIcon: ({color}) => MIcon('run', color),
        }}
        listeners={() => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Record');
          },
        })}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: '활동',
          tabBarIcon: ({color}) => MIcon('format-list-bulleted', color),
        }}
      />
      {/* <Tab.Screen
        name="Challenge"
        component={ChallengeScreen}
        options={{
          tabBarLabel: '챌린지',
          tabBarIcon: ({color}) => MIcon('flag', color),
        }}
      /> */}
      {/* <Tab.Screen
        name="Mypage"
        component={MypageScreen}
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({color}) => MIcon('account', color),
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default MainScreen;
