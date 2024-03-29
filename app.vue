<script setup lang="ts">
import 'element-plus/theme-chalk/dark/css-vars.css';
import type { RouterInput } from '~/utils/types';

const { $trpc } = useNuxtApp();

const query = ref<RouterInput['job']['list']>({
  filter: 'relevant',
  isViewed: false,
});

const { data: jobs, refresh } = $trpc.job.list.useQuery(query);

function filterJob(key: string) {
  query.value.filter = key as RouterInput['job']['list']['filter'];
  refresh();
}

const isViewed = ref<'unviewed' | 'viewed'>('unviewed');
function viewJob(key: string) {
  if (key === 'viewed') {
    query.value.isViewed = true;
  } else if (key === 'unviewed') {
    query.value.isViewed = false;
  }
  refresh();
}

onMounted(() => {
  navigator.serviceWorker.addEventListener('message', ({ data }) => {
    ElNotification.success(data);
  });
});
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
      <el-menu :default-active="isViewed" mode="horizontal" @select="viewJob">
        <el-menu-item index="unviewed">Unviewed</el-menu-item>
        <el-menu-item index="viewed">Viewed</el-menu-item>
      </el-menu>
      <div v-if="jobs?.length" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <JobItem v-for="job of jobs" :key="job.id" :job="job" />
      </div>
      <p v-else class="text-center text-xl font-bold">No job found</p>
    </div>
  </div>
</template>
