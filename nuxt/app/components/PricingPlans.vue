<script setup lang="ts">
const { data: plans, status } = await useLazyFetch<Plan[]>('/api/plans')

const formatFeatureText = (text: string) => {
  if (!text) return ''
  return text.replace(/(10,000|50,000|100,000|500|1,000|2,000|FREE)/g, '<strong class="text-gray-800 font-bold">$1</strong>')
}
</script>

<template>
  <section class="max-w-6xl mx-auto mb-24">
    <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#84cc16" />
          <stop offset="100%" stop-color="#a3e635" />
        </linearGradient>
      </defs>
    </svg>

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

    <div v-if="status === 'pending'" class="flex justify-center items-center py-20">
      <p class="text-lg text-emerald-500 font-medium animate-pulse">Завантаження тарифів...</p>
    </div>

    <div v-else-if="plans" class="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-stretch">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="relative bg-white rounded-xl w-full p-8 border-x border-b border-t-0 border-gray-100 transition-all duration-300 hover:border-gray-300 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:shadow-[0_10px_40px_rgb(0,0,0,0.06)] cursor-pointer overflow-hidden flex flex-col"
      >
        <div class="absolute h-[6px] top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-cyan-400"></div>

        <h3 class="text-xl font-bold text-gray-800 mt-1">{{ plan.name }}</h3>

        <div class="mt-4 mb-3">
          <span class="bg-gray-100 text-gray-500 text-[13px] font-medium px-2 py-1 rounded-sm">
            3-days free then:
          </span>
        </div>

        <div class="flex items-baseline gap-1 mt-4">
          <span class="text-[44px] font-bold text-gray-800 tracking-tight leading-none">${{ plan.price.toFixed(2) }}</span>
          <span class="text-[14px] text-gray-400 font-medium">/month</span>
        </div>

        <p class="text-[13px] text-gray-500 mt-3 billed-info">
          billed yearly at <del class="text-gray-400">${{ (plan.oldPrice + plan.savings).toLocaleString('en-US') }}</del>
          <span class="font-bold text-gray-600">${{ plan.oldPrice.toLocaleString('en-US') }}</span>
        </p>

        <div class="mt-3">
          <span class="inline-block bg-green-50 text-green-600 border border-green-100 text-[13px] font-semibold px-2.5 py-0.5 rounded">
            ${{ plan.savings.toLocaleString('en-US') }} in savings
          </span>
        </div>

        <button class="cursor-pointer w-full mt-6 transition-colors text-gray-900 text-[15px] font-bold py-3 rounded-md shadow-sm bg-gradient-to-r from-[#ffaf40] to-[#ff9f00] hover:from-[#ff9f00] hover:to-[#ff8f00]">
          Try It Free
        </button>

        <hr class="my-4 border-gray-200">
        <ul class="mt-4 space-y-3.5 flex-1">
          <li v-for="(feature, idx) in plan.features" :key="idx" class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mt-0.5 mr-3 shrink-0" viewBox="0 0 24 24">
              <path fill="url(#starGradient)" d="M12 1L9 9l-8 3l8 3l3 8l3-8l8-3l-8-3z"/>
            </svg>
            <div>
              <p class="text-[13.5px] text-gray-600 leading-snug" v-html="formatFeatureText(feature.text)"></p>
              <p v-if="feature.subtext" class="text-[12px] text-gray-400 mt-0.5">{{ feature.subtext }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
