<script setup lang="ts">
import type { RouterInput } from '~/utils/types';

const { $trpc } = useNuxtApp();

const query = ref<RouterInput['job']['list']>({
  isFiltered: false,
});

const { data: jobs, refresh } = $trpc.job.list.useQuery(query);

enum JobFilter {
  SELECTED = 'selected',
  FILTERED = 'filtered',
}
const jobFilter = ref(JobFilter.SELECTED);
function filterJob(key: string) {
  const isFilteredValues = {
    [JobFilter.SELECTED]: false,
    [JobFilter.FILTERED]: true,
  };
  query.value.isFiltered = isFilteredValues[key as JobFilter];
  refresh();
}
</script>

<template>
  <div class="container mx-auto my-20">
    <div class="grid grid-cols-1 gap-y-5">
      <el-menu
        :default-active="jobFilter"
        mode="horizontal"
        @select="filterJob"
      >
        <el-menu-item :index="JobFilter.SELECTED">Selected</el-menu-item>
        <el-menu-item :index="JobFilter.FILTERED">Filtered</el-menu-item>
      </el-menu>
      <div
        v-if="jobs?.length > 0"
        class="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <JobItem v-for="job of jobs" :key="job.id" :job="job" />
      </div>
      <p v-else class="text-center text-xl font-bold">No job found</p>
    </div>
  </div>
</template>
