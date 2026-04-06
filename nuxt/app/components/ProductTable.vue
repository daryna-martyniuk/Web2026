<script setup lang="ts">
import * as Types from '~~/types'

const { data: productsData, status } = await useLazyFetch<Types.ProductsResponse>('https://dummyjson.com/products?limit=30')
const products = computed<Types.Product[]>(() => productsData.value?.products || [])

const search = ref('')
const page = ref(1)
const itemsPerPage = ref(5)
const sortCol = ref('title')
const sortDir = ref<'asc' | 'desc'>('asc')

const sortBy = (col: string) => {
  if (sortCol.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = col
    sortDir.value = 'asc'
  }
}

const filteredRows = computed(() => {
  if (!search.value) return products.value
  const q = search.value.toLowerCase()
  return products.value.filter((p: Types.Product) =>
    p.title.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.brand && p.brand.toLowerCase().includes(q))
  )
})

const sortedRows = computed(() => {
  return [...filteredRows.value].sort((a: Types.Product, b: Types.Product) => {
    let aVal = a[sortCol.value]
    let bVal = b[sortCol.value]

    if (aVal === undefined) aVal = ''
    if (bVal === undefined) bVal = ''

    if (aVal === bVal) return 0
    if (sortDir.value === 'asc') return aVal > bVal ? 1 : -1
    return aVal < bVal ? 1 : -1
  })
})

const totalPages = computed(() => Math.ceil(sortedRows.value.length / itemsPerPage.value))

const paginatedRows = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedRows.value.slice(start, end)
})

watch([search, itemsPerPage], () => {
  page.value = 1
})

const selectedIds = ref<number[]>([])

const selectAll = computed({
  get: () => {
    return paginatedRows.value.length > 0 && paginatedRows.value.every(p => selectedIds.value.includes(p.id))
  },
  set: (value) => {
    const pageIds = paginatedRows.value.map(p => p.id)
    if (value) {
      const newIds = new Set([...selectedIds.value, ...pageIds])
      selectedIds.value = Array.from(newIds)
    } else {
      selectedIds.value = selectedIds.value.filter(id => !pageIds.includes(id))
    }
  }
})
</script>

<template>
  <section class="max-w-[1200px] mx-auto pb-20">
    <h2 class="text-[28px] font-bold text-gray-800 tracking-tight">Product Table</h2>

    <div v-if="status === 'pending'" class="flex flex-col justify-center items-center py-32 bg-white rounded-xl border border-gray-200 mt-4 shadow-sm">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-4"></div>
      <p class="text-gray-500 font-medium">Products loading...</p>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-4 text-sm font-normal text-gray-500 mt-4">
        <div>{{ selectedIds.length }} selected</div>

        <div class="flex items-center gap-6">
          <input
            v-model="search"
            type="text"
            placeholder="Search..."
            class="w-48 pl-3 pr-4 py-1.5 bg-white border border-gray-200 rounded-md outline-none focus:border-emerald-500 transition-colors shadow-sm"
          >
          <button class="flex items-center gap-2 text-gray-900 font-semibold hover:text-gray-700 transition-colors">
            <iconify-icon icon="heroicons:bars-3-bottom-left" class="text-lg"></iconify-icon>
            Sort by
          </button>
          <button class="flex items-center gap-2 text-gray-900 font-semibold hover:text-gray-700 transition-colors">
            <iconify-icon icon="heroicons:ellipsis-vertical" class="text-xl"></iconify-icon>
            Actions
          </button>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
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
              <th class="p-4 font-normal">Фото</th>
              <th class="p-4 font-normal cursor-pointer hover:text-gray-800" @click="sortBy('title')">Назва</th>
              <th class="p-4 font-normal">Опис</th>
              <th class="p-4 font-normal cursor-pointer hover:text-gray-800" @click="sortBy('category')">Категорія</th>
              <th class="p-4 font-normal cursor-pointer hover:text-gray-800" @click="sortBy('brand')">Бренд</th>
              <th class="p-4 font-normal text-right cursor-pointer hover:text-gray-800" @click="sortBy('price')">Ціна</th>
              <th class="p-4 font-normal text-center cursor-pointer hover:text-gray-800" @click="sortBy('rating')">Оцінка</th>
              <th class="p-4 font-normal w-12 text-center"></th>
            </tr>
            </thead>

            <tbody class="text-gray-700 divide-y divide-gray-100">
            <tr v-for="product in paginatedRows" :key="product.id" class="hover:bg-gray-50 transition-colors cursor-pointer group">
              <td class="p-4">
                <input
                  type="checkbox"
                  :value="product.id"
                  v-model="selectedIds"
                  class="w-[18px] h-[18px] rounded border-gray-300 accent-emerald-500 cursor-pointer"
                >
              </td>
              <td class="p-4">
                <img :src="product.thumbnail" class="w-[60px] h-[60px] min-w-[60px] object-cover rounded border border-gray-100 bg-white" alt="Thumb" />
              </td>
              <td class="p-4 font-semibold text-gray-900 whitespace-normal min-w-[120px]">
                {{ product.title }}
              </td>
              <td class="p-4 whitespace-normal">
                <p class="text-xs text-gray-500 line-clamp-2 min-w-[200px] max-w-[250px]">{{ product.description }}</p>
              </td>
              <td class="p-4 text-gray-600 text-[13px]">
                {{ product.category }}
              </td>
              <td class="p-4 text-gray-600 text-[13px] whitespace-normal min-w-[100px]">
                {{ product.brand || '—' }}
              </td>
              <td class="p-4 text-right text-gray-800 text-base">
                ${{ product.price }}
              </td>
              <td class="p-4 text-center text-base">
                  <span :class="product.rating < 4.5 ? 'text-red-500' : 'text-emerald-500'">
                    {{ product.rating }}
                  </span>
              </td>
              <td class="p-4 text-center">
                <button class="text-gray-400 hover:text-gray-800 text-xl transition-colors">
                  <iconify-icon icon="heroicons:ellipsis-vertical"></iconify-icon>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white border-t border-gray-200 p-4 flex justify-between items-center text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <span>Show</span>
            <input
              v-model.number="itemsPerPage"
              type="number"
              class="w-10 h-8 border border-gray-200 rounded text-center text-gray-800 font-semibold outline-none focus:border-emerald-500 transition-colors"
            >
            <span>of {{ filteredRows.length }} results</span>
          </div>

          <div class="flex items-center gap-2">
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
