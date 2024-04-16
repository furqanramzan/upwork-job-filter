<script setup lang="ts">
import { Check, Close } from '@element-plus/icons-vue';
import type { Job } from '~/server/utils/models';

const { job } = defineProps<{ job: Job }>();

const { COPY_FOR_PROPOSAL_TEXT } = useRuntimeConfig().public;

function copyForProposal() {
  copyToClipboard(
    `${COPY_FOR_PROPOSAL_TEXT}\n\nJob Title: \n${job.title}\n\nJob Description: \n${job.description}`,
  );
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex items-center justify-between">
        <span class="flex w-5/6 items-center">
          <el-icon
            v-if="job.filter === 'irrelevant'"
            class="mr-2 rounded bg-red-400 text-white"
            size="20"
            color="white"
          >
            <Close />
          </el-icon>
          <el-icon
            v-else-if="job.filter === 'relevant'"
            class="mr-2 rounded bg-green-400 text-white"
            size="20"
            color="white"
          >
            <Check />
          </el-icon>
          <el-icon
            v-else-if="job.filter === 'relevant-irrelevant'"
            class="mr-2 rounded bg-green-400 text-white"
            size="20"
            color="white"
          >
            <ElIconWarning />
          </el-icon>
          <el-icon
            v-else-if="job.filter === 'notsure'"
            class="mr-2 rounded bg-gray-600 text-white"
            size="20"
            color="white"
          >
            <ElIconZoomIn />
          </el-icon>
          {{ job.title }}
        </span>
        <div class="flex gap-2">
          <el-link @click.prevent="copyForProposal">Copy</el-link>
          <el-link :href="job.url" target="_blank"> Open </el-link>
        </div>
      </div>
    </template>
    <div class="flex flex-col gap-5">
      <div class="flex items-center justify-between">
        <strong>{{ job.budget }}</strong>
        <strong>{{ getStringFromTime(job.postedTime) }}</strong>
      </div>
      <p>{{ job.description }}</p>
      <div class="flex flex-wrap gap-2">
        <el-tag
          v-for="(skill, index) in job.skills"
          :key="index"
          type="success"
        >
          {{ skill }}
        </el-tag>
      </div>
    </div>
  </el-card>
</template>
