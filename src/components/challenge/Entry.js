import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

function Challenge({ entry }) {
  useEffect(() => {
    // 거리 정렬 후 렌더링
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{entry.name}</Text>
      <Text style={styles.text}>{entry.distance}km</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
});

export default Challenge