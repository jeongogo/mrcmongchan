import React, {useState, useEffect} from 'react';
import {SafeAreaView, ScrollView, View, StyleSheet, Text, Pressable, TextInput} from 'react-native';
import CustomWrap from "../common/CustomWrap";

const Pace = () => {
  const [tenHour, setTenHour] = useState('');
  const [tenMinute, setTenMinute] = useState('');
  const [tenSecond, setTenSecond] = useState('');
  const [paceTen, setPaceTen] = useState('00:00');
  const [halfHour, setHalfHour] = useState('');
  const [halfMinute, setHalfMinute] = useState('');
  const [halfSecond, setHalfSecond] = useState('');
  const [paceHalf, setPaceHalf] = useState('00:00');
  const [fullHour, setFullHour] = useState('');
  const [fullMinute, setFullMinute] = useState('');
  const [fullSecond, setFullSecond] = useState('');
  const [paceFull, setPaceFull] = useState('00:00');

  const calc = (type) => {
    let t = 0;
    if (type === 'ten') {
      t = ((+tenHour * 60 * 60) + (+tenMinute * 60) + +tenSecond)/10;
    } else if (type === 'half') {
      t = ((+halfHour * 60 * 60) + (+halfMinute * 60) + +halfSecond)/21;
    } else if (type === 'full') {
      t = ((+fullHour * 60 * 60) + (+fullMinute * 60) + +fullSecond)/42.195;
    }
    const m = (Math.floor(t / 60)).toFixed(0);
    const s = (t - (m * 60)).toFixed(0);
    const minutes = m < 10 ? '0' + m : m;
    const seconds = s < 10 ? '0' + s : s;
    return minutes + ':' + seconds;
  }

  useEffect(() => {    
    const data = calc('ten');
    setPaceTen(data);
  }, [tenHour, tenMinute, tenSecond]);

  useEffect(() => {
    const data = calc('half');
    setPaceHalf(data);
  }, [halfHour, halfMinute, halfSecond]);

  useEffect(() => {
    const data = calc('full');
    setPaceFull(data);
  }, [fullHour, fullMinute, fullSecond]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <CustomWrap>
          <Text style={styles.title}>10K</Text>
          <View style={styles.wrap}>
            <TextInput style={styles.input} value={tenHour} onChangeText={setTenHour} keyboardType="numeric" placeholder="시간" />
            <TextInput style={styles.input} value={tenMinute} onChangeText={setTenMinute} keyboardType="numeric" placeholder="분" />
            <TextInput style={styles.input} value={tenSecond} onChangeText={setTenSecond} keyboardType="numeric" placeholder="초" />
          </View>
          <View style={styles.wrap}>
            <Text style={styles.paceText}>{paceTen}</Text>
          </View>
        </CustomWrap>
        <CustomWrap>
          <Text style={styles.title}>Half</Text>
          <View style={styles.wrap}>
            <TextInput style={styles.input} value={halfHour} onChangeText={setHalfHour} keyboardType="numeric" placeholder="시간" />
            <TextInput style={styles.input} value={halfMinute} onChangeText={setHalfMinute} keyboardType="numeric" placeholder="분" />
            <TextInput style={styles.input} value={halfSecond} onChangeText={setHalfSecond} keyboardType="numeric" placeholder="초" />
          </View>
          <View style={styles.wrap}>
            <Text style={styles.paceText}>{paceHalf}</Text>
          </View>
        </CustomWrap>
        <CustomWrap>
          <Text style={styles.title}>Full</Text>
          <View style={styles.wrap}>
            <TextInput style={styles.input} value={fullHour} onChangeText={setFullHour} keyboardType="numeric" placeholder="시간" />
            <TextInput style={styles.input} value={fullMinute} onChangeText={setFullMinute} keyboardType="numeric" placeholder="분" />
            <TextInput style={styles.input} value={fullSecond} onChangeText={setFullSecond} keyboardType="numeric" placeholder="초" />
          </View>
          <View style={styles.wrap}>
            <Text style={styles.paceText}>{paceFull}</Text>
          </View>
        </CustomWrap>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f3f3f3',
  },
  title: {
    marginTop: 10,
    marginBottom: 5,
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    color: '#222',
    textAlign: 'center',
  },
  wrap: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 70,
    marginHorizontal: 5,
    paddingVertical: 7,
    paddingHorizontal: 7,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#454545',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  paceText: {
    marginBottom: 5,
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    color: '#222',
  },
});

export default Pace;