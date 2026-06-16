<template>
  <div class="max-w-3xl mx-auto my-12 px-4">
    <div class="mb-6 flex justify-between items-center">
      <NuxtLink to="/admin/categories" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
        ← Назад до списку
      </NuxtLink>

      <NuxtLink
        :to="`/admin/categories/edit-${categoryId}`"
        class="text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
      >
        Редагувати категорію
      </NuxtLink>
    </div>

    <div class="relative bg-white rounded-2xl w-full p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col overflow-hidden">
      <div class="absolute h-[6px] top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-cyan-400"></div>

      <div v-if="status === 'pending'" class="flex flex-col items-center py-20 text-gray-400">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
        <p class="text-sm font-medium">Завантаження деталей...</p>
      </div>

      <div v-else-if="category">
        <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Перегляд категорії #{{ category.id }}</span>
        <h1 class="text-3xl font-extrabold text-gray-900 mt-1 mb-6">{{ category.title }}</h1>

        <hr class="border-gray-100 mb-6">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
          <div>
            <span class="block text-xs font-semibold text-gray-400 uppercase">Слаг</span>
            <span class="inline-block mt-1 font-mono bg-gray-50 px-2 py-1 border border-gray-200 rounded text-gray-700">
              {{ category.slug || '—' }}
            </span>
          </div>

          <div>
            <span class="block text-xs font-semibold text-gray-400 uppercase">Батьківська категорія</span>
            <span v-if="category.parent_title && category.parent_title !== 'Без категорії'" class="inline-block mt-1 px-2.5 py-1 font-bold bg-green-50 text-green-700 rounded-md border border-blue-100/60">
              {{ category.parent_title }}
            </span>
            <span v-else class="inline-block mt-1 text-gray-400 italic font-medium">
              Відсутня (коренева категорія)
            </span>
          </div>
        </div>

        <div class="text-sm">
          <span class="block text-xs font-semibold text-gray-400 uppercase mb-1">Опис категорії</span>
          <div class="bg-gray-50/60 border border-gray-100 rounded-xl p-4 text-gray-700 min-h-[100px] whitespace-pre-line">
            {{ category.description || 'Опис для цієї категорії відсутній.' }}
          </div>
        </div>
      </div>

      <div v-else class="py-12 text-center text-gray-500">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-4xl text-red-400 mb-2" />
        <p class="font-semibold text-gray-800">Категорію не знайдено</p>
        <p class="text-sm mt-1">Можливо, вона була видалена або сталася помилка сервера.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const categoryId = route.params.id

const { data: response, status } = await useFetch<any>(`http://localhost/api/admin/blog/categories/${categoryId}`, {
  server: false
})

const category = computed(() => response.value?.data || response.value)
</script>
