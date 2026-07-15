<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessageBox, ElMessage, ElAvatar, ElIcon } from 'element-plus'
import { Avatar } from '@element-plus/icons-vue'
import Breadcrumb from './Breadcrumb/index.vue'
import Hamburger from './Hamburger/index.vue'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'

const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()

const sidebar = computed(() => appStore.sidebar)
const avatar = computed(() => userStore.avatar)

function toggleSideBar() {
  appStore.toggleSideBar()
}

async function logout() {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await userStore.logout()
  ElMessage.success('已退出登录')
  router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
}
</script>

<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />
    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown trigger="click">
        <div class="avatar-wrapper">
          <el-avatar :size="32" :src="avatar">
            <el-icon><Avatar /></el-icon>
          </el-avatar>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    cursor: pointer;
    transition: background 0.3s;
    padding: 0 15px;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    margin-right: auto;
  }

  .right-menu {
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 16px;

    &:focus {
      outline: none;
    }

    // el-dropdown wraps the trigger; make it fill the row so the avatar
    // centers vertically instead of sticking to the top.
    :deep(.el-dropdown) {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .avatar-wrapper {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }
}
</style>
