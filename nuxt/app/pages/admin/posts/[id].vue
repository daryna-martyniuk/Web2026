<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const postId = route.params.id

const { data: postResponse, pending, error } = await useFetch<any>(`http://localhost/api/admin/blog/posts/${postId}`, {
  lazy: true,
  server: false
})

const post = computed(() => {
  if (!postResponse.value) return null
  return postResponse.value.data ? postResponse.value.data : postResponse.value
})

const deletePost = async () => {
  if (!confirm('Ви впевнені, що хочете видалити цю статтю?')) return

  try {
    await $fetch(`http://localhost/api/admin/blog/posts/${postId}`, {
      method: 'DELETE'
    })
    alert('Статтю успішно видалено!')
    router.push('/admin/posts/blog-posts-ui')
  } catch (err) {
    alert('Помилка при видаленні статті.')
    console.error(err)
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto my-12 px-4">

    <div class="flex justify-between items-center mb-6">

      <NuxtLink to="/admin/posts/blog-posts-ui" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
        ← Назад до панелі статей
      </NuxtLink>

      <div class="flex items-center gap-3" v-if="post && !pending && !error">
        <NuxtLink
          :to="`/admin/posts/edit-${postId}`"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors no-underline border border-gray-200 text-gray-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <iconify-icon icon="heroicons:pencil-square" class="text-base"></iconify-icon>
          Редагувати
        </NuxtLink>

        <button
          @click="deletePost"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-gray-200 text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
        >
          <iconify-icon icon="heroicons:trash" class="text-base"></iconify-icon>
          Видалити
        </button>
      </div>

    </div>

    <div class="relative bg-white rounded-2xl w-full border border-gray-100 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col overflow-hidden">
      <div class="absolute h-[5px] top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-cyan-400"></div>

      <div v-if="pending" class="text-center py-20 text-gray-400">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-3"></div>
        Завантаження вмісту...
      </div>

      <div v-else-if="error || !post" class="text-center py-20 px-8 text-red-500">
        <p class="font-semibold mb-2">Статтю з ID #{{ postId }} не знайдено.</p>
        <p class="text-sm">Перевірте, чи бекенд віддає дані для цього ID.</p>
      </div>

      <article v-else class="p-8">

        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {{ post.title }}
        </h1>

        <div class="mt-4 mb-6 flex flex-wrap gap-x-4 gap-y-2 items-center text-sm text-gray-500 border-b border-gray-100 pb-6">
          <span class="px-2.5 py-0.5 font-semibold bg-green-50 text-green-700 rounded-md border border-green-100/60">
            {{ post.category_title || 'Без категорії' }}
          </span>
          <span :class="post.is_published ? 'text-green-600' : 'text-amber-600'" class="font-medium">
            {{ post.is_published ? 'Опубліковано' : 'Чернетка' }}
          </span>
          <span class="text-gray-300">|</span>
          <span class="font-medium text-gray-700">{{ post.author_name || 'Невідомий' }}</span>
          <span class="text-gray-300">|</span>
          <span>Дата: {{ post.date_published || '-' }}</span>
        </div>

        <div class="prose max-w-none text-gray-800 leading-relaxed text-[16px] mb-2">
          <div v-if="post.content_html" v-html="post.content_html"></div>
          <div v-else class="whitespace-pre-wrap">{{ post.content_raw || 'Немає вмісту...' }}</div>
        </div>

      </article>

    </div>
  </div>
</template>
