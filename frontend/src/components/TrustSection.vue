<template>
  <div class="tr-root">
    <!-- Brand-blue tint: sits under the whiteout and is revealed as the white lifts -->
    <div class="tr-sky"></div>
    <div class="tr-cloud tr-cloud-a"></div>
    <div class="tr-cloud tr-cloud-b"></div>

    <!-- Continues the statement: one scrolling column over the cold chamber -->
    <div class="tr-wrap">
      <div class="tr-scroll">
        <h2 class="tr-title">Trusted by teams who can’t afford compromise.</h2>

        <div class="tr-clients">
          <div class="tr-label">Clientele</div>
          <div class="tr-grid">
            <div v-for="c in clients" :key="c.n" class="tr-logo"><img :src="`/clients/${c.f}.png`" :alt="c.n" /></div>
          </div>
        </div>

        <div class="tr-info">
          <article v-for="s in sectors" :key="s.name" class="tr-block">
            <h3>{{ s.name }}</h3>
            <i></i>
            <p>{{ s.line }}</p>
          </article>
        </div>
      </div>
    </div>

    <!-- The whiteout: the cold blue lifts into white, then clears to the tint -->
    <div class="tr-haze"></div>
  </div>
</template>

<script setup lang="ts">
// Logos are the ones on the current envisystech.com (Clientele), converted to white on transparent.
// Sector copy is placeholder.
const clients = [
  { n: 'Bosch', f: 'bosch' }, { n: 'Mahindra', f: 'mahindra' }, { n: 'TATA', f: 'tata' }, { n: 'Hyundai', f: 'hyundai' },
  { n: 'nVidia', f: 'nvidia' }, { n: 'GE', f: 'ge' }, { n: 'Wipro', f: 'wipro' }, { n: 'Danfoss', f: 'danfoss' },
  { n: 'TVS', f: 'tvs' }, { n: 'Delphi', f: 'delphi' }, { n: 'Commscope', f: 'commscope' }, { n: 'Titan', f: 'titan' }
]
const sectors = [
  { name: 'Automotive', line: 'Powertrain, electronics and cabin components, proven long before they reach the road.' },
  { name: 'Electronics', line: 'Boards, networking and silicon held through thermal and humidity cycling.' },
  { name: 'Defence', line: 'Qualification runs that meet the standard, unattended and fully logged.' },
  { name: 'Aerospace', line: 'From −70°C to +180°C, and altitude chambers down to 1 mbar.' }
]
</script>

<style scoped>
.tr-root {
  position: fixed;
  inset: 0;
  z-index: 105;
  pointer-events: none;
  visibility: hidden;
  overflow: hidden;
  color: #fff;
}

.tr-sky {
  position: absolute;
  inset: 0;
  opacity: 0;
  background: linear-gradient(180deg, #1a6cb8 0%, #2b86d2 48%, #62aeea 100%);
}
.tr-cloud {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
  filter: blur(26px);
  opacity: 0;
  will-change: transform, opacity;
}
.tr-cloud-a { width: 70vw; height: 22vw; left: -12vw; top: 46%; animation: tr-drift-a 40s ease-in-out infinite alternate; }
.tr-cloud-b { width: 60vw; height: 18vw; right: -14vw; top: 22%; animation: tr-drift-b 52s ease-in-out infinite alternate; }
@keyframes tr-drift-a { to { transform: translateX(14vw); } }
@keyframes tr-drift-b { to { transform: translateX(-12vw); } }

/* Anchored to the bottom and 2.6 screens tall: translated up it brings a soft white horizon,
   then a fully white screen. */
.tr-haze {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 260%;
  opacity: 0;
  will-change: transform, opacity;
  background: linear-gradient(to top, #fff 0%, #fff 44%, #eaf3fc 52%, #bcd8f2 62%, rgba(130, 185, 232, 0.45) 78%, rgba(100, 160, 220, 0) 100%);
}

.tr-wrap {
  position: absolute;
  inset: 0;
  mask-image: linear-gradient(to bottom, transparent 0, #000 13%, #000 87%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 13%, #000 87%, transparent 100%);
}
.tr-scroll {
  position: absolute;
  left: 7vw;
  width: 60vw;
  top: 0;
  transform: translateY(110vh);
  will-change: transform;
  display: flex;
  flex-direction: column;
  gap: clamp(48px, 9vh, 96px);
}
.tr-title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(30px, 3.9vw, 74px);
  line-height: 1.06;
  letter-spacing: -0.04em;
}

.tr-label { font-family: var(--font-body); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.7; margin-bottom: 26px; }
.tr-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 30px 18px; align-items: center; }
.tr-logo { height: 52px; display: flex; align-items: center; justify-content: flex-start; }
.tr-logo img { max-width: 118px; max-height: 46px; object-fit: contain; display: block; opacity: 0.92; }

.tr-info { display: grid; grid-template-columns: 1fr 1fr; gap: 44px 4vw; }
.tr-block h3 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(18px, 1.6vw, 28px); letter-spacing: -0.04em; line-height: 1.05; }
.tr-block i { display: block; width: 28px; height: 1px; background: rgba(255, 255, 255, 0.7); margin: 18px 0 16px; }
.tr-block p { margin: 0; font-family: var(--font-body); font-size: clamp(11px, 0.9vw, 14px); line-height: 1.55; max-width: 34ch; opacity: 0.85; }

@media (max-width: 900px) {
  .tr-scroll { width: 86vw; left: 7vw; }
  .tr-grid { grid-template-columns: repeat(3, 1fr); }
  .tr-info { grid-template-columns: 1fr; gap: 28px; }
}
</style>
