<template>
  <div class="p4-root" aria-hidden="true">
    <!-- The headline itself lives in the 3D scene (App.vue). This is only the small supporting copy. -->
    <div class="p4-eyebrow"><i></i><span>04</span><span class="p4-eyebrow-sep"></span><span>The proof</span></div>
    <div class="p4-copy p4-fade">
      <p class="p4-copy-title">
        <span v-for="(l, i) in config.copyTitle" :key="i">{{ l }}</span>
      </p>
      <div class="p4-rule"></div>
      <p class="p4-copy-body">{{ config.copyBody }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = {
  copyTitle: ['Thermal cycling,', 'humidity, endurance —', 'run on repeat'],
  copyBody:
    'From −70°C to +180°C and 10% to 98% RH, every profile runs autonomously and is logged to the second, so what leaves our chambers is already qualified.'
}
</script>

<style scoped>
.p4-root {
  position: fixed;
  inset: 0;
  z-index: 104;
  pointer-events: none;
  color: #fff;
}
.p4-fade { opacity: 0; }
.p4-eyebrow {
  position: absolute;
  top: clamp(88px, 11vh, 116px);
  left: 5%;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  opacity: 0;
}
.p4-eyebrow i { width: 6px; height: 6px; background: var(--ember); display: block; }
.p4-eyebrow-sep { width: 22px; height: 1px; background: rgba(255, 255, 255, 0.35); display: block; }
.p4-copy {
  position: absolute;
  left: 6vw;
  bottom: 12vh;
  width: min(360px, 30vw);
}
.p4-copy-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(13px, 1.15vw, 19px);
  line-height: 1.25;
  letter-spacing: -0.03em;
}
.p4-copy-title span { display: block; }
.p4-rule { width: 28px; height: 1px; background: #fff; margin: 20px 0; }
.p4-copy-body {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(11px, 0.85vw, 13px);
  line-height: 1.5;
  letter-spacing: -0.01em;
}

@media (max-width: 800px) {
  .p4-copy { width: 60vw; bottom: 8vh; }
}
</style>
