<template>
  <!-- One article at /blog/<slug>: the same address the old WordPress site used, so links and Google rankings carry over.
       The text is in public/blog/<slug>.json (cleaned when it was pulled across: tags only, no styles or scripts). -->
  <PageShell :title="post ? post.title : 'Article'" blue v-slot="{ contact }">
    <article v-if="post" class="bp">
      <header class="bp-head">
        <a class="bp-back" href="/resources" data-cursor="">← All articles</a>
        <div class="bp-meta"><span class="bp-cat">{{ post.cat }}</span><span>{{ post.date }}</span><span>{{ mins }} min read</span></div>
        <h1>{{ post.title }}</h1>
      </header>
      <figure v-if="post.img" class="bp-hero"><img :src="post.img" :alt="post.title" /></figure>
      <div class="bp-body" v-html="post.html"></div>
      <aside class="bp-cta">
        <p>Need a chamber for this kind of test, or the test done for you?</p>
        <button class="ps-pill" data-cursor="" @click="contact(`About your article “${post.title}”: `)"><span>Talk to Envisys</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
      </aside>
    </article>
    <section v-else-if="missing" class="bp bp-miss"><h1>That article has moved.</h1><a class="ps-pill" href="/resources"><span>All articles</span></a></section>
    <section v-else class="bp" aria-busy="true"></section>

    <section v-if="post && more.length" class="bp-more">
      <span class="bp-meta">More to read</span>
      <div class="bp-grid">
        <a v-for="b in more" :key="b.url" :href="b.url" data-cursor="READ">
          <div class="bp-ph"><img v-if="b.img" :src="b.img" :alt="b.title" /></div>
          <small>{{ b.cat }} · {{ b.date }}</small><b>{{ b.title }}</b>
        </a>
      </div>
    </section>
  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageShell from '../components/PageShell.vue'
import index from '../data/blogs.json'

interface Post { title: string; date: string; cat: string; img: string; html: string; excerpt: string }
const slug = location.pathname.replace(/\/+$/, '').split('/')[2] ?? ''
const post = ref<Post | null>(null)
const missing = ref(false)
const mins = computed(() => Math.max(1, Math.round((post.value?.html.replace(/<[^>]+>/g, ' ').split(/\s+/).length ?? 0) / 220)))
fetch(`/blog/${encodeURIComponent(slug)}.json`).then((r) => (r.ok ? r.json() : Promise.reject())).then((p: Post) => {
  post.value = p
  document.title = `${p.title} | Envisys`
  document.querySelector('meta[name="description"]')?.setAttribute('content', p.excerpt)
}).catch(() => { missing.value = true })
// three more: same topic first, then the newest
const more = computed(() => {
  const others = index.filter((b) => b.url !== `/blog/${slug}`)
  return [...others.filter((b) => b.cat === post.value?.cat), ...others.filter((b) => b.cat !== post.value?.cat)].slice(0, 3)
})
</script>

<style scoped>
.bp { width: min(720px, 88vw); margin: 0 auto; padding: 18vh 0 6vh; color: #0d2340; min-height: 60vh; }
.bp-head { margin-bottom: 6vh; }
.bp-back { display: inline-flex; gap: 8px; margin-bottom: 5vh; font-family: 'Geist', sans-serif; font-size: 15px; color: inherit; text-decoration: none; opacity: 0.65; transition: opacity 0.25s ease, gap 0.3s ease; }
.bp-back:hover { opacity: 1; gap: 12px; }
.bp-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 18px; font-family: 'Geist', sans-serif; font-size: 14px; color: rgba(13, 35, 64, 0.62); }
.bp-cat { padding: 6px 12px; border-radius: 40px; background: rgba(255, 106, 26, 0.12); color: #c94e0b; font-weight: 500; }
.bp-head h1, .bp-miss h1 { margin: 3vh 0 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(30px, 3.4vw, 54px); line-height: 1.06; letter-spacing: -0.035em; text-wrap: balance; }
/* the cover, whole, in a navy frame (the covers are designed banners and infographics; cropping cut their text) */
.bp-hero { position: relative; left: 50%; width: min(1040px, 94vw); translate: -50% 0; margin: 0 0 8vh; padding: clamp(10px, 2vw, 22px); border-radius: 24px; background: radial-gradient(120% 90% at 50% 40%, #12305a 0%, #0b1f3a 55%, #071427 100%); box-shadow: 0 30px 60px -30px rgba(7, 20, 39, 0.55); }
.bp-hero img { display: block; width: 100%; height: auto; max-height: 72vh; object-fit: contain; border-radius: 14px; }
.bp-body { font-family: 'Geist', sans-serif; font-size: 18.5px; line-height: 1.78; color: #1a2c44; }
.bp-body :deep(h2) { margin: 7vh 0 2vh; font-family: 'Geist', sans-serif; font-weight: 600; font-size: clamp(24px, 2vw, 30px); line-height: 1.25; letter-spacing: -0.015em; color: #0d2340; }
.bp-body :deep(h3), .bp-body :deep(h4) { margin: 4.5vh 0 1.4vh; font-weight: 600; font-size: 20px; line-height: 1.35; color: #0d2340; }
.bp-body :deep(p) { margin: 0 0 2.6vh; }
.bp-body :deep(ul), .bp-body :deep(ol) { margin: 0 0 2.8vh; padding-left: 0; list-style: none; }
.bp-body :deep(li) { position: relative; margin-bottom: 1.2vh; padding-left: 26px; }
.bp-body :deep(ul > li)::before { content: ''; position: absolute; left: 4px; top: 0.72em; width: 7px; height: 7px; border-radius: 50%; background: #ff6a1a; }
.bp-body :deep(ol) { counter-reset: n; }
.bp-body :deep(ol > li)::before { counter-increment: n; content: counter(n); position: absolute; left: 0; top: 0.1em; font-family: 'Geist Mono', monospace; font-size: 14px; color: #c94e0b; }
.bp-body :deep(strong) { font-weight: 600; color: #0d2340; }
.bp-body :deep(a) { color: #c94e0b; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
.bp-body :deep(img) { display: block; max-width: 100%; max-height: 80vh; height: auto; margin: 5vh auto; border-radius: 16px; box-shadow: 0 24px 50px -28px rgba(7, 20, 39, 0.45); }
.bp-body :deep(table) { width: 100%; margin: 4vh 0; border-collapse: collapse; font-size: 15.5px; display: block; overflow-x: auto; border-radius: 14px; background: rgba(255, 255, 255, 0.55); }
.bp-body :deep(th), .bp-body :deep(td) { padding: 12px 16px; border-bottom: 1px solid rgba(13, 35, 64, 0.1); text-align: left; vertical-align: top; }
.bp-body :deep(th) { font-weight: 600; background: rgba(13, 35, 64, 0.05); }
.bp-body :deep(blockquote) { margin: 4vh 0; padding: 6px 0 6px 22px; border-left: 3px solid #ff6a1a; font-size: 20px; color: #0d2340; }
.bp-cta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 18px; margin-top: 9vh; padding: 30px 32px; border-radius: 24px; background: #0d2340; color: #fff; }
.bp-cta p { margin: 0; max-width: 26em; font-family: 'Geist', sans-serif; font-size: 18px; line-height: 1.5; }
.bp-cta :deep(.ps-pill) { background: #ff6a1a; color: #0d2340; }
.bp-more { width: min(1180px, 92vw); margin: 0 auto; padding: 6vh 0 14vh; color: #0d2340; }
.bp-more > .bp-meta { font-family: 'Geist Mono', monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; }
.bp-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; margin-top: 3vh; }
.bp-grid a { display: flex; flex-direction: column; gap: 10px; color: inherit; text-decoration: none; }
.bp-ph { aspect-ratio: 16 / 10; border-radius: 16px; overflow: hidden; background: radial-gradient(120% 90% at 50% 40%, #12305a 0%, #0b1f3a 55%, #071427 100%); }
.bp-ph img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.9s cubic-bezier(0.2, 0.9, 0.2, 1); }
.bp-grid a:hover img { transform: scale(1.03); }
.bp-grid small { font-family: 'Geist', sans-serif; font-size: 13px; opacity: 0.6; }
.bp-grid b { font-family: 'Geist', sans-serif; font-weight: 600; font-size: 19px; line-height: 1.3; letter-spacing: -0.01em; }
@media (max-width: 800px) { .bp { padding-top: 14vh; } .bp-body { font-size: 17.5px; } .bp-grid { grid-template-columns: 1fr; } .bp-hero { border-radius: 18px; } .bp-cta { padding: 24px; } }
</style>
