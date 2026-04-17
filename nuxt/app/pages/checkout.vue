<script setup lang="ts">
import * as Types from '~~/types'
import { storeToRefs } from 'pinia'

useHead({
  title: 'Checkout',
  script: [
    { src: 'https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js' }
  ]
})

const subscriptionStore = useSubscriptionStore()
const { planId: targetPlanId, isAnnual } = storeToRefs(subscriptionStore)

const router = useRouter()

if (!targetPlanId.value) {
  router.push('/')
}

const { data: allPlans, status: planStatus } = await useFetch<Types.Plan[]>('/api/plans')

const plan = computed(() => {
  if (!allPlans.value) return null
  return allPlans.value.find(p => p.id === targetPlanId.value)
})

const orderTotal = computed(() => {
  if (!plan.value) return 0

  if (isAnnual.value) {
    return plan.value.oldPrice || 0
  } else {
    return ((plan.value.oldPrice || 0) + (plan.value.savings || 0)) / 12
  }
})

const trialEndDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 3)
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
})

const fullPeriodPrice = computed(() => {
  if (!plan.value) return 0
  if (isAnnual.value) return plan.value.oldPrice // Повна сума за рік
  return (plan.value.oldPrice || 0) + (plan.value.savings || 0) // Сума за місяць
})

const form = ref<Types.CheckoutForm>({
  cardNumber: '',
  expiry: '',
  cvc: '',
  fullName: '',
  address: '',
  agreeToTerms: false
})

const errors = ref({
  cardNumber: '',
  expiry: '',
  cvc: ''
})

const isSubmitting = ref(false)

const formatCardNumber = (e: Event) => {
  let val = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  form.value.cardNumber = val.match(/.{1,4}/g)?.join(' ') || val
  errors.value.cardNumber = ''
}

const formatExpiry = (e: Event) => {
  let val = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  if (val.length >= 2) {
    form.value.expiry = val.slice(0, 2) + ' / ' + val.slice(2, 4)
  } else {
    form.value.expiry = val
  }
  errors.value.expiry = ''
}

const formatCVC = (e: Event) => {
  let val = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  form.value.cvc = val.slice(0, 4)
  errors.value.cvc = ''
}

const validateForm = () => {
  let isValid = true

  const cardClean = form.value.cardNumber.replace(/\s/g, '')
  if (cardClean.length < 15) {
    errors.value.cardNumber = 'Invalid card number'
    isValid = false
  }

  const expClean = form.value.expiry.replace(/\s/g, '')
  if (expClean.length < 5 || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expClean)) {
    errors.value.expiry = 'Invalid date'
    isValid = false
  }

  if (form.value.cvc.length < 3) {
    errors.value.cvc = 'Invalid CVC'
    isValid = false
  }

  return isValid
}

const submitOrder = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    await $fetch('/api/subscription/create', {
      method: 'POST',
      body: {
        planId: plan.value?.id,
        planName: plan.value?.name,
        billing: isAnnual.value ? 'annual' : 'monthly',
        customer: form.value
      }
    })
    alert('Success! Data sent to the server.')
  } catch (error) {
    alert('An error occurred during submission.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white pb-20">
    <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#84cc16" />
          <stop offset="100%" stop-color="#a3e635" />
        </linearGradient>
      </defs>
    </svg>

    <header class="bg-[#333333] text-white text-center py-4 font-bold text-xl">
      Checkout
    </header>

    <div class="max-w-[1000px] mx-auto px-4 mt-8">
      <NuxtLink to="/" class="text-gray-500 hover:text-gray-800 mb-6 inline-block text-sm">&lt;&lt; back</NuxtLink>

      <h1 class="text-2xl font-bold text-gray-900 mb-3 tracking-tight">You're Almost In - Start Your 3-Day Free Trial Now!</h1>
      <p class="text-gray-600 mb-10 text-base">Set up your account to gain instant access! You won't be charged if you decide to cancel within 3 days</p>

      <div v-if="planStatus === 'pending'" class="text-center py-10 text-emerald-500 font-medium animate-pulse">
        Loading...
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-8 items-start">

        <PricingCard v-if="plan" :plan="plan" :isCheckoutMode="true" :isAnnual="isAnnual" />

        <div class="bg-[#fcfcfc] rounded-xl border border-gray-200 p-8 shadow-sm">
          <h3 class="font-bold text-gray-900 mb-6 text-lg">Order Summary</h3>

          <div class="space-y-4 text-sm">
            <div class="flex justify-between text-gray-700 border-b border-gray-200 pb-4">
              <span>{{ isAnnual ? 'Annual Plan' : 'Monthly Plan' }}</span>
              <span>${{ orderTotal?.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between text-gray-700">
              <span>Total Due <span class=" text-xs">(*not including sales tax where applicable)</span></span>
              <span>${{ orderTotal?.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between font-bold text-gray-900 pt-3 pb-4">
              <span>Due Today</span>
              <span>$0.00</span>
            </div>
          </div>

          <div class="bg-gray-100 text-center py-3.5 rounded-md text-gray-600 text-sm font-medium mb-10">
            Includes 3-Day Free Trial
          </div>

          <div class="flex items-center gap-1.5 mb-6">
            <h3 class="font-bold text-gray-900 text-lg">Billing Information</h3>
            <a href="#" @click.prevent class="text-gray-400 hover:text-gray-700 transition-colors flex items-center mt-0.5">
              <iconify-icon icon="ph:info" class="text-xl"></iconify-icon>
            </a>
          </div>

          <form @submit.prevent="submitOrder">

            <div class="mb-6">
              <label class="block text-sm text-gray-600 mb-2 font-medium">Card Details</label>
              <div
                class="flex items-center border rounded-md bg-gray-50 px-3 py-3 transition-all"
                :class="(errors.cardNumber || errors.expiry || errors.cvc) ? 'border-red-300 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-200' : 'border-gray-200 focus-within:border-gray-300 focus-within:ring-1 focus-within:ring-gray-200'"
              >
                <iconify-icon icon="ph:credit-card" class="text-gray-400 text-2xl mr-2 shrink-0" :class="{'text-red-400': errors.cardNumber}"></iconify-icon>
                <input
                  v-model="form.cardNumber"
                  @input="formatCardNumber"
                  type="text"
                  placeholder="Number"
                  maxlength="19"
                  class="w-full bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
                  required
                >
                <input
                  v-model="form.expiry"
                  @input="formatExpiry"
                  type="text"
                  placeholder="MM / YY"
                  maxlength="7"
                  class="w-20 bg-transparent outline-none text-sm text-gray-900 text-center placeholder-gray-400 shrink-0 mx-2"
                  required
                >
                <input
                  v-model="form.cvc"
                  @input="formatCVC"
                  type="text"
                  placeholder="CVC"
                  maxlength="4"
                  class="w-16 bg-transparent outline-none text-sm text-gray-900 text-center placeholder-gray-400 shrink-0"
                  required
                >
              </div>

              <div v-if="errors.cardNumber || errors.expiry || errors.cvc" class="flex gap-4 mt-1.5 text-[11px] text-red-500 font-medium px-1">
                <span v-if="errors.cardNumber">• {{ errors.cardNumber }}</span>
                <span v-if="errors.expiry">• {{ errors.expiry }}</span>
                <span v-if="errors.cvc">• {{ errors.cvc }}</span>
              </div>
            </div>

            <div class="mb-8">
              <label class="block text-sm text-gray-600 mb-2 font-medium">Address</label>
              <div class="border border-gray-200 rounded-md bg-gray-50 p-4 transition-all">

                <div class="mb-4">
                  <label class="block text-[13px] text-gray-600 font-medium mb-1.5">Full name</label>
                  <input v-model="form.fullName" type="text" class="w-full bg-white border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-all shadow-sm" required>
                </div>

                <div>
                  <label class="block text-[13px] text-gray-600 font-medium mb-1.5">Address</label>
                  <input v-model="form.address" type="text" class="w-full bg-white border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-all shadow-sm" required>
                </div>

              </div>
            </div>

            <label class="flex items-start mb-8 cursor-pointer group">
              <input v-model="form.agreeToTerms" type="checkbox" class="mt-1 mr-3 w-4 h-4 text-gray-800 rounded border-gray-300 focus:ring-gray-800" required>
              <span class="text-[13px] text-gray-600 leading-relaxed">
                I consent to <a href="#" @click.prevent class="text-gray-900 font-bold underline underline-offset-2 hover:text-black">Terms of Use</a> and understand my 3-day free trial will automatically convert to ${{ fullPeriodPrice?.toFixed(2) }} per {{ isAnnual ? 'year' : 'month' }} starting on {{ trialEndDate }}. The {{ isAnnual ? 'yearly' : 'monthly' }} fee will be automatically charged each {{ isAnnual ? 'year' : 'month' }} going forward unless I cancel my account at least one (1) business day before the end of the current billing period, which can be done by calling (888) 463-3163.
              </span>
            </label>

            <button
              type="submit"
              :disabled="!form.agreeToTerms || isSubmitting"
              class="w-[140px] font-bold py-3 px-6 rounded transition-all"
              :class="form.agreeToTerms && !isSubmitting ? 'bg-gray-200 text-gray-900 hover:bg-gray-300 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
            >
              {{ isSubmitting ? 'Processing...' : 'Try It Free' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
