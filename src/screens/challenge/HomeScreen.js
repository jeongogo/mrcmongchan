import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import useStore from "../../store/store";
import { updateUser } from "../../lib/user";
import { useIsFocused } from "@react-navigation/native";
import Home from "../../components/challenge/Home";

function HomeScreen() {
  const isFocused = useIsFocused();
  const [challenges, setChallenges] = useState([]);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const getChanllenges = async () => {
    try {
      let currentDay = new Date();
      currentDay.setDate(currentDay.getDate() - 4);
      const snapshot = await firestore().collection('Challenges').where('endDate', '>', currentDay).get();
      let data = [];
      snapshot.forEach(doc => {
        const item = {
          ...doc.data(),
          id: doc.id
        }
        data.push(item);
      });
      setChallenges(data);

      const filterData = data.filter((i) => i.id === user.challenge);

      if (filterData.length < 1) {
        setUser({...user, challenge: ''});
        await updateUser(user.uid, {challenge: ''});
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getChanllenges();
  }, [isFocused]);

  return (
    <Home challenges={challenges} />
  )
};

export default HomeScreen;