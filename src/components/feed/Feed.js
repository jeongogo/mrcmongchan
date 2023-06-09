import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigation } from "@react-navigation/native";
import useStore from "../../store/store";
import {View, Image, Text, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function Feed({ feed }) {
  const navigation = useNavigation();
  const setFeedDetail = useStore((state) => state.setFeedDetail);
  const [time, setTime] = useState('');

  const onDetail = (id) => {
    setFeedDetail(feed._data);
    navigation.push('FeedDetail', {id});
  }

  useEffect(() => {
    let recordHours = Math.floor(feed._data.totalTime/60/60);
    let recordMinutes = Math.floor(feed._data.totalTime/60) - (recordHours * 60);
    let recordSeconds = (feed._data.totalTime) - (Math.floor(feed._data.totalTime/60) * 60);
    recordHours = recordHours < 1 ? '' : recordHours + ':';
    recordMinutes = recordMinutes < 10 ? '0' + recordMinutes : recordMinutes;
    recordSeconds = recordSeconds < 10 ? '0' + recordSeconds : recordSeconds;
    setTime(recordHours + recordMinutes + ':' + recordSeconds);
  }, []);

  return (
    <View>
      <Pressable onPress={() => onDetail(feed.id)} style={styles.container}>
        <View style={styles.imageWrap}>
          {feed._data.photoURL
            ? <Image source={{uri: feed._data.photoURL}} style={styles.image} />
            : <Image source={{uri: feed._data.captureURL}} style={styles.image} />
          }
        </View>
        <View style={styles.contentWrap}>
          {feed._data.title &&
            <Text style={styles.title}>{feed._data.title}</Text>        
          }
          <View style={styles.wrap}>
            <Text style={styles.date}>{format(new Date(feed._data.date.toDate()), 'MM.dd HH:mm')}</Text>
            <Text style={styles.areaText}>{feed._data.areaName}</Text>
          </View>
          <View style={styles.wrap}>
            <View style={styles.recordWrap}>
              <Text style={styles.recordText}>{feed._data.distance}km</Text>
            </View>
            <Text style={styles.bar}></Text>
            <View style={styles.recordWrap}>
              <Icon name='access-alarm' color='#333' size={14} />
              <Text style={styles.recordText}>{time}</Text>
            </View>
            <Text style={styles.bar}></Text>
            <View style={styles.recordWrap}>
              <Icon name='access-time' color='#333' size={14} />
              <Text style={styles.recordText}>
                {feed._data.pace}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  imageWrap: {
    width: 80,
    height: 80,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
  },
  contentWrap: {
    marginLeft: 15,
    flexGrow: 1,
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  title: {
    marginRight: 7,
    fontFamily: 'Pretendard-Medium',
    fontSize: 17,
    color: '#222',
  },
  date: {
    marginRight: 7,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#222',
  },
  areaText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
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
    fontSize: 15,
    color: '#454545',
  },
  bar: {
    marginHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#ededed',
  }
});

export default Feed