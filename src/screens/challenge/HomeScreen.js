import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from "@react-navigation/native";
import Home from "../../components/challenge/Home";

function HomeScreen() {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState();
  const [challenges, setChallenges] = useState([]);

  const getChanllenges = async () => {
    setIsLoading(true);
    try {
      const snapshot = await firestore().collection('Challenges').get();
      let data = [];
      snapshot.forEach(doc => {
        const item = {
          ...doc.data(),
          id: doc.id
        }
        data.push(item);
      });
      setChallenges(data);
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
    getChanllenges();
  }, [isFocused]);

  return (
    <Home isLoading={isLoading} challenges={challenges} />
  )
};

export default HomeScreen;