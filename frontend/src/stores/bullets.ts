import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as api from '@/api';

export const useBulletStore = defineStore('bullets', () => {
  const bullets = ref([]);
  const loading = ref(false);

  // 加载所有弹种
  const loadBullets = async () => {
    loading.value = true;
    try {
      const response = await api.getBullets();
      bullets.value = response.data;
    } catch (error) {
      console.error('Failed to load bullets:', error);
    } finally {
      loading.value = false;
    }
  };

  // 初始化弹种
  const initializeBullets = async () => {
    try {
      const response = await api.initBullets();
      console.log(response.data.message);
      await loadBullets();
      return response.data;
    } catch (error) {
      console.error('Failed to initialize bullets:', error);
      throw error;
    }
  };

  return {
    bullets,
    loading,
    loadBullets,
    initializeBullets,
  };
});
