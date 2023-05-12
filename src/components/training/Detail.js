import React from 'react';
import { useNavigation } from "@react-navigation/native";
import useStore from "../../store/store";
import { updateUser } from "../../lib/user";
import {SafeAreaView, ScrollView, View, Text, StyleSheet, Pressable, Alert} from 'react-native';

function Detail() {
  const navigation = useNavigation();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const trainingDetail = useStore((state) => state.trainingDetail);

  const onStart = () => {
    Alert.alert("", "훈련을 시작하시겠습니까?", [
      {
        text: "취소",
        onPress: () => null,
      },
      {
        text: "확인",
        onPress: () => {
          onStartTraining();
        }
      }
    ]);
  }

  const onStartTraining = async () => {
    await updateUser(user.uid, {
      ...user,
      training: trainingDetail,
      trainingStartDate: new Date(),
    });
    setUser({
      ...user,
      training: trainingDetail,
      trainingStartDate: new Date(),
    });
    navigation.navigate('TrainingProgress');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{trainingDetail.title}</Text>
        <View style={styles.content}>
          <View style={styles.wrap}>
            <Text style={styles.label}>일차</Text>
            <Text style={[styles.contentText, styles.center]}>미션 내용</Text>
          </View>
          {trainingDetail.program.map((item) => (
            <View key={item.day} style={styles.wrap}>
              <Text style={styles.label}>{item.day}</Text>
              <Text style={styles.contentText}>{item.content}</Text>
            </View>
          ))}
        </View>
        <Pressable onPress={onStart} style={styles.btn}>
          <Text style={styles.btnText}>시작하기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  title: {
    marginTop: 25,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 500,
    color: '#222',
    textAlign: 'center',
  },
  content: {
  },
  wrap: {
    marginTop: -1,
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    width: 50,
    paddingVertical: 15,
    color: '#222',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    backgroundColor: '#efefef'
  },
  contentText: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: '#222',
  },
  center: {
    textAlign: 'center',
    backgroundColor: '#efefef'
  },
  btn: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 17,
    backgroundColor: '#E53A40',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 700,
    textAlign: 'center',
  }
});

export default Detail;