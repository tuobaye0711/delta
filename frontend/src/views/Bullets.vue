<template>
  <div class="bullets">
    <el-card>
      <el-table :data="bullets" style="width: 100%">
        <el-table-column prop="name" label="弹种" width="200" />
        <el-table-column prop="level" label="等级" width="100">
          <template #default="{ row }">
            Lv.{{ row.level }}
          </template>
        </el-table-column>
        <el-table-column prop="currentPrice" label="当前价格" width="150" :formatter="formatPrice" />
        <el-table-column label="涨跌幅" width="150">
          <template #default="{ row }">
            <span :class="row.changePercent >= 0 ? 'positive' : 'negative'">
              {{ row.changePercent >= 0 ? '↑' : '↓' }} {{ Math.abs(row.changePercent).toFixed(2) }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="数据来源" width="150" />
        <el-table-column prop="updatedAt" label="更新时间" width="180" :formatter="formatTime" />
        <el-table-column label="热门" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.isHot" type="danger" size="small">热门</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="goToDetail(row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBulletStore } from '@/stores/bullets';

const router = useRouter();
const bulletStore = useBulletStore();
const bullets = computed(() => bulletStore.bullets);

const formatPrice = (_row: any, _column: any, cellValue: number) => {
  return cellValue.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatTime = (_row: any, _column: any, cellValue: string) => {
  if (!cellValue) return '-';
  return new Date(cellValue).toLocaleString('zh-CN');
};

const goToDetail = (id: number) => {
  router.push(`/bullets/${id}`);
};

onMounted(async () => {
  await bulletStore.loadBullets();
  setInterval(() => bulletStore.loadBullets(), 60000);
});
</script>

<style scoped>
.bullets {
  background: #fff;
  border-radius: 8px;
}

.positive {
  color: #67c23a;
}

.negative {
  color: #f56c6c;
}
</style>
