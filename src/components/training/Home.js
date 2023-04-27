import React from 'react';
import { useNavigation } from "@react-navigation/native";
import useStore from "../../store/store";
import {Pressable, SafeAreaView, ScrollView, Text, StyleSheet} from 'react-native';

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
            <Pressable onPress={() => onDetail(item)} style={styles.wrap} key={item.id}>
              <Text style={styles.text}>{item.title}</Text>
            </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#000',
  },
  wrap: {
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  }
});

export default Home;