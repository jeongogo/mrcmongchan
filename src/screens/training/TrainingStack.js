import React, {useState, useEffect} from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";
import HomeScreen from './HomeScreen';
import DetailScreen from "./DetailScreen";
import ProgressScreen from "./ProgressScreen";
import useStore from "../../store/store";

const Stack = createNativeStackNavigator();

function TrainingStack() {
  const isFocused = useIsFocused();
  const [isProgress, setIsProgress] = useState();
  const user = useStore((state) => state.user);

  useEffect(() => {
    setIsProgress(user.training?.program?.length > 0);
  }, [isFocused])

  return (
    <Stack.Navigator>
      {isProgress
        ?
          <Stack.Screen
            name='TrainingProgress'
            component={ProgressScreen}
            options={() => ({
              title: '미션 도전'
            })}
          />
        :
          <>
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
                title: '미션 도전'
              })}
            />
          </>
      }
      
    </Stack.Navigator>
  );
}

export default TrainingStack;