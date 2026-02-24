<template>
  <div class="bullet-detail">
    <el-page-header @back="goBack" :title="bullet?.name || '弹种详情'" />

    <el-card v-if="bullet" class="info-card">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="弹种名称">{{ bullet.name }}</el-descriptions-item>
        <el-descriptions-item label="弹药等级">Lv.{{ bullet.level }}</el-descriptions-item>
        <el-descriptions-item label="当前价格">
          <span class="price-value">{{ formatPrice(currentPrice) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="涨跌幅">
          <span :class="change >= 0 ? 'positive' : 'negative'">
            {{ change >= 0 ? '↑' : '↓' }} {{ Math.abs(changePercent).toFixed(2) }}%
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="数据来源">{{ source || '-' }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ updateTime }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ bullet.description }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>价格趋势</span>
          <el-radio-group v-model="timeRange" @change="loadHistory">
            <el-radio-button label="6">6小时</el-radio-button>
            <el-radio-button label="24">24小时</el-radio-button>
            <el-radio-button label="168">7天</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div ref="chartRef" style="height: 400px"></div>
    </el-card>

    <el-card class="targets-card">
      <template #header>
        <div class="card-header">
          <span>目标价格</span>
          <el-button type="primary" size="small" @click="showAddTarget = true">添加目标</el-button>
        </div>
      </template>
      <div v-if="bulletTargets.length > 0">
        <div v-for="target in bulletTargets" :key="target.id" class="target-item">
          <el-tag :type="target.targetType === 'profit' ? 'success' : 'danger'">
            {{ target.targetType === 'profit' ? '止盈' : '止损' }}
          </el-tag>
          <span class="target-price">{{ formatPrice(target.targetPrice) }}</span>
          <el-button size="small" text type="danger" @click="deleteTarget(target.id)">删除</el-button>
        </div>
      </div>
      <el-empty v-else description="暂无目标价格" />
    </el-card>

    <!-- 添加目标对话框 -->
    <el-dialog v-model="showAddTarget" title="添加目标价格" width="400px">
      <el-form :model="targetForm" label-width="80px">
        <el-form-item label="目标类型">
          <el-radio-group v-model="targetForm.targetType">
            <el-radio label="profit">止盈</el-radio>
            <el-radio label="loss">止损</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标价格">
          <el-input-number v-model="targetForm.targetPrice" :min="0" :precision="0" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddTarget = false">取消</el-button>
        <el-button type="primary" @click="handleAddTarget">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBulletDetail, getPriceHistory, getTargets, addTarget, deleteTarget as deleteTargetApi } from '@/api';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';

const route = useRoute();
const router = useRouter();

const bulletId = computed(() => parseInt(route.params.id as string));
const bullet = ref<any>(null);
const currentPrice = ref(0);
const change = ref(0);
const changePercent = ref(0);
const source = ref('');
const updateTime = ref('');
const timeRange = ref('24');
const chartRef = ref<HTMLElement>();
const bulletTargets = ref<any[]>([]);
const showAddTarget = ref(false);
const targetForm = ref({
  targetType: 'profit',
  targetPrice: 0,
});

let chartInstance: echarts.ECharts | null = null;

const formatPrice = (price: number) => {
  return price.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const goBack = () => {
  router.back();
};

const loadBulletDetail = async () => {
  try {
    const response = await getBulletDetail(bulletId.value);
    const data = response.data;
    bullet.value = data;
    currentPrice.value = data.currentPrice;
    change.value = data.change;
    changePercent.value = data.changePercent;
    source.value = data.priceHistory[0]?.source || '';
    updateTime.value = data.priceHistory[0]?.createdAt
      ? new Date(data.priceHistory[0].createdAt).toLocaleString('zh-CN')
      : '';
  } catch (error) {
    console.error('Failed to load bullet detail:', error);
  }
};

const loadHistory = async () => {
  try {
    const response = await getPriceHistory(bulletId.value, parseInt(timeRange.value));
    const history = response.data;

    const times = history.map((h: any) => new Date(h.createdAt).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }));
    const prices = history.map((h: any) => h.price);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: times,
        boundaryGap: false,
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
          markLine: {
            data: [
              { type: 'max', name: '最高价' },
              { type: 'min', name: '最低价' },
            ],
          },
        },
      ],
    };

    if (!chartInstance) {
      chartInstance = echarts.init(chartRef.value!);
    }
    chartInstance.setOption(option);
  } catch (error) {
    console.error('Failed to load history:', error);
  }
};

const loadTargets = async () => {
  try {
    const response = await getTargets();
    bulletTargets.value = response.data.filter((t: any) => t.bulletId === bulletId.value);
  } catch (error) {
    console.error('Failed to load targets:', error);
  }
};

const handleAddTarget = async () => {
  try {
    await addTarget({
      bulletId: bulletId.value,
      targetType: targetForm.value.targetType,
      targetPrice: targetForm.value.targetPrice,
    });
    ElMessage.success('添加成功');
    showAddTarget.value = false;
    targetForm.value = {
      targetType: 'profit',
      targetPrice: 0,
    };
    await loadTargets();
  } catch (error) {
    ElMessage.error('添加失败');
  }
};

const deleteTarget = async (id: number) => {
  try {
    await deleteTargetApi(id);
    ElMessage.success('删除成功');
    await loadTargets();
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

onMounted(async () => {
  await loadBulletDetail();
  await loadHistory();
  await loadTargets();
});
</script>

<style scoped>
.bullet-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card,
.chart-card,
.targets-card {
  background: #fff;
  border-radius: 8px;
}

.price-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.positive {
  color: #67c23a;
}

.negative {
  color: #f56c6c;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.target-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #e4e7ed;
}

.target-item:last-child {
  border-bottom: none;
}

.target-price {
  font-size: 18px;
  font-weight: 500;
  flex: 1;
}
</style>
