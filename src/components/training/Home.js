import React from 'react';
import { useNavigation } from "@react-navigation/native";
import useStore from "../../store/store";
import {Pressable, SafeAreaView, ScrollView, Text, StyleSheet} from 'react-native';
import CustomWrap from "../common/CustomWrap";

function Home({trainings}) {
  const navigation = useNavigation();
  const setTrainingDetail = useStore((state) => state.setTrainingDetail);

  const onDetail = (item) => {
    setTrainingDetail(item);
    navigation.navigate('TrainingDetail');
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {(trainings.length > 0) && 
          trainings.map((item) => (
            <CustomWrap key={item.id}>
              <Pressable onPress={() => onDetail(item)}>
                <Text style={styles.text}>{item.title}</Text>
              </Pressable>
            </CustomWrap>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f3f3f3',
  },
  text: {
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
  }
});

export default Home;