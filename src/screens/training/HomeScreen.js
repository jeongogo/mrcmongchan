import React from 'react';
import { useQuery } from 'react-query';
import firestore from '@react-native-firebase/firestore';
import Home from "../../components/training/Home";
import Loader from "../../components/common/Loader";

function HomeScreen() {
  const getTraining = async () => {
    const snapshot = await firestore().collection('Trainings').get();
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

  const trainingQuery = useQuery('myrecord', getTraining);

  if (!trainingQuery.data) {
    return <Loader />
  }

  return (
    <Home trainings={trainingQuery.data} />
  )
};

export default HomeScreen;