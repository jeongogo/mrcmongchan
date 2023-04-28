import React, { useEffect, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import { getUser } from "../../lib/user";
import crashlytics from '@react-native-firebase/crashlytics';
import useStore from "../../store/store";
import Home from "../../components/home/Home";

function HomeScreen() {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [distance, setDistance] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

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

  const refreshUser = async () => {
    try {
      const u = await getUser(user.uid);
      setUser(u);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getMyRecord();
    refreshUser();
  }, [isFocused]);

  return (
    <Home
      isLoading={isLoading}
      distance={distance}
      calorie={calorie}
    />
  );
};

export default HomeScreen;