<template>
  <div>
    <div class="justify-between items-center mb-4 gap-4 flex flex-col sm:flex-row">
      <h2 class="text-xl font-semibold text-gray-700">{{ title }}</h2>
      <slot name="filter"></slot>
    </div>
    <div v-if="vehicles.length" class="grid xsm:grid-cols-responsive gap-4">
      <VehicleCard v-for="vehicle in vehicles" :key="vehicle.kenteken" :vehicle="vehicle"
        class="transform transition-transform duration-200 ease-in-out fade-in" />
    </div>
    <div v-else class="text-center text-gray-600">
      Geen voertuigen gevonden
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VehicleCard from './VehicleCard.vue'; // Ensure the correct path

export default defineComponent({
  name: 'VehicleList',
  components: { VehicleCard },
  props: {
    title: {
      type: String,
      required: true,
    },
    vehicles: {
      type: Array as () => Array<Record<string, any>>, // Define vehicles as an array of objects
      required: true,
    },
  },
});
</script>
