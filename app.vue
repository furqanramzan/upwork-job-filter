<script setup lang="ts">
const { $trpc } = useNuxtApp();
const { data: jobs } = $trpc.job.list.useQuery();
</script>

<template>
  <div class="container mx-auto my-20">
    <div v-if="jobs.length > 0" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <JobItem v-for="job of jobs" :key="job.id" :job="job" />
    </div>
    <p v-else class="text-center text-xl font-bold">No job found</p>
  </div>
</template>
