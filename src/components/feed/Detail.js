import React, { useEffect, useState } from 'react';
import useStore from "../../store/store";
import {SafeAreaView, ScrollView, View, Text, Image, StyleSheet, useWindowDimensions} from 'react-native';
import CustomWrap from '../common/CustomWrap';

function Detail() {
  const width = useWindowDimensions().width;
  const feedDetail = useStore((state) => state.feedDetail);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [paceDetail, setPaceDetail] = useState([]);

  useEffect(() => {
    setMinutes(Math.floor(feedDetail.totalTime/60));
    setSeconds(feedDetail.totalTime - (Math.floor(feedDetail.totalTime/60) * 60));
    if (feedDetail.paceDetail.length > 0) {
      const filterData = feedDetail.paceDetail.map((item, index) => {
        if (index === 0) {
          return item;
        }
        return item - feedDetail.paceDetail[index-1];
      });
      const max = Math.max.apply(Math, filterData);
      const processData = filterData.map((item) => {
        const m = (Math.floor(item / 60)).toFixed(0);
        const s = (item - m * 60).toFixed(0);  
        const minutes = m < 1 ? '00' : m < 10 ? '0' + m : m;
        const seconds = s < 1 ? '00' : s < 10 ? '0' + s : s;
        let newItem = {
          seconds: item,
          pace: minutes + ':' + seconds,
          percent: (item/max) * 100,
        }
        return newItem;
      });
      setPaceDetail(processData);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageWrap}>
          <Image style={styles.image} width={width} source={{uri: feedDetail.captureURL}} />
        </View>
        <View style={styles.infoWrap}>
          <View style={styles.wrap}>
            <Text style={styles.text}>{feedDetail.distance}km</Text>
            <Text style={styles.label}>이동 거리</Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.text}>{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}</Text>
            <Text style={styles.label}>이동 시간</Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.text}>{feedDetail.pace}</Text>
            <Text style={styles.label}>평균 페이스</Text>
          </View>
        </View>
        <View style={styles.contentWrap}>
          <Text style={styles.title}>페이스</Text>
          {paceDetail.length > 0 &&
            paceDetail.map((item, index) => (
              <View style={styles.paceWrap} key={index}>
                <Text style={styles.paceLabel}>{index+1}</Text>
                <View style={styles.paceBar}>
                  <View style={[styles.paceBarCurrent, {width: item.percent + '%'}]}></View>
                </View>
                <Text style={styles.paceText}>{item.pace}</Text>
              </View>
            ))
          }
        </View>
        <View style={styles.contentWrap}>
          <Text style={styles.title}>고도</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageWrap: {
    
  },
  image: {
    height: 200,
  },
  infoWrap: {
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f6f6',
    overflow: 'hidden',
  },
  wrap: {
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  contentWrap: {
    marginBottom: 10,
    paddingTop: 30,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 700,
    color: '#222',
  },
  text: {
    fontSize: 24,
    color: '#454545',
  },
  label: {
    marginTop: 5,
    fontSize: 16,
    color: '#222',
  },
  paceWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  paceLabel: {
    marginRight: 10,
    fontSize: 14,
    color: '#222',
  },
  paceBar: {
    position: 'relative',
    flexGrow: 1,
    height: 10,
    marginRight: 20,
  },
  paceBarCurrent: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#ff7473',
    borderRadius: 5,
    zIndex: 2,
  },
  paceText: {
    fontSize: 14,
    color: '#222',
  },
});

export default Detail;