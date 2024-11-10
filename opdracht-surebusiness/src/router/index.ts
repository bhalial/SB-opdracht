import { createRouter, createWebHistory } from 'vue-router';
import VehicleCollectionPage from '@/views/VehicleCollectionPage.vue';
import VehicleDetailPage from '@/views/VehicleDetailPage.vue';
import RecentlySeenPage from '@/views/RecentlySeenPage.vue';
import FavoritesPage from '@/views/FavoritesPage.vue';

const routes = [
  { path: '/', name: 'Home', component: VehicleCollectionPage },
  {
    path: '/vehicle/:kenteken',
    name: 'VehicleDetail',
    component: VehicleDetailPage,
    props: true
  },
  { path: '/recent-bekeken', name: 'RecentBekeken', component: RecentlySeenPage },
  { path: '/favorieten', name: 'Favorieten', component: FavoritesPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
