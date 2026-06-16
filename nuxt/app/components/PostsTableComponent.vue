<template>
  <div class="container">
    <div class="flex justify-center">
      <div class="w-full">
        <nav class="navbar bg-gray-100">
          <a href="/admin/blog/posts/create" class="">Додати</a>
        </nav>
        <div class="card">
          <div class="card-body">
            <table class="table table-auto">
              <thead>
              <tr>
                <th>#</th>
                <th>Автор</th>
                <th>Категорія</th>
                <th>Заголовок</th>
                <th>Дата публікації</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="post in posts" :key="post.id">
                <td>{{ post.id }}</td>

                <td>{{ post.author_name || 'Невідомий' }}</td>
                <td>{{ post.category_title || 'Без категорії' }}</td>

                <td>
                  <a :href="'/admin/posts/edit-' + post.id">
                    {{ post.title }}
                  </a>
                </td>

                <td>{{ formatDate(post.date_published) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { data: apiData } = await useFetch<any>('http://localhost/api/admin/blog/posts', {
  lazy: true,
  server: false
})

const posts = computed(() => (apiData.value as any)?.data || [])

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  return dateStr.split(' ')[0]
}
</script>
