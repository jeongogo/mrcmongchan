import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import Home from "../../components/training/Home";
import Loader from "../../components/common/Loader";

function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [trainings, setTrainings] = useState([]);

  const getTraining = async () => {
    setIsLoading(true);
    try {
      const snapshot = await firestore().collection('Trainings').get();
      let data = [];
      snapshot.forEach(doc => {
        const item = {
          ...doc.data(),
          id: doc.id
        }
        data.push(item);
      });
      setTrainings(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getTraining();
  }, []);

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Home trainings={trainings} />
    </>
  )
};

export default HomeScreen;