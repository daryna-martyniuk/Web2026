import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // State (Ref/Reactive)
  const name = ref('Гість')
  const isLoggedIn = ref(false)
  const loginTime = ref<string | null>(null)

  // Getters (Computed)
  const welcomeMessage = computed(() => `Вітаємо, ${name.value}!`)

  const profileData = ref<any>(null)
  const isLoading = ref(false)

  // Actions (Functions)
  function login(userName: string) {
    name.value = userName
    isLoggedIn.value = true
    loginTime.value = new Date().toLocaleTimeString()
  }

  function logout() {
    name.value = 'Гість'
    isLoggedIn.value = false
    loginTime.value = null
  }

  async function fetchProfile() {
    isLoading.value = true
    try {
      // Приклад запиту через вбудований $fetch
      const response = await $fetch('https://api.github.com/users/octocat')
      profileData.value = response
    } finally {
      isLoading.value = false
    }
  }

  return {
    name,
    isLoggedIn,
    loginTime,
    welcomeMessage,
    login,
    logout
  }
})
