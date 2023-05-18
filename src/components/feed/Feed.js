import React, { useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import useStore from "../../store/store";
import {View, Image, Text, StyleSheet, Pressable} from 'react-native';
import CustomWrap from '../common/CustomWrap';

function Feed({ feed }) {
  const navigation = useNavigation();
  const user = useStore((state) => state.user);
  const setFeedDetail = useStore((state) => state.setFeedDetail);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [date, setDate] = useState('');

  const onDetail = (id) => {
    setFeedDetail(feed);
    navigation.push('FeedDetail', {id});
  }

  useEffect(() => {
    const current = new Date(feed.date.toDate());
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    const date = current.getDate();
    let hours = current.getHours();
    let min = current.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    min = min < 10 ? '0' + min : min;
    setDate(month + '월 ' + date + '일 ' + hours + ':' + min);
    setMinutes(Math.floor(feed.totalTime/60));
    setSeconds((feed.totalTime) - (Math.floor(feed.totalTime/60) * 60));
  }, []);

  return (
    <CustomWrap>
      <Pressable onPress={() => onDetail(feed.id)}>
        {/* <View style={styles.wrap}>
          <Image style={styles.avatar} source={{uri: feed.photoURL}} />
          <Text style={styles.text}>{feed.displayName}</Text>
        </View> */}
        <View style={[styles.wrap, styles.top]}>
          {feed.title
            ?
              <>
                <Text style={styles.title}>{feed.title}</Text>
                <Text style={styles.date}>{date}</Text>
              </>
            :
              <Text style={styles.title}>{date}</Text>
          }          
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>{feed.areaName}</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>{feed.distance}km</Text>
          <Text style={styles.bar}></Text>
          <Text style={styles.text}>{minutes}:{seconds}</Text>
          <Text style={styles.bar}></Text>
          <Text style={styles.text}>{feed.pace}</Text>
        </View>
      </Pressable>
    </CustomWrap>
  )
};

const styles = StyleSheet.create({
  container: {
    
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  top: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginBottom: 2,
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#222',
  },
  date: {
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