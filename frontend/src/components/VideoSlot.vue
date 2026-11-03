<template>
  <!-- A film that is still being edited: the photograph shows until the clip exists at `src`, then the clip plays over it.
       In development a tag says which file to drop in; visitors only ever see the photograph or the film. -->
  <div class="vs">
    <img :src="poster" alt="" />
    <video v-if="ok" :src="src" muted loop playsinline autoplay preload="metadata" @error="ok = false"></video>
    <span v-else-if="dev" class="vs-tag">Video placeholder · {{ label }} → public{{ src }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ src: string; poster: string; label: string }>()
const ok = ref(true)
const dev = import.meta.env.DEV
</script>

<style scoped>
.vs > img, .vs > video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.vs-tag { position: absolute; left: 50%; top: 50%; translate: -50% -50%; z-index: 1; padding: 8px 14px; border: 1px dashed rgba(255, 255, 255, 0.6); border-radius: 30px; background: rgba(0, 0, 0, 0.45); color: #fff; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; pointer-events: none; }
</style>
