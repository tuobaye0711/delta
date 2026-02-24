<template>
  <div id="app">
    <el-container>
      <el-header>
        <div class="header">
          <h1>🐼 三角洲子弹价格监控平台</h1>
          <el-menu
            :default-active="activeMenu"
            mode="horizontal"
            @select="handleMenuSelect"
          >
            <el-menu-item index="/">仪表盘</el-menu-item>
            <el-menu-item index="/bullets">弹种详情</el-menu-item>
            <el-menu-item index="/positions">持仓管理</el-menu-item>
            <el-menu-item index="/settings">设置</el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const activeMenu = computed(() => route.path);

const handleMenuSelect = (index: string) => {
  router.push(index);
};
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #f5f7fa;
}

.el-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0;
}

.header {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header h1 {
  margin: 0 40px 0 0;
  font-size: 24px;
  color: #409eff;
}

.el-main {
  max-width: 1400px;
  margin: 20px auto;
  padding: 0 20px;
}
</style>
