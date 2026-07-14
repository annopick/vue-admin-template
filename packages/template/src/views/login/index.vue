<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '111111',
})

const rules: FormRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
}

async function handleLogin() {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await userStore.login(loginForm)
      const redirect = (route.query.redirect as string) || '/'
      router.push({ path: redirect })
      ElMessage.success('登录成功')
    } catch (err) {
      ElMessage.error((err as Error).message || '登录失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">系统登录</h3>
      </div>

      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入账号"
          :prefix-icon="User"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          :prefix-icon="Lock"
          type="password"
          placeholder="请输入密码"
          tabindex="2"
          autocomplete="on"
          @keyup.enter="handleLogin"
        />
      </el-form-item>

      <el-button
        type="primary"
        :loading="loading"
        class="login-button"
        @click="handleLogin"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  width: 450px;
  max-width: 100%;
  padding: 35px 35px 15px;
  background: #fff;
  border-radius: 8px;
}

.title-container {
  text-align: center;
  margin-bottom: 24px;

  .title {
    font-size: 26px;
    color: #303133;
    margin: 0;
  }
}

.login-button {
  width: 100%;
  margin-top: 8px;
}

// Element Plus wrapper background override for the themed dark page.
:deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: none;
}
</style>
