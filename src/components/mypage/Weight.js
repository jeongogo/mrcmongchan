import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
  Text,
  Pressable,
  useWindowDimensions
} from 'react-native';
import { format } from 'date-fns';
import {LineChart} from "react-native-chart-kit";
import useStore from "../../store/store";
import { updateUser } from "../../lib/user";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomWrap from "../common/CustomWrap";
import { getUser } from "../../lib/user";

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

function Weight() {
  const screenWidth = useWindowDimensions().width;
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [mode, setMode] = useState();
  const [editDate, setEditDate] = useState('');
  const [weight, setWeight] = useState(0);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [dateData, setDateData] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [renderList, setRenderList] = useState([]);

  const getDate = (d) => {
    const current = new Date(d.toDate());
    const month = current.getMonth() + 1;
    const date = current.getDate();
    return month + '월 ' + date + '일';
  }

  const onEdit = (date) => {
    const current = user.weightList.filter((i) => i.date === date);
    setEditDate(date);
    setWeight((current[0].weight).toString());
    setMode('edit');
    setShowEditForm(true);
  }

  const onWrite = () => {
    const today = new Date();
    setEditDate(today.getMonth() + 1 + '.' + today.getDate());
    setWeight('');
    setMode('write');
    setShowEditForm(true);
  }

  const onSubmit = async () => {
    if (weight === '') {
      return;
    }
    if (mode === 'edit') {
      const processWeight = user.weightList.map((i) => {
        if (i.date === editDate) {
          return {...i, weight}
        }
        return i;
      });
      await updateUser(user.uid, {weight, weightList: processWeight});
    } else if (mode === 'write') {
      setShowAddBtn(false);
      await updateUser(user.uid, {weight, weightList: [...user.weightList, {date: new Date(), weight}]});
    }
    const u = await getUser(user.uid);
    setUser(u);
    setShowEditForm(false);
    setWeight('');
  }

  useEffect(() => {
    const today = new Date();
    const todayStr = today.getFullYear() + '' + today.getMonth() + 1 + '' + today.getDate();
    const current = user.weightList.filter((i) => {
      const date = i.date.toDate();
      if (todayStr == date.getFullYear() + '' + date.getMonth() + 1 + '' + date.getDate()) {
        return i;
      };
    });
    if (current.length < 1) {
      setShowAddBtn(true);
    }
  }, []);

  useEffect(() => {
    let list = [...user.weightList];
    list = list.filter((item, index) => {
      const count = list.length - index;
      if (count < 11) {
        return item;
      }
    });
    setRenderList(list.reverse());

    let reverseList = [...list];
    reverseList = reverseList.reverse();
    const d = reverseList.map((i) => {
      const date = new Date(i.date.toDate());
      return date.getMonth() + 1 + '.' + date.getDate();
    });
    setDateData(d);
    const w = reverseList.map((i) => {
      return +i.weight;
    });
    setWeightData(w);
  }, [user.weightList]);

  return ( 
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentWrap}>
        <View style={styles.chartWrap}>
          {weightData.length > 0 &&
            <LineChart
              data={
                {
                  labels: dateData,
                  datasets: [
                    {
                      data: weightData,
                      color: () => `rgba(249, 161, 74)`,
                    },
                    {
                      data: [weightData[weightData.length-1] - 10],
                      withDots: false,
                    },
                    {
                      data: [weightData[weightData.length-1] + 10],
                      withDots: false,
                    },
                  ],
                }
              }
              width={screenWidth-40}
              height={220}
              chartConfig={chartConfig}
            />
          }
        </View>
        {showAddBtn &&
          <Pressable style={styles.addBtn} onPress={onWrite}>
            <Text style={styles.addBtnText}>오늘 체중 입력하기</Text>
          </Pressable>
        }
        <CustomWrap>
          {renderList.map((item, index) => (
            <View key={index} style={styles.itemWrap}>
              <Text style={[styles.text, styles.date]}>{format(new Date(item.date.toDate()), 'yy.MM.dd')}</Text>
              <Text style={[styles.text, styles.weight]}>{item.weight}</Text>
              <Pressable onPress={() => onEdit(item.date)}>
                <Icon name='pencil-outline' color='#999' size={20} />
              </Pressable>
            </View>
          ))}
        </CustomWrap>
      </ScrollView>
      {showEditForm &&
        <View style={styles.editForm}>
          <Text style={styles.editDate}>
            {mode === 'edit'
              ? getDate(editDate)
              : editDate
            }
          </Text>
          <Pressable style={styles.close} onPress={() => setShowEditForm(false)}>
            <Icon name='close' color='#222' size={30} />
          </Pressable>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            onSubmitEditing={onSubmit}
          />
          <Pressable style={styles.confirm} onPress={onSubmit}>
            <Text style={styles.confirmText}>확인</Text>
          </Pressable>
        </View>
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrap: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  chartWrap: {
    paddingTop: 30,
    paddingBottom: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  itemWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#222',
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  weight: {
    marginLeft: 15,
    marginRight: 'auto',
  },
  addBtn: {
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    backgroundColor: '#E53A40',
    borderRadius: 10,
  },
  addBtnText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
  },
  editForm: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 300,
    marginTop: -150,
    marginLeft: -150,
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  editDate: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 20,
    color: '#222',
    textAlign: 'center',
  },
  input: {
    marginTop: 15,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  confirm: {
    width: '100%',
    marginTop: 15,
    paddingVertical: 17,
    backgroundColor: '#E53A40',
    borderRadius: 10,
  },
  confirmText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    fontWeight: 500,
    textAlign: 'center',
    color: '#fff',
  }
});

export default Weight;