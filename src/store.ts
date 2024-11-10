// src/store.ts

import { reactive } from 'vue';

// Define the structure of a vehicle object
interface Vehicle {
  kenteken: string;
  [key: string]: any;
}

// Define the structure of the global state
interface GlobalState {
  filter: string;         // Vehicle type filter
  brandFilter: string;    // Brand filter
  currentPage: number;    // Current page number
  lastViewed: Vehicle[];  // Last viewed vehicles
  favorites: Vehicle[];   // Favorite vehicles
}

// Define the global store interface
export interface GlobalStore {
  state: GlobalState;
  setFilter: (newFilter: string) => void;
  setBrandFilter: (newFilter: string) => void;
  setCurrentPage: (page: number) => void;
  addLastViewed: (vehicle: Vehicle) => void;
  toggleFavorite: (vehicle: Vehicle) => void;
}

// Helper functions to load and save data from localStorage
const loadFromLocalStorage = (key: string, fallback: any) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Define and initialize the global state
export const useGlobalStore = (): GlobalStore => {
  const state = reactive<GlobalState>({
    filter: '',
    brandFilter: '',
    currentPage: 1,
    lastViewed: loadFromLocalStorage('lastViewed', []),
    favorites: loadFromLocalStorage('favorites', []),
  });

  // Define store functions
  const setFilter = (newFilter: string) => {
    state.filter = newFilter;
  };

  // In the `setFilter` function, you can also set the `brandFilter`
  const setBrandFilter = (newFilter: string) => {
    state.brandFilter = newFilter;
  };

  const setCurrentPage = (page: number) => {
    state.currentPage = page;
  };

  const addLastViewed = (vehicle: Vehicle) => {
    const existsIndex = state.lastViewed.findIndex(v => v.kenteken === vehicle.kenteken);
    if (existsIndex !== -1) {
      state.lastViewed.splice(existsIndex, 1); // Remove if already exists to re-add at the top
    }
    state.lastViewed.unshift(vehicle); // Add vehicle to the beginning of the list
    if (state.lastViewed.length > 5) {
      state.lastViewed.pop(); // Keep only the last 5 items
    }
    saveToLocalStorage('lastViewed', state.lastViewed); // Save to localStorage
  };

  const toggleFavorite = (vehicle: Vehicle) => {
    const index = state.favorites.findIndex(fav => fav.kenteken === vehicle.kenteken);
    if (index === -1) {
      state.favorites.push(vehicle); // Add to favorites if not already present
    } else {
      state.favorites.splice(index, 1); // Remove from favorites if already present
    }
    saveToLocalStorage('favorites', state.favorites); // Save to localStorage
  };

  return {
    state,
    setFilter,
    setCurrentPage,
    addLastViewed,
    toggleFavorite,
    setBrandFilter, // Add this line to make it available in the store
  };
};
