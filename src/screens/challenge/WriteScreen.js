import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import firestore from '@react-native-firebase/firestore';
import Write from "../../components/challenge/Write";

function WriteScreen({navigation}) {
  const queryClient = useQueryClient();
  const handleSubmit = async (challenge) => {
    try {
      const data = await firestore().collection('Challenges').add(challenge);
      navigation.navigate('ChallengeDetail', {id: data.id})
    } catch (e) {
      console.log(e);
    }
  }

  const challengeMutation = useMutation(handleSubmit, {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('challenges');
    },
  });

  return (
    <Write challengeMutation={challengeMutation} />
  )
};

export default WriteScreen;