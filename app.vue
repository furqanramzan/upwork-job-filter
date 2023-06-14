<script setup lang="ts">
import type { RouterInput } from './utils/utils';

const { $trpc } = useNuxtApp();

const query = ref<RouterInput['job']['list']>({ isFiltered: false });

const { data: jobs, refresh } = $trpc.job.list.useQuery(query);

enum MenuIndex {
  SELECTED = 'selected',
  FILTERED = 'filtered',
  ALL = 'all',
}
const activeIndex = ref(MenuIndex.SELECTED);
function handleSelect(key: string) {
  const isFilteredValues = {
    [MenuIndex.SELECTED]: false,
    [MenuIndex.FILTERED]: true,
    [MenuIndex.ALL]: undefined,
  };
  query.value.isFiltered = isFilteredValues[key as MenuIndex];
  refresh();
}
</script>

<template>
  <div class="container mx-auto my-20">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item :index="MenuIndex.SELECTED">Selected</el-menu-item>
      <el-menu-item :index="MenuIndex.FILTERED">Filtered</el-menu-item>
      <el-menu-item :index="MenuIndex.ALL">All</el-menu-item>
    </el-menu>
    <div class="h-6" />
    <div v-if="jobs.length > 0" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <JobItem v-for="job of jobs" :key="job.id" :job="job" />
    </div>
    <p v-else class="text-center text-xl font-bold">No job found</p>
  </div>
</template>
