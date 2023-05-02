import React, {useState, useEffect} from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import useStore from "../../store/store";
import {ScrollView, View, Text, StyleSheet, Linking, Image, useWindowDimensions, Pressable} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";
import CustomWrap from '../common/CustomWrap';
import Loader from "../../components/common/Loader";

function Home({isLoading, distance, calorie, month}) {
  const [exCurrent, setExCurrent] = useState(0);
  const user = useStore((state) => state.user);
  const width = useWindowDimensions().width;
  
  const openURL = (url) => {
    Linking.openURL(url);
  }

  useEffect(() => {
    const lv = +user.level + 1;
    const nextLevelEx = (( lv - 1 ) * ( lv - 1 )) * ( (lv*lv) - 13*lv + 82 );
    setExCurrent((user.exPoint/nextLevelEx) * 100);
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          {isLoading && <Loader /> }
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
              <Text style={styles.label}>이번주</Text>
              <Text style={styles.text}>준비중</Text>
            </View>
            <View style={styles.wrap}>
              <Text style={styles.label}>{month}월</Text>
              <Text style={styles.text}>{distance.toFixed(2)}km / {calorie}k㎈</Text>
            </View>
            <View style={styles.wrap}>
              <Text style={styles.label}>누적</Text>
              <Text style={styles.text}>준비중</Text>
            </View>
          </CustomWrap>
          <CustomWrap>
            <Text style={styles.title}>대회정보</Text>
            <Pressable style={styles.competitionWrap} onPress={() => openURL('http://bbangrun.com/')}>
              <Image style={styles.image} width={50} height={50} source={{uri: 'https://cdn.imweb.me/thumbnail/20230216/52ac6f385319c.jpg'}} />
              <Text style={[styles.label, styles.competitionTitle]}>빵빵런</Text>
              <Text style={[styles.text, styles.date]}>2023.5.14</Text>
            </Pressable>
            <Pressable style={styles.competitionWrap} onPress={() => openURL('http://www.irunman.kr')}>
              <Image style={styles.image} width={50} height={50} source={{uri: 'http://www.irunman.kr/admin/data/main/main_288'}} />
              <Text style={[styles.label, styles.competitionTitle]}>러너스 레이스</Text>
              <Text style={[styles.text, styles.date]}>2023.5.20</Text>
            </Pressable>
            <Pressable style={styles.competitionWrap} onPress={() => openURL('http://amarunsb.com/')}>
              <Image style={styles.image} width={50} height={50} source={{uri: 'http://amarunsb.com/images/common/visual/main/001.jpg'}} />
              <Text style={[styles.label, styles.competitionTitle]}>새벽강변 국제마라톤대회</Text>
              <Text style={[styles.text, styles.date]}>2023.6.17</Text>
            </Pressable>
          </CustomWrap>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f6f6f6',
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
    marginBottom: 20,
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
    marginTop: 5,
    marginBottom: 20,
    fontSize: 20,
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
  date: {
    fontSize: 14,
    color: '#999',
  },
  competitionWrap: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  competitionTitle: {
    marginLeft: 10,
    marginRight: 'auto',
  },
  image: {
    borderRadius: 5,
  },
});

export default Home