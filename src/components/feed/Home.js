import React, { useEffect, useState } from 'react';
import { FlatList,StyleSheet, View, Text } from 'react-native';
import Feed from "./Feed";

function Home({data, onMore}) {
  const [list, setList] = useState([]);

  useEffect(() => {
    let filterData = [];
    data.pages.map((i) => {
      filterData.push(i._docs);
      return i._docs
    });
    setList(filterData[0]);
  }, []);

  return (
    <>
      {list.length > 0
        ?
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={(feed) => feed.id}
            style={styles.container}
            onEndReached={onMore}
          />
        :
          <View style={styles.empty}>
            <Text style={styles.emptyText}>아직 활동 기록이 없습니다.</Text>
          </View>
      }
    </>
  )
}

const renderItem = ({item}) => (
  <Feed feed={item} />
)

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