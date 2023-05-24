import React, {useState, useEffect} from 'react';
import useStore from "../../store/store";
import { Switch } from 'react-native-paper';
import {SafeAreaView, ScrollView, View, StyleSheet, Text, Pressable} from 'react-native';

const Setting = () => {
  const setting = useStore((state) => state.setting);
  const setSetting = useStore((state) => state.setSetting);
  const [isSwitchOn, setIsSwitchOn] = useState(true);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    setSetting({...setting, recordVaibration: !isSwitchOn});
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrap}>
        <Text style={styles.label}>러닝 1km마다 진동 울리기</Text>
        <Switch value={isSwitchOn} color="#E53A40" onValueChange={onToggleSwitch} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  label: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#222',
  }
});

export default Setting;