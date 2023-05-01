import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import CustomWrap from '../common/CustomWrap';

function Challenge({ challenge, navigation }) {
  const onDetail = (id) => {
    navigation.navigate('ChallengeDetail', {id});
  }

  return (
    <CustomWrap>
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
            <Icon name={'account-multiple'} color={'#222'} size={16} />
          </View>
          <Text style={styles.text}>{challenge.entry.length}</Text>
        </View>
      </Pressable>
    </CustomWrap>
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
    fontSize: 14,
    color: '#222',
  },
  margin: {
    marginHorizontal: 10,
  }
});

export default Challenge