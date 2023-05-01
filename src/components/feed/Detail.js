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
    if (feedDetail.paceDetail.length > 1) {
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
        <View style={styles.contentWrap}>
          <CustomWrap>
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
          </CustomWrap>
          <CustomWrap>
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
          </CustomWrap>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  imageWrap: {
    marginBottom: 20,
  },
  image: {
    height: 200,
  },
  contentWrap: {
    paddingHorizontal: 20,
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  text: {
    fontSize: 14,
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