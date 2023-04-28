import React, { useEffect, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import useStore from "../../store/store";
import Home from "../../components/feed/Home";

function HomeScreen() {
  const user = useStore((state) => state.user);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState();
  const [feeds, setFeeds] = useState([]);

  /** 피드 리스트 가져오기 */
  const getFeeds = async () => {
    setIsLoading(true);
    try {
      const snapshot = await firestore().collection('Records').where('uid', '==', user.uid).orderBy('date', 'desc').get();
      let data = [];
      snapshot.forEach(doc => {
        const item = {
          ...doc.data(),
          id: doc.id
        }
        data.push(item);
      });
      setFeeds(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getFeeds();
  }, [isFocused]);

  return (
    <Home isLoading={isLoading} feeds={feeds} />
  );
}

export default HomeScreen;
