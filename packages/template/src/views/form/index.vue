<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage, type FormInstance, type FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const form = reactive({
  title: '',
  author: '',
  content: '',
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
}

function submit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success('表单提交成功（示例）')
    } else {
      ElMessage.error('请填写必填项')
    }
  })
}

function reset() {
  formRef.value?.resetFields()
}
</script>

<template>
  <div class="app-container">
    <h2>Form 示例</h2>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" style="max-width: 500px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author" placeholder="请输入作者" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
