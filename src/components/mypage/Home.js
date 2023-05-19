import React from 'react';
import { useNavigation } from "@react-navigation/native";
import {StyleSheet, SafeAreaView, ScrollView, StatusBar, View, Text, Pressable, Alert} from 'react-native';
import useStore from "../../store/store";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Home() {
  const navigation = useNavigation();
  const user = useStore((state) => state.user);

  const onGoChallenge = () => {
    if (user.challenge === '') {
      Alert.alert("", "참가중인 챌린지가 없습니다.", [
        {
          text: "확인",
          onPress: () => null,
        },
      ]);
    } else {
      navigation.navigate('ChallengeDetail', {id: user.challenge});
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.wrap}>
          <Text style={styles.title}>프로필</Text>
          <Text style={styles.name}>{user.name}</Text>
        </View>
        <View style={styles.hr}></View>
        <View style={styles.menuWrap}>
          <Pressable style={styles.menu} onPress={() => navigation.navigate('WeightManage')}>
            <Icon name='chart-timeline-variant' color='#222' size={18} />
            <Text style={styles.menuText}>체중 관리</Text>
            <Icon name='chevron-right' color='#222' size={24} />
          </Pressable>
          <Pressable style={styles.menu} onPress={onGoChallenge}>
            <Icon name='flag' color='#222' size={18} />
            <Text style={styles.menuText}>참가중인 챌린지</Text>
            <Icon name='chevron-right' color='#222' size={24} />
          </Pressable>
          <Pressable style={styles.menu} onPress={() => navigation.navigate('PaceCalc')}>
            <Icon name='alarm-check' color='#222' size={18} />
            <Text style={styles.menuText}>페이스 계산</Text>
            <Icon name='chevron-right' color='#222' size={24} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrap: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  hr: {
    borderTopWidth: 1,
    borderTopColor: '#ededed',
    borderBottomWidth: 10,
    borderBottomColor: '#f3f3f3',
  },
  title: {
    marginBottom: 10,
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    fontWeight: 500,
    color: '#222',
  },
  name: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 18,
    color: '#222',
  },
  menuWrap: {
    paddingVertical: 5,
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
  },
  menuText: {
    marginLeft: 10,
    marginRight: 'auto',
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#222',
  }
});

export default Home;