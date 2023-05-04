import React from 'react';
import firestore from '@react-native-firebase/firestore';
import Write from "../../components/challenge/Write";

function WriteScreen({navigation}) {
  const handleSubmit = async (challenge) => {
    try {
      const data = await firestore().collection('Challenges').add(challenge);
      navigation.navigate('ChallengeDetail', {id: data.id})
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Write handleSubmit={handleSubmit} />
  )
};

export default WriteScreen;