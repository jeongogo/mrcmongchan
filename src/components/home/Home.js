import React, {useEffect, useState} from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import useStore from "../../store/store";
import {ScrollView, View, Text, StyleSheet, Linking, useWindowDimensions, Pressable, Alert} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";
import CustomWrap from '../common/CustomWrap';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Home({
  distanceWeek,
  calorieWeek,
  distanceMonth,
  calorieMonth,
  competition
}) {
  const [exCurrent, setExCurrent] = useState(0);
  const [disCurrent, setDisCurrent] = useState(0);
  const user = useStore((state) => state.user);
  const width = useWindowDimensions().width;
  
  const openURL = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open this URL");
    }
  }

  useEffect(() => {
    const lv = user.level + 1;
    const nextLevelEx = (( lv - 1 ) * ( lv - 1 )) * ( (lv*lv) - 13*lv + 82 );
    setExCurrent(((user.exPoint/nextLevelEx) * 100).toFixed(2));
    setDisCurrent((user.distance/320)*100);
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <ScrollView>
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
          </CustomWrap>
          {/* <CustomWrap>
            <Text style={styles.title}>최고기록</Text>
            <Text style={styles.text}>준비중</Text>
          </CustomWrap> */}
          <CustomWrap>
            <Text style={styles.title}>서울에서 부산까지</Text>
            <View style={styles.totalWrap}>
              <View style={[styles.totalDistance, {left: (disCurrent >= 100 ? 100 : disCurrent) + '%'}]}>
                <Icon name='run' color='#090707' size={20} />
              </View>
              <View style={styles.goal}>
                {disCurrent > 90
                  ? <Icon name='flag-variant-outline' color='#fcbe32' size={20} />
                  : <Icon name='flag-variant-outline' color='#090707' size={20} />
                }
              </View>
              <View style={styles.disTotal}>
                <View style={[styles.disCurrent, {width: (disCurrent > 100 ? 100 : disCurrent) + '%'}]}></View>
              </View>
            </View>
            <View style={styles.totalLabelWrap}>
              {disCurrent >= 100
                ? <Text style={[styles.label, styles.city]}>축하합니다! 부산에 도착했습니다. 😃</Text>
                : <Text style={[styles.label, styles.city]}>{320 - user.distance}km 남았습니다.</Text>
              }              
            </View>
          </CustomWrap>
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
          <Pressable onPress={() => openURL('https://smartstore.naver.com/xionstore/products/6853375059?NaPm=ct%3Dlh5ls0u8%7Cci%3D0683128f05c1e4d8c73b509545c6713d9da6fa4d%7Ctr%3Dsls%7Csn%3D3186798%7Chk%3Dba46cc1982d38532c1b3049e95605d5e006dd580')} style={styles.imageWrap}>
            <AutoHeightImage width={width} source={require('../../assets/images/x_kit.jpg')} />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f3f3f3',
  },
  distance: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 18,
  },
  totalWrap: {
    position: 'relative',
    width: '100%',
    height: 38,
    marginTop: 12,
  },
  totalDistance: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: -8,
    zIndex: 2,
  },
  goal: {
    position: 'absolute',
    top: 0,
    right: -10,
    zIndex: 1,
  },
  disCurrent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 10,
    backgroundColor: '#fcbe32',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    zIndex: 2,
  },
  disTotal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: "hidden",
    zIndex: 1,
  },
  totalLabelWrap: {
    position: 'relative',
    marginTop: 10,
    paddingVertical: 7,
  },
  city: {
    textAlign: 'center',
  },
  imageWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontFamily: 'Pretendard-Regular',
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
    marginVertical: 5,
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#222',
  },
  label: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#222',
  },
  text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#454545',
    textAlign: 'center',
  },
  location: {
    marginTop: 3,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#999'
  },
  date: {
    fontFamily: 'Pretendard-Regular',
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