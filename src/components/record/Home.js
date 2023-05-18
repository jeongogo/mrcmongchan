import React, { useState, useRef, useEffect } from 'react';
import {Platform, PermissionsAndroid, View, Text, StyleSheet, BackHandler, Alert, AppState, Pressable} from 'react-native';
import BackgroundGeolocation from "react-native-background-geolocation";
import Geolocation from 'react-native-geolocation-service';
import haversine from 'haversine';
import useStore from "../../store/store";
import Map from "./Map";
import Popup from "./Popup";
import Record from "./Record";
import Loader from "../../components/common/Loader";

function Home({ navigation }) {
  const user = useStore((state) => state.user);
  const permission = useStore((state) => state.permission);
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
  const backgroundStartTimeRef = useRef(null);                                 // 시작 시간용 Ref
  const timeRef = useRef(null);                                      // 시간용 Ref
  const backgroundRef = useRef(null);                                // Background Ref
  const altitudeRef = useRef(1);                                     // 고도 Ref
  const [currentAltitude, setCurrentAltitude] = useState('');        // 실시간 고도
  const [altitude, setAltitude] = useState([]);                      // 기록 고도
  const [totalTime, setTotalTime] = useState(0);                     // 누적 시간
  const [minutes, setMinutes] = useState(0);                         // 렌더링용 분
  const [seconds, setSeconds] = useState(0);                         // 렌더링용 초
  const [distance, setDistance] = useState(0);                       // 누적 거리
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
        initGeo();
      }
    } catch (e) {
      console.log(e);
    }
  }

  /** 백그라운드 서비스 권한 */
  const requestBackgroundPermission = () => {
    BackgroundGeolocation.ready({
      locationAuthorizationRequest: 'Always',
      backgroundPermissionRationale: {
        title: "위치 권한 사용 설정 안내",
        message: "러닝 추적을 위해 위치 서비스에서 '항상 허용'을 사용하도록 설정해야 합니다.",
        positiveAction: "'항상 허용' 설정"
      },
      locationAuthorizationAlert: {
        titleWhenNotEnabled: "위치 권한 사용 설정 안내",
        titleWhenOff: "위치 권한 사용 설정 안내",
        instructions: "러닝 추적을 위해 위치 서비스에서 '항상 허용'을 사용하도록 설정해야 합니다.",
        cancelButton: "취소",
        settingsButton: "'항상 허용' 설정"
      },
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
      setPermission(true)
      BackgroundGeolocation.start();
      console.log("BackgroundGeolocation is configured and ready: ", state.enabled);
    });
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
      backgroundRef.current = BackgroundGeolocation.watchPosition((location) => {
        const {latitude, longitude} = location.coords;
        setCurrentAltitude(location.coords.altitude);
        if (distanceRef.current != null) {
          const currentDistance = haversine(distanceRef.current, location.coords, {unit: 'meter'});
          setDistance(prev => prev + currentDistance);
          setPath(prev => [...prev, { latitude, longitude }]);
        }
        distanceRef.current = { latitude, longitude };
      }, (e) => {
        console.log(e);
      }, {
        interval: 2000,
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        persist: false,
        extras: {foo: "bar"},
        timeout: 60000
      });
    } catch (e) {
      console.log(e);
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
    if (distance > altitudeRef.current * 100) {
      altitudeRef.current++;
      setAltitude(prev => [...prev, currentAltitude]);
    }
  }, [distance]);

  /** 누적 분:초 */
  useEffect(() => {
    setMinutes(Math.floor(totalTime/1000/60));
    setSeconds((totalTime/1000) - (Math.floor(totalTime/1000/60) * 60));
  }, [totalTime]);

  /** 시작하기 */
  const onStart = () => {
    setIsStarted(true);
    setIsRecoding(true);
    recordTime();
    recordDistance();
  }

  /** 일시 정지 */
  const onPause = () => {
    setIsRecoding(false);
    clearInterval(timeRef.current);
    backgroundStartTimeRef.current = null;
    timeRef.current = null;
    distanceRef.current = null;
    backgroundRef.current = null;
    BackgroundGeolocation.stopWatchPosition();
    BackgroundGeolocation.stop();
  }

  /** 측정 초기화 */
  const onClear = () => {
    setTotalTime(0);
    setDistance(0);
    setPace('00:00');
    setPaceDetail([]);
    setIsStarted(false);
    setIsRecoding(false);
    clearInterval(timeRef.current);
    backgroundStartTimeRef.current = null;
    paceRef.current = 1;
    timeRef.current = null;
    distanceRef.current = null;
    altitudeRef.current = 1;
    backgroundRef.current = null;
    BackgroundGeolocation.stopWatchPosition();
    BackgroundGeolocation.stop();
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

  useEffect(() => {
    onClear();
    setRecord('');
    setCaptureURL('');
    requestPermissions();    
  }, []);

  useEffect(() => {
    let subscription = '';
    subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App Foreground');
        if (isStarted && isRecoding) {
          let before = backgroundStartTimeRef.current;
          before = Math.round(before/1000);
          let now = new Date().getTime();
          now = Math.round(now/1000);
          setTotalTime(prev => prev + ((now * 1000) - (before * 1000)));
        }
      } else {
        console.log('App Backround');
        if (isStarted && isRecoding) {
          backgroundStartTimeRef.current = new Date().getTime();
        }
      }
      appState.current = nextAppState;
    });
    return () => {
      if (permission) {
        subscription.remove();
      }
    };
  }, [isStarted, isRecoding]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackAction
    );
    return () => {
      backHandler.remove();
    }
  }, [isStarted]);

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
            minutes={minutes}
            seconds={seconds}
            pace={pace}
            onPause={onPause}
            onStart={onStart}
            onComplete={onComplete}
          />
        :
          <Pressable style={styles.start} activeOpacity={0.5} onPress={onStart}>
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
  mission: {
    position: 'absolute',
    bottom: 180,
    left: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    width: 300,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    transform: [{ translateX: -150 }],
    zIndex: 9,
  },
  missionTitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    fontWeight: 500,
    color: '#000',
    textAlign: 'center',
  },
  missionContent: {
    marginTop: 10,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
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
    width: 110,
    height: 110,
    backgroundColor: '#000',
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
