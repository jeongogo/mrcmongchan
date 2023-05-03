import React from 'react';
import firestore from '@react-native-firebase/firestore';
import Write from "../../components/challenge/Write";

function WriteScreen({navigation}) {
  const handleSubmit = async (data) => {
    try {
      const data = await firestore().collection('Challenges').add(data);
      navigation.navigate('ChallengeHome', {id: data.id})
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Write handleSubmit={handleSubmit} />
  )
};

export default WriteScreen;