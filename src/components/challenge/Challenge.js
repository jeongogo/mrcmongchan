import React from 'react';
import { format } from 'date-fns';
import useStore from "../../store/store";
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomWrap from '../common/CustomWrap';

function Challenge({ challenge, navigation }) {
  const user = useStore((state) => state.user);

  const onDetail = (id) => {
    navigation.navigate('ChallengeDetail', {id});
  }

  return (
    <CustomWrap>
      <Pressable onPress={() => onDetail(challenge.id)} style={styles.block}>
        <View style={styles.imageWrap}>
          <Image source={{uri: challenge.photoURL}} style={styles.image} />
        </View>
        <View style={styles.contentWrap}>
          <Text style={styles.title}>{challenge.title}</Text>
          <View style={styles.wrap}>
            <Text style={styles.date}>{format(new Date(challenge.startDate.toDate()), 'yyyy.MM.dd')}</Text>
            <Text style={styles.date}> ~ </Text>
            <Text style={styles.date}>{format(new Date(challenge.endDate.toDate()), 'yyyy.MM.dd')}</Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.text}>
              <Icon name={'flag'} color={'#222'} size={16} /> {challenge.goal}km
            </Text>
            <Text style={styles.margin}></Text>
            <Text style={styles.text}>
              <Icon name={'account-multiple'} color={'#222'} size={16} /> {challenge.entry.length}
            </Text>
          </View>
        </View>
        {user.challenge === challenge.id &&
          <Text style={styles.hasAttend}>참가중</Text>
        }
      </Pressable>
    </CustomWrap>
  )
};

const styles = StyleSheet.create({
  block: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  imageWrap: {
    width: 100,
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  contentWrap: {
    marginLeft: 15,
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
  date: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#666',
  },
  margin: {
    marginHorizontal: 10,
  },
  hasAttend: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'underline',
    zIndex: 2,
  }
});

export default Challenge