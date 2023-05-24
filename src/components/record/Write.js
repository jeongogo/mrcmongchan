import React, {useEffect, useState} from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import useStore from "../../store/store";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  BackHandler,
  Pressable,
} from 'react-native';
import Loader from "../../components/common/Loader";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Write({navigation, isLoading, response, setResponse, handleSubmit}) {
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const record = useStore((state) => state.record);
  const captureURL = useStore((state) => state.captureURL);

  /** 삭제하기 */
  const onDelete = () => {
    Alert.alert("", "기록을 삭제히겠습니까?", [
      {
        text: "취소",
        onPress: () => null,
      },
      {
        text: "확인",
        onPress: () => {
          navigation.navigate('RecordHome');
        }
      }
    ]);
  }

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

  const onTakeCamera = () => {
    launchCamera(
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

  const onSubmit = () => {
    handleSubmit(title);
  }

  useEffect(() => {
    let recordHours = Math.floor(record.totalTime/1000/60/60);
    let recordMinutes = Math.floor(record.totalTime/1000/60) - (recordHours * 60);
    let recordSeconds = Math.floor((record.totalTime/1000) - (Math.floor(record.totalTime/1000/60) * 60));
    recordHours = recordHours < 1 ? '' : recordHours + ':';
    recordMinutes = recordMinutes < 10 ? '0' + recordMinutes : recordMinutes;
    recordSeconds = recordSeconds < 10 ? '0' + recordSeconds : recordSeconds;
    setTime(recordHours + recordMinutes + ':' + recordSeconds);

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {return true;}
    );
    return () => {
      backHandler.remove();
    }
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        {isLoading && <Loader />}
        <View style={styles.wrap}>
          <TextInput value={title} style={styles.input} onChangeText={setTitle} placeholder="달리기 제목" placeholderTextColor='#aaa' />
        </View>
        <View style={styles.imageWrap}>
          {captureURL &&
            <Image style={styles.image} source={{uri: captureURL}} />
          }
          {response
            ?
              <Image
                style={styles.image}
                source={{uri: response?.assets[0]?.uri}}
              />
            :
              <Pressable onPress={onTakeCamera} style={styles.addImage}>
                <Icon name='camera-plus-outline' color='#999' size={32} />
              </Pressable>
          }
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>거리</Text>
          <Text style={styles.text}>{record.distance}km</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>시간</Text>
          <Text style={styles.text}>{time}</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>페이스</Text>
          <Text style={styles.text}>{record.pace}</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.text}>소모 칼로리</Text>
          <Text style={styles.text}>{record.calorie}k㎈</Text>
        </View>
        <View style={styles.btnWrap}>
          <Pressable style={styles.btn} onPress={onDelete}>
            <Text style={[styles.btnText, styles.cancel]}>삭제하기</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={onSubmit}>
            <Text style={[styles.btnText, styles.submit]}>저장하기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  imageWrap: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    marginRight: 10,
    width: 100,
    height: 100,
  },
  addImage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ededed',
  },
  input: {
    marginBottom: 5,
    width: '100%',
    paddingHorizontal: 10,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#222',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
  },
  wrap: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#222',
  },
  btnWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 30,
  },
  btn: {
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
  },
  btnText: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },
  cancel: {
    color: '#E53A40',
    backgroundColor: '#fff',
    borderColor: '#E53A40',
  },
  submit: {
    color: 'white',
    backgroundColor: '#E53A40',
    borderColor: '#E53A40',
  },
});

export default Write;