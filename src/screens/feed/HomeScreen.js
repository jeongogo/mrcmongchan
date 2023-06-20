import React from 'react';
import { useQuery } from 'react-query';
import firestore from '@react-native-firebase/firestore';
import useStore from "../../store/store";
import Home from "../../components/feed/Home";
import Loader from "../../components/common/Loader";

function HomeScreen() {
  const user = useStore((state) => state.user);

  const getFeeds = async () => {
    const snapshot = await firestore().collection("Records").where('uid', '==', user.uid).orderBy("date", "desc").get()
    const data = snapshot.docs.map(item => (
      {
        ...item.data(),
        date: item.data().date.toDate(),
        id: item.id
      }
    ));
    return data;
  }

  const feedsQuery = useQuery('feeds', getFeeds);

  if (!feedsQuery.data) {
    return <Loader />
  }

  return <Home feeds={feedsQuery.data} />;
}

export default HomeScreen;
