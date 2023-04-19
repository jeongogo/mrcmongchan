import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import {View, Text, StyleSheet, Linking} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import useStore from "../../store/store";
import Loader from "../../components/common/Loader";

function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [distance, setDistance] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const user = useStore((state) => state.user);

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
  }, []);

  return (
    <View style={styles.container}>
      {isLoading
        ?
          <Loader />
        :
          <>
            <View style={styles.info}>
              <Text style={styles.title}>이번달 달린 거리</Text>
              <Text style={styles.text}>{distance}km</Text>
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
    padding: 15,
    backgroundColor: 'black',
  },
  info: {
    marginTop: 30,
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
