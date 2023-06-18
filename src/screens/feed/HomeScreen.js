import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import useStore from "../../store/store";
import Home from "../../components/feed/Home";
import Loader from "../../components/common/Loader";

function HomeScreen() {
  const user = useStore((state) => state.user);
  const feeds = useStore((state) => state.feeds);
  const setFeeds = useStore((state) => state.setFeeds);
  const [isLoading, setIsLoading] = useState(false);

  const getFeeds = async () => {
    setIsLoading(true);
    try {
      const snapshot = await firestore().collection("Records").where('uid', '==', user.uid).orderBy("date", "desc").get()
      const data = snapshot.docs.map(item => (
        {
          ...item.data(),
          date: new Date(item.data().date.toDate()),
          id: item.id
        }
      ));
      setFeeds(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!feeds) {
      getFeeds();
    }
  }, []);

  return (
    <>
      {
        isLoading
        ? <Loader />
        : <Home />
      }
    </>
  );
}

export default HomeScreen;
