import React, {useState} from 'react';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import useStore from "../../store/store";
import {SafeAreaView, ScrollView, View, Text, Pressable, TextInput, StyleSheet, Keyboard, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Write({ challengeMutation }) {
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [visibleStartPic, setVisibleStartPic] = useState(false);
  const [visibleEndPic, setVisibleEndPic] = useState(false);
  const [response, setResponse] = useState(null);
  const user = useStore((state) => state.user);

  const showStartPicker = () => {
    setVisibleStartPic(true);
    Keyboard.dismiss();
  };

  const hideStartPicker = () => {
    setVisibleStartPic(false);
  };

  const showEndPicker = () => {
    setVisibleEndPic(true);
    Keyboard.dismiss();
  };

  const hideEndPicker = () => {
    setVisibleEndPic(false);
  };

  const onStartDate = (current) => {
    const date = new Date(current);
    setStartDate(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
    hideStartPicker();
  };

  const onEndDate = (current) => {
    const date = new Date(current);
    setEndDate(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
    hideEndPicker();
  };

  const onSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android',
      },
      (res) => {
        if (res.didCancel) {
          return;
        }
        setResponse(res);
      },
    );
  };

  const onSubmit = async () => {
    try {
      if (title === '' || startDate === '' || endDate === '') {
        return;
      }

      let photoURL = '';
  
      if (response) {
        const asset = response.assets[0];
        const extension = asset.fileName.split('.').pop();
        const reference = storage().ref(`/challenge/${new Date().getTime()}.${extension}`);
  
        if (Platform.OS === 'android') {
          await reference.putString(asset.base64, 'base64', {
            contentType: asset.type,
          });
        } else {
          await reference.putFile(asset.uri);
        }
  
        photoURL = response ? await reference.getDownloadURL() : null;
      }

      const challenge = {
        title,
        creator: user.uid,
        goal,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        entry: [],
        photoURL,
      };
      challengeMutation.mutate(challenge);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.wrap}>
          <Text style={styles.title}>챌린지명</Text>
          <TextInput value={title} style={styles.input} onChangeText={setTitle} />
        </View>
        <View style={styles.wrap}>
          <Text style={styles.title}>목표 거리</Text>
          <TextInput value={goal} style={styles.input} onChangeText={setGoal} placeholder="km" placeholderTextColor='#aaa' />
        </View>
        <View style={styles.wrap}>
          <Text style={styles.title}>기간</Text>
          <View style={styles.dateWrap}>
            <Pressable style={styles.grow} onPress={showStartPicker}>
              <View style={styles.input}>
                <Text style={styles.text}>{startDate ? startDate : '시작'}</Text>
              </View>
            </Pressable>
            <Text style={styles.text}> ~ </Text>
            <Pressable style={styles.grow} onPress={showEndPicker}>
              <View style={styles.input}>
                <Text style={styles.text}>{endDate ? endDate : '종료'}</Text>
              </View>
            </Pressable>
            <DateTimePickerModal
              isVisible={visibleStartPic}
              mode="date"
              onConfirm={onStartDate}
              onCancel={hideStartPicker}
            />
            <DateTimePickerModal
              isVisible={visibleEndPic}
              mode="date"
              onConfirm={onEndDate}
              onCancel={hideEndPicker}
            />
          </View>
        </View>
        <View style={[styles.wrap, styles.imageWrap]}>
          <Text style={styles.title}>포스터</Text>
          {response
            ?
              <Image
                style={styles.image}
                source={{uri: response?.assets[0]?.uri}}
              />
            :
              <Pressable onPress={onSelectImage} style={styles.imagePick}>
                <Icon name='camera-plus-outline' color='#999' size={32} />
              </Pressable>
          }
        </View>
        <View style={styles.btnWrap}>
          <Pressable style={styles.btn} onPress={onSubmit}>
            <Text style={styles.btnText}>만들기</Text>
          </Pressable>
        </View>
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
  wrap: {
    
  },
  title: {
    marginTop: 20,
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    fontWeight: 500,
    color: '#222',
  },
  input: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
    height: 42,
    paddingHorizontal: 10,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#222',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  dateWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#222',
  },
  grow: {
    flexGrow: 1,
    width: '40%',
  },
  imageWrap: {
    
  },
  image: {
    marginTop: 10,
    width: '100%',
    aspectRatio: 1,
  },
  imagePick: {
    marginTop: 10,
  },
  btnWrap: {
    marginTop: 20,
    marginBottom: 20,
  },
  btn: {
    paddingVertical: 15,
    backgroundColor: '#E53A40',
    borderRadius: 5,
  },
  btnText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    fontWeight: 500,
    color: 'white',
    textAlign: 'center',
  }
});

export default Write