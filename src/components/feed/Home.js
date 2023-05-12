import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import Feed from "./Feed";

function Home({feeds}) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {(feeds.length > 0) && 
          feeds.map((feed) => (
            <Feed key={feed.id} feed={feed} />
        ))}
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
});

export default Home;