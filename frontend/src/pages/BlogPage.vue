<template>
  <!-- One article at /blog/<slug>: the same address the old WordPress site used, so links and Google rankings carry over.
       The text is in public/blog/<slug>.json (cleaned when it was pulled across: tags only, no styles or scripts). -->
  <PageShell :title="post ? post.title : 'Article'" blue v-slot="{ contact }">
    <article v-if="post" class="bp">
      <header class="bp-head">
        <a class="bp-back" href="/resources" data-cursor="">← All articles</a>
        <span class="bp-meta">{{ post.cat }} · {{ post.date }}</span>
        <h1>{{ post.title }}</h1>
      </header>
      <img v-if="post.img" class="bp-hero" :src="post.img" :alt="post.title" />
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
.bp { width: min(760px, 90vw); margin: 0 auto; padding: 18vh 0 6vh; color: #0d2340; min-height: 60vh; }
.bp-back { display: inline-block; margin-bottom: 4vh; font-family: 'Geist Mono', monospace; font-size: 13px; color: inherit; text-decoration: none; opacity: 0.7; }
.bp-back:hover { opacity: 1; color: #e0560c; }
.bp-meta { display: block; font-family: 'Geist Mono', monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.6; }
.bp-head h1, .bp-miss h1 { margin: 2vh 0 5vh; font-family: var(--font-display); font-weight: 400; font-size: clamp(30px, 3.6vw, 58px); line-height: 1.05; letter-spacing: -0.04em; }
.bp-hero { display: block; width: 100%; max-height: 62vh; object-fit: cover; border-radius: 20px; margin-bottom: 6vh; }
.bp-body { font-family: 'Geist', sans-serif; font-size: 18px; line-height: 1.75; }
.bp-body :deep(h2) { margin: 6vh 0 2vh; font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 2vw, 32px); line-height: 1.15; letter-spacing: -0.03em; }
.bp-body :deep(h3), .bp-body :deep(h4) { margin: 4vh 0 1.4vh; font-size: 20px; font-weight: 600; }
.bp-body :deep(p) { margin: 0 0 2.4vh; }
.bp-body :deep(ul), .bp-body :deep(ol) { margin: 0 0 2.4vh; padding-left: 24px; }
.bp-body :deep(li) { margin-bottom: 1vh; }
.bp-body :deep(a) { color: #e0560c; text-underline-offset: 3px; }
.bp-body :deep(img) { display: block; max-width: 100%; height: auto; margin: 4vh auto; border-radius: 14px; }
.bp-body :deep(table) { width: 100%; margin: 3vh 0; border-collapse: collapse; font-size: 15px; display: block; overflow-x: auto; }
.bp-body :deep(th), .bp-body :deep(td) { padding: 10px 12px; border-bottom: 1px solid rgba(13, 35, 64, 0.15); text-align: left; vertical-align: top; }
.bp-body :deep(blockquote) { margin: 3vh 0; padding-left: 20px; border-left: 3px solid #ff6a1a; }
.bp-cta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 18px; margin-top: 8vh; padding: 28px; border-radius: 22px; background: rgba(255, 255, 255, 0.6); }
.bp-cta p { margin: 0; font-family: 'Geist', sans-serif; font-size: 18px; }
.bp-more { padding: 6vh 2.2vw 12vh; color: #0d2340; }
.bp-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 3vh; }
.bp-grid a { display: flex; flex-direction: column; gap: 8px; color: inherit; text-decoration: none; }
.bp-ph { aspect-ratio: 16 / 10; border-radius: 16px; overflow: hidden; background: rgba(13, 35, 64, 0.08); }
.bp-ph img { width: 100%; height: 100%; object-fit: cover; transition: transform 1s ease; }
.bp-grid a:hover img { transform: scale(1.04); }
.bp-grid small { font-family: 'Geist Mono', monospace; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.6; }
.bp-grid b { font-family: var(--font-display); font-weight: 400; font-size: 20px; line-height: 1.15; letter-spacing: -0.03em; }
@media (max-width: 800px) { .bp { padding-top: 14vh; } .bp-body { font-size: 17px; } .bp-grid { grid-template-columns: 1fr; } }
</style>
