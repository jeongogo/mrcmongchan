import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import { Text } from "react-native";
import HomeStack from './home/HomeStack';
import FeedStack from "./feed/FeedStack";
import RecordStack from './record/RecordStack';
import ChallengeStack from "./challenge/ChallengeStack";
import MypageStack from "./mypage/MypageStack";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

const MIcon = (name, color) => {
  return <Icon name={name} color={color} size={24} />;
};

const MainTab = ({navigation}) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      inactiveColor="#999"
      activeColor="#000"
      barStyle={{
        backgroundColor: '#fff',
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: <Text style={{fontFamily: 'Pretendard-Regular',}}>홈</Text>,
          tabBarIcon: ({color}) => MIcon('home', color),
        }} 
        />
      <Tab.Screen
        name="FeedStack"
        component={FeedStack}
        options={{
          tabBarLabel: <Text style={{fontFamily: 'Pretendard-Regular',}}>기록</Text>,
          tabBarIcon: ({color}) => MIcon('format-list-bulleted', color),
        }}
      />
      <Tab.Screen
        name="RecordStack"
        component={RecordStack}
        options={{
          tabBarLabel: <Text style={{fontFamily: 'Pretendard-Regular',}}>달리기</Text>,
          tabBarIcon: ({color}) => MIcon('run', color),
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
          tabBarLabel: <Text style={{fontFamily: 'Pretendard-Regular',}}>챌린지</Text>,
          tabBarIcon: ({color}) => MIcon('flag', color),
        }}
      />
      <Tab.Screen
        name="MypageStack"
        component={MypageStack}
        options={{
          tabBarLabel: <Text style={{fontFamily: 'Pretendard-Regular',}}>마이페이지</Text>,
          tabBarIcon: ({color}) => MIcon('account', color),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
