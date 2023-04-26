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
    setSeconds(feedDetail.totalTime - (minutes * 60));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <Text style={styles.text}>{feedDetail.name}</Text>
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
      <View style={styles.wrap}>
        <Image style={styles.image} width={width-30} source={{uri: feedDetail.captureURL}} />
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
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 20,
  },
  text: {
    minWidth: 100,
    fontSize: 20,
    color: 'white',
  },
  image: {
    height: 200,
  }
});

export default DetailScreen;
