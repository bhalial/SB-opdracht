<template>
  <div class="p-6">
    <!-- Back and Add to Favorites Buttons -->
    <div class="flex space-x-4 justify-between mb-4">
      <button @click="$router.back()" class="px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 text-blue-950">
        ← Terug
      </button>
      <button 
        @click="toggleFavorite" 
        :class="isFavorite ? 'bg-red-100 hover:bg-red-200 text-red-950' : 'bg-green-100 hover:bg-green-200 text-green-950'" 
        class="px-4 py-2 rounded"
      >
        {{ isFavorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten' }}
      </button>
    </div>

    <h2 class="text-2xl font-semibold text-gray-700 mb-4">
      Voertuig details: {{ vehicleData?.kenteken }}
    </h2>
    
    <div v-if="vehicleData" class="bg-gray-100 p-6 rounded shadow mb-4">
      <h3 class="text-lg font-bold text-gray-800 mb-2">Hoofd details:</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="(value, key) in firstFourProperties" :key="key" class="p-4 bg-white rounded shadow border">
          <span class="font-semibold text-gray-700">{{ formatKey(key) }}:</span>
          <span class="text-gray-600 ml-2">{{ value }}</span>
        </div>
      </div>
    </div>

    <div class="bg-gray-100 p-6 rounded shadow">
      <h3 class="text-lg font-bold text-gray-800 mb-2">Aanvullende details:</h3>
      <div v-if="vehicleData" v-for="(value, key) in vehicleData" :key="key" class="mb-2">
        <span class="font-semibold text-gray-700">{{ formatKey(key) }}:</span>
        <span class="text-gray-600 ml-2">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { inject, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { GlobalStore } from '../store';

export default {
  name: 'VehicleDetailPage',
  setup() {
    const globalStore = inject<GlobalStore>('globalStore');
    const route = useRoute();

    interface VehicleData {
      kenteken: string;
      [key: string]: any;
    }

    const vehicleData = ref<VehicleData | null>(null);

    // Fetch the vehicle data from the API
    const fetchVehicleData = async () => {
      try {
        const response = await axios.get(
          `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${route.params.kenteken}`
        );
        
        // Take only the first vehicle in the response
        const vehicle = response.data[0];
        
        // Strip down to the first 25 properties
        vehicleData.value = Object.keys(vehicle)
          .slice(0, 25)
          .reduce((obj, key) => {
            obj[key] = vehicle[key];
            return obj;
          }, {} as VehicleData);

        // Add this vehicle to the recently viewed list
        if (vehicleData.value) {
          if (globalStore) {
            globalStore.addLastViewed(vehicleData.value); // Add to recently viewed
          }
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      }
    };

    // Check if the vehicle is in favorites
    const isFavorite = computed(() => {
      return globalStore?.state.favorites.some(fav => fav.kenteken === vehicleData.value?.kenteken);
    });

    // Toggle favorite status for the vehicle
    const toggleFavorite = () => {
      if (vehicleData.value) {
        globalStore?.toggleFavorite(vehicleData.value);
      }
    };

    // Extract the first four properties for display
    const firstFourProperties = computed(() => {
      if (vehicleData.value) {
        return Object.keys(vehicleData.value)
          .slice(0, 4)
          .reduce((obj, key) => {
            if (vehicleData.value) {
              obj[key] = vehicleData.value[key];
            }
            return obj;
          }, {}); 
      }
      return {};
    });

    // Format the vehicle keys for display
    const formatKey = (key) => {
      return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    };

    onMounted(() => {
      fetchVehicleData();
    });

    return {
      vehicleData,
      formatKey,
      isFavorite,
      toggleFavorite,
      firstFourProperties,
    };
  },
};
</script>
