<template>
  <!-- The specification of one product, as a glass sheet over the page. Close with the button, Esc, or a click outside. -->
  <Teleport to="body">
    <Transition name="sh" :duration="{ enter: 700, leave: 240 }">
      <div v-if="product" class="sh" role="dialog" :aria-label="`${product.name} specification`" @keydown.esc="$emit('close')" tabindex="-1" ref="root">
        <div class="sh-scrim" @click="$emit('close')"></div>
        <article class="sh-card">
          <button class="sh-x" aria-label="Close" data-cursor="" @click="$emit('close')"><svg viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.2" fill="none" /></svg></button>

          <div class="sh-vis">
            <Transition name="fade" mode="out-in">
              <img :key="pic" :src="pic === 0 ? img(product, 'hero') : img(product, `g${pic}`)" :alt="product.name" />
            </Transition>
            <div v-if="product.gallery" class="sh-th">
              <button v-for="n in product.gallery + 1" :key="n" :class="{ on: pic === n - 1 }" data-cursor="" @click="pic = n - 1" :aria-label="`View ${n}`">
                <img :src="n === 1 ? img(product, 'hero') : img(product, `g${n - 1}`)" alt="" loading="lazy" />
              </button>
            </div>
          </div>

          <div class="sh-tx" data-lenis-prevent>
            <span class="sh-k">{{ product.code }} · {{ product.group }}</span>
            <h2>{{ product.name }}</h2>
            <p class="sh-tag">{{ product.tagline }}</p>
            <p class="sh-in">{{ product.intro }}</p>
            <dl v-if="product.specs.length">
              <div v-for="s in product.specs" :key="s[0]"><dt>{{ s[0] }}</dt><dd>{{ s[1] }}</dd></div>
            </dl>
            <ul v-if="product.features.length">
              <li v-for="f in product.features" :key="f">{{ f }}</li>
            </ul>
            <div v-for="m in product.models" :key="m.label" class="sh-m">
              <span>{{ m.label }}</span>
              <div><i v-for="it in m.items" :key="it">{{ it }}</i></div>
            </div>
            <div class="sh-act">
              <button class="ps-pill" data-cursor="" @click="$emit('quote')"><span>Get a quote</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
              <a v-if="product.brochure" :href="product.brochure" target="_blank" rel="noopener" data-cursor="">Brochure ↗</a>
              <a :href="`/products/${product.slug}`" data-cursor="">Full page →</a>
            </div>
          </div>
        </article>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { img, type Product } from '../config/products'

const props = defineProps<{ product: Product | null }>()
defineEmits<{ (e: 'close'): void; (e: 'quote'): void }>()
const pic = ref(0)
const root = ref<HTMLElement | null>(null)
watch(() => props.product, async (p) => {
  const l = (window as any).lenisInstance
  pic.value = 0
  if (p) { l?.stop(); await nextTick(); root.value?.focus() } else l?.start()
})
</script>

<style scoped>
.sh { --ink: #0a0a0c; position: fixed; inset: 0; z-index: 2500; display: grid; place-items: center; outline: none; }
.sh-scrim { position: absolute; inset: 0; background: rgba(3, 5, 8, 0.62); backdrop-filter: blur(16px) saturate(1.2); -webkit-backdrop-filter: blur(16px) saturate(1.2); }
.sh-card { position: relative; width: min(1180px, 92vw); height: min(760px, 86vh); display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); border-radius: 26px; overflow: hidden; color: #eef2f7; background: linear-gradient(145deg, rgba(30, 33, 40, 0.86), rgba(12, 14, 18, 0.9)); border: 1px solid rgba(255, 255, 255, 0.14); border-top-color: rgba(255, 255, 255, 0.3); box-shadow: 0 50px 120px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.16) inset;  }
.sh-x { position: absolute; right: 18px; top: 18px; z-index: 2; width: 36px; height: 36px; display: grid; place-items: center; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 50%; background: rgba(255, 255, 255, 0.08); color: inherit; cursor: pointer; transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1), background 0.3s ease; }
.sh-x:hover { transform: rotate(90deg); background: #fff; color: #0a0a0c; }
.sh-x svg { width: 10px; height: 10px; }
.sh-vis { position: relative; min-height: 0; display: grid; grid-template-rows: minmax(0, 1fr); place-items: center; padding: 6vh 3vw 14vh; background: radial-gradient(60% 50% at 50% 45%, rgba(200, 220, 245, 0.16), transparent 70%), linear-gradient(180deg, #11151b, #070a0e); }
.sh-vis > img { min-height: 0; max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 30px 30px rgba(0, 0, 0, 0.6)); }
.sh-th { z-index: 2; position: absolute; left: 50%; bottom: 3vh; translate: -50% 0; display: flex; gap: 6px; padding: 6px; border-radius: 14px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.16); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
.sh-th button { width: 52px; height: 52px; padding: 5px; border: 1px solid transparent; border-radius: 9px; background: transparent; cursor: pointer; transition: background 0.3s ease, border-color 0.3s ease; }
.sh-th button:hover { background: rgba(255, 255, 255, 0.16); }
.sh-th button.on { background: rgba(255, 255, 255, 0.2); border-color: rgba(255, 255, 255, 0.6); }
.sh-th img { width: 100%; height: 100%; object-fit: contain; }
.sh-tx { min-width: 0; overflow-wrap: anywhere; scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.28) transparent; overflow-y: auto; padding: 7vh 3.4vw 5vh; display: flex; flex-direction: column; gap: 2vh; overscroll-behavior: contain; }
.sh-k { font-family: var(--font-body); font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.5; }
.sh-tx h2 { margin: 0; font-weight: 400; font-family: var(--font-display); font-size: clamp(24px, 2.4vw, 42px); line-height: 1; letter-spacing: -0.05em; }
.sh-tag { margin: 0; font-family: var(--font-display); font-size: clamp(13px, 1vw, 17px); letter-spacing: -0.035em; opacity: 0.55; }
.sh-in { margin: 0; font-family: var(--font-body); font-size: 12px; line-height: 1.7; opacity: 0.78; }
.sh-tx dl { margin: 0; border-top: 1px solid rgba(255, 255, 255, 0.5); }
.sh-tx dl div { display: grid; grid-template-columns: 1fr 1.5fr; gap: 1.6vw; padding: 1.3vh 0; border-bottom: 1px solid rgba(255, 255, 255, 0.12); }
.sh-tx dt { font-family: var(--font-body); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.5; align-self: center; }
.sh-tx dd { margin: 0; font-family: var(--font-display); font-size: clamp(13px, 1vw, 16px); letter-spacing: -0.03em; }
.sh-tx ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.sh-tx li { position: relative; padding-left: 16px; font-family: var(--font-body); font-size: 11.5px; line-height: 1.55; opacity: 0.8; }
.sh-tx li::before { content: ''; position: absolute; left: 0; top: 0.62em; width: 6px; height: 1px; background: #ff6a1a; }
.sh-m span { display: block; margin-bottom: 6px; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.5; }
.sh-m div { display: flex; flex-wrap: wrap; gap: 5px; }
.sh-m i { font-style: normal; font-family: var(--font-body); font-size: 10px; padding: 5px 9px; border-radius: 5px; border: 1px solid rgba(255, 255, 255, 0.18); }
.sh-act { display: flex; align-items: center; gap: 22px; margin-top: 1vh; }
.sh-act .ps-pill { background: #f4f4f2; color: #0a0a0c; }
.sh-act .ps-pill:hover { background: #ff6a1a; color: #fff; }
.sh-act a { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: inherit; text-decoration: none; opacity: 0.6; transition: opacity 0.3s ease; }
.sh-act a:hover { opacity: 1; }

/* the card is opaque, so it can fade as one piece; the blurred scrim only changes its colour and blur (fading blurred layers makes browsers flash) */
.sh-enter-active .sh-scrim { transition: background-color 0.45s ease, backdrop-filter 0.45s ease, -webkit-backdrop-filter 0.45s ease; }
.sh-leave-active .sh-scrim { transition: background-color 0.22s ease, backdrop-filter 0.22s ease, -webkit-backdrop-filter 0.22s ease; }
.sh-enter-from .sh-scrim, .sh-leave-to .sh-scrim { background-color: rgba(3, 5, 8, 0); backdrop-filter: blur(0px) saturate(1); -webkit-backdrop-filter: blur(0px) saturate(1); }
.sh-enter-active .sh-card { transition: transform 0.7s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.45s ease; }
.sh-leave-active .sh-card { transition: transform 0.22s ease, opacity 0.2s ease; }
.sh-enter-from .sh-card { transform: translateY(40px) scale(0.97); opacity: 0; }
.sh-leave-to .sh-card { transform: translateY(14px) scale(0.985); opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 860px) { .sh-card { grid-template-columns: minmax(0, 1fr); grid-template-rows: 55vh minmax(0, 1fr); width: 94vw; height: 92vh; } .sh-tx { padding: 5vh 6vw; } .sh-vis { padding: 2vh 3vw 9vh; } .sh-th { bottom: 1.4vh; } .sh-th button { width: 44px; height: 44px; padding: 4px; } }
@media (max-width: 860px) { .sh-scrim { backdrop-filter: none; -webkit-backdrop-filter: none; background: rgba(3, 5, 8, 0.86); } .sh-card { backdrop-filter: none; -webkit-backdrop-filter: none; background: #14161b; } }
</style>
