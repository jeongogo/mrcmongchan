import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, StyleSheet, Pressable} from 'react-native';

function Challenge({ challenge, navigation }) {
  const onDetail = (id) => {
    navigation.navigate('ChallengeDetail', {id});
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => onDetail(challenge.id)}>
        <View style={styles.wrap}>
          <Text style={styles.text}>{challenge.title}</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>{challenge.startDate}</Text>
          <Text style={styles.text}> ~ </Text>
          <Text style={styles.text}>{challenge.endDate}</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>{challenge.goal}km</Text>
          <Text style={styles.margin}></Text>
          <View>
            <Icon name={'account-multiple'} color={'white'} size={16} />
          </View>
          <Text style={styles.text}>{challenge.entry.length}</Text>
        </View>
      </Pressable>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  margin: {
    marginHorizontal: 10,
  }
});

export default Challenge