import React, {useEffect, useState} from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
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
}) {
  const [exCurrent, setExCurrent] = useState(0);
  const [disCurrent, setDisCurrent] = useState(0);
  const user = useStore((state) => state.user);
  const width = useWindowDimensions().width;
  
  const openURL = (url) => {
    Linking.openURL(url);
  }

  const getTime = (time) => {
    let recordHours = Math.floor(time/60/60);
    let recordMinutes = Math.floor(time/60) - (recordHours * 60);
    let recordSeconds = Math.floor((time) - (Math.floor(time/60) * 60));
    recordHours = recordHours < 1 ? '' : recordHours + ':';
    recordMinutes = recordMinutes < 10 ? '0' + recordMinutes : recordMinutes;
    recordSeconds = recordSeconds < 10 ? '0' + recordSeconds : recordSeconds;
    return recordHours + recordMinutes + ':' + recordSeconds;
  }

  useEffect(() => {
    const lv = user.level + 1;
    const nextLevelEx = (( lv - 1 ) * ( lv - 1 )) * ( (lv*lv) - 13*lv + 82 );
    setExCurrent(((user.exPoint/nextLevelEx) * 100).toFixed(2));
    setDisCurrent((user.distance/320)*100);
  }, [user]);

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <ScrollView style={styles.contentWrap}>
          <Pressable onPress={() => openURL('https://smartstore.naver.com/xionstore/products/6853375059?NaPm=ct%3Dlh5ls0u8%7Cci%3D0683128f05c1e4d8c73b509545c6713d9da6fa4d%7Ctr%3Dsls%7Csn%3D3186798%7Chk%3Dba46cc1982d38532c1b3049e95605d5e006dd580')} style={styles.imageWrap}>
            <AutoHeightImage width={width} source={require('../../assets/images/x_kit.jpg')} />
          </Pressable>
          <CustomWrap>
            <View style={styles.levelWrap}>
              <View style={styles.levelTitleWrap}>
                <Text style={[styles.title, styles.noMargin]}>레벨 {user.level}</Text>
                <Text style={styles.levelExp}>{exCurrent}%</Text>
              </View>
              <View style={styles.exWrap}>
                <View style={[styles.exCurrent, {width: exCurrent + '%'}]}></View>
                <View style={styles.exTotal}></View>
              </View>
            </View>
            <View style={styles.wrap}>
              <Text style={styles.label}>이번 주</Text>
              <Text style={styles.text}>{distanceWeek}km / {calorieWeek.toLocaleString('ko-KR')}k㎈</Text>
            </View>
            <View style={styles.wrap}>
              <Text style={styles.label}>이번 달</Text>
              <Text style={styles.text}>{distanceMonth}km / {calorieMonth.toLocaleString('ko-KR')}k㎈</Text>
            </View>
            <View style={styles.wrap}>
              <Text style={styles.label}>누적 거리</Text>
              <Text style={styles.text}>{user.distance.toFixed(2)}km</Text>
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
                : <Text style={[styles.label, styles.city]}>{(320 - user.distance).toFixed(2)}km 남았습니다.</Text>
              }              
            </View>
          </CustomWrap>
          <CustomWrap>
            <Text style={styles.title}>최고 기록</Text>
            <View style={styles.wrap}>
              <Text style={styles.label}>5K</Text>
              <Text style={styles.text}>{user.record.five === 0 ? '--:--' : getTime(user.record.five)}</Text>
            </View>
            <View style={styles.wrap}>
              <Text style={styles.label}>10K</Text>
              <Text style={styles.text}>{user.record.ten === 0 ? '--:--' : getTime(user.record.ten)}</Text>
            </View>
            <View style={styles.wrap}>
              <Text style={styles.label}>하프</Text>
              <Text style={styles.text}>{user.record.half === 0 ? '--:--' : getTime(user.record.half)}</Text>
            </View>
            <View style={styles.wrap}>
              <Text style={styles.label}>풀코스</Text>
              <Text style={styles.text}>{user.record.full === 0 ? '--:--' : getTime(user.record.full)}</Text>
            </View>
          </CustomWrap>
          {/* <CustomWrap>
            <Text style={[styles.title, styles.noMargin]}>대회정보</Text>
            {competition.map((item) => (
              <Pressable key={item.url} style={styles.competitionWrap} onPress={() => openURL(item.url)}>
                <View>
                  <Text style={styles.label}>{item.title}</Text>
                  <Text style={styles.location}>{item.location}</Text>
                </View>
                <Text style={[styles.text, styles.date]}>{format(new Date(item.date.toDate()), 'yy.M.dd')}</Text>
              </Pressable>
            ))}
          </CustomWrap> */}
          <View style={styles.hr}></View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  contentWrap: {
    paddingTop: 10,
    paddingHorizontal: 10,
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
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  levelWrap: {
    marginBottom: 20,
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
    marginTop: 7,
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
    paddingVertical: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: 5,
    marginBottom: 7,
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#222',
  },
  noMargin: {
    marginBottom: 0,
  },
  label: {
    minWidth: 35,
    marginRight: 20,
    fontFamily: 'Pretendard-Medium',
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
    fontSize: 13,
    color: '#666'
  },
  date: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
    color: '#999',
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
  hr: {
    height: 10,
  }
});

export default Home