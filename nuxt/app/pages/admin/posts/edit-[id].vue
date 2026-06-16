<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'

const route = useRoute()
const router = useRouter()
const postId = route.params.id
const toast = useToast()

const { data: postResponse, pending: postPending } = await useFetch<any>(`http://localhost/api/admin/blog/posts/${postId}`, {
  lazy: true,
  server: false
})

const categories = ref<{ value: number; label: string }[]>([])
const authors = ref<{ value: number; label: string }[]>([])

const loadCategories = async () => {
  try {
    const res: any = await $fetch('http://localhost/api/admin/blog/categories/all-list')
    const dataArray = Array.isArray(res) ? res : (res?.data || [])

    categories.value = dataArray.map((item: any) => ({
      value: Number(item.id),
      label: String(item.id_title)
    }))
  } catch (error) {
    console.error(error)
  }
}

const loadAuthors = async () => {
  try {
    const res: any = await $fetch('http://localhost/api/admin/blog/posts/authors-list')
    const dataArray = Array.isArray(res) ? res : (res?.data || [])

    authors.value = dataArray.map((item: any) => ({
      value: Number(item.id),
      label: String(item.name)
    }))
  } catch (error) {
    console.error(error)
  }
}

loadCategories()
loadAuthors()

const schema = z.object({
  title: z.string().min(3, 'Заголовок має містити мінімум 3 символи'),
  slug: z.string().max(200, 'Слаг не може бути довшим за 200 символів').optional(),
  content_raw: z.string().min(10, 'Текст статті повинен бути не коротшим за 10 символів'),
  category_id: z.number({ message: 'Обов\'язково оберіть категорію' }).min(1, 'Обов\'язково оберіть категорію'),
  user_id: z.number({ message: 'Обов\'язково оберіть автора' }).min(1, 'Обов\'язково оберіть автора'),
  is_published: z.boolean()
})

const state = ref({
  title: '',
  slug: '',
  content_raw: '',
  category_id: undefined as number | undefined,
  user_id: undefined as number | undefined,
  is_published: false
})

watch(() => postResponse.value, (newVal) => {
  if (!newVal) return
  const data = newVal.data || newVal

  state.value.title = data.title || ''
  state.value.slug = data.slug || ''
  state.value.content_raw = data.content_raw || ''
  state.value.category_id = data.category_id ? Number(data.category_id) : undefined
  state.value.user_id = data.user_id ? Number(data.user_id) : undefined
  state.value.is_published = Boolean(data.is_published)
}, { immediate: true, deep: true })

const slugify = (text: string) => {
  const ukr = "а б в г ґ д е є ж з и і ї й к л м н о п р с т у ф х ц ч ш щ ь ю я е і".split(" ");
  const lat = "a b v h g d e ye zh z y i yi y k l m n o p r s t u f kh ts ch sh sch _ yu ya e i".split(" ");

  let res = text.toLowerCase().trim();
  ukr.forEach((char, index) => {
    res = res.replaceAll(char, lat[index] || '');
  });

  return res
    .replace(/[^a-z0-9_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const isSaving = ref(false)

const onSubmit = async () => {
  isSaving.value = true
  try {
    const generatedHtml = state.value.content_raw.replace(/\n/g, '<br>')

    let finalSlug = state.value.slug.trim()
    if (!finalSlug) {
      finalSlug = slugify(state.value.title)
    }

    await $fetch(`http://localhost/api/admin/blog/posts/${postId}`, {
      method: 'PUT',
      body: {
        title: state.value.title,
        slug: finalSlug,
        content_raw: state.value.content_raw,
        content_html: generatedHtml,
        category_id: state.value.category_id,
        user_id: state.value.user_id,
        is_published: state.value.is_published,
      }
    })

    toast.add({
      title: 'Успіх!',
      description: 'Статтю успішно оновлено.',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })

    await router.push(`/admin/posts/blog-posts-ui`)
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

<template>
  <div class="max-w-3xl mx-auto my-12 px-4">
    <div class="mb-6">
      <NuxtLink to="/admin/posts/blog-posts-ui" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
        ← Відмінити та повернутися
      </NuxtLink>
    </div>

    <div class="relative bg-white rounded-2xl w-full p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col overflow-hidden">
      <div class="absolute h-[6px] top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-cyan-400"></div>

      <h2 class="text-2xl font-extrabold text-gray-800 mt-2">
        Редагування статті #{{ postId }}
      </h2>

      <hr class="my-7 border-gray-200">

      <div v-if="postPending" class="flex flex-col items-center py-12 text-gray-400">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
        <p class="text-[14px] font-semibold text-gray-700">Завантаження даних...</p>
      </div>

      <UForm :schema="schema" :state="state" class="flex-1 flex flex-col space-y-5" @submit="onSubmit">
        <UFormField label="Заголовок статті" name="title">
          <UInput v-model="state.title" placeholder="Введіть назву..." class="w-full" />
        </UFormField>

        <UFormField label="Слаг" name="slug" class="mb-4">
          <div class="flex rounded-md shadow-sm">
            <input
              v-model="state.slug"
              type="text"
              placeholder="автогенерація якщо порожньо..."
              class="flex-1 block w-full min-w-0 px-3 py-2 rounded-none rounded-r-md border border-gray-200 outline-none focus:border-emerald-500 transition-colors text-sm text-gray-600"
            >
          </div>
        </UFormField>

        <UFormField label="Категорія" name="category_id">
          <USelectMenu
            v-model="state.category_id"
            :items="categories"
            value-key="value"
            label-key="label"
            placeholder="Оберіть категорію..."
            class="w-full"
          />
        </UFormField>

        <UFormField label="Автор статті" name="user_id">
          <USelectMenu
            v-model="state.user_id"
            :items="authors"
            value-key="value"
            label-key="label"
            placeholder="Оберіть автора..."
            class="w-full"
          />
        </UFormField>

        <UFormField label="Вміст статті" name="content_raw">
          <UTextarea v-model="state.content_raw" :rows="12" placeholder="Напишіть щось цікаве..." class="w-full font-mono text-sm" />
        </UFormField>

        <UFormField name="is_published">
          <div class="flex items-center gap-3 mt-2 bg-gray-50 px-4 py-3 rounded-md border border-gray-100">
            <UCheckbox v-model="state.is_published" id="is_published" color="primary" />
            <label for="is_published" class="text-[14px] font-semibold text-gray-700 cursor-pointer select-none leading-tight">
              Опублікувати статтю
              <span class="block text-[12px] text-gray-400 mt-0.5 font-normal">Зробити статтю доступною для всіх користувачів</span>
            </label>
          </div>
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
