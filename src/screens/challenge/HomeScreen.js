import React, {useEffect} from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useQuery } from 'react-query';
import firestore from '@react-native-firebase/firestore';
import useStore from "../../store/store";
import { updateUser } from "../../lib/user";
import Home from "../../components/challenge/Home";
import Loader from "../../components/common/Loader";

function HomeScreen() {
  const isFocused = useIsFocused();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const getChallenges = async () => {
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
    return data;
  }

  const challengesQuery = useQuery('challenges', getChallenges);

  const checkChallenge = async () => {
    const filterData = challengesQuery.data.filter((i) => i.id === user.challenge);
    
    if (filterData.length < 1) {
      setUser({...user, challenge: ''});
      await updateUser(user.uid, {challenge: ''});
    }
  }

  useEffect(() => {
    if (challengesQuery.data && user.challenge !== '') {
      checkChallenge();
    }
  }, [isFocused]);

  if (!challengesQuery.data) {
    return <Loader />
  }
  
  return (
    <Home challenges={challengesQuery.data} />
  )
};

export default HomeScreen;