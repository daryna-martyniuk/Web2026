<script setup lang="ts">
import * as Types from '~~/types'
import { storeToRefs } from 'pinia'

const subscriptionStore = useSubscriptionStore()
const { isAnnual } = storeToRefs(subscriptionStore)

const { data: plans, status } = await useLazyFetch<Types.Plan[]>('/api/plans')
</script>

<template>
  <section class="max-w-6xl mx-auto mb-24">
    <div class="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
      <h2 class="text-[28px] font-bold text-gray-800 tracking-tight">Start Your 3 Day Free Trial</h2>

      <div class="flex items-center gap-3">
        <div class="text-green-500 text-[13px] font-medium relative pr-4">
          Save up to 20%
          <iconify-icon icon="ph:arrow-arc-right-bold" class="text-xl text-emerald-500 cursor-pointer"></iconify-icon>
        </div>

        <div class="flex bg-gray-100 border border-gray-200 rounded text-[14px]">
          <button
            @click="subscriptionStore.setBilling(true)"
            :class="['px-4 py-1.5 font-medium rounded transition-colors', isAnnual ? 'text-gray-800 bg-white shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-600']"
          >
            Annual
          </button>

          <button
            @click="subscriptionStore.setBilling(false)"
            :class="['px-4 py-1.5 font-medium rounded transition-colors', !isAnnual ? 'text-gray-800 bg-white shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-600']"
          >
            Monthly
          </button>
        </div>
      </div>
    </div>

    <div v-if="status === 'pending'" class="flex justify-center items-center py-20">
      <p class="text-lg text-emerald-500 font-medium animate-pulse">Plan loading...</p>
    </div>

    <div v-else-if="plans" class="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-stretch">

      <PricingCard
        v-for="plan in plans"
        :key="plan.id"
        :plan="plan"
        :isAnnual="isAnnual"
      />

    </div>
  </section>
</template>
