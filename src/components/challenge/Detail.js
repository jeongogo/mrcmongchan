import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import useStore from "../../store/store";
import {View, Pressable, Text, StyleSheet, Alert} from 'react-native';
import Entry from './Entry';

function Challenge({
  routeId,
  challenge,
  handleAttend,
  handleLeave,
  handleDelete,
}) {
  const user = useStore((state) => state.user);
  const [totalDistance, setTotalDistance] = useState(0);
  const [goalCurrent, setGoalCurrent] = useState(0);
  const [entryList, setEntryList] = useState([]);

  /** 참가 취소 Alert */
  const onLeave = () => {
    Alert.alert("", "챌린지 참가를 취소하시겠습니까?", [
      {
        text: "취소",
        onPress: () => null,
      },
      {
        text: "확인",
        onPress: () => {
          handleLeave();
        }
      }
    ]);
  }

  /** 챌린지 삭제 Aleert */
  const onDelete = () => {
    Alert.alert("", "챌린지를 삭제하시겠습니까?", [
      {
        text: "취소",
        onPress: () => null,
      },
      {
        text: "확인",
        onPress: () => {
          handleDelete();
        }
      }
    ]);
  }

  useEffect(() => {
    const total = challenge.entry.reduce((accumulator, current, index, array) => {
      return accumulator + current.distance;
    }, 0);
    setTotalDistance(total);
    setGoalCurrent((total/challenge.goal)*100);

    const entry = [...challenge.entry];
    entry.sort((a, b) => {
      return b.distance - a.distance;
    });
    setEntryList(entry);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{challenge.title}</Text>
        <View style={styles.dateWrap}>
          <Text style={styles.dateText}>{format(new Date(challenge.startDate.toDate()), 'yyyy.MM.dd')}</Text>
          <Text style={styles.dateText}> ~ </Text>
          <Text style={styles.dateText}>{format(new Date(challenge.endDate.toDate()), 'yyyy.MM.dd')}</Text>
        </View>
        <View style={styles.goalTitleWrap}>
          <Text style={styles.goalCurrentText}>{totalDistance}km</Text>
          <Text style={styles.goalText}>{challenge.goal}km</Text>
        </View>
        <View style={styles.goalBarWrap}>
          <View style={[styles.goalCurrent, {width: goalCurrent + '%'}]}></View>
          <View style={styles.goalTotal}></View>
        </View>
        {goalCurrent >= 100 &&
          <View style={styles.goalIn}>
            <Text style={styles.goalInText}>축하합니다! 목표 거리에 도달했습니다.😃</Text>
          </View>
        }
        <View></View>
      </View>
      <View style={styles.entry}>
        {entryList && 
          entryList.map((entry, index) => (
            <Entry key={entry.uid} entry={entry} index={index} />
        ))}
      </View>
      <View style={styles.btnWrap}>
        {user.challenge === '' &&
          <Pressable onPress={handleAttend}>
            <Text style={[styles.btn, styles.submit]}>참가하기</Text>
          </Pressable>
        }
        {user.challenge === routeId &&
          <Pressable onPress={onLeave}>
            <Text style={[styles.btn, styles.cancel]}>챌린지 나가기</Text>
          </Pressable>
        }
        {(user.isAdmin || user.uid === challenge.creator) &&
          <Pressable onPress={onDelete}>
            <Text style={[styles.btn, styles.cancel]}>챌린지 삭제하기</Text>
          </Pressable>
        }
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  info: {
    paddingHorizontal: 30,
    paddingVertical: 40,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  title: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    color: '#222',
    textAlign: 'center',
  },
  dateWrap: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#999',
  },
  goalTitleWrap: {
    marginTop: 30,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  goalCurrentText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#E53A40',
    textAlign: 'center',
  },
  goalText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 18,
    color: '#454545',
    textAlign: 'center',
  },
  goalBarWrap: {
    marginTop: 10,
    position: 'relative',
    width: '100%',
    height: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  goalCurrent: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#E53A40',
    zIndex: 2,
  },
  goalTotal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    zIndex: 1,
  },
  goalIn: {
    marginTop: 20,
  },
  goalInText: {
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: 'Pretendard-Medium',
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 500,
    color: '#000',
  },
  btnWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    paddingVertical: 15,
    marginHorizontal: 10,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    textAlign: 'center',
    borderRadius: 5,
  },
  submit: {
    paddingHorizontal: 30,
    color: '#fff',
    backgroundColor: '#E53A40',
  },
  cancel: {
    color: '#666',
    textDecorationLine: 'underline',
  },
  entry: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
});

export default Challenge