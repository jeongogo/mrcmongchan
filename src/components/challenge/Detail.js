import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import useStore from "../../store/store";
import {SafeAreaView, ScrollView, View, Pressable, Text, StyleSheet, Alert, Image} from 'react-native';
import Entry from './Entry';
import CustomButton from "../common/CustomButton";

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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{uri: challenge.photoURL}} style={styles.image} />
        <View style={styles.infoWrap}>
          <View style={styles.top}>
            <Text style={styles.title}>{challenge.title}</Text>
            <View style={styles.dateWrap}>
              <Text style={styles.dateText}>{format(new Date(challenge.startDate.toDate()), 'yy.MM.dd')}</Text>
              <Text style={styles.dateText}> ~ </Text>
              <Text style={styles.dateText}>{format(new Date(challenge.endDate.toDate()), 'yy.MM.dd')}</Text>
            </View>
          </View>
          <View style={styles.info}>
            <View style={styles.goalBarWrap}>
              <View style={[styles.goalCurrent, {width: goalCurrent + '%'}]}></View>
              <View style={styles.goalTotal}></View>
            </View>
            <View style={styles.goalTitleWrap}>
              <Text style={styles.goalCurrentText}>{totalDistance}km</Text>
              <Text style={styles.goalText}>{challenge.goal}km</Text>
            </View>
            {goalCurrent >= 100 &&
              <View style={styles.goalIn}>
                <Text style={styles.goalInText}>축하합니다! 목표 거리에 도달했습니다.😃</Text>
              </View>
            }
          </View>
        </View>
        <View style={styles.hr}></View>
        <View style={styles.entry}>
          {entryList && 
            entryList.map((entry, index) => (
              <Entry key={entry.uid} entry={entry} index={index} />
          ))}
        </View>
        <View style={styles.btnWrap}>
          {user.challenge === '' &&
            <CustomButton title='참가하기' onPress={handleAttend} />
          }
          {user.challenge === routeId &&
            <Pressable onPress={onLeave} style={styles.btn}>
              <Text style={[styles.btnText, styles.gray]}>챌린지 나가기</Text>
            </Pressable>
          }
          {(user.isAdmin || user.uid === challenge.creator) &&
            <Pressable onPress={onDelete} style={styles.btn}>
              <Text style={[styles.btnText, styles.gray]}>챌린지 삭제하기</Text>
            </Pressable>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  infoWrap: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',    
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#222',
  },
  dateWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
    color: '#666',
  },
  info: {
    marginTop: 20,
  },
  goalTitleWrap: {
    marginTop: 5,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  goalCurrentText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#E53A40',
    textAlign: 'center',
  },
  goalText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#454545',
    textAlign: 'center',
  },
  goalBarWrap: {
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
    marginTop: 10,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  btn: {
    paddingVertical: 15,
    marginHorizontal: 10,
  },
  submit: {
    flexGrow: 1,
    backgroundColor: '#E53A40',
  },
  btnText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#fff',
    borderRadius: 5,
  },
  gray: {
    color: '#666',
    textDecorationLine: 'underline',
  },
  hr: {
    borderBottomWidth: 7,
    borderBottomColor: '#f3f3f3',
  },
  entry: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
});

export default Challenge