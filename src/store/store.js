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

  /** 세팅 */
  setting: {
    recordVaibration: true,
  },
  setSetting: (data) => set(() => ({ setting: data })),

  /** 권한 */
  permission: false,
  setPermission: (data) => set(() => ({ permission: data })),

  /** 지도 캡쳐 */
  captureURL: '',
  setCaptureURL: (data) => set(() => ({ captureURL: data })),

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