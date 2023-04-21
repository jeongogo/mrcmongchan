import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

let state = () => ({
  beginner: [
    {
      title: '',
      distance: 1,
      pace: 7.5*60
    },
  ],
  intermediate: [
    {
      title: '',
      distance: 1,
      pace: 7.5*60
    },
  ],
  master: [
    {
      title: '',
      distance: 1,
      pace: 7.5*60
    },
  ],
});

const useLevelStore = create(persist(state, {
    name: "mrc-level",
    storage: createJSONStorage(() => AsyncStorage),
  }
));

export default useLevelStore;