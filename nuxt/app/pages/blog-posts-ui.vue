<template>
  <section class="max-w-[1200px] mx-auto pb-20 pt-10 px-6">
    <h2 class="text-[28px] font-bold text-gray-800 tracking-tight">Панель статей</h2>

    <div class="flex justify-between items-center mb-4 text-sm font-normal text-gray-500 mt-4">
      <div>{{ selectedIds.length }} вибрано</div>

      <div class="flex items-center gap-6">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Пошук за заголовком..."
          class="w-56 pl-3 pr-4 py-1.5 bg-white border border-gray-200 rounded-md outline-none focus:border-emerald-500 transition-colors shadow-sm"
        >
        <button class="flex items-center gap-2 text-gray-900 font-semibold hover:text-gray-700 transition-colors">
          <iconify-icon icon="heroicons:bars-3-bottom-left" class="text-lg"></iconify-icon>
          Сортування
        </button>
        <button class="flex items-center gap-2 text-gray-900 font-semibold hover:text-gray-700 transition-colors">
          <iconify-icon icon="heroicons:ellipsis-vertical" class="text-xl"></iconify-icon>
          Дії
        </button>
      </div>
    </div>

    <div v-if="pending || status === 'idle'" class="flex flex-col justify-center items-center py-32 bg-white rounded-xl border border-gray-200 mt-4 shadow-sm relative overflow-hidden">
      <div class="absolute h-[6px] top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-cyan-400"></div>
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-4"></div>
      <p class="text-gray-500 font-medium">Оновлення списку статей...</p>
    </div>

    <div v-else>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col mt-4">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr>
              <th class="p-4 w-12 font-medium">
                <div class="flex items-center gap-1">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    class="w-[18px] h-[18px] rounded border-gray-300 accent-emerald-500 cursor-pointer"
                  >
                  <iconify-icon icon="heroicons:chevron-down" class="text-xs cursor-pointer hover:text-gray-800"></iconify-icon>
                </div>
              </th>
              <th class="p-4 font-normal">ID</th>
              <th class="p-4 font-normal">Заголовок</th>
              <th class="p-4 font-normal">Категорія</th>
              <th class="p-4 font-normal">Автор</th>
              <th class="p-4 font-normal text-right">Дата публікації</th>
              <th class="p-4 font-normal w-12 text-center">Дії</th>
            </tr>
            </thead>

            <tbody class="text-gray-700 divide-y divide-gray-100">
            <tr v-if="posts.length === 0 && status === 'success'">
              <td colspan="7" class="p-12 text-center text-gray-400">Статей за таким запитом не знайдено.</td>
            </tr>

            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50 transition-colors cursor-pointer group">
              <td class="p-4" @click.stop>
                <input
                  type="checkbox"
                  :value="post.id"
                  v-model="selectedIds"
                  class="w-[18px] h-[18px] rounded border-gray-300 accent-emerald-500 cursor-pointer"
                >
              </td>
              <td class="p-4 font-semibold text-gray-400">
                #{{ post.id }}
              </td>
              <td>
                <NuxtLink :to="`/posts/${post.id}`" class="text-gray-800 hover:text-gray-900 font-semibold no-underline hover:underline">
                  {{ post.title }}
                </NuxtLink>
              </td>
              <td class="p-4 text-gray-600 text-[13px]">
                <span class="px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 rounded-md border border-green-100/60">
                  {{ post.category_title || 'Без категорії' }}
                </span>
              </td>
              <td class="p-4 text-gray-600 font-medium">
                {{ post.author_name || 'Невідомий' }}
              </td>
              <td class="p-4 text-right text-gray-500 text-sm">
                {{ formatDate(post.date_published) }}
              </td>
              <td class="p-4 text-center">
                <NuxtLink
                  :to="`/admin/posts/${post.id}/edit`"
                  class="text-gray-400 hover:text-emerald-600 text-xl transition-colors inline-block p-1 hover:bg-emerald-50 rounded"
                  title="Редагувати"
                  @click.stop
                >
                  <iconify-icon icon="heroicons:pencil-square"></iconify-icon>
                </NuxtLink>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white border-t border-gray-200 p-4 flex justify-between items-center text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <span>Показувати</span>
            <input
              v-model.lazy.number="itemsPerPage"
              type="number"
              class="w-12 h-8 border border-gray-200 rounded text-center text-gray-800 font-semibold outline-none focus:border-emerald-500 transition-colors"
            >
            <span>із {{ totalItems }} результатів</span>
          </div>

          <div class="flex items-center gap-2" v-if="totalPages > 1">
            <template v-for="p in totalPages" :key="p">
              <div v-if="p === page" class="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-cyan-400 p-[1.5px] cursor-pointer">
                <button class="w-full h-full rounded-full bg-green-50 text-gray-800 font-bold flex items-center justify-center hover:bg-green-100 transition-colors">
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
import { ref, computed, watch } from 'vue'

const searchInput = ref('')
const search = ref('')
const page = ref(1)
const itemsPerPage = ref(10)

let debounceTimeout: any = null
watch(searchInput, (newValue) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    search.value = newValue
  }, 500)
})

const { data: apiData, pending, status } = await useFetch<any>('http://localhost/api/blog/posts', {
  query: {
    page: page,
    per_page: itemsPerPage,
    search: search
  },
  watch: [page, itemsPerPage, search],
  lazy: true,
  server: false
})

const posts = computed(() => apiData.value?.data || [])
const totalPages = computed(() => apiData.value?.meta?.last_page || 1)
const totalItems = computed(() => apiData.value?.meta?.total || 0)

watch([search, itemsPerPage], () => {
  page.value = 1
})

const selectedIds = ref<number[]>([])

const selectAll = computed({
  get: () => {
    return posts.value.length > 0 && posts.value.every((p: any) => selectedIds.value.includes(p.id))
  },
  set: (value) => {
    const pageIds = posts.value.map((p: any) => p.id)
    if (value) {
      const newIds = new Set([...selectedIds.value, ...pageIds])
      selectedIds.value = Array.from(newIds)
    } else {
      selectedIds.value = selectedIds.value.filter(id => !pageIds.includes(id))
    }
  }
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return dateStr.split(' ')[0]
}
</script>

<style scoped>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
