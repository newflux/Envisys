<template>
  <!-- PLACEHOLDER: the in-stock chart (standard models ready to ship) is not built yet; this keeps the nav link from landing on the home page. -->
  <PageShell title="In stock" blue v-slot="{ contact }">
    <section class="is">
      <span class="is-l rv">In stock</span>
      <h1 class="is-h rv" style="--d: 0.06s">Standard chambers, ready to ship.</h1>
      <p class="is-p rv" style="--d: 0.12s">The chart of models we keep in stock is being put together. Until it is here, ask us what is ready today.</p>
      <button class="ps-pill rv" style="--d: 0.18s" data-cursor="" @click="contact()"><span>Ask what is in stock</span></button>
    </section>
  </PageShell>
</template>

<script setup lang="ts">
import PageShell from '../components/PageShell.vue'
</script>

<style scoped>
.is { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 3vh; padding: 18vh 5vw 14vh; }
.is-l { font-family: var(--font-body); font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.7; }
.is-h { margin: 0; max-width: 14em; font-weight: 400; font-family: var(--font-display); font-size: clamp(34px, 5vw, 92px); line-height: 1.02; letter-spacing: -0.055em; }
.is-p { margin: 0; max-width: 34em; font-family: var(--font-body); font-size: clamp(16px, 1.2vw, 19px); line-height: 1.6; }
</style>
