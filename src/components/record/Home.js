import React, { useState, useRef, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import {
  Platform,
  PermissionsAndroid,
  View,
  Text,
  StyleSheet,
  BackHandler,
  Alert,
  AppState,
  Pressable,
  Vibration,
} from 'react-native';
import BackgroundGeolocation from "react-native-background-geolocation";
import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';
import { differenceInSeconds } from "date-fns";
import haversine from 'haversine';
import useStore from "../../store/store";
import Map from "./Map";
import Popup from "./Popup";
import Record from "./Record";
import Loader from "../../components/common/Loader";

function Home({ navigation }) {
  const user = useStore((state) => state.user);
  const permission = useStore((state) => state.permission);
  const setting = useStore((state) => state.setting);
  const setPermission = useStore((state) => state.setPermission);
  const setRecord = useStore((state) => state.setRecord);
  const setCaptureURL = useStore((state) => state.setCaptureURL);
  const [isLoading, setIsLoading] = useState(true);                  // loading
  const appState = useRef(AppState.currentState);                    // App State
  const captureRef = useRef(null);                                   // 지도 캡쳐용 Ref
  const [initLocation, setInitLocation] = useState('');              // 실시간 현재 위치
  const [isStarted, setIsStarted] = useState(false);                 // 시작 여부
  const [isRecoding, setIsRecoding] = useState(false);               // 기록중 여부
  const distanceRef = useRef(null);                                  // 거리용 Ref
  const backgroundStartTimeRef = useRef(null);                       // 시작 시간용 Ref
  const timeRef = useRef(null);                                      // 시간용 Ref
  const backgroundRef = useRef(null);                                // Background Ref
  const altitudeRef = useRef(1);                                     // 고도 Ref
  const [currentAltitude, setCurrentAltitude] = useState('');        // 실시간 고도
  const [altitude, setAltitude] = useState([]);                      // 기록 고도
  const [totalTime, setTotalTime] = useState(0);                     // 누적 시간
  const [distance, setDistance] = useState(0);                       // 누적 거리
  const [realtimeDistance, setRealtimeDistance] = useState([]);      // 페이스 계산용 거리
  const [pace, setPace] = useState('00:00');                         // 페이스
  const paceRef = useRef(1);                                         // 상세 페이스용 Ref
  const [paceDetail, setPaceDetail] = useState([]);                  // 상세 페이스
  const [path, setPath] = useState([]);                              // 경로 그리기
  const [areaName, setAreaName] = useState('');                      // 현재 위치 지역 이름
  const [weather, setWeather] = useState('');                        // 현재 위치 날씨
  
  /** 지도 초기값 세팅 */
  const initGeo = () => {
    Geolocation.getCurrentPosition((position) => {
      const {latitude, longitude} = position.coords;
      setInitLocation({ latitude, longitude });
      getAreaInfo(latitude, longitude);
      setIsLoading(false);
    },
    (error) => {
      console.log(error.code, error.message);
      setIsLoading(false);
    },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    );
  }

  /** 지역 이름, 날씨 가져오기 */
  const getAreaInfo = async (latitude, longitude) => {
    try {
      const areaNameRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=ko&key=${'AIzaSyDgFKJXcVa_LwwV3mPMxmPrEu1SDz9W9Y4'}`,
      );
      const areaNameResJson = await areaNameRes.json();
      const addressArr = areaNameResJson.results[0].formatted_address.split(
        ' ',
      );
      setAreaName(`${addressArr[2]} ${addressArr[3]}`);

      const areaWeatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=4f73a6b7126147928e173d4caa9d8d8b`);
      const areaWeatherResJson = await areaWeatherRes.json();
      setWeather(areaWeatherResJson.weather[0].main);
    } catch (e) {
      console.log(e);
    }
  }

  /** 권한 받기 */
  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          initGeo();
        } else {
          navigation.navigate('HomeStack');          
        }
      }
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('always');
        messaging().requestPermission();        
        initGeo();
      }
    } catch (e) {
      console.log(e);
    }
  }

  /** 백그라운드 서비스 */
  const requestBackgroundPermission = () => {
    BackgroundGeolocation.ready({      
      locationAuthorizationRequest: 'WhenInUse',      
      notification: {
        title: "모두의 러닝 코치",
        text: "앱이 실행중입니다."
      },
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      stopTimeout: 5,
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: false,
    }).then((state) => {
      setPermission(true);
      console.log("BackgroundGeolocation is configured and ready: ", state.enabled);
    });
  }

  /** 측정하기 */
  useEffect(() => {
    const onLocation = BackgroundGeolocation.onLocation((location) => {
      if (isRecoding) {
        const {latitude, longitude} = location.coords;
        setCurrentAltitude(location.coords.altitude);

        if (distanceRef.current != null) {
          const currentDistance = haversine(distanceRef.current, location.coords, {unit: 'meter'});
          setDistance(prev => prev + currentDistance);
          setPath(prev => [...prev, { latitude, longitude }]);
        }

        distanceRef.current = { latitude, longitude };
      }
    });

    return () => {
      onLocation.remove();
    }
  }, [isRecoding]);

  useEffect(() => {
    // 실시간 거리/시간 누적
    if (realtimeDistance.length < 10) {
      setRealtimeDistance(prev => [...prev, {
        time: totalTime,
        distance,
      }]);
    } else {
      const filterRealtimeDistance = realtimeDistance.filter((item, index) => index !== 0);
      setRealtimeDistance([...filterRealtimeDistance, {
        time: totalTime,
        distance,
      }]);
    }

    // 실시간 페이스 계산
    if (realtimeDistance.length >= 3) {
      const sumDistance = realtimeDistance[realtimeDistance.length - 1].distance - realtimeDistance[0].distance;
      const calcTime = realtimeDistance[realtimeDistance.length - 1].time - realtimeDistance[0].time;
      const time = (1000/sumDistance) * calcTime;
      const m = (Math.floor(time / 60)).toFixed(0);
      const s = (time - m * 60).toFixed(0);
      const minutes = m < 10 ? '0' + m : m;
      const seconds = s < 10 ? '0' + s : s;
      setPace(minutes + ':' + seconds);
    }

    // 1km마다 페이스 기록
    if (distance > paceRef.current * 1000) {
      if (setting.recordVaibration) {
        Vibration.vibrate();
      }
      paceRef.current++;
      setPaceDetail(prev => [...prev, totalTime]);
    }

    // 100m마다 고도 기록
    if (distance > altitudeRef.current * 100) {
      altitudeRef.current++;
      setAltitude(prev => [...prev, currentAltitude]);
    }
  }, [distance]);

  /** 시작하기 */
  const onStart = () => {
    setIsStarted(true);
    setIsRecoding(true);
    // onStartRecordTime();
    if (!isStarted) {
      backgroundStartTimeRef.current = new Date();
    } else {
      const t = new Date();
      t.setSeconds(t.getSeconds() - totalTime);
      backgroundStartTimeRef.current = t;
    }
    BackgroundTimer.runBackgroundTimer(() => { 
      const time = differenceInSeconds(new Date(), Date.parse(backgroundStartTimeRef.current))
      setTotalTime(time);
    }, 1000);
    BackgroundGeolocation.start()
      .then(() => BackgroundGeolocation.changePace(true))
      .catch((e) => console.log(e));
  }

  /** 일시 정지 */
  const onPause = () => {
    setIsRecoding(false);
    BackgroundTimer.stopBackgroundTimer();
    distanceRef.current = null;
    backgroundRef.current = null;
  }

  /** 측정 초기화 */
  const onClear = () => {
    setTotalTime(0);
    setDistance(0);
    setPace('00:00');
    setPaceDetail([]);
    setRealtimeDistance([]);
    setIsStarted(false);
    setIsRecoding(false);
    BackgroundTimer.stopBackgroundTimer();
    backgroundStartTimeRef.current = null;
    paceRef.current = 1;
    distanceRef.current = null;
    altitudeRef.current = 1;
    backgroundRef.current = null;
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
          BackgroundGeolocation.stop();
          handleComplete();
        }
      }
    ]);
  }

  /** 완료 */
  const handleComplete = async () => {
    try {
      const uri = await captureRef.current.capture();
      setCaptureURL(uri);

      const intensity = distance / (totalTime/60);

      let MET = '';
      if (intensity < 134) {
        MET = 7;
      } else if (intensity >= 134 && intensity < 139) {
        MET = 8;
      } else if (intensity >= 139 && intensity < 161) {
        MET = 9;
      } else if (intensity >= 161 && intensity < 178) {
        MET = 10;
      } else if (intensity >= 178 && intensity < 189) {
        MET = 11;
      } else if (intensity >= 189 && intensity < 201) {
        MET = 11.5;
      } else if (intensity >= 201 && intensity < 214) {
        MET = 12.5;
      } else if (intensity >= 214 && intensity < 229) {
        MET = 13.5;
      } else if (intensity >= 229 && intensity < 247) {
        MET = 14;
      } else if (intensity >= 247 && intensity < 268) {
        MET = 15;
      } else if (intensity >= 268 && intensity < 292) {
        MET = 16;
      } else if (intensity >= 292) {
        MET = 18;
      }

      const calorie = MET * (3.5 * user.weight * (totalTime / 60)) * 5 / 1000;

      const time = (1000/distance) * totalTime;
      const m = (Math.floor(time / 60)).toFixed(0);
      const s = (time - m * 60).toFixed(0);
      const minutes = m < 10 ? '0' + m : m;
      const seconds = s < 10 ? '0' + s : s;
      
      const recordData = {
        uid: user.uid,
        name: user.name,
        totalTime,
        distance: (distance/1000).toFixed(2),
        pace: totalTime > 60 ? minutes + ':' + seconds : '00:00',
        paceDetail: (distance - ((paceRef.current - 1) * 1000)) > 100 ? [...paceDetail, totalTime] : paceDetail,
        calorie: calorie.toFixed(0),
        date: new Date(),
        areaName,
        weather,
        altitude,
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
    if (isStarted) {
      Alert.alert("", "기록 측정을 중지하시겠습니까?", [
        {
          text: "취소",
          onPress: () => null,
        },
        {
          text: "확인",
          onPress: () => {
            BackgroundGeolocation.stop();
            onClear();
          }
        }
      ]);
      return true;
    }
  };

  /** 권한 받기 */
  useEffect(() => {
    if (permission) {
      initGeo();
      requestBackgroundPermission();
    } else {
      requestPermissions();
    }
  }, [permission]);

  /** 초기화 */
  useEffect(() => {
    onClear();
    setRecord('');
    setCaptureURL('');
    return () => {
      BackgroundGeolocation.stop();
    }
  }, []);

  /** 앱 상태 + 뒤로가기 핸들러 */
  useEffect(() => {
    let subscription = '';
    subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App Foreround');
      } else {
        console.log('App Backround');
      }
      appState.current = nextAppState;
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackAction
    );

    return () => {
      if (permission) {
        subscription.remove();
      }
      backHandler.remove();
    };
  }, [isStarted, isRecoding]);

  return (
    <View style={styles.container}>
      {isLoading && <Loader />}
      {!permission &&
        <Popup navigation={navigation} requestBackgroundPermission={requestBackgroundPermission} />
      }
      {initLocation &&
        <Map captureRef={captureRef} initLocation={initLocation} path={path} />
      }
      {isStarted
        ?
          <Record
            isRecoding={isRecoding}
            distance={distance}
            totalTime={totalTime}
            pace={pace}
            onPause={onPause}
            onStart={onStart}
            onComplete={onComplete}
          />
        :
          <Pressable style={styles.start} onPress={onStart}>
            <Text style={styles.startText}>시작</Text>
          </Pressable>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  start: {
    position: 'absolute',
    bottom: 55,
    left: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    width: 110,
    height: 110,
    backgroundColor: '#222',
    transform: [{ translateX: -55 }],
    borderRadius: 55,
    zIndex: 10,
  },
  startText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    fontWeight: 700,
    color: '#fff',
    textAlign: 'center',
  },
});

export default Home;