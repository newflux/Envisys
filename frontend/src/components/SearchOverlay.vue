<template>
  <!-- Site search: a sheet that drops from the top. Searches every product series, model code and spec offline, so a chamber that is
       not on the main products page (a salt spray cabinet, an IPX9K rig) still takes you straight to its page. -->
  <Teleport to="body">
    <div class="so" :class="{ open }" :aria-hidden="!open" @keydown.esc="$emit('close')">
      <div class="so-scrim" @click="$emit('close')"></div>
      <div class="so-sheet" role="dialog" aria-label="Search products">
        <div class="so-in">
          <button class="so-x" aria-label="Close search" @click="$emit('close')"><svg viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.2" fill="none" /></svg></button>

          <h2 class="so-h">What are you looking for?</h2>
          <label class="so-field">
            <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.4" /><path d="M13 13l5 5" stroke="currentColor" stroke-width="1.4" /></svg>
            <input ref="inp" v-model="q" type="text" placeholder="Chamber, model code or test, e.g. ET950, salt spray, −70 °C" autocomplete="off" spellcheck="false" @keydown.down.prevent="move(1)" @keydown.up.prevent="move(-1)" @keydown.enter.prevent="go(sel)" />
            <kbd>Esc</kbd>
          </label>

          <div v-if="!q.trim()" class="so-try">
            <span>Try these searches</span>
            <button v-for="s in suggestions" :key="s" data-cursor="" @click="q = s">{{ s }}</button>
          </div>

          <ul v-else class="so-res">
            <li v-for="(h, i) in hits" :key="h.product.slug" :class="{ on: sel === i }" @mouseenter="sel = i" @click="go(i)" data-cursor="">
              <div class="so-th"><img :src="img(h.product, 'hero')" alt="" loading="lazy" /></div>
              <div class="so-tx">
                <b>{{ h.product.name }}</b>
                <small>{{ h.product.group }} · {{ h.product.tier === 'main' ? 'Main range' : 'Catalogue' }}</small>
                <span v-if="h.models.length"><i v-for="m in h.models" :key="m">{{ m }}</i></span>
                <em v-else>{{ h.product.tagline }}</em>
              </div>
              <svg class="so-ar" viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.2" /></svg>
            </li>
            <li v-if="!hits.length" class="so-none">Nothing matches “{{ q }}”. Try a chamber type, like salt spray or thermal shock, or a model code like ET950.</li>
          </ul>

          <a class="so-all" href="/products" data-cursor="">Browse all products <span>→</span></a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { searchProducts, suggestions, img } from '../config/products'

const props = defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()

const q = ref('')
const sel = ref(0)
const inp = ref<HTMLInputElement | null>(null)
const hits = computed(() => searchProducts(q.value).slice(0, 7))
watch(q, () => { sel.value = 0 })
watch(() => props.open, async (v) => {
  const l = (window as any).lenisInstance
  if (v) { l?.stop(); await nextTick(); setTimeout(() => inp.value?.focus(), 250) } else { l?.start(); q.value = '' }
})
const move = (d: number) => { if (hits.value.length) sel.value = (sel.value + d + hits.value.length) % hits.value.length }
function go(i: number) {
  const h = hits.value[i]
  if (!h) return
  location.href = `/products/${h.product.slug}${h.models[0] ? `?m=${encodeURIComponent(h.models[0])}` : ''}`
}
</script>

<style scoped>
.so { position: fixed; inset: 0; z-index: 3000; pointer-events: none; }
.so.open { pointer-events: auto; }
.so-scrim { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); opacity: 0; transition: opacity 0.5s ease; }
.so.open .so-scrim { opacity: 1; }
.so-sheet { position: absolute; left: 0; right: 0; top: 0; max-height: 92vh; overflow: auto; background: #0a0a0c; color: #f4f4f2; border-bottom: 1px solid rgba(255, 255, 255, 0.1); transform: translateY(-102%); transition: transform 0.7s cubic-bezier(0.2, 0.9, 0.2, 1); }
.so.open .so-sheet { transform: none; }
.so-in { position: relative; width: min(980px, 90vw); margin: 0 auto; padding: 11vh 0 6vh; }
.so-x { position: absolute; right: 0; top: 4vh; width: 40px; height: 40px; display: grid; place-items: center; border: 0; border-radius: 50%; background: rgba(255, 255, 255, 0.08); color: inherit; cursor: pointer; transition: background 0.3s ease, transform 0.5s ease; }
.so-x:hover { background: rgba(255, 255, 255, 0.18); transform: rotate(90deg); }
.so-x svg { width: 11px; height: 11px; }
.so-h { margin: 0 0 4vh; text-align: center; font-family: var(--font-display); font-weight: 400; font-size: clamp(26px, 3vw, 52px); letter-spacing: -0.05em; line-height: 1.05; }
.so-field { display: flex; align-items: center; gap: 16px; padding: 0 22px; height: 68px; border-radius: 14px; background: #101013; border: 1px solid rgba(255, 138, 74, 0.55); box-shadow: 0 0 0 4px rgba(255, 106, 26, 0.08), 0 20px 50px rgba(0, 0, 0, 0.45); transition: box-shadow 0.4s ease, border-color 0.4s ease; }
.so-field:focus-within { border-color: #ff8a4a; box-shadow: 0 0 0 5px rgba(255, 106, 26, 0.16), 0 20px 50px rgba(0, 0, 0, 0.45); }
.so-field svg { width: 20px; height: 20px; flex: none; opacity: 0.75; }
.so-field input { flex: 1; min-width: 0; height: 100%; border: 0; outline: 0; background: transparent; color: inherit; font-family: var(--font-body); font-size: clamp(14px, 1.2vw, 18px); }
.so-field input::placeholder { color: rgba(244, 244, 242, 0.38); }
.so-field kbd { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.1em; padding: 5px 8px; border-radius: 5px; border: 1px solid rgba(255, 255, 255, 0.2); opacity: 0.55; }

.so-try { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; margin-top: 4vh; }
.so-try span { width: 100%; text-align: center; margin-bottom: 4px; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.5; }
.so-try button { padding: 10px 16px; border-radius: 40px; border: 1px solid rgba(255, 255, 255, 0.2); background: transparent; color: inherit; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.08em; cursor: pointer; transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease; }
.so-try button:hover { background: #f4f4f2; color: #0a0a0c; border-color: #f4f4f2; }

.so-res { list-style: none; margin: 3vh 0 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.so-res li { display: flex; align-items: center; gap: 18px; padding: 10px 18px 10px 10px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.06); background: rgba(255, 255, 255, 0.03); cursor: pointer; transition: background 0.3s ease, border-color 0.3s ease, transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1); }
.so-res li.on { background: rgba(255, 255, 255, 0.09); border-color: rgba(255, 138, 74, 0.5); transform: translateX(4px); }
.so-th { width: 74px; height: 74px; flex: none; border-radius: 8px; background: linear-gradient(180deg, #d9d9d6, #f1f1ef); display: grid; place-items: center; overflow: hidden; }
.so-th img { max-width: 86%; max-height: 86%; object-fit: contain; }
.so-tx { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.so-tx b { font-weight: 400; font-family: var(--font-display); font-size: clamp(16px, 1.4vw, 22px); letter-spacing: -0.04em; }
.so-tx small { font-family: var(--font-body); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.5; }
.so-tx span { display: flex; flex-wrap: wrap; gap: 6px; }
.so-tx span i { font-style: normal; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 4px; background: rgba(255, 138, 74, 0.16); color: #ffb48a; }
.so-tx em { font-style: normal; font-family: var(--font-body); font-size: 12px; opacity: 0.6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.so-ar { width: 12px; height: 12px; flex: none; opacity: 0.4; transition: transform 0.4s ease, opacity 0.3s ease; }
.so-res li.on .so-ar { opacity: 1; transform: translate(3px, -3px); }
.so-none { justify-content: center; padding: 28px 18px !important; cursor: default !important; font-family: var(--font-body); font-size: 13px; line-height: 1.6; opacity: 0.7; text-align: center; }

.so-all { display: inline-flex; gap: 10px; margin-top: 4vh; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: inherit; text-decoration: none; opacity: 0.65; transition: opacity 0.3s ease, gap 0.4s ease; }
.so-all:hover { opacity: 1; gap: 16px; }

@media (max-width: 700px) { .so-th { width: 56px; height: 56px; } .so-field { height: 58px; } .so-field kbd { display: none; } }
</style>
