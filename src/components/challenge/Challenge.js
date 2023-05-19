import React, { useEffect, useState } from 'react';
import useStore from "../../store/store";
import {View, Text, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomWrap from '../common/CustomWrap';

function Challenge({ challenge, navigation }) {
  const user = useStore((state) => state.user);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const onDetail = (id) => {
    navigation.navigate('ChallengeDetail', {id});
  }

  useEffect(() => {
    const currentStart = new Date(challenge.startDate.toDate());
    const currentEnd = new Date(challenge.endDate.toDate());
    const startYear = currentStart.getFullYear();
    const startMonth = currentStart.getMonth() + 1;
    const startDate = currentStart.getDate();
    const endYear = currentEnd.getFullYear();
    const endMonth = currentEnd.getMonth() + 1;
    const endDate = currentEnd.getDate();
    setStart(startYear + '.' + startMonth + '.' + startDate);
    setEnd(endYear + '.' + endMonth + '.' + endDate);
  }, []);

  return (
    <CustomWrap>
      <Pressable onPress={() => onDetail(challenge.id)}>
        <View style={styles.wrap}>
          <Text style={styles.title}>{challenge.title}</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>{start}</Text>
          <Text style={styles.text}> ~ </Text>
          <Text style={styles.text}>{end}</Text>
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
    fontFamily: 'Pretendard-Bold',
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