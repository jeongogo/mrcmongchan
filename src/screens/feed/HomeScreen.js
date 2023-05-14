import React from 'react';
import { useQuery } from 'react-query';
import firestore from '@react-native-firebase/firestore';
import useStore from "../../store/store";
import Home from "../../components/feed/Home";
import Loader from "../../components/common/Loader";

function HomeScreen() {
  const user = useStore((state) => state.user);

  const getFeed = async () => {
    const snapshot = await firestore().collection('Records').where('uid', '==', user.uid).orderBy('date', 'desc').get();
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

  const feedQuery = useQuery('feed', getFeed);

  if (!feedQuery.data) {
    return <Loader />
  }

  return (
    <Home feeds={feedQuery.data} />
  );
}

export default HomeScreen;
