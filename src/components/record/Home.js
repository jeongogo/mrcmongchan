import React, { useState, useRef, useEffect } from 'react';
import {Platform, PermissionsAndroid, View, Text, StyleSheet, TouchableOpacity, BackHandler, Alert} from 'react-native';
import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import ViewShot from "react-native-view-shot";
import MapView, {Polyline} from 'react-native-maps';
import haversine from 'haversine';
import useStore from "../../store/store";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from "../../components/common/Loader";

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

function Home({ navigation }) {
  const user = useStore((state) => state.user);
  const setRecord = useStore((state) => state.setRecord);
  const setCaptureURL = useStore((state) => state.setCaptureURL);
  const trainingMission = useStore((state) => state.trainingMission);
  const [isLoading, setIsLoading] = useState(true);                  // loading
  const captureRef = useRef(null);                                   // 지도 캡쳐용 Ref
  const watchId = useRef(null);                                      // 위치 추적용 Ref
  const [initLocation, setInitLocation] = useState('');              // 실시간 현재 위치
  const [isStarted, setIsStarted] = useState(false);                 // 시작 여부
  const [isRecoding, setIsRecoding] = useState(false);               // 기록중 여부
  const distanceRef = useRef(null);                                  // 거리용 Ref
  const timeRef = useRef(null);                                      // 시간용 Ref
  const [totalTime, setTotalTime] = useState(0);                     // 누적 시간
  const [minutes, setMinutes] = useState(0);                         // 렌더링용 분
  const [seconds, setSeconds] = useState(0);                         // 렌더링용 초
  const [distance, setDistance] = useState(0);                       // 누적 거리
  const [pace, setPace] = useState('00:00');                         // 페이스
  const paceRef = useRef(1);                                         // 상세 페이스용 Ref
  const [paceDetail, setPaceDetail] = useState([]);                  // 상세 페이스
  const [path, setPath] = useState([]);                              // 경로 그리기

  const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise( async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        recordDistance();
        await BackgroundService.updateNotification({taskDesc: 'New ExampleTask description'});
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
        delay: 3000,
    },
  };

  /** 지도 초기값 세팅 */
  const initGeo = () => {
    Geolocation.getCurrentPosition((position) => {
      const {latitude, longitude} = position.coords;
      setInitLocation({ latitude, longitude });
    },
    (error) => {
      console.log(error.code, error.message);
    },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    );
  }

  /** 권한 받기 */
  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          initGeo(); 
        } else {
          console.log('권한을 못받음');
        }
      }
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('always');
        initGeo();
      }
    } catch (e) {
      console.log(e);
      crashlytics().recordError(e);
    } finally {
      setIsLoading(false);
    }
  }

  /** 시간 계산 */
  const recordTime = () => {
    timeRef.current = setInterval(() => {
      setTotalTime(prev => prev + 1000);
    }, 1000);
  }

  /** 위치 추적 + 기록 */
  const recordDistance = () => {
    try {
      watchId.current = Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          if (distanceRef.current != null) {
            const currentDistance = haversine(distanceRef.current, position.coords, {unit: 'meter'});
            setDistance(prev => prev + currentDistance);
            setPath(prev => [...prev, { latitude, longitude }]);
          }
          distanceRef.current = { latitude, longitude };
        },
        e => {
          Alert.alert("", e.message, [
            {
              text: "확인",
              onPress: () => null,
            },
          ]);
        },
        {
          enableHighAccuracy: true,
        }
      );
    } catch (e) {
      Alert.alert("", e.message, [
        {
          text: "확인",
          onPress: () => null,
        },
      ]);
    }
  }

  /** 페이스 계산 */
  useEffect(() => {
    if (distance > 30) {
      const time = (1000/distance) * (totalTime/1000);
      const m = (Math.floor(time / 60)).toFixed(0);
      const s = (time - m * 60).toFixed(0);
      const minutes = m < 10 ? '0' + m : m;
      const seconds = s < 10 ? '0' + s : s;
      setPace(minutes + ':' + seconds);
    } else {
      setPace('00:00');
    }
    if (distance > paceRef.current * 1000) {
      paceRef.current++;
      setPaceDetail(prev => [...prev, totalTime/1000]);
    }
  }, [distance]);

  /** 누적 분:초 */
  useEffect(() => {
    setMinutes(Math.floor(totalTime/1000/60));
    setSeconds((totalTime/1000) - (Math.floor(totalTime/1000/60) * 60));
  }, [totalTime]);

  /** 시작하기 */
  const onStart = async () => {
    setIsStarted(true);
    setIsRecoding(true);
    recordTime();
    // recordDistance();
    await BackgroundService.start(veryIntensiveTask, options);
  }

  /** 일시 정지 */
  const onPause = async () => {
    await BackgroundService.stop();
    setIsRecoding(false);
    clearInterval(timeRef.current);
    timeRef.current = null;
    Geolocation.clearWatch(watchId.current);
    watchId.current = null;
  }

  /** 측정 초기화 */
  const onClear = async () => {
    await BackgroundService.stop();
    setTotalTime(0);
    setDistance(0);
    setPace('00:00');
    setPaceDetail([]);
    setIsStarted(false);
    setIsRecoding(false);
    clearInterval(timeRef.current);
    paceRef.current = 1;
    timeRef.current = null;
    watchId.current = null;
  }

  /** 완료 Alert */
  const onComplete = () => {
    Alert.alert("", "기록 측정을 완료하시겠습니까?", [
      {
        text: "취소",
        onPress: () => null,
      },
      {
        text: "확인",
        onPress: () => {
          handleComplete();
        }
      }
    ]);
  }

  /** 완료 */
  const handleComplete = async () => {
    await BackgroundService.stop();
    try {
      if (distance - ((paceRef.current - 1) * 1000) > 490) {
        setPaceDetail(prev => [...prev, totalTime/1000]);
      }

      const uri = await captureRef.current.capture();
      setCaptureURL(uri);

      const intensity = distance / (totalTime/1000/60);

      let met = '';
      if (intensity < 134) {
        met = 7;
      } else if (intensity >= 134 && intensity < 139) {
        met = 8;
      } else if (intensity >= 139 && intensity < 161) {
        met = 9;
      } else if (intensity >= 161 && intensity < 178) {
        met = 10;
      } else if (intensity >= 178 && intensity < 189) {
        met = 11;
      } else if (intensity >= 189 && intensity < 201) {
        met = 11.5;
      } else if (intensity >= 201 && intensity < 214) {
        met = 12.5;
      } else if (intensity >= 214 && intensity < 229) {
        met = 13.5;
      } else if (intensity >= 229 && intensity < 247) {
        met = 14;
      } else if (intensity >= 247 && intensity < 268) {
        met = 15;
      } else if (intensity >= 268 && intensity < 292) {
        met = 16;
      } else if (intensity >= 292) {
        met = 18;
      }

      const calorie = met * (3.5 * user.weight * ((totalTime/1000) / 60)) * 5 / 1000;
      
      const recordData = {
        uid: user.uid,
        name: user.name,
        totalTime: totalTime/1000,
        distance: (distance/1000).toFixed(2),
        pace,
        paceDetail,
        calorie: calorie.toFixed(0),
        date: new Date(),
      };
      setRecord(recordData);
      onClear();
      navigation.navigate('RecordWrite');
    } catch (e) {
      Alert.alert("", e.message, [
        {
          text: "확인",
          onPress: () => null,
        },
      ]);
    }
  }

  /** 뒤로가기 이벤트 */
  const onBackAction = () => {
    onPause();
    if (isStarted) {
      Alert.alert("", "기록 측정을 중지하시겠습니까?", [
        {
          text: "취소",
          onPress: () => onStart(),
        },
        {
          text: "확인",
          onPress: () => {
            onClear();
          }
        }
      ]);
      return true;
    }
  };

  /** init */
  useEffect(() => {
    onClear();
    setRecord('');
    setCaptureURL('');
    requestPermissions();
    return () => {
      if (watchId.current) {
        Geolocation.clearWatch(watchId.current);
      };
    }
  }, []);

  /** Back Event */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackAction
    );
    return () => {
      backHandler.remove();
    }
  }, [isStarted]);

  if (isLoading) {
    return (
      <Loader />
    )
  }

  return (
    <View style={styles.container}>
      <ViewShot ref={captureRef} options={{ fileName: "map", format: "jpg", quality: 0.9 }}>
        {initLocation &&
          <MapView
            style={{width: '100%', height: '100%'}}
            initialRegion={{
              latitude: initLocation.latitude,
              longitude: initLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
            zoomEnabled={false}
            minZoomLevel={13}
            maxZoomLevel={13}
            rotateEnabled={false}
            scrollEnabled={false}
          >
            {(path.length > 1) &&
              <Polyline
                coordinates={path}
                strokeColor='red'
                strokeWidth={5}
              />
            }
          </MapView>
        }
      </ViewShot>
      {trainingMission !== '' &&
        <View style={styles.mission}>
          <Text style={styles.missionTitle}>진행중인 미션</Text>
          <Text style={styles.missionContent}>{trainingMission.content}</Text>
        </View>
      }
      {isStarted
        ?
          <View style={styles.record_wrap}>
            <View style={styles.record_el}>
              <Text style={styles.record_current}>{(distance/1000).toFixed(2)}</Text>
              <Text style={styles.record_title}>Distance</Text>
            </View>
            <View style={styles.record_el}>
              <Text style={styles.record_current}>{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}</Text>
              <Text style={styles.record_title}>Time</Text>
            </View>
            <View style={styles.record_el}>
              <Text style={styles.record_current}>{pace}</Text>
              <Text style={styles.record_title}>Pace</Text>
            </View>
            <View style={styles.record_btn_wrap}>
              {isRecoding
                ?
                  <TouchableOpacity activeOpacity={0.5} onPress={onPause} style={styles.record_btn}>
                    <Icon name='pause' color='white' size={30} />
                  </TouchableOpacity>
                :
                  <TouchableOpacity activeOpacity={0.5} onPress={onStart} style={styles.record_btn}>
                    <Text style={styles.record_btn_text}>
                      <Icon name='play-pause' color='white' size={30} />
                    </Text>
                  </TouchableOpacity>
              }
              <TouchableOpacity activeOpacity={0.5} onPress={onComplete} style={styles.record_btn}>
                <Text style={styles.record_btn_text}>
                  <Icon name='stop' color='white' size={30} />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        :
          <TouchableOpacity style={styles.start} activeOpacity={0.5} onPress={onStart}>
            <Text style={styles.startText}>시작</Text>
          </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  record_wrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 30,
    backgroundColor: '#000',
    zIndex: 10,
  },
  record_el: {
    marginBottom: 40,
  },
  record_current: {
    fontSize: 60,
    fontWeight: 700,
    color: '#fff',
    textAlign: 'center',
  },
  record_title: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  record_btn_wrap: {
    marginTop: 40,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  record_btn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 40,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  record_btn_text: {
    textAlign: 'center',
  },
  toggleBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  mission: {
    position: 'absolute',
    bottom: 170,
    left: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'red',
    width: 300,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    transform: [{ translateX: -150 }],
    zIndex: 9,
  },
  missionTitle: {
    fontSize: 16,
    color: '#000',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  missionContent: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  start: {
    position: 'absolute',
    bottom: 55,
    left: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    width: 100,
    height: 100,
    backgroundColor: '#000',
    transform: [{ translateX: -50 }],
    borderRadius: 50,
    zIndex: 10,
  },
  startText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  }
});

export default Home;
