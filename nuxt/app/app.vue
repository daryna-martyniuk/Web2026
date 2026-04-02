<script setup>
useHead({
  script: [
    { src: 'https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js' }
  ],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  htmlAttrs: { lang: 'en' }
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="mr-6">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>

        <nav class="flex gap-6 font-medium text-sm">
          <NuxtLink
            to="/"
            class="text-gray-500 hover:text-gray-900 transition-colors py-4"
            active-class="text-emerald-600 font-bold border-b-2 border-emerald-500"
          >
            Список продуктів
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="text-gray-500 hover:text-gray-900 transition-colors py-4"
            active-class="text-emerald-600 font-bold border-b-2 border-emerald-500"
          >
            Таблиця
          </NuxtLink>
        </nav>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">Built with Nuxt UI • © {{ new Date().getFullYear() }}</p>
      </template>
    </UFooter>
  </UApp>
</template>
