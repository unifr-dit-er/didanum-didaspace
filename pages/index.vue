<script setup lang="ts">
import type { Issue } from "@/types/issue"

const { apiProvider } = useRuntimeConfig().public
const localePath = useLocalePath()
const { locale } = useI18n()
const search = useSearch()

const { data: issues, error } = await useFetch<Issue[]>(`/api/${apiProvider}/issues`, {
  query: { lang: `${locale.value}`, search }
})
</script>

<template>
  <div class="container mx-auto px-4 pt-20 pb-8 min-h-screen">
    <div class="my-8">
      <VSearch />
    </div>
    <VError v-if="error" :code="error.statusCode" :message="error.statusMessage" />
    <div v-else-if="issues" class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div class="flex items-center justify-center">
        <img src="/img/undraw_teaching_re_g7e3.svg" class="w-96" />
      </div>
      <VCard v-for="issue in issues" :key="issue.id" 
        :title="issue.title" 
        :description="issue.videoDescription || issue.introduction || ''"
        :vignette="issue.vignette"
        :link="localePath(`/issues/${issue.id}`)"
      />
    </div>
  </div>
</template>