import React, { useEffect, useState } from 'react';
import useStore from "../../store/store";
import {View, Image, Text, StyleSheet, Pressable} from 'react-native';

function Feed({ feed, navigation }) {
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
    setDate(year + '.' + month + '.' + date + ' ' + hours + ':' + min);
  }, []);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => onDetail(feed.id)}>
        {/* <View style={styles.wrap}>
          <Image style={styles.avatar} source={{uri: feed.photoURL}} />
          <Text style={styles.text}>{feed.displayName}</Text>
        </View> */}
        <View style={styles.wrap}>
          <Text style={styles.text}>{date}</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>거리 </Text>
          <Text style={styles.text}>{feed.distance}km</Text>
          <Text style={styles.margin}></Text>
          <Text style={styles.text}>페이스 </Text>
          <Text style={styles.text}>{feed.pace}</Text>
        </View>
      </Pressable>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  margin: {
    marginRight: 20,
  }
});

export default Feed