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

    const validateRecentlyViewed = async () => {
      validatedRecentlySeen.value = [];
      if (!globalStore) {
        console.error('globalStore is undefined');
        return;
      }
      for (const vehicle of globalStore.state.lastViewed) {
        try {
          const response = await axios.get(
            `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${vehicle.kenteken}`
          );
          if (response.data[0]) {
            validatedRecentlySeen.value.push(response.data[0]);
          }
        } catch (error) {
          console.error(`Error fetching vehicle data for ${vehicle.kenteken}:`, error);
        }
      }
    };

    onMounted(() => {
      validateRecentlyViewed();
    });

    return {
      validatedRecentlySeen,
    };
  },
};
</script>
