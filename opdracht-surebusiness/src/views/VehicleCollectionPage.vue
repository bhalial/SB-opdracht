<template>
  <div class="p-6">
    <!-- Vehicle List Display using VehicleList Component -->
    <VehicleList :title="headerTitle" :vehicles="paginatedItems">
      <template #filter>
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Vehicle Type Filter -->
          <div>
            <select v-model="globalStore.state.filter" @change="updateFilter"
              class="p-2 rounded border-gray-300 max-w-[200px] truncate text-ellipsis">
              <option value="">Alle types</option>
              <option v-for="type in voertuigsoorten" :key="type" :value="type" class="option">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- Vehicle Brand Filter -->
          <div>
            <select v-model="globalStore.state.brandFilter" @change="updateBrandFilter"
              class="p-2 rounded border-gray-300 max-w-[200px] truncate text-ellipsis">
              <option value="">Alle merken</option>
              <option v-for="brand in vehicleBrands" :key="brand" :value="brand" class="option">
                {{ brand }}
              </option>
            </select>
          </div>
        </div>
      </template>
    </VehicleList>

    <!-- Pagination Controls -->
    <Pagination :currentPage="globalStore.state.currentPage" :totalItems="filteredItems.length"
      :itemsPerPage="itemsPerPage" :goToPage="goToPage" :updateFilter="updateFilter" />
  </div>
</template>

<script lang="ts">
import { inject, ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import VehicleList from '../components/VehicleList.vue';
import Pagination from '../components/Pagination.vue';
import { GlobalStore } from '../store';

export default {
  name: 'VehicleCollectionPage',
  components: { VehicleList, Pagination },
  setup() {
    const globalStore = inject<GlobalStore>('globalStore');
    if (!globalStore) {
      throw new Error("Global store couldn't be injected");
    }

    interface Vehicle {
      [key: string]: any;
    }

    const items = ref<Vehicle[]>([]);
    const voertuigsoorten = ref<string[]>([]);
    const vehicleBrands = ref<string[]>([]);  // List for unique vehicle brands
    const itemsPerPage = 30;
    const router = useRouter();
    const route = useRoute();

    const headerTitle = computed(() => {
      const itemCount = filteredItems.value.length;
      return globalStore.state.filter
        ? `${globalStore.state.filter} (${itemCount})`
        : `Alle voertuigen (${itemCount})`;
    });

    // Fetch vehicle data and extract the vehicle types and brands
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://opendata.rdw.nl/resource/m9d7-ebf2.json');
        items.value = response.data;

        // Update vehicleBrands based on 'merk' property
        vehicleBrands.value = [...new Set(items.value.map(item => item.merk))];

        voertuigsoorten.value = [...new Set(items.value.map(item => item.voertuigsoort))];
        applyInitialFilter();
        applyInitialPage(); // Set initial page
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    const applyInitialFilter = () => {
      const initialFilter = route.query.filter as string;
      if (initialFilter && voertuigsoorten.value.includes(initialFilter)) {
        globalStore.setFilter(initialFilter);
      } else {
        globalStore.setFilter('');
      }
    };

    const applyInitialPage = () => {
      const initialPage = parseInt(route.query.page as string) || 1;
      globalStore.setCurrentPage(initialPage);
    };

    const filteredItems = computed(() => {
      // Apply both the vehicle type filter and brand filter independently
      let filteredList = items.value;

      if (globalStore.state.filter) {
        filteredList = filteredList.filter(item => item.voertuigsoort === globalStore.state.filter);
      }

      if (globalStore.state.brandFilter) {
        filteredList = filteredList.filter(item => item.merk === globalStore.state.brandFilter);
      }

      return filteredList;
    });

    const paginatedItems = computed(() => {
      const start = (globalStore.state.currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredItems.value.slice(start, end);
    });

    const goToPage = (page: number) => {
      globalStore.setCurrentPage(page);
      router.push({ query: { ...route.query, page: page > 0 ? page : 1 } });
    };

    const updateFilter = () => {
      // Reset page to 1 when changing filter
      router.push({ query: { ...route.query, filter: globalStore.state.filter || undefined, page: 1 } });
    };

    const updateBrandFilter = () => {
      // Reset page to 1 when changing brand filter
      router.push({ query: { ...route.query, brandFilter: globalStore.state.brandFilter || undefined, page: 1 } });
    };

    watch(
      () => route.query.filter,
      (newFilter) => {
        if (typeof newFilter === 'string' && voertuigsoorten.value.includes(newFilter)) {
          globalStore.setFilter(newFilter as string);
        } else {
          globalStore.setFilter('');
        }
      }
    );

    watch(
      () => route.query.page,
      (newPage) => {
        const pageNumber = parseInt(newPage as string);
        if (!isNaN(pageNumber)) {
          globalStore.setCurrentPage(pageNumber);
        }
      }
    );

    onMounted(() => {
      fetchItems();
    });

    return {
      globalStore,
      headerTitle,
      filteredItems,
      paginatedItems,
      voertuigsoorten,
      vehicleBrands,
      itemsPerPage,
      goToPage,
      updateFilter,
      updateBrandFilter,
    };
  },
};
</script>
