<template>
  <!-- Questions buyers ask about this series (config/products.ts → faqFor), as native disclosure rows: keyboard and screen reader work as is.
       The same questions go into the page as FAQPage structured data, so search engines can show them. -->
  <section id="faq" class="fq">
    <div class="fq-top rv"><span>{{ num }}</span><span>Questions</span><span>{{ p.code }}</span></div>
    <div class="fq-row">
      <h2 class="rv">Asked before buying</h2>
      <div class="fq-list">
        <details v-for="(q, i) in list" :key="q[0]" class="rv" :open="i === 0" :style="{ '--d': i * 0.04 + 's' }">
          <summary data-cursor="">{{ q[0] }}<i aria-hidden="true"></i></summary>
          <p>{{ q[1] }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { faqFor, type Product } from '../config/products'

const props = defineProps<{ p: Product; num: string }>()
const list = faqFor(props.p)
let tag: HTMLScriptElement | null = null
onMounted(() => {
  tag = document.createElement('script'); tag.type = 'application/ld+json'
  tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: list.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })
  document.head.appendChild(tag)
})
onUnmounted(() => tag?.remove())
</script>

<style scoped>
.fq { padding: 12vh 2.2vw 10vh; color: #0d2340; }
.fq-top { position: relative; display: grid; grid-template-columns: 8.333vw 1fr auto; gap: 2vw; padding-top: 14px; font-family: var(--font-body); font-size: 13px; letter-spacing: 0.08em; opacity: 0.7; }
.fq-top::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: currentColor; opacity: 0.35; }
.fq-row { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 5vw; margin-top: 6vh; }
.fq-row h2 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(28px, 3vw, 52px); line-height: 1.05; letter-spacing: -0.03em; }
.fq-list { border-top: 1px solid rgba(13, 35, 64, 0.15); }
details { border-bottom: 1px solid rgba(13, 35, 64, 0.15); }
summary { position: relative; display: block; padding: 2.4vh 48px 2.4vh 0; font-family: 'Geist', sans-serif; font-weight: 500; font-size: clamp(17px, 1.25vw, 20px); line-height: 1.4; cursor: pointer; list-style: none; }
summary::-webkit-details-marker { display: none; }
summary i { position: absolute; right: 6px; top: 50%; width: 16px; height: 16px; margin-top: -8px; }
summary i::before, summary i::after { content: ''; position: absolute; left: 0; right: 0; top: 7px; height: 2px; background: #ff6a1a; transition: transform 0.3s ease; }
summary i::after { transform: rotate(90deg); }
details[open] summary i::after { transform: rotate(0deg); }
details p { margin: 0 0 2.6vh; max-width: 40em; font-family: 'Geist', sans-serif; font-size: 16px; line-height: 1.6; opacity: 0.85; }
@media (max-width: 640px) { .fq { padding: 9vh 5vw 6vh; } .fq-top { grid-template-columns: 14vw 1fr auto; } .fq-row { grid-template-columns: 1fr; gap: 4vh; } }
</style>
