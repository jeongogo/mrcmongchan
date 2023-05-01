import React, {useState, useEffect} from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import useStore from "../../store/store";
import {View, Text, StyleSheet, Linking} from 'react-native';
import CustomWrap from '../common/CustomWrap';
import Loader from "../../components/common/Loader";

function Home({isLoading, distance, calorie, month}) {
  const [exCurrent, setExCurrent] = useState(0);
  const [exNext, setExNext] = useState(0);
  const user = useStore((state) => state.user);
  
  useEffect(() => {
    const lv = +user.level + 1;
    const nextLevelEx = (( lv - 1 ) * ( lv - 1 )) * ( (lv*lv) - 13*lv + 82 );
    setExNext(nextLevelEx);
    setExCurrent((user.exPoint/nextLevelEx) * 100);
  }, []);

  /** 브라우저 새창 열기 */
  // const openURL = (url) => {
  //   Linking.openURL(url);
  // }

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        {isLoading && <Loader /> }
        <CustomWrap>
          <View style={styles.levelWrap}>
            <View style={styles.levelTitleWrap}>
              <Text style={styles.title}>나의 레벨 {user.level}</Text>
              <Text style={styles.levelExp}>{user.exPoint}/{exNext}</Text>
            </View>
            <View style={styles.exWrap}>
              <View style={[styles.exCurrent, {width: exCurrent + '%'}]}></View>
              <View style={styles.exTotal}></View>
            </View>
          </View>
        </CustomWrap>
        <CustomWrap>
          <View style={styles.wrap}>
            <Text style={styles.title}>이번주</Text>
            <Text style={styles.text}>준비중</Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.title}>{month}월</Text>
            <Text style={styles.text}>{distance.toFixed(2)}km / {calorie}k㎈</Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.title}>누적</Text>
            <Text style={styles.text}>준비중</Text>
          </View>
        </CustomWrap>
        <CustomWrap>
          <Text style={styles.title}>대회정보</Text>
          <Text style={styles.text}>준비중</Text>
        </CustomWrap>
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
  levelWrap: {
    paddingVertical: 10,
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
    backgroundColor: '#ff7473',
    zIndex: 2,
  },
  exTotal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    zIndex: 1,
  },
  wrap: {
    paddingVertical: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: '#222',
  },
  text: {
    fontSize: 14,
    fontWeight: 400,
    color: '#454545',
    textAlign: 'center',
  },
});

export default Home