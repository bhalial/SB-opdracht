<template>
  <div class="p-6">
    <VehicleList :title="'Favoriete voertuigen'" :vehicles="globalStore?.state?.favorites || []" />
  </div>
</template>

<script lang="ts">
import { inject } from 'vue';
import VehicleList from '../components/VehicleList.vue';
import { GlobalStore } from '../store';

export default {
  name: 'FavoritesPage',
  components: { VehicleList },
  setup() {
    const globalStore = inject<GlobalStore>('globalStore');

    return {
      globalStore,
    };
  },
};
</script>
