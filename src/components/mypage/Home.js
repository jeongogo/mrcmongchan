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
            <Text style={styles.menuText}>체중 관리</Text>
            <Icon name='chevron-right' color='#222' size={24} />
          </Pressable>
          <Pressable style={styles.menu} onPress={onGoChallenge}>
            <Text style={styles.menuText}>참가중인 챌린지</Text>
            <Icon name='chevron-right' color='#222' size={24} />
          </Pressable>
          {/* <Pressable style={styles.menu} onPress={() => navigation.navigate('PaceCalc')}>
            <Text style={styles.menuText}>페이스 계산</Text>
            <Icon name='chevron-right' color='#222' size={24} />
          </Pressable> */}
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
    fontSize: 20,
    fontWeight: 500,
    color: '#222',
  },
  name: {
    fontSize: 18,
    color: '#222',
  },
  menuWrap: {
    paddingVertical: 10,
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
  },
  menuText: {
    fontSize: 18,
    fontWeight: 500,
    color: '#222',
  }
});

export default Home;