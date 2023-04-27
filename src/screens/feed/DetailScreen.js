import React, { useEffect, useState } from 'react';
import useStore from "../../store/store";
import {View, Text, Image, StyleSheet, useWindowDimensions} from 'react-native';

function DetailScreen() {
  const width = useWindowDimensions().width;
  const feedDetail = useStore((state) => state.feedDetail);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setMinutes(Math.floor(feedDetail.totalTime/60));
    setSeconds(feedDetail.totalTime - (Math.floor(feedDetail.totalTime/60) * 60));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageWrap}>
        <Image style={styles.image} width={width-30} source={{uri: feedDetail.captureURL}} />
      </View>
      <View style={styles.wrap}>
        <Text style={styles.text}>거리</Text>
        <Text style={styles.text}>{feedDetail.distance}km</Text>
      </View>
      <View style={styles.wrap}>
        <Text style={styles.text}>시간</Text>
        <Text style={styles.text}>{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}</Text>
      </View>
      <View style={styles.wrap}>
        <Text style={styles.text}>페이스</Text>
        <Text style={styles.text}>{feedDetail.pace}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#000',
  },
  imageWrap: {
    paddingVertical: 5,
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  text: {
    minWidth: 120,
    fontSize: 20,
    color: 'white',
  },
  image: {
    height: 200,
  }
});

export default DetailScreen;
