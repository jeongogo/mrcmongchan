import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView, View, Text} from 'react-native';
import Feed from "./Feed";

function Home({feeds}) {
  return (
    <SafeAreaView style={styles.container}>
      {(feeds.length > 0) 
        ?
          <ScrollView>
            {feeds.map((feed) => (
              <Feed key={feed.id} feed={feed} />
            ))}
          </ScrollView>
        :
          <View style={styles.empty}>
            <Text style={styles.emptyText}>아직 활동 기록이 없습니다.</Text>
          </View>
      }      
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#454545',
  },
});

export default Home;