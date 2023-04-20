import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

let state = () => ({
  /** 레벨별 경험치 */
  experience: [
    {
      lv1: 0,
    },
    {
      lv2: 0,
    },
    {
      lv3: 0,
    },
    {
      lv4: 0,
    },
    {
      lv5: 0,
    },
    {
      lv6: 0,
    },
    {
      lv7: 0,
    },
    {
      lv8: 0,
    },
    {
      lv9: 0,
    },
    {
      lv10: 0,
    },
    {
      lv11: 0,
    },
    {
      lv12: 0,
    },
    {
      lv13: 0,
    },
    {
      lv14: 0,
    },
    {
      lv15: 0,
    },
    {
      lv16: 0,
    },
    {
      lv17: 0,
    },
    {
      lv18: 0,
    },
    {
      lv19: 0,
    },
    {
      lv20: 0,
    },
    {
      lv21: 0,
    },
    {
      lv22: 0,
    },
    {
      lv23: 0,
    },
    {
      lv24: 0,
    },
    {
      lv25: 0,
    },
    {
      lv26: 0,
    },
    {
      lv27: 0,
    },
    {
      lv28: 0,
    },
    {
      lv29: 0,
    },
    {
      lv30: 0,
    },
  ]
});

const useLevelStore = create(persist(state, {
    name: "mrc-level",
    storage: createJSONStorage(() => AsyncStorage),
  }
));

export default useLevelStore;