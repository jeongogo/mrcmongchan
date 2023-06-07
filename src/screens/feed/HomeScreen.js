import React from 'react';
import firestore from '@react-native-firebase/firestore';
import { useInfiniteQuery } from 'react-query';
import useStore from "../../store/store";
import Home from "../../components/feed/Home";
import Loader from "../../components/common/Loader";

function HomeScreen() {
  const user = useStore((state) => state.user);

  const feedQuery = useInfiniteQuery(["feed"],
    async ({queryKey, pageParam}) => {
      return pageParam
        ?
          await firestore()
          .collection("Records")
          .where('uid', '==', user.uid)
          .orderBy("date", "desc")
          .startAfter(pageParam)
          .limit(10)
          .get()
          .then((querySnapshot) => querySnapshot)
        :
          await firestore()
          .collection("Records")
          .where('uid', '==', user.uid)
          .orderBy("date", "desc") 
          .limit(10)
          .get()
          .then((querySnapshot) => querySnapshot)
    }, 
    {
      getNextPageParam: (querySnapshot) => {
        if (querySnapshot.size < 10) return null;
        else return querySnapshot.docs[querySnapshot.docs.length - 1];
      },
    }
  );

  const onMore = () => {
    if (feedQuery.hasNextPage) {
      feedQuery.fetchNextPage();
    } else {
      console.log("no next page");
    }
  }

  if (!feedQuery.data) {
    return <Loader />
  }

  return (
    <Home data={feedQuery.data} onMore={onMore} />
  );
}

export default HomeScreen;
