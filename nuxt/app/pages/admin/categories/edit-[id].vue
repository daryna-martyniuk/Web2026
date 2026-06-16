<template>
  <div class="max-w-3xl mx-auto my-12 px-4">
    <div class="mb-6">
      <NuxtLink to="/admin/categories" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
        ← Скасувати та повернутися
      </NuxtLink>
    </div>

    <div class="relative bg-white rounded-2xl w-full p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col overflow-hidden">
      <div class="absolute h-[6px] top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-cyan-400"></div>

      <h2 class="text-2xl font-extrabold text-gray-800 mt-2">
        Редагування категорії #{{ categoryId }}
      </h2>

      <hr class="my-7 border-gray-200">

      <div v-if="pending" class="flex flex-col items-center py-12 text-gray-400">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
        <p class="text-[14px] font-semibold text-gray-700">Завантаження даних категорії...</p>
      </div>

      <UForm v-else :schema="schema" :state="state" class="flex-1 flex flex-col space-y-5" @submit="onSubmit">
        <UFormField label="Назва категорії" name="title">
          <UInput v-model="state.title" placeholder="Введіть назву..." class="w-full" />
        </UFormField>

        <UFormField label="Слаг" name="slug" class="mb-4">
          <div class="flex rounded-md shadow-sm">
            <input
              v-model="state.slug"
              type="text"
              placeholder="автогенерація якщо порожньо..."
              class="flex-1 block w-full min-w-0 px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-emerald-500 transition-colors text-sm text-gray-600"
            >
          </div>
        </UFormField>

        <UFormField label="Батьківська категорія" name="parent_id">
          <USelectMenu
            v-model="state.parent_id"
            :items="parentCategories"
            value-key="value"
            label-key="label"
            placeholder="Оберіть батьківську категорію..."
            class="w-full"
            clearable
          />
        </UFormField>

        <UFormField label="Опис категорії (необов'язково)" name="description">
          <UTextarea v-model="state.description" :rows="4" placeholder="Короткий опис..." class="w-full text-sm" />
        </UFormField>

        <button
          type="submit"
          :disabled="isSaving"
          class="block text-center cursor-pointer w-full mt-6 transition-colors text-gray-900 text-[16px] font-semibold py-3.5 rounded-sm shadow-sm bg-gradient-to-r from-[#ffaf40] to-[#ff9f00] hover:from-[#ff9f00] hover:to-[#ff8f00] disabled:opacity-70"
        >
          {{ isSaving ? 'Збереження...' : 'Зберегти зміни' }}
        </button>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const categoryId = route.params.id

const { data: categoryResponse, pending } = await useFetch<any>(`http://localhost/api/admin/blog/categories/${categoryId}`, {
  server: false
})

const parentCategories = ref<{ value: number; label: string }[]>([])

const loadParentCategories = async () => {
  try {
    const res: any = await $fetch('http://localhost/api/admin/blog/categories/all-list')
    const dataArray = Array.isArray(res) ? res : (res?.data || res)

    parentCategories.value = dataArray.map((item: any) => ({
      value: Number(item.id),
      label: String(item.id_title || item.title)
    }))
  } catch (error) {
    console.error(error)
  }
}
loadParentCategories()

const schema = z.object({
  title: z.string().min(5, 'Назва має містити мінімум 5 символів'),
  slug: z.string().max(200, 'Максимум 200 символів').optional(),
  parent_id: z.number({ message: 'Обов\'язково оберіть батьківську категорію' }),
  description: z.string().optional().refine(val => !val || val.length >= 3, {
    message: 'Опис має містити мінімум 3 символи, якщо він заповнений'
  })
})

const state = ref({
  title: '',
  slug: '',
  parent_id: undefined as number | undefined,
  description: ''
})

watch(() => categoryResponse.value, (newVal) => {
  if (!newVal) return
  const data = newVal.data || newVal
  state.value.title = data.title || ''
  state.value.slug = data.slug || ''
  state.value.parent_id = data.parent_id ? Number(data.parent_id) : undefined
  state.value.description = data.description || ''
}, { immediate: true })

const isSaving = ref(false)

const onSubmit = async () => {
  isSaving.value = true

  const payload: any = {
    title: state.value.title,
    slug: state.value.slug,
    parent_id: state.value.parent_id
  }

  if (state.value.description && state.value.description.trim() !== '') {
    payload.description = state.value.description
  }

  try {
    await $fetch(`http://localhost/api/admin/blog/categories/${categoryId}`, {
      method: 'PUT',
      body: payload
    })

    toast.add({
      title: 'Успіх!',
      description: 'Категорію успішно оновлено.',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
    await router.push('/admin/categories')
  } catch (err: any) {
    console.error('Повна помилка запиту:', err)

    if (!err.response) {
      toast.add({
        title: 'Помилка мережі',
        description: 'Сервер не відповідає. Можливо, виникла помилка CORS або Laravel вимкнено.',
        color: 'error',
        icon: 'i-heroicons-signal-slash'
      })
      return
    }

    const validationErrors = err.response?._data?.errors
    if (validationErrors) {
      const allErrors = Object.values(validationErrors).flat().join('\n')

      toast.add({
        title: 'Помилка валідації Laravel',
        description: allErrors,
        color: 'error',
        icon: 'i-heroicons-exclamation-triangle'
      })
      return
    }

    const errorMessage = err.response?._data?.message || 'Виникла невідома помилка при збереженні.'
    toast.add({
      title: 'Помилка сервера',
      description: errorMessage,
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })

  } finally {
    isSaving.value = false
  }
}
</script>
