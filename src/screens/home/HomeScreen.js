import React, { useEffect, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import {View, Text, StyleSheet, Linking} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import useStore from "../../store/store";
import Loader from "../../components/common/Loader";
import { lime100 } from "react-native-paper/lib/typescript/src/styles/themes/v2/colors";

function HomeScreen() {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [distance, setDistance] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const [exCurrent, setExCurrent] = useState();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  /** 브라우저 새창 열기 */
  // const openURL = (url) => {
  //   Linking.openURL(url);
  // }

  /** 내 기록 가져오기 */
  const getMyRecord = async () => {
    try {
      const today = new Date();
      const startDay = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + '1 09:00');
      const snapshot = await firestore().collection('Records').where('uid', '==', user.uid).where('date', '>', startDay).where('date', '<', today).get();
      let dis = 0;
      let cal = 0;
      snapshot.forEach(doc => {
        dis += parseFloat(doc.data().distance);
        cal += parseFloat(doc.data().calorie);
      });
      setDistance(dis);
      setCalorie(cal);
    } catch (e) {
      console.log('에러', e)
      crashlytics().recordError(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getMyRecord();
    const lv = +user.level + 1;
    const nextLevelEx = (( lv - 1 ) * ( lv - 1 )) * ( (lv*lv) - 13*lv + 82 );
    setExCurrent((user.exPoint/nextLevelEx) * 100);
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {isLoading
        ?
          <Loader />
        :
          <>
            <View style={styles.level}>
              <Text style={styles.text}>Lv. {user.level}</Text>
              <View style={styles.exWrap}>
                <View style={[styles.exCurrent, {width: exCurrent + '%'}]}></View>
                <View style={styles.exTotal}></View>
              </View>
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>이번달 달린 거리</Text>
              <Text style={styles.text}>{distance.toFixed(2)}km</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>이번달 소비 칼로리</Text>
              <Text style={styles.text}>{calorie}k㎈</Text>
            </View>
          </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'black',
  },
  level: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 80,
  },
  exWrap: {
    marginTop: 20,
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
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  text: {
    marginTop: 15,
    fontSize: 50,
    color: '#AEEA00',
    textAlign: 'center',
  },
  feeds: {
    borderTopWidth: 1,
    borderTopColor: '#333'
  }
});

export default HomeScreen;
