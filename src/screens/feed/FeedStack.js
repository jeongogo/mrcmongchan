import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Pressable,
  Share
} from 'react-native';
import HomeScreen from './HomeScreen';
import DetailScreen from './DetailScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();

function RecordStack() {
  /** 공유하기 */
  const onShare = async (id) => {
    try {
      const result = await Share.share({
        message: `https://mymrc-382104.web.app/feed/${id}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        options={({route}) => ({
          title: '기록 상세',
          headerRight: () => (
            <Pressable onPress={() => onShare(route.params.id)}>
              <Icon name="share-variant-outline" size={20} color={'#000'} />
            </Pressable>
          )
        })}
      />
    </Stack.Navigator>
  );
}

export default RecordStack;