import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import useStore from "../../store/store";

function Terms() {
  const terms = useStore((state) => state.terms);
  const setTerms = useStore((state) => state.setTerms);

  return (
    <View></View>
  )
}

export default Terms