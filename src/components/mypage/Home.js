import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';
import { signOut } from '../../lib/auth';
import useStore from "../../store/store";
import { StyleSheet, SafeAreaView, ScrollView, Image, View, Text, Pressable, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Home() {
  const navigation = useNavigation();
  const [visibleForm, setVisibleForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

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

  const onLogout = () => {
    signOut();
    setUser('');
  }

  const handleLeave = async () => {
    const provider = auth.EmailAuthProvider;
    const authCredential = provider.credential('chcgogotest@gmail.com', '!test1234');
    await auth().currentUser.reauthenticateWithCredential(authCredential);
    auth().currentUser.delete().then(() => {
      firestore().collection('Users').doc(user.id).delete();
      signOut();
      setUser('');
    }).catch((error) => {
      console.log(error, "error")
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.wrap}>
          <Pressable onPress={() => navigation.navigate('Profile')}>
            <View style={styles.profile}>
              <View style={styles.avatar}>
                <Image
                  style={styles.circle}
                  source={user.photoURL ? {uri: user.photoURL} : require('../../assets/images/user.png')}
                />
              </View>
              <Text style={styles.name}>{user.name}</Text>
              <Icon name='chevron-right' color='#222' size={24} />
            </View>
          </Pressable>
        </View>
        <View style={styles.hr}></View>
        <View style={styles.menuWrap}>
          <Pressable style={styles.menu} onPress={() => navigation.navigate('Garmin')}>
            <Image style={{width: 18, height: 18}} source={require('../../assets/images/icon_garmin.png')} />
            <Text style={styles.menuText}>Garmin 연동하기</Text>
            <Icon name='chevron-right' color='#222' size={24} />
          </Pressable>
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
            <Text style={styles.menuText}>페이스 계산기</Text>
            <Icon name='chevron-right' color='#222' size={24} />
          </Pressable>
          <Pressable style={styles.menu} onPress={() => navigation.navigate('VDOT')}>
            <Icon name='help-circle-outline' color='#222' size={18} />
            <Text style={styles.menuText}>예상 기록 테스트</Text>
            <Icon name='chevron-right' color='#222' size={24} />
          </Pressable>
          <Pressable style={styles.menu} onPress={() => navigation.navigate('Setting')}>
            <Icon name='cog-outline' color='#222' size={18} />
            <Text style={styles.menuText}>설정</Text>
            <Icon name='chevron-right' color='#222' size={24} />
          </Pressable>
        </View>
        <View style={styles.btn}>
          <Pressable onPress={() => setVisibleForm(true)}>
            <Text style={styles.btnText}>회원탈퇴</Text>
          </Pressable>
          <Pressable onPress={onLogout}>
            <Text style={styles.btnText}>로그아웃</Text>
          </Pressable>
        </View>
      </ScrollView>
      {visibleForm &&
        <View style={styles.form}>
          <View style={styles.formWrap}>
            <Text style={styles.formTitle}>사용자 재인증</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.formInput} placeholder='이메일' placeholderTextColor='#666' />
            <TextInput value={password} onChangeText={setPassword} style={styles.formInput} placeholder='비밀번호' placeholderTextColor='#666' />
            <View style={styles.formBtnWrap}>
              <Pressable onPress={() => setVisibleForm(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>취소</Text>
              </Pressable>
              <Pressable onPress={handleLeave} style={styles.leaveBtn}>
                <Text style={styles.leaveBtnText}>회원탈퇴</Text>
              </Pressable>
            </View>
          </View>
        </View>
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profile: {
    marginTop: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  circle: {
    width: 50,
    height: 50,
  },
  title: {
    marginBottom: 10,
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    fontWeight: 500,
    color: '#222',
  },
  name: {
    marginRight: 'auto',
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#222',
  },
  form: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  formWrap: {
    paddingVertical: 36,
    paddingHorizontal: 36,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#222',
    textAlign: 'center',
  },
  formInput: {
    marginTop: 10,
    paddingHorizontal: 10,
    width: 200,
    height: 48,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
  },
  formBtnWrap: {
    marginTop: 32,
    display: 'flex',
    flexDirection: 'row',
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#999',
    borderRadius: 32,
    flexGrow: 1,
  },
  cancelBtnText: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
  },
  leaveBtn: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#E53A40',
    borderRadius: 32,
    flexGrow: 1,
  },
  leaveBtnText: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
  },
  wrap: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  hr: {
    borderTopWidth: 1,
    borderTopColor: '#ededed',
    borderBottomWidth: 7,
    borderBottomColor: '#f3f3f3',
  },
  menuWrap: {
    paddingVertical: 5,
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 17,
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
  },
  btn: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    marginRight: 20,
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
});

export default Home;