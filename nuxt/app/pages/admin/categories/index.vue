<template>
  <section class="max-w-[1200px] mx-auto pb-20 pt-10 px-6">
    <h2 class="text-[28px] font-bold text-gray-800 tracking-tight">Панель категорій</h2>

    <div class="flex justify-between items-center mb-4 text-sm font-normal text-gray-500 mt-4">
      <div>{{ selectedIds.length }} вибрано</div>

      <div class="flex items-center gap-6">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Пошук за назвою..."
          class="w-56 pl-3 pr-4 py-1.5 bg-white border border-gray-200 rounded-md outline-none focus:border-emerald-500 transition-colors shadow-sm"
        >
        <button class="flex items-center gap-2 text-gray-900 font-semibold hover:text-gray-700 transition-colors">
          <UIcon name="i-heroicons-bars-3-bottom-left" class="text-lg" />
          Сортування
        </button>
        <button class="flex items-center gap-2 text-gray-900 font-semibold hover:text-gray-700 transition-colors">
          <UIcon name="i-heroicons-ellipsis-vertical" class="text-xl" />
          Дії
        </button>

        <UButton
          to="/admin/categories/create"
          icon="i-heroicons-plus"
          color="primary"
          variant="solid"
        >
          Створити
        </UButton>
      </div>
    </div>

    <div v-if="pending || status === 'idle'" class="flex flex-col justify-center items-center py-32 bg-white rounded-xl border border-gray-200 mt-4 shadow-sm relative overflow-hidden">
      <div class="absolute h-[6px] top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-cyan-400"></div>
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-4"></div>
      <p class="text-gray-500 font-medium">Оновлення списку категорій...</p>
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
                  <UIcon name="i-heroicons-chevron-down" class="text-xs cursor-pointer hover:text-gray-800" />
                </div>
              </th>
              <th class="p-4 font-normal">ID</th>
              <th class="p-4 font-normal">Назва категорії</th>
              <th class="p-4 font-normal">Батьківська категорія</th>
              <th class="p-4 font-normal">Слаг</th>
              <th class="p-4 font-normal w-12 text-center">Дії</th>
            </tr>
            </thead>

            <tbody class="text-gray-700 divide-y divide-gray-100">
            <tr v-if="categories.length === 0 && status === 'success'">
              <td colspan="6" class="p-12 text-center text-gray-400">Категорій за таким запитом не знайдено.</td>
            </tr>

            <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 transition-colors cursor-pointer group">
              <td class="p-4" @click.stop>
                <input
                  type="checkbox"
                  :value="category.id"
                  v-model="selectedIds"
                  class="w-[18px] h-[18px] rounded border-gray-300 accent-emerald-500 cursor-pointer"
                >
              </td>
              <td class="p-4 font-semibold text-gray-400">
                #{{ category.id }}
              </td>
              <td>
                <NuxtLink :to="`/admin/categories/${category.id}`" class="text-gray-800 hover:text-gray-900 font-semibold no-underline hover:underline">
                  {{ category.title }}
                </NuxtLink>
              </td>

              <td class="p-4 text-gray-600 text-[13px]">
                <span
                  v-if="category.parent_title && category.parent_title !== 'Без категорії'"
                  class="px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 rounded-md border border-green-100/60"
                >
                  {{ category.parent_title }}
                </span>
                <span v-else class="text-gray-400 italic">
                  Коренева
                </span>
              </td>

              <td class="p-4 text-gray-500 font-mono text-xs">
                {{ category.slug || '-' }}
              </td>

              <td class="p-4 text-center">
                <UDropdownMenu :items="dropdownActions(category)">
                  <button
                    type="button"
                    class="text-gray-400 hover:text-gray-600 text-xl transition-colors inline-block p-1 hover:bg-gray-100 rounded cursor-pointer"
                    @click.stop
                  >
                    <UIcon name="i-heroicons-ellipsis-vertical" />
                  </button>
                </UDropdownMenu>
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
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()

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

const { data: apiData, pending, status, refresh } = await useFetch<any>('http://localhost/api/admin/blog/categories', {
  query: computed(() => ({
    page: page.value,
    per_page: itemsPerPage.value,
    search: search.value
  })),
  watch: [page, itemsPerPage, search],
  lazy: true,
  server: false
})

const categories = computed(() => (apiData.value as any)?.data || [])
const totalPages = computed(() => (apiData.value as any)?.meta?.last_page || 1)
const totalItems = computed(() => (apiData.value as any)?.meta?.total || 0)

watch([search, itemsPerPage], () => {
  page.value = 1
})

const selectedIds = ref<number[]>([])

const selectAll = computed({
  get: () => {
    return categories.value.length > 0 && categories.value.every((c: any) => selectedIds.value.includes(c.id))
  },
  set: (value) => {
    const pageIds = categories.value.map((c: any) => c.id)
    if (value) {
      const newIds = new Set([...selectedIds.value, ...pageIds])
      selectedIds.value = Array.from(newIds)
    } else {
      selectedIds.value = selectedIds.value.filter(id => !pageIds.includes(id))
    }
  }
})

const dropdownActions = (category: any) => [
  [
    {
      label: 'Редагувати',
      icon: 'i-heroicons-pencil-square',
      onSelect: () => {
        router.push(`/admin/categories/edit-${category.id}`)
      }
    },
    {
      label: 'Видалити',
      icon: 'i-heroicons-trash',
      color: 'error' as const,
      onSelect: () => {
        deleteCategory(category.id, category.title)
      }
    }
  ]
]

const deleteCategory = async (id: number, title: string) => {
  if (!confirm(`Ви впевнені, що хочете видалити категорію "${title}"?`)) return

  try {
    await $fetch(`http://localhost/api/admin/blog/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json' // <-- ДОДАЙ ЦЕЙ РЯДОК
      }
    } as any)

    toast.add({
      title: 'Успіх!',
      description: `Категорію "${title}" успішно видалено.`,
      color: 'success',
      icon: 'i-heroicons-trash'
    })
    await refresh()
  } catch (err: any) {
    console.error(err)

    if (!err.response) {
      toast.add({
        title: 'Помилка мережі',
        description: 'Немає відповіді від сервера (Перевірте CORS або підключення).',
        color: 'error',
        icon: 'i-heroicons-signal-slash'
      })
      return
    }

    const serverMessage = err.response?._data?.message || err.data?.message || 'Не вдалося видалити категорію.'

    toast.add({
      title: 'Помилка видалення',
      description: serverMessage,
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle'
    })
  }
}
</script>

<style scoped>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
