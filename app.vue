<script setup lang="ts">
import type { RouterInput } from '~/utils/types';

const { $trpc } = useNuxtApp();

const query = ref<RouterInput['job']['list']>({
  filter: 'relevant',
});

const { data: jobs, refresh } = $trpc.job.list.useQuery(query);

function filterJob(key: string) {
  query.value.filter = key as RouterInput['job']['list']['filter'];
  refresh();
}
</script>

<template>
  <div class="container mx-auto my-20">
    <div class="grid grid-cols-1 gap-y-5">
      <el-menu
        :default-active="query.filter"
        mode="horizontal"
        @select="filterJob"
      >
        <el-menu-item index="relevant">Relevant</el-menu-item>
        <el-menu-item index="relevant-irrelevant"
          >Relevant-Irrelevant</el-menu-item
        >
        <el-menu-item index="notsure">Not Sure</el-menu-item>
        <el-menu-item index="irrelevant">Irrelevant</el-menu-item>
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
