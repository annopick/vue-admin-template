<script setup lang="ts">
// 404 page — rendered for unknown routes (catch-all registered after dynamic routes).
</script>

<template>
  <div class="error-page-container">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <p class="error-desc">抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-page-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f0f2f5;

  .error-content {
    text-align: center;

    .error-code {
      font-size: 120px;
      font-weight: 600;
      color: #2d3a4b;
      margin: 0;
      line-height: 1;
    }

    .error-desc {
      font-size: 20px;
      color: #606266;
      margin: 20px 0 30px;
    }
  }
}
</style>
