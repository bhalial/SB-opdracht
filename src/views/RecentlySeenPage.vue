<template>
  <div class="p-6">
    <VehicleList :title="'Recent bekeken voertuigen'" :vehicles="validatedRecentlySeen" />
  </div>
</template>

<script lang="ts">
import { inject, ref, onMounted } from 'vue';
import axios from 'axios';
import VehicleList from '../components/VehicleList.vue';
import { GlobalStore } from '../store';

export default {
  name: 'RecentlySeenPage',
  components: { VehicleList },
  setup() {
    const globalStore = inject<GlobalStore>('globalStore');
    const validatedRecentlySeen = ref<any[]>([]);
    const isLoading = ref(true);

    if (!globalStore) {
      throw new Error("Global store is not available");
    }

    const validateRecentlyViewed = async () => {
      if (!globalStore.state.lastViewed.length) {
        console.log('No recently viewed vehicles');
        return;
      }

      try {
        isLoading.value = true;
        const requests = globalStore.state.lastViewed.map(vehicle =>
          axios.get(`https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${vehicle.kenteken}`)
        );
        const responses = await Promise.all(requests);
        validatedRecentlySeen.value = responses
          .filter(response => response.data[0])
          .map(response => response.data[0]);
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      validateRecentlyViewed();
    });

    return {
      validatedRecentlySeen,
      isLoading,
    };
  },
};
</script>
