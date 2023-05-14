import React, {useEffect, useState} from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import useStore from "../../store/store";
import {ScrollView, View, Text, StyleSheet, Linking, useWindowDimensions, Pressable} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";
import CustomWrap from '../common/CustomWrap';

function Home({
  distanceWeek,
  calorieWeek,
  distanceMonth,
  calorieMonth,
  competition
}) {
  const [exCurrent, setExCurrent] = useState(0);
  const user = useStore((state) => state.user);
  const width = useWindowDimensions().width;
  
  const openURL = (url) => {
    Linking.openURL(url);
  }

  useEffect(() => {
    const lv = user.level + 1;
    const nextLevelEx = (( lv - 1 ) * ( lv - 1 )) * ( (lv*lv) - 13*lv + 82 );
    setExCurrent(((user.exPoint/nextLevelEx) * 100).toFixed(2));
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <Pressable onPress={() => openURL('https://smartstore.naver.com/xionstore/products/6853375059?NaPm=ct%3Dlh5ls0u8%7Cci%3D0683128f05c1e4d8c73b509545c6713d9da6fa4d%7Ctr%3Dsls%7Csn%3D3186798%7Chk%3Dba46cc1982d38532c1b3049e95605d5e006dd580')} style={styles.imageWrap}>
            <AutoHeightImage width={width} source={require('../../assets/images/x_kit.jpg')} />
          </Pressable>
          <CustomWrap>
            <Text style={styles.title}>리포트</Text>
            <View style={styles.levelWrap}>
              <View style={styles.levelTitleWrap}>
                <Text style={styles.label}>레벨 {user.level}</Text>
                <Text style={styles.levelExp}>{exCurrent}%</Text>
              </View>
              <View style={styles.exWrap}>
                <View style={[styles.exCurrent, {width: exCurrent + '%'}]}></View>
                <View style={styles.exTotal}></View>
              </View>
            </View>
            <View style={styles.wrap}>
              <Text style={styles.label}>이번 주</Text>
              <Text style={styles.text}>{distanceWeek}km / {calorieWeek}k㎈</Text>
            </View>
            <View style={styles.wrap}>
              <Text style={styles.label}>이번 달</Text>
              <Text style={styles.text}>{distanceMonth}km / {calorieMonth}k㎈</Text>
            </View>
            <View style={styles.wrap}>
              <Text style={styles.label}>누적 거리</Text>
              <Text style={styles.text}>{user.distance > 0 ? (parseFloat(user.distance)).toFixed(2) : 0}km</Text>
            </View>
          </CustomWrap>
          {/* <CustomWrap>
            <Text style={styles.title}>최고기록</Text>
            <Text style={styles.text}>준비중</Text>
          </CustomWrap> */}
          <CustomWrap>
            <Text style={styles.title}>대회정보</Text>
            {competition.map((item) => (
              <Pressable key={item.url} style={styles.competitionWrap} onPress={() => openURL(item.url)}>
                <View>
                  <Text style={styles.label}>{item.title}</Text>
                  <Text style={styles.location}>{item.location}</Text>
                </View>
                <Text style={[styles.text, styles.date]}>{item.date}</Text>
              </Pressable>
            ))}
          </CustomWrap>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#f3f3f3',
  },
  imageWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  levelWrap: {
    marginTop: 10,
    marginBottom: 25,
  },
  levelTitleWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  levelExp: {
    fontSize: 11,
    color: '#666',
  },
  exWrap: {
    marginTop: 5,
    position: 'relative',
    width: '100%',
    height: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  exCurrent: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#E53A40',
    zIndex: 2,
  },
  exTotal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    zIndex: 1,
  },
  wrap: {
    paddingVertical: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginVertical: 7,
    fontSize: 22,
    fontWeight: 700,
    color: '#000',
  },
  label: {
    fontSize: 15,
    color: '#222',
  },
  text: {
    fontSize: 15,
    color: '#454545',
    textAlign: 'center',
  },
  location: {
    marginTop: 3,
    fontSize: 12,
    color: '#999'
  },
  date: {
    fontSize: 14,
    color: '#454545',
  },
  competitionWrap: {
    paddingVertical: 15,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

});

export default Home