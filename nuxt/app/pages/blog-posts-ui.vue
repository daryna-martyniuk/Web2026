<template>
  <section class="max-w-[1200px] mx-auto pb-20 p-6">
    <h2 class="text-[28px] font-bold text-gray-800 tracking-tight">Список постів</h2>

    <div v-if="pending" class="flex flex-col justify-center items-center py-32 bg-white rounded-xl border border-gray-200 mt-4 shadow-sm">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-4"></div>
      <p class="text-gray-500 font-medium">Завантаження постів...</p>
    </div>

    <div v-else-if="posts.length === 0" class="flex flex-col justify-center items-center py-32 bg-white rounded-xl border border-gray-200 mt-4 shadow-sm">
      <p class="text-gray-500 font-medium text-lg">Поки що немає жодного поста</p>
      <p class="text-gray-400 text-sm mt-1">Дані не завантажились або база даних порожня.</p>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-4 text-sm font-normal text-gray-500 mt-4">
        <div>Всього постів у базі: <span class="font-bold">{{ totalPosts }}</span></div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr>
              <th class="p-4 w-12 font-medium text-center">#</th>
              <th class="p-4 font-normal">Автор</th>
              <th class="p-4 font-normal">Категорія</th>
              <th class="p-4 font-normal">Заголовок</th>
              <th class="p-4 font-normal">Дата публікації</th>
              <th class="p-4 font-normal w-12 text-center"></th>
            </tr>
            </thead>

            <tbody class="text-gray-700 divide-y divide-gray-100">
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50 transition-colors cursor-pointer group">
              <td class="p-4 text-center font-semibold text-gray-500">
                {{ post.id }}
              </td>
              <td class="p-4 font-semibold text-gray-900 whitespace-normal min-w-[120px]">
                {{ post.user?.name || 'Невідомо' }}
              </td>
              <td class="p-4 text-gray-600 text-[13px]">
                <span class="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-medium border border-emerald-100">
                  {{ post.category?.title || 'Без категорії' }}
                </span>
              </td>
              <td class="p-4 whitespace-normal min-w-[200px]">
                <a :href="'/admin/blog/posts/' + post.id + '/edit'" class="text-gray-800 hover:text-emerald-600 hover:underline font-medium transition-colors">
                  {{ post.title }}
                </a>
              </td>
              <td class="p-4 text-gray-500 text-[13px]">
                {{ post.published_at || '-' }}
              </td>
              <td class="p-4 text-center">
                <button class="text-gray-400 hover:text-gray-800 text-xl transition-colors font-bold">
                  ⋮
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white border-t border-gray-200 p-4 flex justify-between items-center text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <span>Показано по</span>
            <span class="w-10 h-8 border border-gray-200 rounded flex items-center justify-center text-gray-800 font-semibold bg-gray-50">
              {{ perPage }}
            </span>
            <span>записів</span>
          </div>

          <div class="flex items-center gap-2">
            <template v-for="p in totalPages" :key="p">
              <div v-if="p === page" class="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-cyan-400 p-[1.5px] shadow-sm">
                <button class="w-full h-full rounded-full bg-white text-gray-800 font-bold flex items-center justify-center cursor-default">
                  {{ p }}
                </button>
              </div>
              <button v-else @click="page = p" class="w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 font-medium flex items-center justify-center transition-colors">
                {{ p }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const page = ref(1)

const { data: response, pending } = await useFetch<any>(() => `http://localhost/api/blog/posts?page=${page.value}`)

const posts = computed(() => response.value?.data || [])
const totalPosts = computed(() => response.value?.total || 0)
const perPage = computed(() => response.value?.per_page || 10)
const totalPages = computed(() => Math.ceil(totalPosts.value / perPage.value) || 1)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
