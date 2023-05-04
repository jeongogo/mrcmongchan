import React, { useEffect, useState } from 'react';
import useStore from "../../store/store";
import {View, Pressable, Text, StyleSheet, Alert} from 'react-native';
import Entry from './Entry';

function Challenge({
  route,
  challenge,
  goalCurrent,
  handleAttend,
  handleLeave,
  handleDelete,
  totalDistance
}) {
  const user = useStore((state) => state.user);

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

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{challenge.title}</Text>
        <View style={styles.goalTitleWrap}>
          <Text style={styles.goalCurrentText}>{totalDistance}km</Text>
          <Text style={styles.goalText}>{challenge.goal}km</Text>
        </View>
        <View style={styles.goalBarWrap}>
          <View style={[styles.goalCurrent, {width: goalCurrent + '%'}]}></View>
          <View style={styles.goalTotal}></View>
        </View>
      </View>
      <View style={styles.entry}>
        <Text style={styles.subTitle}>참가자</Text>
        {(challenge.entry?.length > 0) && 
          challenge.entry.map((i) => (
            <Entry key={i.uid} entry={i} />
        ))}
      </View>
      <View style={styles.btnWrap}>
        {user.challenge === '' &&
          <Pressable onPress={handleAttend}>
            <Text style={[styles.btn, styles.submit]}>참가 신청하기</Text>
          </Pressable>
        }
        {user.challenge === route.params.id &&
          <Pressable onPress={onLeave}>
            <Text style={[styles.btn, styles.cancel]}>참가 취소하기</Text>
          </Pressable>
        }
        {(user.isAdmin || user.uid === challenge.creator) &&
          <Pressable onPress={onDelete}>
            <Text style={[styles.btn, styles.submit]}>챌린지 삭제하기</Text>
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
    fontSize: 20,
    fontWeight: 500,
    color: '#222',
    textAlign: 'center',
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
    fontSize: 18,
    color: '#E53A40',
    fontWeight: 500,
    textAlign: 'center',
  },
  goalText: {
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
  subTitle: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 500,
    color: '#000',
  },
  btnWrap: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginHorizontal: 5,
    fontSize: 16,
    textAlign: 'center',
    borderRadius: 5,
  },
  submit: {
    color: '#fff',
    backgroundColor: '#E53A40',
  },
  cancel: {
    color: '#666',
    textDecorationLine: 'underline',
  },
  entry: {
    paddingVertical: 30,
    paddingHorizontal: 30,
  },
});

export default Challenge