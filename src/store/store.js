import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

let state = (set) => ({
  /** 유저 */
  user: '',
  setUser: (data) => set(() => ({ user: data })),

  /** 기록 측정 */
  record: '',
  setRecord: (data) => set(() => ({ record: data })),

  /** 지도 캡쳐 */
  captureURL: '',
  setCaptureURL: (data) => set(() => ({ captureURL: data })),
  
  /** 훈련 상세 */
  trainingDetail: '',
  setTrainingDetail: (data) => set(() => ({ trainingDetail: data })),

  /** 미션 */
  trainingMission: '',
  setTrainingMission: (data) => set(() => ({ trainingMission: data })),

  /** 활동 상세 */
  feedDetail: '',
  setFeedDetail: (data) => set(() => ({ feedDetail: data })),
});

const useStore = create(persist(state, {
    name: "mrc-storage",
    storage: createJSONStorage(() => AsyncStorage),
  }
));

export default useStore;