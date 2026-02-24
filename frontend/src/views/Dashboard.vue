<template>
  <div class="dashboard">
    <!-- 弹种卡片列表 -->
    <div class="bullet-cards">
      <div v-for="bullet in bullets" :key="bullet.id" class="bullet-card" @click="goToDetail(bullet.id)">
        <div class="bullet-name">{{ bullet.name }}</div>
        <div class="bullet-price">{{ formatPrice(bullet.currentPrice) }}</div>
        <div class="bullet-change" :class="bullet.change >= 0 ? 'positive' : 'negative'">
          {{ bullet.changePercent >= 0 ? '↑' : '↓' }} {{ Math.abs(bullet.changePercent).toFixed(2) }}%
        </div>
        <div class="bullet-level">Lv.{{ bullet.level }}</div>
        <el-tag v-if="bullet.isHot" type="danger" size="small" class="hot-tag">热门</el-tag>
      </div>
    </div>

    <!-- 价格趋势图 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>价格趋势（最近24小时）</span>
          <el-select v-model="selectedBulletId" placeholder="选择弹种" style="width: 200px">
            <el-option
              v-for="bullet in bullets"
              :key="bullet.id"
              :label="bullet.name"
              :value="bullet.id"
            />
          </el-select>
        </div>
      </template>
      <div ref="chartRef" style="height: 300px"></div>
    </el-card>

    <!-- 持仓概览 -->
    <el-card class="positions-card">
      <template #header>
        <span>持仓概览</span>
      </template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="持仓总价值">
          {{ formatPrice(summary.totalValue || 0) }}
        </el-descriptions-item>
        <el-descriptions-item label="未实现利润">
          <span :class="summary.totalProfit >= 0 ? 'positive' : 'negative'">
            {{ formatPrice(summary.totalProfit || 0) }} ({{ formatPercent(summary.totalProfitPercent) }})
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="持仓数量">
          {{ summary.positionCount || 0 }} 种
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 今日预警 -->
    <el-card class="alerts-card">
      <template #header>
        <span>今日预警</span>
      </template>
      <el-empty v-if="alerts.length === 0" description="暂无预警" />
      <div v-else>
        <el-alert
          v-for="alert in alerts"
          :key="alert.target.id"
          :title="alert.message"
          :type="alert.target.targetType === 'profit' ? 'success' : 'warning'"
          :closable="false"
          style="margin-bottom: 10px"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useBulletStore } from '@/stores/bullets';
import { getPositionSummary, checkTargets, getPriceHistory } from '@/api';
import * as echarts from 'echarts';

const router = useRouter();
const bulletStore = useBulletStore();

const bullets = computed(() => bulletStore.bullets);
const chartRef = ref<HTMLElement>();
const selectedBulletId = ref<number | null>(null);
const summary = ref<any>({});
const alerts = ref<any[]>([]);
let chartInstance: echarts.ECharts | null = null;

const formatPrice = (price: number) => {
  return price.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatPercent = (percent: number) => {
  if (!percent) return '0%';
  return (percent >= 0 ? '+' : '') + percent.toFixed(2) + '%';
};

const goToDetail = (id: number) => {
  router.push(`/bullets/${id}`);
};

const loadSummary = async () => {
  try {
    const response = await getPositionSummary();
    summary.value = response.data;
  } catch (error) {
    console.error('Failed to load summary:', error);
  }
};

const loadAlerts = async () => {
  try {
    const response = await checkTargets();
    alerts.value = response.data;
  } catch (error) {
    console.error('Failed to load alerts:', error);
  }
};

const updateChart = async () => {
  if (!selectedBulletId.value || !chartRef.value) return;

  try {
    const response = await getPriceHistory(selectedBulletId.value, 24);
    const history = response.data;

    const times = history.map((h: any) => new Date(h.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    const prices = history.map((h: any) => h.price);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: times,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: prices,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.05)' },
              ],
            },
          },
        },
      ],
    };

    if (!chartInstance) {
      chartInstance = echarts.init(chartRef.value);
    }
    chartInstance.setOption(option);
  } catch (error) {
    console.error('Failed to update chart:', error);
  }
};

onMounted(async () => {
  await bulletStore.loadBullets();
  await loadSummary();
  await loadAlerts();

  if (bullets.value.length > 0) {
    selectedBulletId.value = bullets.value[0].id;
  }

  // 定时刷新
  setInterval(() => {
    bulletStore.loadBullets();
    loadSummary();
    loadAlerts();
  }, 60000); // 每分钟刷新
});

watch(selectedBulletId, () => {
  updateChart();
});
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bullet-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.bullet-card {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e4e7ed;
  position: relative;
}

.bullet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.bullet-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #303133;
}

.bullet-price {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.bullet-change {
  font-size: 14px;
  margin-bottom: 5px;
}

.bullet-change.positive {
  color: #67c23a;
}

.bullet-change.negative {
  color: #f56c6c;
}

.bullet-level {
  font-size: 12px;
  color: #909399;
}

.hot-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.chart-card,
.positions-card,
.alerts-card {
  background: #fff;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.positive {
  color: #67c23a;
}

.negative {
  color: #f56c6c;
}
</style>
