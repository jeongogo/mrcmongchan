import React, {useState, useEffect} from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getUser } from "../../lib/user";
import HomeScreen from './HomeScreen';
import DetailScreen from "./DetailScreen";
import ProgressScreen from "./ProgressScreen";
import useStore from "../../store/store";

const Stack = createNativeStackNavigator();

// 진행중인 훈련 있으면 progress만

function TrainingStack() {
  const [isProgress, setIsProgress] = useState();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const onGetUser = async () => {
    const u = await getUser(user.uid);
    setIsProgress(u?.training?.program?.length > 0);
    setUser(u);
  }

  useEffect(() => {
    onGetUser();
  }, [])

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='TrainingHome'
        component={HomeScreen}
        options={() => ({
          title: '훈련 프로그램'
        })}
      />
      <Stack.Screen
        name='TrainingDetail'
        component={DetailScreen}
        options={() => ({
          title: '훈련 프로그램 상세'
        })}
      />
      <Stack.Screen
        name='TrainingProgress'
        component={ProgressScreen}
        options={() => ({
          title: '훈련 미션 도전하기'
        })}
      />
    </Stack.Navigator>
  );
}

export default TrainingStack;