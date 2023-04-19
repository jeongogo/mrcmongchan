import React, { useEffect, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import useStore from "../../store/store";
import {View, StyleSheet, SafeAreaView, ScrollView, StatusBar, Alert} from 'react-native';
import Feed from "../../components/feed/Feed";
import Loader from "../../components/common/Loader";

function FeedScreen({navigation}) {
  const user = useStore((state) => state.user);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState();
  const [feeds, setFeeds] = useState([]);

  /** 피드 리스트 가져오기 */
  const getFeeds = async () => {
    setIsLoading(true);
    try {
      const snapshot = await firestore().collection('Records').where('uid', '==', user.uid).get();
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
      Alert.alert("실패", e.message, [
        {
          text: "확인",
          onPress: () => null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getFeeds();
  }, [isFocused]);
  return (
    <SafeAreaView style={styles.container}>
      {isLoading
        ?
          <Loader />
        :
          <ScrollView>
            {(feeds.length > 0) && 
              feeds.map((feed) => (
                <Feed key={feed.id} feed={feed} navigation={navigation} />
            ))}
          </ScrollView>
        }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#000'
  },
});

export default FeedScreen;
