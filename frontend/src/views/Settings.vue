<template>
  <div class="settings">
    <el-card>
      <template #header>
        <span>系统设置</span>
      </template>
      <el-form label-width="150px">
        <el-form-item label="数据刷新频率">
          <el-select v-model="refreshInterval" style="width: 200px">
            <el-option label="30秒" :value="30" />
            <el-option label="1分钟" :value="60" />
            <el-option label="5分钟" :value="300" />
            <el-option label="15分钟" :value="900" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格波动提醒">
          <el-switch v-model="priceAlert" />
        </el-form-item>
        <el-form-item label="提醒阈值（%）">
          <el-input-number v-model="alertThreshold" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="回本线提醒">
          <el-switch v-model="breakEvenAlert" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <template #header>
        <span>数据管理</span>
      </template>
      <el-space direction="vertical" style="width: 100%">
        <el-button type="primary" @click="initBullets">初始化弹种数据</el-button>
        <el-button type="warning" @click="testApi">测试API连接</el-button>
        <el-button type="danger" @click="clearData">清空所有数据</el-button>
      </el-space>
    </el-card>

    <el-card>
      <template #header>
        <span>关于</span>
      </template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="项目名称">三角洲子弹价格监控平台</el-descriptions-item>
        <el-descriptions-item label="版本">v1.0.0</el-descriptions-item>
        <el-descriptions-item label="作者">盼盼</el-descriptions-item>
        <el-descriptions-item label="技术栈">Vue 3 + Node.js + SQLite</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { initBullets as initBulletsApi } from '@/api';
import { useBulletStore } from '@/stores/bullets';
import { ElMessage, ElMessageBox } from 'element-plus';

const bulletStore = useBulletStore();

const refreshInterval = ref(60);
const priceAlert = ref(true);
const alertThreshold = ref(20);
const breakEvenAlert = ref(true);

const loadSettings = () => {
  const settings = localStorage.getItem('bulletTrackerSettings');
  if (settings) {
    const parsed = JSON.parse(settings);
    refreshInterval.value = parsed.refreshInterval || 60;
    priceAlert.value = parsed.priceAlert ?? true;
    alertThreshold.value = parsed.alertThreshold || 20;
    breakEvenAlert.value = parsed.breakEvenAlert ?? true;
  }
};

const saveSettings = () => {
  const settings = {
    refreshInterval: refreshInterval.value,
    priceAlert: priceAlert.value,
    alertThreshold: alertThreshold.value,
    breakEvenAlert: breakEvenAlert.value,
  };
  localStorage.setItem('bulletTrackerSettings', JSON.stringify(settings));
  ElMessage.success('设置已保存');
};

const initBullets = async () => {
  try {
    await ElMessageBox.confirm('确定要初始化弹种数据吗？', '确认', {
      type: 'warning',
    });
    await bulletStore.initializeBullets();
    ElMessage.success('初始化成功');
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('初始化失败');
    }
  }
};

const testApi = async () => {
  try {
    await bulletStore.loadBullets();
    ElMessage.success('API连接正常');
  } catch (error) {
    ElMessage.error('API连接失败');
  }
};

const clearData = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有数据吗？此操作不可恢复！', '危险操作', {
      type: 'error',
      confirmButtonText: '确定清空',
      cancelButtonText: '取消',
    });
    localStorage.clear();
    ElMessage.success('数据已清空');
    loadSettings();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空失败');
    }
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.el-card {
  background: #fff;
  border-radius: 8px;
}
</style>
