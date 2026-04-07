<script setup lang="ts">
import * as Types from '~~/types'

defineProps<{
  plan: Types.Plan
  isAnnual: boolean
  isCheckoutMode?: boolean
}>()

const formatFeatureText = (text: string) => {
  if (!text) return ''
  return text.replace(/(10,000|50,000|100,000|500|1,000|2,000|FREE)/g, '<strong class="text-gray-800 font-bold">$1</strong>')
}
</script>

<template>
  <div :class="[
    'relative bg-white rounded-2xl w-full p-8 border transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col overflow-hidden',
    !isCheckoutMode ? 'border-gray-100 hover:border-gray-400 cursor-pointer' : 'border-gray-100'
  ]">
    <div class="absolute h-[6px] top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-cyan-400"></div>

    <h2 class="text-2xl font-extrabold text-gray-800 mt-2">
      {{ isAnnual ? plan?.name : plan?.name?.replace(' - Annual', '') }}
    </h2>

    <div class="mt-4 mb-2">
      <span class="bg-gray-100 text-gray-600 text-[13px] font-medium px-3 py-1.5 rounded-md">
        3-days free then:
      </span>
    </div>

    <div class="flex items-baseline gap-1.5 mt-2">
      <span class="text-4xl font-extrabold text-gray-800 tracking-tight">
        ${{ isAnnual ? plan?.price?.toFixed(2) : ((plan?.oldPrice + (plan?.savings || 0)) / 12).toFixed(2) }}
      </span>
      <span class="text-base text-gray-500 font-medium">/month</span>
    </div>

    <div class="h-[24px] mt-1.5">
      <p v-if="isAnnual" class="text-[15px] text-gray-500">
        Billed yearly at
        <del class="text-gray-400 ml-1">${{ (plan?.oldPrice + (plan?.savings || 0))?.toLocaleString('en-US') }}</del>
        <span class="font-semibold text-gray-700 ml-1">${{ plan?.oldPrice?.toLocaleString('en-US') }}</span>
      </p>
      <p v-else class="text-[15px] text-gray-500">
        Billed $<span class="font-semibold text-gray-700">{{ (plan?.oldPrice + (plan?.savings || 0))?.toLocaleString('en-US') }}</span> yearly
      </p>
    </div>

    <div class="mt-4 h-[28px]">
      <span v-if="isAnnual && plan?.savings" class="inline-block bg-green-50 text-green-600 border border-green-100 text-[15px] font-semibold px-2.5 py-0.5 rounded">
        ${{ plan?.savings?.toLocaleString('en-US') }} in savings
      </span>
    </div>

    <NuxtLink
      v-if="!isCheckoutMode"
      :to="`/checkout?planId=${plan?.id}&billing=${isAnnual ? 'annual' : 'monthly'}`"
      class="block text-center w-full mt-6 transition-colors text-gray-900 text-[16px] font-semibold py-3.5 rounded-sm shadow-sm bg-gradient-to-r from-[#ffaf40] to-[#ff9f00] hover:from-[#ff9f00] hover:to-[#ff8f00]"
    >
      Try It Free
    </NuxtLink>

    <hr class="my-7 border-gray-200">

    <ul class="space-y-4 flex-1">
      <li v-for="(feature, idx) in plan?.features" :key="idx" class="flex items-start">
        <iconify-icon icon="mdi:star-four-points" class="text-lime-500 text-xl mt-0.5 mr-3 shrink-0"></iconify-icon>
        <div>
          <p class="text-[14px] font-semibold text-gray-700 leading-tight" v-html="formatFeatureText(feature?.text)"></p>
          <p v-if="feature?.subtext" class="text-[12px] text-gray-400 mt-1">{{ feature.subtext }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
