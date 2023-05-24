import React from 'react';
import { format } from 'date-fns';
import useStore from "../../store/store";
import {View, Text, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomWrap from '../common/CustomWrap';

function Challenge({ challenge, navigation }) {
  const user = useStore((state) => state.user);

  const onDetail = (id) => {
    navigation.navigate('ChallengeDetail', {id});
  }

  return (
    <CustomWrap>
      <Pressable onPress={() => onDetail(challenge.id)}>
        <View style={styles.wrap}>
          <Text style={styles.title}>{challenge.title}</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>{format(new Date(challenge.startDate.toDate()), 'yyyy.MM.dd')}</Text>
          <Text style={styles.text}> ~ </Text>
          <Text style={styles.text}>{format(new Date(challenge.endDate.toDate()), 'yyyy.MM.dd')}</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>
            <Icon name={'flag'} color={'#222'} size={16} /> {challenge.goal}km
          </Text>
          <Text style={styles.margin}></Text>
          <Text style={styles.text}>
            <Icon name={'account-multiple'} color={'#222'} size={16} /> {challenge.entry.length}
          </Text>
          {user.challenge === challenge.id &&
            <Text style={styles.hasAttend}>참가중</Text>
          }
        </View>
      </Pressable>
    </CustomWrap>
  )
};

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  title: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#222',
  },
  text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#454545',
  },
  margin: {
    marginHorizontal: 10,
  },
  hasAttend: {
    marginLeft: 'auto',
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'underline',
  }
});

export default Challenge