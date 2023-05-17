import React, { useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import useStore from "../../store/store";
import {View, Image, Text, StyleSheet, Pressable} from 'react-native';
import CustomWrap from '../common/CustomWrap';

function Feed({ feed }) {
  const navigation = useNavigation();
  const user = useStore((state) => state.user);
  const setFeedDetail = useStore((state) => state.setFeedDetail);
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
  }, []);

  return (
    <CustomWrap>
      <Pressable onPress={() => onDetail(feed.id)}>
        {/* <View style={styles.wrap}>
          <Image style={styles.avatar} source={{uri: feed.photoURL}} />
          <Text style={styles.text}>{feed.displayName}</Text>
        </View> */}
        {feed.title &&
          <View style={styles.wrap}>
            <Text style={styles.title}>{feed.title}</Text>
          </View>
        }
        <View style={styles.wrap}>
          <Text style={styles.text}>{date}</Text>
          <Text style={styles.marginRight}></Text>
          <Text style={styles.text}>{feed.areaName}</Text>
        </View>
        <View style={[styles.wrap, styles.marginTop]}>
          <Text style={styles.text}>거리 </Text>
          <Text style={styles.text}>{feed.distance}km</Text>
          <Text style={styles.marginRight}></Text>
          <Text style={styles.text}>페이스 </Text>
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
    paddingVertical: 3,
  },
  title: {
    marginBottom: 3,
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    fontWeight: 500,
    color: '#222',
  },
  text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#454545',
  },
  marginRight: {
    marginRight: 20,
  }
});

export default Feed