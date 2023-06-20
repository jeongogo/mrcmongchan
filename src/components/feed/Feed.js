import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigation } from "@react-navigation/native";
import useStore from "../../store/store";
import {View, Image, Text, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomWrap from '../common/CustomWrap';

function Feed({ feed }) {
  const navigation = useNavigation();
  const setFeedDetail = useStore((state) => state.setFeedDetail);
  const [time, setTime] = useState('');

  const onDetail = (id) => {
    setFeedDetail(feed);
    navigation.push('FeedDetail', {id});
  }

  useEffect(() => {
    let recordHours = Math.floor(feed.totalTime/60/60);
    let recordMinutes = Math.floor(feed.totalTime/60) - (recordHours * 60);
    let recordSeconds = (feed.totalTime) - (Math.floor(feed.totalTime/60) * 60);
    recordHours = recordHours < 1 ? '' : recordHours + ':';
    recordMinutes = recordMinutes < 10 ? '0' + recordMinutes : recordMinutes;
    recordSeconds = recordSeconds < 10 ? '0' + recordSeconds : recordSeconds;
    setTime(recordHours + recordMinutes + ':' + recordSeconds);
  }, []);

  return (
    <CustomWrap>
      <Pressable onPress={() => onDetail(feed.id)} style={styles.container}>
        <View style={styles.imageWrap}>
          {feed.photoURL
            ? <Image source={{uri: feed.photoURL}} style={styles.image} />
            : <Image source={{uri: feed.captureURL}} style={styles.image} />
          }
        </View>
        <View style={styles.contentWrap}>
          <View style={styles.distanceWrap}>
            <Text style={styles.distanceText}>{feed.distance}<Text style={styles.distanceKmText}>km</Text></Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.date}>{format(new Date(feed.date), 'MM.dd HH:mm')}</Text>
            <Text style={styles.areaText}>{feed.areaName}</Text>
          </View>
          <View style={styles.wrap}>
            <View style={styles.recordWrap}>
              <Icon name='access-alarm' color='#222' size={12} />
              <Text style={styles.recordText}>{time}</Text>
            </View>
            <Text style={styles.bar}></Text>
            <View style={styles.recordWrap}>
              <Icon name='access-time' color='#222' size={12} />
              <Text style={styles.recordText}>{feed.pace}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </CustomWrap>
  )
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrap: {
    width: 60,
    height: 60,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 60,
    height: 60,
  },
  contentWrap: {
    marginLeft: 15,
    flexGrow: 1,
  },
  distanceWrap: {
    marginBottom: 1,
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  title: {
    marginRight: 7,
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#222',
  },
  distanceText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    color: '#222',
  },
  distanceKmText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  date: {
    marginRight: 10,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#222',
  },
  areaText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#999',
  },
  recordWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordText: {
    marginLeft: 2,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#222',
  },
  bar: {
    width: 1,
    height: 10,
    marginHorizontal: 10,
    backgroundColor: '#ededed',
  }
});

export default Feed