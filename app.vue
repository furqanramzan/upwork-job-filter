<script setup lang="ts">
import { Check, Close } from '@element-plus/icons-vue';

const { $trpc } = useNuxtApp();
const { data: jobs } = $trpc.job.list.useQuery();
</script>

<template>
  <div class="container mx-auto my-20">
    <div v-if="jobs.length > 0" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <el-card v-for="job of jobs" :key="job.id">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="flex w-5/6 items-center">
              <el-icon
                v-if="job.isFiltered"
                class="mr-2 rounded bg-red-400 text-white"
                size="20"
                color="white"
              >
                <Close />
              </el-icon>
              <el-icon
                v-else
                class="mr-2 rounded bg-green-400 text-white"
                size="20"
                color="white"
              >
                <Check />
              </el-icon>
              {{ job.title }}
            </span>
            <el-link :href="job.url" target="_blank">Open </el-link>
          </div>
        </template>
        <p>{{ job.description }}</p>
      </el-card>
    </div>
    <p v-else class="text-center text-xl font-bold">No job found</p>
  </div>
</template>
