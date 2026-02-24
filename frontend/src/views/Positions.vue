<template>
  <div class="positions">
    <!-- 持仓统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card shadow="hover">
          <el-statistic title="持仓总价值" :value="summary.totalValue || 0" :precision="0">
            <template #prefix>💰</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <el-statistic
            title="未实现利润"
            :value="summary.totalProfit || 0"
            :precision="0"
            :value-style="summary.totalProfit >= 0 ? { color: '#67c23a' } : { color: '#f56c6c' }"
          >
            <template #prefix>{{ summary.totalProfit >= 0 ? '📈' : '📉' }}</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <el-statistic title="持仓数量" :value="summary.positions?.length || 0">
            <template #prefix>📦</template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作按钮 -->
    <el-row class="action-row">
      <el-button type="primary" @click="showAddDialog = true">➕ 添加交易记录</el-button>
      <el-button @click="loadData">🔄 刷新</el-button>
    </el-row>

    <!-- 持仓列表 -->
    <el-card v-if="summary.positions && summary.positions.length > 0">
      <el-table :data="summary.positions" style="width: 100%">
        <el-table-column prop="bulletName" label="弹种" width="200" />
        <el-table-column prop="quantity" label="持仓数量" width="120" />
        <el-table-column prop="avgCost" label="平均成本" width="150" :formatter="formatPrice" />
        <el-table-column prop="totalCost" label="总成本" width="150" :formatter="formatPrice" />
        <el-table-column prop="currentPrice" label="当前价格" width="150" :formatter="formatPrice" />
        <el-table-column label="未实现利润" width="200">
          <template #default="{ row }">
            <span :class="row.unrealizedProfit >= 0 ? 'positive' : 'negative'">
              {{ formatPriceValue(row.unrealizedProfit) }} ({{ formatPercent(row.profitPercent) }})
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleSell(row)">卖出</el-button>
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-empty v-else description="暂无持仓，快去添加交易记录吧！" />

    <!-- 添加交易对话框 -->
    <el-dialog v-model="showAddDialog" title="添加交易记录" width="500px">
      <el-form :model="transactionForm" label-width="100px">
        <el-form-item label="操作类型">
          <el-radio-group v-model="transactionForm.action">
            <el-radio label="buy">买入</el-radio>
            <el-radio label="sell">卖出</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="弹种">
          <el-select v-model="transactionForm.bulletId" placeholder="选择弹种" style="width: 100%">
            <el-option
              v-for="bullet in bullets"
              :key="bullet.id"
              :label="bullet.name"
              :value="bullet.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="transactionForm.quantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="transactionForm.price" :min="0" :precision="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="transactionForm.note" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddTransaction">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useBulletStore } from '@/stores/bullets';
import { getPositionSummary, addTransaction } from '@/api';
import { ElMessage } from 'element-plus';

const bulletStore = useBulletStore();
const bullets = computed(() => bulletStore.bullets);

const summary = ref<any>({});
const showAddDialog = ref(false);
const transactionForm = ref({
  action: 'buy',
  bulletId: null as number | null,
  quantity: 1,
  price: 0,
  note: '',
});

const formatPrice = (_row: any, _column: any, cellValue: number) => {
  return cellValue.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatPriceValue = (value: number) => {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatPercent = (percent: number) => {
  if (!percent) return '0%';
  return (percent >= 0 ? '+' : '') + percent.toFixed(2) + '%';
};

const loadData = async () => {
  await bulletStore.loadBullets();
  try {
    const response = await getPositionSummary();
    summary.value = response.data;
  } catch (error) {
    console.error('Failed to load positions:', error);
  }
};

const handleAddTransaction = async () => {
  if (!transactionForm.value.bulletId) {
    ElMessage.warning('请选择弹种');
    return;
  }

  try {
    await addTransaction(transactionForm.value);
    ElMessage.success('添加成功');
    showAddDialog.value = false;
    transactionForm.value = {
      action: 'buy',
      bulletId: null,
      quantity: 1,
      price: 0,
      note: '',
    };
    await loadData();
  } catch (error) {
    ElMessage.error('添加失败');
  }
};

const handleSell = (row: any) => {
  showAddDialog.value = true;
  transactionForm.value = {
    action: 'sell',
    bulletId: row.bulletId,
    quantity: row.quantity,
    price: row.currentPrice,
    note: `卖出 ${row.bulletName}`,
  };
};

const handleEdit = (row: any) => {
  ElMessage.info('编辑功能开发中...');
};

onMounted(() => {
  loadData();
  // 定时刷新
  setInterval(loadData, 60000);
});
</script>

<style scoped>
.positions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.action-row {
  display: flex;
  gap: 10px;
}

.positive {
  color: #67c23a;
  font-weight: 500;
}

.negative {
  color: #f56c6c;
  font-weight: 500;
}
</style>
