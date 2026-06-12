<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const postId = route.params.id

const { data: post, pending, error } = await useFetch<any>(`http://localhost/api/blog/posts/${postId}`)
</script>

<template>
  <div class="max-w-3xl mx-auto my-12 px-4">

    <NuxtLink to="/blog-posts-ui" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-6 transition-colors">
      ← Назад до панелі статей
    </NuxtLink>

    <div class="relative bg-white rounded-2xl w-full p-8 border border-gray-100 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col overflow-hidden">

      <div class="absolute h-[6px] top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-cyan-400"></div>

      <div v-if="pending" class="text-center py-12 text-gray-400">Завантаження статті...</div>
      <div v-else-if="error" class="text-center py-12 text-red-500 font-medium">Статтю не знайдено або вона ще не опублікована.</div>

      <article v-else-if="post?.data">
        <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight mt-2 leading-tight">
          {{ post.data.title }}
        </h1>

        <div class="mt-4 mb-5 flex flex-wrap gap-2 items-center text-sm">
    <span class="px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 rounded-md border border-green-100/60">
      {{ post.data.category_title || 'Без категорії' }}
    </span>
          <span class="text-gray-400">•</span>
          <span class="text-gray-500 font-medium">Автор: <strong class="text-gray-700">
      {{ post.data.author_name || 'Невідомий' }}
    </strong></span>
          <span class="text-gray-400">•</span>
          <span class="text-gray-500">Опубліковано: {{ post.data.date_published }}</span>
        </div>

        <hr class="border-gray-100 my-6">

        <div class="prose max-w-none text-gray-700 leading-relaxed text-[16px]">
          <div v-html="post.data.content_html || post.data.content_raw"></div>
        </div>
      </article>

    </div>
  </div>
</template>
