import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {LineChart} from "react-native-chart-kit";
import useStore from "../../store/store";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const chartConfig = {
  backgroundGradientFrom: "white",
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: "white",
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(55, 55, 55, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 11,
  useShadowColorFromDataset: true,
};

function Detail() {
  const width = useWindowDimensions().width;
  const user = useStore((state) => state.user);
  const feedDetail = useStore((state) => state.feedDetail);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [time, setTime] = useState('');
  const [paceDetail, setPaceDetail] = useState([]);
  const [altitude, setAltitude] = useState([]);
  const [weather, setWeather] = useState('');

  /** 총 시간 */
  const onSetTotalTime = () => {
    let recordHours = Math.floor(feedDetail.totalTime/60/60);
    let recordMinutes = Math.floor(feedDetail.totalTime/60) - (recordHours * 60);
    let recordSeconds = (feedDetail.totalTime) - (Math.floor(feedDetail.totalTime/60) * 60);
    recordHours = recordHours < 1 ? '' : recordHours + ':';
    recordMinutes = recordMinutes < 10 ? '0' + recordMinutes : recordMinutes;
    recordSeconds = recordSeconds < 10 ? '0' + recordSeconds : recordSeconds;
    setTime(recordHours + recordMinutes + ':' + recordSeconds);
  }

  /** 고도 */
  const onSetAltitude = () => {
    const altitudeCount = Math.ceil((feedDetail.altitude.length)/10) - 1;
    let currentCount = [];
    for (let i=0; i <= altitudeCount; i++) {
      currentCount.push(i);
    }
    setAltitude(currentCount);
  }

  /** 페이스 상세 */
  const onSetPaceDetail = () => {
    let filterData = feedDetail.paceDetail.map((item, index) => {
      if (index === 0) {
        return item;
      }
      return item - feedDetail.paceDetail[index-1];
    });

    const max = Math.max.apply(Math, filterData);
    const processData = filterData.map((item, index) => {
      let time = 0;
      if (index === filterData.length - 1 && (feedDetail.distance - Math.floor(feedDetail.distance)).toFixed(2) >= 0.1) {
        time = (1000/(feedDetail.distance - Math.floor(feedDetail.distance)).toFixed(2)) * (item/1000);
      } else {
        time = item;
      }
      const m = (Math.floor(time / 60)).toFixed(0);
      const s = (time - m * 60).toFixed(0);
      const minutes = m < 1 ? '00' : m < 10 ? '0' + m : m;
      const seconds = s < 1 ? '00' : s < 10 ? '0' + s : s;
      let newItem = {
        seconds: time,
        pace: minutes + ':' + seconds,
        percent: (time/max) * 100,
      }
      return newItem;
    });
    setPaceDetail(processData);
  }

  /** 날씨 */
  const onSetWeather = () => {
    switch (feedDetail.weather) {
      case 'Clouds':
        setWeather('weather-partly-cloudy');
        break;
      case 'Clear':
        setWeather('weather-sunny');
        break;
      case 'Snow':
        setWeather('weather-snowy-heavy');
        break;
      case 'Rain':
        setWeather('weather-pouring');
        break;
      case 'Drizzle':
        setWeather('weather-partly-rainy');
        break;
      case 'Thunderstorm':
        setWeather('weather-lightning-rainy');
        break;
      default:
        setWeather('weather-fog');
    }
  }

  useEffect(() => {
    onSetTotalTime();
    if (feedDetail.paceDetail.length > 0) {
      onSetPaceDetail();
    }    
    onSetAltitude();
    onSetWeather();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Image
              style={styles.circle}
              source={user.photoURL ? {uri: user.photoURL} : require('../../assets/images/user.png')}
            />
          </View>
          <View>
            <Text style={styles.date}>{format(new Date(feedDetail.date.toDate()), 'yy.MM.dd HH:mm')}</Text>
            <Text style={styles.name}>{user.name}</Text>
          </View>
          <View style={styles.area}>
            <Text style={styles.areaText}>{feedDetail.areaName}</Text>
            {weather && <Icon name={weather} color={weather === 'weather-sunny' ? '#fcbe32' : '#999'} size={18} />}
          </View>
        </View>
        <View style={styles.recordDistance}>
          <Text style={styles.recordDistanceText}>{feedDetail.distance}<Text style={styles.recordDistanceKm}>km</Text></Text>
        </View>
        <View style={styles.recordWrap}>
          <View style={[styles.recordItem, styles.borderRight]}>
            <Text style={styles.recordText}>{time}</Text>
            <Text style={styles.recordLabel}>시간</Text>
          </View>
          <View style={[styles.recordItem, styles.borderRight]}>
            <Text style={styles.recordText}>{feedDetail.pace}</Text>
            <Text style={styles.recordLabel}>페이스</Text>
          </View>
          <View style={styles.recordItem}>
            <Text style={styles.recordText}>{feedDetail.calorie}</Text>
            <Text style={styles.recordLabel}>칼로리</Text>
          </View>
        </View>
        <View style={styles.imageWrap}>
          {feedDetail.photoURL
            ?
              <Image
                style={styles.image}
                source={{uri: feedDetail.photoURL}}
                width={width}
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
              />
            :
              <Image
                style={styles.image}
                source={{uri: feedDetail.captureURL}}
                width={width}
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
              />
          }
          {isImageLoading && (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size='large' color="#E53A40" />
            </View>
          )}
        </View>
        <View style={[styles.sectionWrap, styles.sectionPace]}>
          <Text style={styles.sectionTitle}>페이스</Text>
          {paceDetail.length > 0 &&
            paceDetail.map((item, index) => (
              <View style={styles.paceItem} key={index}>
                <Text style={styles.paceLabel}>{index+1}</Text>
                <View style={styles.paceBar}>
                  <View style={[styles.paceBarCurrent, {width: item.percent + '%'}]}></View>
                </View>
                <Text style={styles.paceText}>{item.pace}</Text>
              </View>
            ))
          }
        </View>
        <View style={[styles.sectionWrap, styles.sectionAltitude]}>
          <Text style={styles.sectionTitle}>고도</Text>
          {feedDetail.altitude.length > 0 &&
            <LineChart
              data={
                {
                  labels: altitude,
                  datasets: [
                    {
                      data: feedDetail.altitude,
                      color: () => '#30A9DE',
                    },
                    {
                      data: [feedDetail.altitude[feedDetail.altitude.length-1] - 50],
                      withDots: false,
                    },
                    {
                      data: [feedDetail.altitude[feedDetail.altitude.length-1] + 50],
                      withDots: false,
                    },
                  ],
                }
              }
              width={width-35}
              height={220}
              chartConfig={chartConfig}
              withDots={false}
              withInnerLines={false}
              yAxisSuffix="m"
            />
          }
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
  profile: {
    marginTop: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
  },
  avatar: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  circle: {
    width: 40,
    height: 40,
  },
  name: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: '#222',
  },
  date: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
    color: '#454545',
  },
  area: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
  },
  areaText: {
    marginRight: 5,
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
    color: '#999',
  },
  subject: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#222',
  },
  recordDistance: {
    paddingTop: 20,
    borderTopWidth: 7,
    borderTopColor: '#f3f3f3',
  },
  recordDistanceText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 56,
    color: '#222',
    textAlign: 'center',
  },
  recordDistanceKm: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 24,
  },
  recordWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-around',
    marginTop: 15,
    marginBottom: 25,
  },
  recordItem: {
    flexGrow: 1,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#ededed',
  },
  recordText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 22,
    color: '#222',
    textAlign: 'center',
  },
  recordLabel: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  imageWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  image: {
    aspectRatio: 1.2,
  },
  loaderWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  sectionWrap: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  sectionPace: {
    paddingBottom: 0,
  },
  sectionAltitude: {
    paddingBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#222',
  },
  paceItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  paceLabel: {
    width: 20,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#222',
  },
  paceBar: {
    position: 'relative',
    flexGrow: 1,
    height: 16,
    marginRight: 20,
    backgroundColor: '#ededed',
  },
  paceBarCurrent: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#ff7473',
    zIndex: 2,
  },
  paceText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#454545',
  },
});

export default Detail;