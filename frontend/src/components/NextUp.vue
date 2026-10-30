<template>
  <!-- The link to the next page: a hairline that fills on hover, a small label, the title, and a round arrow. Quiet until touched. -->
  <div class="nu-sec">
  <a class="nu" :href="href" data-cursor="" @click="click">
    <i class="nu-line"><u></u></i>
    <span class="nu-l">{{ label }}</span>
    <span class="nu-m">
      <b class="nu-t">{{ title }}</b>
      <span class="nu-d">{{ text }}</span>
    </span>
    <span class="nu-a" aria-hidden="true"><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.1" /></svg></span>
  </a>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ label: string; title: string; text: string; href: string }>()
const emit = defineEmits<{ (e: 'go'): void }>()
// href="#" means the link opens something on the page instead of navigating
const click = (e: MouseEvent) => { if (props.href === '#') e.preventDefault(); emit('go') }
</script>

<style scoped>
/* the page dissolves into the footer's dark, like smoke rising from below */
.nu-sec { position: relative; padding-top: 22vh; color: #eef3fa; background: linear-gradient(180deg, rgba(4, 6, 10, 0) 0%, rgba(4, 6, 10, 0.55) 26%, rgba(4, 6, 10, 0.92) 52%, #04060a 70%); }
.nu { position: relative; display: grid; grid-template-columns: 9vw 1fr auto; align-items: center; gap: 2vw; margin: 0 5vw; padding: 10vh 0 12vh; color: inherit; text-decoration: none; }
.nu-line { position: absolute; left: 0; right: 0; top: 10vh; height: 1px; margin-top: -4.5vh; background: currentColor; opacity: 0.16; }
.nu-line u { position: absolute; inset: 0; background: #ff6a1a; transform: scaleX(0); transform-origin: 0 0; transition: transform 0.9s cubic-bezier(0.2, 0.9, 0.2, 1); }
.nu:hover .nu-line { opacity: 1; background: transparent; }
.nu:hover .nu-line u { transform: none; }
.nu-l { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.5; }
.nu-m { display: flex; flex-direction: column; gap: 10px; }
.nu-t { font-weight: 400; font-family: var(--font-display); font-size: clamp(20px, 2.1vw, 38px); line-height: 1; letter-spacing: -0.05em; transition: transform 0.7s cubic-bezier(0.2, 0.9, 0.2, 1); }
.nu:hover .nu-t { transform: translateX(10px); }
.nu-d { max-width: 30em; font-family: var(--font-body); font-size: 11px; line-height: 1.6; opacity: 0.55; transition: transform 0.7s cubic-bezier(0.2, 0.9, 0.2, 1) 0.04s; }
.nu:hover .nu-d { transform: translateX(10px); }
.nu-a { width: 46px; height: 46px; display: grid; place-items: center; border-radius: 50%; border: 1px solid currentColor; opacity: 0.6; transition: background 0.4s ease, border-color 0.4s ease, color 0.4s ease, opacity 0.3s ease, transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1); }
.nu-a svg { width: 10px; height: 10px; transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1); }
.nu:hover .nu-a { opacity: 1; background: #ff6a1a; border-color: #ff6a1a; color: #fff; transform: rotate(45deg); }
@media (max-width: 700px) { .nu { grid-template-columns: 1fr auto; } .nu-l { grid-column: 1 / -1; } }
</style>
