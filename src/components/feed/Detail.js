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
  ActivityIndicator
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
        percent: (item/max) * 100,
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
        <View style={styles.titleWrap}>
          <Text style={styles.title}>
            {feedDetail.title
              ? feedDetail.title
              : format(new Date(feedDetail.date.toDate()), 'M.dd HH:mm')
            }
          </Text>
          <Text style={styles.area}>{feedDetail.areaName}</Text>
          {weather && <Icon name={weather} color={weather === 'weather-sunny' ? '#fcbe32' : '#666'} size={20} />}
        </View>
        <View style={styles.imageWrap}>
          {feedDetail.photoURL
            ?
              <Image
                style={styles.image}
                source={{uri: feedDetail.photoURL}}
                width={width - 30}
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
              />
            :
              <Image
                style={styles.image}
                source={{uri: feedDetail.captureURL}}
                width={width - 30}
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
        <View style={styles.infoWrap}>
          <View style={styles.wrap}>
            <Text style={styles.text}>{feedDetail.distance}</Text>
            <Text style={styles.label}>거리</Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.text}>{time}</Text>
            <Text style={styles.label}>시간</Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.text}>{feedDetail.pace}</Text>
            <Text style={styles.label}>페이스</Text>
          </View>
        </View>
        <View style={styles.hr}></View>
        <View style={styles.contentWrap}>
          <Text style={[styles.title, styles.margin]}>페이스</Text>
          {paceDetail.length > 0 &&
            paceDetail.map((item, index) => (
              <View style={styles.paceWrap} key={index}>
                <Text style={styles.paceLabel}>{index+1}</Text>
                <View style={styles.paceBar}>
                  <View style={[styles.paceBarCurrent, {width: item.percent + '%'}]}></View>
                </View>
                <Text style={styles.paceText}>{item.pace}</Text>
              </View>
            ))
          }
        </View>
        <View style={styles.hr}></View>
        <View style={styles.altitudeWrap}>
          <Text style={[styles.title, styles.margin, styles.altitudeTitle]}>고도</Text>
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
              width={width-25}
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
  hr: {
    borderTopWidth: 1,
    borderTopColor: '#ededed',
    borderBottomWidth: 10,
    borderBottomColor: '#f3f3f3',
  },
  titleWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  imageWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 15,
  },
  image: {
    aspectRatio: 1,
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
  infoWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wrap: {
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  contentWrap: {
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  altitudeWrap: {
    paddingLeft: 10,
    paddingVertical: 25,
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    fontWeight: 700,
    color: '#454545',
  },
  altitudeTitle: {
    paddingLeft: 10,
    marginBottom: 20,
  },
  margin: {
    marginBottom: 10,
  },
  area: {
    marginLeft: 'auto',
    marginRight: 5,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#666',
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 28,
    color: '#222',
  },
  label: {
    marginTop: 3,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#222',
  },
  paceWrap: {
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
    color: '#222',
  },
});

export default Detail;