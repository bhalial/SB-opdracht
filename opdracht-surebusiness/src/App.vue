<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <header class="bg-stone-900 text-white py-4 shadow-lg">
      <div class="container mx-auto flex flex-col gap-4 sm:flex-row justify-between items-center px-4">
        <!-- Logo with reset of URL params -->
        <router-link to="/" @click="clearPaginationAndFilters" class="text-2xl font-bold hover:text-blue-300">
          VoertuigWijzer 🚗
        </router-link>
        <nav class="space-x-4">
          <router-link :to="{ name: 'RecentBekeken' }" class="hover:text-blue-300">Recent bekeken</router-link>
          <router-link :to="{ name: 'Favorieten' }" class="hover:text-blue-300">Favorieten</router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-4">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; {{ new Date().getFullYear() }} AutoKnow.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const clearPaginationAndFilters = () => {
  router.push({ path: '/', query: { page: '1', } });
};
</script>
