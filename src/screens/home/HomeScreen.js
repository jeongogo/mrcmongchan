import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import useStore from "../../store/store";
import Home from "../../components/home/Home";

function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [exCurrent, setExCurrent] = useState(0);
  const [distanceWeek, setDistanceWeek] = useState(0);
  const [calorieWeek, setCalorieWeek] = useState(0);
  const [distanceMonth, setDistanceMonth] = useState(0);
  const [calorieMonth, setCalorieMonth] = useState(0);
  const [month, setMonth] = useState(0);
  const [competition, setCompetition] = useState([]);
  const user = useStore((state) => state.user);

  /** 내 기록 가져오기 */
  const getMyRecord = async () => {
    try {
      const today = new Date();
      const startDay = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + '1 09:00');
      const snapshot = await firestore().collection('Records').where('uid', '==', user.uid).where('date', '>', startDay).where('date', '<', today).get();

      let startWeek = null;
      let disWeek = 0;
      let calWeek = 0;
      let disMonth = 0;
      let calMonth = 0;

      snapshot.forEach(doc => {
        const data = doc.data();
        disMonth += parseFloat(data.distance);
        calMonth += parseFloat(data.calorie);
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
        if (startWeek >= data.date.toDate().getDate() <= (startWeek + 6)) {
          disWeek += parseFloat(data.distance);
          calWeek += parseFloat(data.calorie);
        }
      });

      setDistanceWeek(disWeek);
      setCalorieWeek(calWeek);
      setDistanceMonth(disMonth);
      setCalorieMonth(calMonth);
      setMonth(today.getMonth() + 1);
    } catch (e) {
      console.log('에러', e)
      crashlytics().recordError(e);
    } finally {
      setIsLoading(false);
    }
  }

  const getCompetition = async () => {
    try {
      const snapshot = await firestore().collection('Competitions').orderBy('date').get();
      let data = [];
      snapshot.forEach(doc => {
        const current = new Date(doc.data().date.toDate());
        const year = current.getFullYear();
        const month = current.getMonth() + 1;
        const date = current.getDate();
        const item = {
          ...doc.data(),
          date: year + '.' + month + '.' + date
        };
        data.push(item);
      });
      setCompetition(data);
    } catch (e) {
      console.log(e);
    }
  }

  const levelCheck = () => {
    const lv = user.level + 1;
    const nextLevelEx = (( lv - 1 ) * ( lv - 1 )) * ( (lv*lv) - 13*lv + 82 );
    setExCurrent((user.exPoint/nextLevelEx) * 100);
  }

  useEffect(() => {
    getMyRecord();
    getCompetition();
    levelCheck();
  }, []);

  return (
    <Home
      isLoading={isLoading}
      exCurrent={exCurrent}
      distanceWeek={distanceWeek}
      calorieWeek={calorieWeek}
      distanceMonth={distanceMonth}
      calorieMonth={calorieMonth}
      month={month}
      competition={competition}
    />
  );
};

export default HomeScreen;
