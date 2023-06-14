<script setup lang="ts">
import { Check, Close } from '@element-plus/icons-vue';
import type { Job } from '@prisma/client';

const { job } = defineProps<{ job: Job }>();

function copyForProposal() {
  copyToClipboard(
    `Using the information I have provided, please craft me an upwork proposal for this job:\n\nJob Title: \n${job.title}\n\nJob Description: \n${job.description}`,
  );
}
</script>

<template>
  <el-card>
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
        <div class="flex gap-2">
          <el-link @click.prevent="copyForProposal">Copy</el-link>
          <el-link :href="job.url" target="_blank"> Open </el-link>
        </div>
      </div>
    </template>
    <p>{{ job.description }}</p>
    <div class="flex justify-end">
      <p>{{ getStringFromTime(job.postedTime) }}</p>
    </div>
  </el-card>
</template>
