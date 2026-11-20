<template>
  <!-- What it is used for, the standards it runs and its options, side by side on one screen (each column only when there is data) -->
  <section v-if="p.uses?.length || p.standards?.length || p.options?.length" id="standards" class="pf">
    <div class="pf-top rv"><span>{{ num }}</span><span>Uses and standards</span><span>{{ p.code }}</span></div>
    <div class="pf-row">
      <div v-if="p.uses?.length" class="pf-col rv">
        <h3>Used for</h3>
        <ul class="pf-list"><li v-for="u in p.uses" :key="u">{{ u }}</li></ul>
      </div>
      <div v-if="p.standards?.length" class="pf-col rv" style="--d: 0.06s">
        <h3>Test standards</h3>
        <ul class="pf-tags"><li v-for="s in p.standards" :key="s"><a :href="`/products?std=${encodeURIComponent(stdFamily(s))}`" data-cursor="">{{ s }}</a></li></ul>
        <small>Tell us your standard and clause; we confirm the set-up before you order.</small>
      </div>
      <div v-if="p.options?.length" class="pf-col rv" style="--d: 0.12s">
        <h3>Options and accessories</h3>
        <ul class="pf-list"><li v-for="o in p.options" :key="o">{{ o }}</li></ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { stdFamily, type Product } from '../config/products'
defineProps<{ p: Product; num: string }>()
</script>

<style scoped>
.pf { padding: 12vh 2.2vw 8vh; color: #0d2340; }
.pf-top { position: relative; display: grid; grid-template-columns: 8.333vw 1fr auto; gap: 2vw; padding-top: 14px; font-family: var(--font-body); font-size: 13px; letter-spacing: 0.08em; opacity: 0.7; }
.pf-top::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: currentColor; opacity: 0.35; }
.pf-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 4vw; margin-top: 6vh; }
.pf-col h3 { margin: 0 0 2.4vh; font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 1.9vw, 32px); letter-spacing: -0.03em; }
.pf-list { margin: 0; padding: 0; list-style: none; border-top: 1px solid rgba(13, 35, 64, 0.15); }
.pf-list li { padding: 1.6vh 0 1.6vh 22px; border-bottom: 1px solid rgba(13, 35, 64, 0.15); position: relative; font-family: 'Geist', sans-serif; font-size: 16px; line-height: 1.5; }
.pf-list li::before { content: ''; position: absolute; left: 2px; top: calc(1.6vh + 0.6em); width: 8px; height: 8px; border-radius: 50%; background: #ff6a1a; }
.pf-tags { display: flex; flex-wrap: wrap; gap: 10px; margin: 0; padding: 0; list-style: none; }
.pf-tags a { display: inline-block; padding: 9px 14px; border: 1px solid rgba(13, 35, 64, 0.25); border-radius: 40px; background: rgba(255, 255, 255, 0.55); color: #0d2340; font: 14px 'Geist', sans-serif; text-decoration: none; transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease; }
.pf-tags a:hover { background: #0d2340; border-color: #0d2340; color: #fff; }
.pf-col small { display: block; margin-top: 2.4vh; font-family: 'Geist', sans-serif; font-size: 13px; line-height: 1.5; opacity: 0.6; }
@media (max-width: 640px) { .pf { padding: 9vh 5vw 4vh; } .pf-top { grid-template-columns: 14vw 1fr auto; } .pf-row { gap: 6vh; } }
</style>
