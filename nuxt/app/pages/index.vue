<script setup lang="ts">
import * as Types from '~~/types'

useSeoMeta({
  title: 'Pricing Plans | Start Your Free Trial',
  description: 'Choose the perfect plan for your business needs. Try 3 days for free.',
})

const {
  data: plans,
  status,
  error,
  refresh
} = await useLazyFetch<Types.Plan[]>('/api/plans')
</script>

<template>
  <section class="max-w-6xl mx-auto mb-24 mt-12">

    <div class="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
      <h2 class="text-[28px] font-bold text-gray-800 tracking-tight">Start Your 3 Day Free Trial</h2>
      <div class="flex items-center gap-3">
        <div class="text-green-500 text-[13px] font-medium relative pr-4">
          Save up to 20%
          <iconify-icon icon="ph:arrow-arc-right-bold" class="text-xl text-emerald-500 cursor-pointer"></iconify-icon>
        </div>
        <div class="flex bg-gray-100 border border-gray-200 rounded text-[14px]">
          <button class="px-4 py-1.5 text-gray-800 font-medium bg-white shadow-sm rounded border border-gray-100">Annual</button>
          <button class="px-4 py-1.5 text-gray-500 font-medium hover:text-gray-600 transition-colors">Monthly</button>
        </div>
      </div>
    </div>

    <div v-if="error" class="flex flex-col items-center justify-center p-12 bg-red-50 rounded-xl border border-red-100">
      <p class="text-red-500 font-medium mb-4">Something went wrong while loading the plans.</p>
      <button
        @click="refresh()"
        class="px-5 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition-colors"
      >
        Try Again
      </button>
    </div>

    <div v-else-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-stretch">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl w-full p-8 border border-gray-100 shadow-sm animate-pulse flex flex-col h-[500px]">
        <div class="h-1.5 w-full bg-gray-200 absolute top-0 left-0 right-0"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2 mt-1 mb-4"></div>
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div class="h-12 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div class="h-12 bg-gray-200 rounded w-full mb-6"></div>
        <hr class="my-4 border-gray-100">
        <div class="space-y-3">
          <div v-for="j in 5" :key="j" class="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>

    <div v-else-if="plans" class="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-stretch">
      <PricingCard
        v-for="plan in plans"
        :key="plan.id"
        :plan="plan"
      />
    </div>

  </section>
</template>
