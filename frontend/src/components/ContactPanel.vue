<template>
  <!-- "Build w/ Envisys": a quote request in a drawer on the right. The page dims and blurs behind it; fields rise
       in one after another. -->
  <Teleport to="body">
    <div class="cp" :class="{ open }" :aria-hidden="!open" @keydown.esc="close">
      <div class="cp-scrim" @click="close"></div>
      <aside class="cp-panel" ref="panelRef" data-lenis-prevent role="dialog" aria-modal="true" aria-label="Request a quote" tabindex="-1">
        <header class="cp-head">
          <div>
            <span class="cp-eyebrow">Build w/ Envisys</span>
            <h2>Request a quote</h2>
          </div>
          <button class="cp-x" aria-label="Close" @click="close"><svg viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.3" /></svg></button>
        </header>

        <form v-if="!sent" class="cp-form" novalidate @submit.prevent="submit">
          <p class="cp-lead cp-in">Tell us what you need to test. We will come back with the right chamber, or build one around it.</p>

          <fieldset class="cp-in">
            <legend>Chamber</legend>
            <div class="cp-chips">
              <button v-for="c in chambers" :key="c" type="button" class="cp-chip" :class="{ on: picked.includes(c) }" :aria-pressed="picked.includes(c)" @click="toggle(c)">{{ c }}</button>
            </div>
          </fieldset>

          <div class="cp-grid">
            <label v-for="f in fields" :key="f.k" class="cp-field cp-in" :class="{ full: f.full, bad: errors[f.k] }">
              <input v-if="!f.area" v-model.trim="form[f.k]" :type="f.type" :name="f.k" :autocomplete="f.auto" placeholder=" " />
              <textarea v-else v-model.trim="form[f.k]" :name="f.k" rows="3" placeholder=" "></textarea>
              <span>{{ f.label }}<i v-if="f.req">*</i></span>
              <b></b>
              <em v-if="errors[f.k]">{{ errors[f.k] }}</em>
            </label>
          </div>

          <button class="cp-send cp-in" type="submit">
            <span>Send request</span>
            <svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
          </button>
        </form>

        <div v-else class="cp-done">
          <h3>Your request is ready.</h3>
          <p>It has opened in your email app, addressed to enquiry@envisystech.com. Send it from there and the team will pick it up.</p>
          <button class="cp-again" type="button" @click="sent = false">Edit the request</button>
        </div>

        <footer class="cp-foot">
          <span>Prefer to talk? <a href="tel:+919900014150">+91 99000 14150</a></span>
          <a href="mailto:enquiry@envisystech.com">enquiry@envisystech.com</a>
        </footer>
      </aside>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()
const panelRef = ref<HTMLElement | null>(null)

const chambers = ['Environmental', 'Thermal shock', 'Altitude', 'Salt spray', 'Walk-in', 'Not sure yet']
type Key = 'name' | 'company' | 'email' | 'phone' | 'range' | 'message'
const fields: { k: Key; label: string; type?: string; auto?: string; req?: boolean; full?: boolean; area?: boolean }[] = [
  { k: 'name', label: 'Name', type: 'text', auto: 'name', req: true },
  { k: 'company', label: 'Company', type: 'text', auto: 'organization' },
  { k: 'email', label: 'Work email', type: 'email', auto: 'email', req: true },
  { k: 'phone', label: 'Phone', type: 'tel', auto: 'tel' },
  { k: 'range', label: 'Temperature / humidity range (e.g. −40 to +85°C, 95% RH)', type: 'text', full: true },
  { k: 'message', label: 'What are you testing?', full: true, area: true }
]
const form = reactive<Record<Key, string>>({ name: '', company: '', email: '', phone: '', range: '', message: '' })
const errors = reactive<Partial<Record<Key, string>>>({})
const picked = ref<string[]>([])
const sent = ref(false)

function toggle(c: string) {
  picked.value = picked.value.includes(c) ? picked.value.filter((x) => x !== c) : [...picked.value, c]
}

// shortcut: no backend yet, so the request is handed to the visitor's email app; swap for a form endpoint when there is one
function submit() {
  delete errors.name
  delete errors.email
  if (!form.name) errors.name = 'Please add your name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please add a valid email'
  if (errors.name || errors.email) return
  const body = [
    `Name: ${form.name}`, `Company: ${form.company || '-'}`, `Email: ${form.email}`, `Phone: ${form.phone || '-'}`,
    `Chamber: ${picked.value.join(', ') || '-'}`, `Range: ${form.range || '-'}`, '', form.message
  ].join('\n')
  const subject = `Quote request${form.company ? ` · ${form.company}` : ''}`
  window.location.href = `mailto:enquiry@envisystech.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  sent.value = true
}

function close() {
  emit('close')
}

// the page stops scrolling while the drawer is open
watch(() => props.open, async (o) => {
  const lenis = (window as any).lenisInstance
  if (o) {
    lenis?.stop()
    await nextTick()
    panelRef.value?.focus()
  } else lenis?.start()
})
</script>

<style scoped>
.cp { position: fixed; inset: 0; z-index: 3000; pointer-events: none; }
.cp.open { pointer-events: auto; }
.cp-scrim { position: absolute; inset: 0; background: rgba(4, 7, 12, 0.5); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); opacity: 0; transition: opacity 0.6s ease; }
.cp.open .cp-scrim { opacity: 1; }

.cp-panel {
  position: absolute; top: 20px; right: 20px; bottom: 20px; width: min(640px, calc(100vw - 40px));
  display: flex; flex-direction: column; padding: 22px 26px 20px; border-radius: 14px; overflow: auto; outline: none;
  color: #eef2f7; background: linear-gradient(180deg, #07111f 0%, #0b1a30 55%, #182640 100%);
  border: 1px solid rgba(255, 255, 255, 0.06); box-shadow: 0 40px 120px rgba(0, 0, 0, 0.5);
  transform: translateX(calc(100% + 40px)); transition: transform 0.85s cubic-bezier(0.7, 0, 0.2, 1);
}
.cp.open .cp-panel { transform: none; }
/* slim scrollbar inside the drawer, in the panel's own colours */
.cp-panel { scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.22) transparent; overscroll-behavior: contain; }
.cp-panel::-webkit-scrollbar { width: 6px; }
.cp-panel::-webkit-scrollbar-track { background: transparent; margin: 14px 0; }
.cp-panel::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 6px; border: 2px solid transparent; background-clip: padding-box; }
.cp-panel::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.4); }
.cp-panel::-webkit-scrollbar-button { display: none; height: 0; }

.cp-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3.4vh; }
.cp-eyebrow { display: block; margin-bottom: 12px; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); }
.cp-head h2 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(30px, 2.8vw, 46px); letter-spacing: -0.05em; line-height: 1; }
.cp-x { width: 42px; height: 42px; flex: none; display: grid; place-items: center; border: 0; border-radius: 8px; background: rgba(255, 255, 255, 0.1); color: #fff; cursor: pointer; transition: background 0.3s ease, transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1); }
.cp-x:hover { background: rgba(255, 255, 255, 0.2); transform: rotate(90deg); }
.cp-x svg { width: 13px; height: 13px; }

/* rows rise in, one after another, once the drawer is open */
.cp-in { opacity: 0; transform: translateY(14px); transition: opacity 0.5s ease, transform 0.7s cubic-bezier(0.2, 0.9, 0.2, 1); }
.cp.open .cp-in { opacity: 1; transform: none; }
.cp.open .cp-form > .cp-in:nth-child(1) { transition-delay: 0.3s; }
.cp.open .cp-form > .cp-in:nth-child(2) { transition-delay: 0.36s; }
.cp.open .cp-field:nth-child(1) { transition-delay: 0.42s; }
.cp.open .cp-field:nth-child(2) { transition-delay: 0.46s; }
.cp.open .cp-field:nth-child(3) { transition-delay: 0.5s; }
.cp.open .cp-field:nth-child(4) { transition-delay: 0.54s; }
.cp.open .cp-field:nth-child(5) { transition-delay: 0.58s; }
.cp.open .cp-field:nth-child(6) { transition-delay: 0.62s; }
.cp.open .cp-send { transition-delay: 0.68s; }

.cp-form { display: flex; flex-direction: column; gap: 3vh; }
.cp-lead { margin: 0; max-width: 40ch; font-family: var(--font-body); font-size: 13px; line-height: 1.55; color: rgba(238, 242, 247, 0.7); }

fieldset { margin: 0; padding: 0; border: 0; }
legend { padding: 0; margin-bottom: 14px; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); }
.cp-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.cp-chip { padding: 10px 16px; border-radius: 40px; border: 1px solid rgba(255, 255, 255, 0.2); background: none; color: #eef2f7; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease, transform 0.35s cubic-bezier(0.2, 0.9, 0.2, 1); }
.cp-chip:hover { border-color: rgba(255, 255, 255, 0.5); transform: translateY(-2px); }
.cp-chip.on { background: #fff; color: #0b1a30; border-color: #fff; }

/* floating labels on a hairline that fills from the left when the field is focused */
.cp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.6vh 22px; }
.cp-field { position: relative; display: block; padding-top: 16px; }
.cp-field.full { grid-column: 1 / -1; }
.cp-field input, .cp-field textarea { width: 100%; padding: 8px 0 10px; border: 0; border-bottom: 1px solid rgba(255, 255, 255, 0.2); background: none; color: #fff; font-family: var(--font-display); font-size: 15px; letter-spacing: -0.02em; outline: none; resize: none; }
.cp-field span { position: absolute; left: 0; top: 24px; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.04em; color: rgba(238, 242, 247, 0.55); pointer-events: none; transform-origin: left top; transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1), color 0.3s ease; }
.cp-field span i { font-style: normal; color: #7fb2e8; margin-left: 2px; }
.cp-field input:focus ~ span, .cp-field input:not(:placeholder-shown) ~ span,
.cp-field textarea:focus ~ span, .cp-field textarea:not(:placeholder-shown) ~ span { transform: translateY(-22px) scale(0.84); color: rgba(238, 242, 247, 0.8); }
.cp-field b { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: #fff; transform: scaleX(0); transform-origin: left; transition: transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1); }
.cp-field textarea ~ b { bottom: 4px; }
.cp-field input:focus ~ b, .cp-field textarea:focus ~ b { transform: scaleX(1); }
.cp-field.bad b { background: #ff8a6a; transform: scaleX(1); }
.cp-field em { position: absolute; left: 0; top: 100%; margin-top: 6px; font-style: normal; font-family: var(--font-body); font-size: 11px; color: #ff8a6a; }

.cp-send { align-self: flex-start; position: relative; overflow: hidden; isolation: isolate; display: inline-flex; align-items: center; gap: 18px; padding: 20px 34px; border: 0; border-radius: 40px; background: #fff; color: #0b1a30; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; }
.cp-send::before { content: ''; position: absolute; inset: 0; z-index: -1; background: #cfe3f6; transform: translateY(101%); transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1); }
.cp-send:hover::before { transform: none; }
.cp-send svg { width: 12px; height: 12px; transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1); }
.cp-send:hover svg { transform: translate(3px, -3px); }

.cp-done h3 { margin: 0 0 16px; font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 2vw, 32px); letter-spacing: -0.04em; }
.cp-done p { margin: 0; max-width: 42ch; font-family: var(--font-body); font-size: 13px; line-height: 1.6; color: rgba(238, 242, 247, 0.7); }
.cp-again { margin-top: 28px; padding: 0; border: 0; background: none; color: #fff; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: underline; text-underline-offset: 4px; cursor: pointer; }

.cp-foot { margin-top: auto; padding-top: 28px; display: flex; justify-content: space-between; gap: 16px; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.55); }
.cp-foot a { color: #fff; text-decoration: none; }
.cp-foot a:hover { text-decoration: underline; text-underline-offset: 3px; }

@media (max-width: 640px) { .cp-grid { grid-template-columns: 1fr; } .cp-foot { flex-direction: column; } }
</style>
