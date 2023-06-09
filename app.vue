<script setup lang="ts">
const { $trpc } = useNuxtApp();
const { data } = $trpc.hello.useQuery({ text: 'Nuxt Boilerplate' });
</script>

<template>
  <div>
    <h1>{{ data.greeting }}</h1>
  </div>
</template>
