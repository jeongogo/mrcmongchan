import React from 'react';
import { useQuery } from 'react-query';
import firestore from '@react-native-firebase/firestore';
import useStore from "../../store/store";
import Home from "../../components/home/Home";
import Loader from '../../components/common/Loader';

function HomeScreen() {
  const user = useStore((state) => state.user);  
  
  /** 내 기록 가져오기 */
  const getMyRecord = async () => {
    const today = new Date();
    const startDay = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + '1 09:00');
    const snapshot = await firestore().collection('Records').where('uid', '==', user.uid).where('date', '>', startDay).where('date', '<', today).get();

    let startWeek = null;
    let distanceWeek = 0;
    let calorieWeek = 0;
    let distanceMonth = 0;
    let calorieMonth = 0;

    snapshot.forEach(doc => {
      const obj = doc.data();
      distanceMonth += parseFloat(obj.distance);
      calorieMonth += parseFloat(obj.calorie);
      switch (today.getDay()) {
        case 1:
          startWeek = today.getDate();
          break;
        case 2:
          startWeek = today.getDate() - 1;
          break;
        case 3:
          startWeek = today.getDate() - 2;
          break;
        case 4:
          startWeek = today.getDate() - 3;
          break;
        case 5:
          startWeek = today.getDate() - 4;
          break;
        case 6:
          startWeek = today.getDate() - 5;
          break;
        case 7:
          startWeek = today.getDate() - 6;
          break;
      }
      if (startWeek >= obj.date.toDate().getDate() <= (startWeek + 6)) {
        distanceWeek += parseFloat(obj.distance);
        calorieWeek += parseFloat(obj.calorie);
      }
    });

    const data = {
      distanceWeek: distanceWeek > 0 ? distanceWeek.toFixed(2) : 0,
      distanceMonth: distanceMonth > 0 ? distanceMonth.toFixed(2) : 0,
      calorieWeek,
      calorieMonth,
    }

    return data;
  }

  /** 대회정보 가져오기 */
  const getCompetition = async () => {
    const snapshot = await firestore().collection('Competitions').orderBy('date').get();
    let data = [];
    snapshot.forEach(doc => {
      const item = {
        ...doc.data(),
      };
      data.push(item);
    });
    return data;
  }

  const recordQuery = useQuery('myrecord', getMyRecord);
  const competitionQuery = useQuery('competition', getCompetition);

  if (!competitionQuery.data || !recordQuery.data) {
    return <Loader />
  }

  return (
    <Home
      distanceWeek={recordQuery.data.distanceWeek}
      calorieWeek={recordQuery.data.calorieWeek}
      distanceMonth={recordQuery.data.distanceMonth}
      calorieMonth={recordQuery.data.calorieMonth}
      competition={competitionQuery.data}
    />
  );
};

export default HomeScreen;
