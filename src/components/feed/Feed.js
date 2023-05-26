import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigation } from "@react-navigation/native";
import useStore from "../../store/store";
import {View, Image, Text, StyleSheet, Pressable} from 'react-native';
import CustomWrap from '../common/CustomWrap';

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
    <CustomWrap>
      <Pressable onPress={() => onDetail(feed.id)} style={styles.container}>
        <View style={styles.imageWrap}>
          {feed._data.photoURL
            ? <Image source={{uri: feed._data.photoURL}} style={styles.image} />
            : <Image source={{uri: feed._data.captureURL}} style={styles.image} />
          }
        </View>
        <View style={styles.contentWrap}>
          <View style={styles.wrap}>
            {feed._data.title
              ?
                <>
                  <Text style={styles.title}>{feed._data.title}</Text>
                  <Text style={styles.date}>{format(new Date(feed._data.date.toDate()), 'M.dd HH:mm')}</Text>
                </>
              :
                <Text style={styles.title}>{format(new Date(feed._data.date.toDate()), 'M.dd HH:mm')}</Text>
            }          
          </View>
          <View style={styles.wrap}>
            <Text style={styles.text}>{feed._data.areaName}</Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.text}>{feed._data.distance}km</Text>
            <Text style={styles.bar}></Text>
            <Text style={styles.text}>{time}</Text>
            <Text style={styles.bar}></Text>
            <Text style={styles.text}>{feed._data.pace}</Text>
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
    marginBottom: 1,
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#222',
  },
  date: {
    marginLeft: 10,
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
    color: '#999',
  },
  text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#454545',
  },
  bar: {
    marginHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  }
});

export default Feed