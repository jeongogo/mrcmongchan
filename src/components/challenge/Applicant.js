import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

function Challenge({ applicant, handleAttend }) {
  const onAccept = () => {
    handleAttend(applicant.uid, applicant.name);
  }

  useEffect(() => {
    // 거리 정렬 후 렌더링
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{applicant.name}</Text>
      <Button onPress={onAccept} title='수락' />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 7,
    paddingVertical: 15,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
});

export default Challenge