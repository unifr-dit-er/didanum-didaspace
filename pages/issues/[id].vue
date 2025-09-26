<script lang="ts" setup>
import type { Issue } from "@/types/issue"

const { id } = useRoute().params
const apiProvider = useRuntimeConfig().public.apiProvider
const { locale } = useI18n()
const lang = `${locale.value}`
const localePath = useLocalePath()

const { data: issue, error, pending } = await useFetch<Issue>(`/api/${apiProvider}/issues/${id}`, {
  query: { lang }
})
if (issue.value == null || issue.value.title == "") {
  navigateTo(localePath('/'))
}
</script>

<template>
  <div class="container mx-auto px-4 pt-20 pb-8 min-h-screen">
    <VError v-if="error" :code="error.statusCode" :message="error.statusMessage" />
    <div v-else-if="issue" class="flex flex-col lg:flex-row gap-4 lg:gap-8 mb-24">
      <div class="basis-2/3">
        <h1 class="text-3xl font-bold border-b-2 border-slate-300 pb-2 my-6">
          {{ issue.title }}
        </h1>
        <div class="text-xl">
          <div v-html="issue.introduction"></div>
        </div>
        <div class="my-6">
          <VCardVideo v-if="issue.videoUrl" :url="issue.videoUrl" :description="issue.videoDescription" />
        </div>
        <div class="grid md:grid-cols-2 gap-4">
          <VCardVideo v-for="solution in issue.solutions" :url="solution.url" :title="solution.title" />
        </div>
        <div v-html="issue.content" class="p-4 prose lg:prose-lg max-w-none"></div>
      </div>
      <div class="basis-1/3 mt-24">
        <div class="mb-8">
          <VCardVideo v-for="testimonie in issue.testimonies" :url="testimonie.url" :title="testimonie.title" class="mb-4" />
        </div>
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title">Ressources</h2>
            <ul class="menu bg-base-100 rounded-box" v-if="issue.appendix?.length || issue.links?.length">
              <li v-for="appendix in issue.appendix">
                <NuxtLink :to="appendix.url">
                  <Icon name="tabler:paperclip" size="24px" />
                  {{ appendix.title }}
                </NuxtLink>
              </li>
              <li v-for="link in issue.links">
                <NuxtLink :to="link.url">
                  <Icon name="tabler:link" size="24px" />
                  {{ link.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>