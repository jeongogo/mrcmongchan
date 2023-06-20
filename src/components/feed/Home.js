import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FlatList,StyleSheet, View, Text } from 'react-native';
import Feed from "./Feed";

function Home({ feeds }) {
  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.contentWrap}>
      {feeds
        ?
          <FlatList
            data={feeds}
            renderItem={renderItem}
            keyExtractor={(feed) => feed.id}
            style={styles.list}
          />
        :
          <View style={styles.empty}>
            <Text style={styles.emptyText}>아직 활동 기록이 없습니다.</Text>
          </View>
      }
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const renderItem = ({item}) => (
  <Feed feed={item} />
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  contentWrap: {
  },
  list: {
    paddingVertical: 10,
    paddingHorizontal: 10,
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