import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';
import useStore from "../../store/store";
import Loader from "../../components/common/Loader";

function Home({isLoading, distance, calorie}) {
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
    <View style={styles.container}>
      {isLoading && <Loader /> }
      <View style={styles.levelWrap}>
        <View style={styles.levelTitleWrap}>
          <Text style={styles.levelTitle}>Lv. {user.level}</Text>
          <Text style={styles.levelExp}>{user.exPoint.toFixed(0)}/{exNext}</Text>
        </View>
        <View style={styles.exWrap}>
          <View style={[styles.exCurrent, {width: exCurrent + '%'}]}></View>
          <View style={styles.exTotal}></View>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.text}>{distance.toFixed(2)}km</Text>
        <Text style={styles.title}>이번달 달린 거리</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.text}>{calorie}k㎈</Text>
        <Text style={styles.title}>이번달 소비 칼로리</Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'black',
  },
  levelWrap: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  levelTitleWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  levelTitle: {
    fontSize: 40,
    fontWeight: 500,
    color: '#AEEA00',
  },
  levelExp: {
    fontSize: 12,
    color: '#ddd',
  },
  exWrap: {
    marginTop: 10,
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
    backgroundColor: '#AEEA00',
    zIndex: 2,
  },
  exTotal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    zIndex: 1,
  },
  info: {
    marginTop: 50,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    color: '#ddd',
    textAlign: 'center',
  },
  text: {
    fontSize: 50,
    fontWeight: 500,
    color: '#AEEA00',
    textAlign: 'center',
  },
  feeds: {
    borderTopWidth: 1,
    borderTopColor: '#333'
  }
});

export default Home