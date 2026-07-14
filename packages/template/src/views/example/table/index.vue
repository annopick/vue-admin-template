<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElPagination, ElTag } from 'element-plus'
import { getList, type TableItem } from '@/api/table'

const list = ref<TableItem[]>([])
const total = ref(0)
const listLoading = ref(false)
const listQuery = ref({ page: 1, limit: 10 })

async function fetchList() {
  listLoading.value = true
  try {
    const res = await getList(listQuery.value)
    list.value = res.data.items
    total.value = res.data.total
  } finally {
    listLoading.value = false
  }
}

function handlePageChange(page: number) {
  listQuery.value.page = page
  fetchList()
}

onMounted(fetchList)
</script>

<template>
  <div class="app-container">
    <h2>Table 示例</h2>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="标题" prop="title" min-width="200" />
      <el-table-column label="作者" prop="author" align="center" width="100" />
      <el-table-column label="状态" align="center" width="110">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'">
            {{ row.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="浏览量" prop="pageviews" align="center" width="100" />
    </el-table>
    <el-pagination
      v-show="total > 0"
      class="pagination"
      background
      :current-page="listQuery.page"
      :page-size="listQuery.limit"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
