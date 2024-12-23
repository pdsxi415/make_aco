<template>
  <Suspense>
    <template #default>
      <ColorConverter />
    </template>
    <template #fallback>
      <div class="loading">
        加载中...
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { Suspense } from 'vue'
import ColorConverter from './components/ColorConverter.vue'
</script>

<style>
.loading {
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #909399;
}
</style> 