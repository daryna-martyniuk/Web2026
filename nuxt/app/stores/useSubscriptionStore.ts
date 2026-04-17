import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore('subscription', () => {
  const planId = useCookie<number | null>('planId', { default: () => null })
  const isAnnual = useCookie<boolean>('isAnnual', { default: () => true })

  function setSubscription(id: number, annual: boolean) {
    planId.value = id
    isAnnual.value = annual
  }

  function setBilling(annual: boolean) {
    isAnnual.value = annual
  }

  return { planId,
    isAnnual,
    setSubscription,
    setBilling
  }
})
