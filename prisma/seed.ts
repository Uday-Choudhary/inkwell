import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ── Helpers ──────────────────────────────────────────────────────────────────

function slug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function readingTime(content: string) {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

// ── Article content blocks ────────────────────────────────────────────────────

const techContent = `
<p class="lead">We are living through the quietest revolution in computing history. While past technological shifts announced themselves with fanfare — the PC, the internet, the smartphone — artificial intelligence has crept into the fabric of daily life almost unnoticed.</p>

<h2>From Rule to Inference</h2>
<p>Classical software operates on rules: <em>if this, then that</em>. Engineers painstakingly encode every condition, every edge case, every exception. It is exhausting, brittle work. A program that handles a thousand known situations will fail on the thousand-and-first.</p>
<p>Modern machine learning inverts this contract. Instead of rules, we supply examples. The system discovers the rules itself — and, crucially, it can generalise to situations it has never seen before. This shift from prescription to inference is the deep change that makes today's AI qualitatively different from every previous wave of automation.</p>

<h2>The Attention Mechanism</h2>
<p>Transformer models — the architecture underpinning GPT, Claude, and their kin — process language by computing relationships between every word and every other word in a passage. This "attention" mechanism lets the model hold long-range context: the pronoun at the end of a paragraph can be correctly resolved by a noun that appeared at the beginning.</p>
<blockquote>The transformer did not merely improve on previous architectures — it obsoleted them almost overnight. That rarely happens in engineering.</blockquote>
<p>What made transformers so consequential was that they scaled. More data and more compute produced reliably better results, a property that earlier architectures lacked. This meant that progress became partially predictable: invest enough, and you would improve.</p>

<h2>The Next Bottleneck</h2>
<p>Today the limits are shifting from architecture to data and alignment. Models must be not just capable but reliably helpful and honest. The field has invented a suite of techniques — RLHF, constitutional AI, deliberative alignment — to steer behaviour after pre-training. Whether these techniques are sufficient for much more capable systems remains an open and urgent question.</p>
<p>What is clear is that the centre of gravity for AI research has moved from academia to industry, that the pace of progress has accelerated, and that the downstream consequences — for labour markets, for epistemics, for security — are only beginning to be understood.</p>
`

const cultureContent = `
<p class="lead">Every generation believes it has discovered busyness. Romans complained about the frantic pace of city life; Victorians worried about the telegraph collapsing the comfortable distance between events and awareness. And yet something does feel different now.</p>

<h2>Attention as Currency</h2>
<p>The economy of the last decade has been, at its core, an attention economy. The platforms that dominate our screens are not in the software business — they are in the time business. Every notification, every algorithmically curated feed, every autoplay video is a small lever pulling your attention away from wherever it rested and redirecting it toward an advertisement.</p>
<p>This is not a conspiracy; it is an incentive structure. Companies are rewarded for engagement, and engagement is maximised by novelty and arousal. The result is an environment engineered, at scale, to prevent boredom — and boredom, it turns out, is where a great deal of creative and reflective thinking happens.</p>

<h2>What Slow Looks Like</h2>
<p>The countermovement is gaining vocabulary. "Deep work," "digital minimalism," "slow media," "intentional tech use" — these phrases have become common in productivity writing and are beginning to appear in mainstream conversation. Their shared premise is that quality of attention matters as much as quantity of information.</p>
<blockquote>The inbox will never be empty. The feed will never end. Accepting this is the beginning of a saner relationship with the machine.</blockquote>
<p>What does slow actually look like in practice? It looks like reading one long article instead of twelve headlines. It looks like letting a question sit unanswered for a day before reaching for a search engine. It looks like conversations that end without anyone reaching for their phone.</p>

<h2>The Paradox of Curation</h2>
<p>There is a paradox at the heart of slow media. Most of us encounter it through newsletters, podcasts, and carefully maintained reading lists — all of which are, inevitably, digital. We are using the tools of the attention economy to escape the attention economy. Whether this constitutes genuine resistance or merely a premium tier of consumption is a question worth sitting with.</p>
`

const scienceContent = `
<p class="lead">The universe is under no obligation to be simple. And yet, repeatedly, physicists have discovered that beneath the bewildering variety of natural phenomena lie surprisingly compact mathematical structures.</p>

<h2>The Unreasonable Effectiveness</h2>
<p>In 1960, the physicist Eugene Wigner wrote an essay titled "The Unreasonable Effectiveness of Mathematics in the Natural Sciences." His puzzle: why should abstract structures invented by pure mathematicians, with no empirical motivation, turn out to describe physical reality so precisely?</p>
<p>The electron's magnetic moment has been measured to agree with quantum electrodynamics to one part in a trillion. The general theory of relativity, derived from philosophical thought experiments about accelerating elevators, predicts the timing corrections required by GPS satellites to within microseconds. The concordance is eerie.</p>

<h2>Symmetry All the Way Down</h2>
<p>Modern physics is, in large part, the study of symmetry. Noether's theorem — proved in 1915 and still startling today — establishes that every continuous symmetry in a physical system corresponds to a conservation law. The symmetry of time gives conservation of energy. The symmetry of space gives conservation of momentum.</p>
<blockquote>Emmy Noether's theorem is one of the most beautiful results in all of mathematics. It reveals conservation laws not as brute empirical facts but as logical consequences of geometry.</blockquote>
<p>The Standard Model of particle physics is essentially a specification of which symmetry groups govern the universe's fundamental interactions. When experiments at the LHC confirmed the existence of the Higgs boson in 2012, they were validating a symmetry-breaking mechanism proposed half a century earlier on purely theoretical grounds.</p>

<h2>What Remains Unknown</h2>
<p>The Standard Model accounts for three of the four known fundamental forces. Gravity remains unincorporated. Attempts to construct a quantum theory of gravity — string theory, loop quantum gravity, causal set theory — have not yet made predictions that experiments can test. Whether this reflects a deep incompatibility or merely the practical difficulty of probing Planck-scale physics is the central open question of fundamental physics.</p>
`

const designContent = `
<p class="lead">Typography is the invisible architecture of communication. Done well, it disappears — the reader notices only the ideas. Done poorly, it is a persistent friction, a slight resistance that accumulates across every paragraph.</p>

<h2>The Paragraph as Unit</h2>
<p>Most editorial decisions happen at the level of the page or the headline. The paragraph is neglected. Yet the paragraph is where reading actually happens: it is the unit of sustained attention, the container for a single developed thought.</p>
<p>A well-set paragraph has a line length of 50 to 75 characters — long enough to develop rhythm, short enough to avoid the eye losing its place on the return. It has leading (line-height) that opens the lines without making them feel disconnected, usually 1.4 to 1.6 times the type size. It has a typeface chosen for the body of text, not for display.</p>

<h2>Variable Fonts and the New Flexibility</h2>
<p>For most of typographic history, a typeface was a physical object — a set of metal slugs, then a set of photographic masters, then a set of digital outlines. Each weight and width required a separate file. The type system was inherently discontinuous.</p>
<blockquote>Variable fonts collapse the design space of a typeface into a single file with infinite intermediate positions. This is not an incremental improvement; it is a different kind of object.</blockquote>
<p>Variable fonts, introduced in the OpenType specification in 2016, change this fundamentally. A single font file contains the full design space, parameterised across one or more axes: weight, width, optical size, slant, and any custom axes the type designer chooses to expose. An interface can now interpolate smoothly between weights rather than snapping between fixed grades.</p>

<h2>Reading on Glass</h2>
<p>The screen remains a fundamentally different substrate from paper. It emits rather than reflects; its resolution, while vastly improved since the 1980s, is still lower than print; and it is typically held at a greater variety of distances and angles. Good screen typography must account for all of this.</p>
<p>The practitioner's answer has generally been to go slightly larger, slightly looser, and slightly higher in contrast than one might on paper. The deeper answer — still being worked out — is that screen typography needs its own conventions, not merely adapted print conventions. The best digital typefaces are those designed explicitly for the medium.</p>
`

// ── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Seeding database…')

  // ── Admin user ───────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: 'admin@inkwell.dev' },
    update: {},
    create: {
      email: 'admin@inkwell.dev',
      password: await bcrypt.hash('admin1234', 12),
      role: 'ADMIN',
    },
  })
  console.log('   ✓  Admin user')

  // ── Author ───────────────────────────────────────────────────────────────
  const author = await prisma.author.upsert({
    where: { email: 'editorial@inkwell.dev' },
    update: {},
    create: {
      name: 'The Inkwell Editorial',
      email: 'editorial@inkwell.dev',
      bio: 'Long-form writing on technology, culture, science, and design.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
    },
  })
  console.log('   ✓  Author')

  // ── Categories ───────────────────────────────────────────────────────────
  const [techCat, cultureCat, scienceCat, designCat] = await Promise.all([
    prisma.category.upsert({ where: { slug: 'technology' }, update: {}, create: { name: 'Technology', slug: 'technology' } }),
    prisma.category.upsert({ where: { slug: 'culture' }, update: {}, create: { name: 'Culture', slug: 'culture' } }),
    prisma.category.upsert({ where: { slug: 'science' }, update: {}, create: { name: 'Science', slug: 'science' } }),
    prisma.category.upsert({ where: { slug: 'design' }, update: {}, create: { name: 'Design', slug: 'design' } }),
  ])
  console.log('   ✓  Categories')

  // ── Articles ─────────────────────────────────────────────────────────────
  const articles = [
    // ── Technology ──────────────────────────────────────────────────────
    {
      title: 'The Quiet Revolution: How AI Rewired the World Without Anyone Noticing',
      excerpt: 'We are living through the quietest revolution in computing history. While past shifts announced themselves with fanfare, artificial intelligence has crept into daily life almost unnoticed.',
      content: techContent,
      coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=675&fit=crop',
      coverImageAlt: 'Abstract neural network visualization in purple and blue tones',
      category: techCat,
      metaTitle: 'How AI Rewired the World Without Anyone Noticing',
      metaDescription: 'A deep dive into how artificial intelligence has quietly transformed computing, language understanding, and everyday life — and what comes next.',
      publishedAt: new Date('2026-04-20T09:00:00Z'),
    },
    {
      title: 'Why Every Developer Should Understand Transformer Architecture',
      excerpt: 'The transformer architecture has dominated AI for nearly a decade. Understanding its mechanics — attention, positional encoding, and layer normalisation — is no longer optional for serious engineers.',
      content: techContent,
      coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=675&fit=crop',
      coverImageAlt: 'Close-up of circuit board with glowing traces',
      category: techCat,
      metaTitle: 'Why Developers Should Understand Transformer Architecture',
      metaDescription: 'A practical guide to the transformer architecture — self-attention, positional encoding, and why it matters for every software engineer working in 2026.',
      publishedAt: new Date('2026-04-28T09:00:00Z'),
    },
    {
      title: 'The Coming Energy Crisis in Machine Learning',
      excerpt: 'Training a frontier model now consumes as much electricity as a small town uses in a year. As AI scales, energy is becoming the binding constraint — and nobody has a clean answer.',
      content: techContent,
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=675&fit=crop',
      coverImageAlt: 'Data center server racks with blue lighting',
      category: techCat,
      metaTitle: 'The Energy Crisis Hiding Inside Machine Learning',
      metaDescription: 'Frontier AI models consume extraordinary amounts of energy. This piece examines the growing tension between AI ambition and planetary resource limits.',
      publishedAt: new Date('2026-05-01T09:00:00Z'),
    },

    // ── Culture ─────────────────────────────────────────────────────────
    {
      title: 'Slow Media: Reclaiming Your Attention in the Age of the Infinite Feed',
      excerpt: 'The feed will never end. The inbox will never be empty. Accepting this is the beginning of a saner relationship with the machine — and with your own mind.',
      content: cultureContent,
      coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=675&fit=crop',
      coverImageAlt: 'Person reading a physical book in warm library light',
      category: cultureCat,
      metaTitle: 'Slow Media: Reclaiming Attention in the Age of Infinite Feeds',
      metaDescription: 'How the attention economy hijacks focus, why boredom matters, and what a slower relationship with media might look like in practice.',
      publishedAt: new Date('2026-04-15T09:00:00Z'),
    },
    {
      title: 'The Return of the Essay: Why Long-Form Writing Is Thriving',
      excerpt: 'Predictions of the essay\'s death turned out to be wrong. In the age of social media and short video, long-form writing has found a more engaged audience than ever before.',
      content: cultureContent,
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=675&fit=crop',
      coverImageAlt: 'Vintage typewriter on a wooden desk with scattered notes',
      category: cultureCat,
      metaTitle: 'The Return of the Essay in the Age of Short Video',
      metaDescription: 'Newsletters, Substack, and long-form publishing are booming. Here\'s why the essay is thriving — not despite the attention economy, but because of it.',
      publishedAt: new Date('2026-04-22T09:00:00Z'),
    },
    {
      title: 'On Boredom: The Underrated Cognitive State We\'re Engineering Away',
      excerpt: 'We have built an environment designed to prevent boredom. It may be one of the most consequential mistakes of the digital age — because boredom is where creativity begins.',
      content: cultureContent,
      coverImage: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=1200&h=675&fit=crop',
      coverImageAlt: 'Person staring thoughtfully out a rainy window',
      category: cultureCat,
      metaTitle: 'On Boredom: The Cognitive State We\'re Engineering Away',
      metaDescription: 'Boredom is cognitively essential — a state that enables creative thinking, consolidation, and self-reflection. We are engineering it out of existence.',
      publishedAt: new Date('2026-05-03T09:00:00Z'),
    },

    // ── Science ─────────────────────────────────────────────────────────
    {
      title: 'Symmetry and Existence: Why the Universe Obeys Mathematical Laws',
      excerpt: 'Noether\'s theorem reveals that conservation laws are not brute empirical facts but logical consequences of symmetry. This is one of the most beautiful results in all of science.',
      content: scienceContent,
      coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&h=675&fit=crop',
      coverImageAlt: 'Spiral galaxy photographed by a space telescope',
      category: scienceCat,
      metaTitle: 'Symmetry and Existence: Why the Universe Obeys Math',
      metaDescription: 'From Noether\'s theorem to the Standard Model, this piece explores why abstract mathematics describes physical reality so unreasonably well.',
      publishedAt: new Date('2026-04-10T09:00:00Z'),
    },
    {
      title: 'What the Higgs Boson Actually Tells Us About Reality',
      excerpt: 'The Higgs discovery in 2012 confirmed a symmetry-breaking mechanism proposed fifty years earlier. But the deeper story is about what it means to verify a theory that nobody can directly see.',
      content: scienceContent,
      coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=675&fit=crop',
      coverImageAlt: 'Particle collision trails in a bubble chamber',
      category: scienceCat,
      metaTitle: 'What the Higgs Boson Actually Tells Us About Reality',
      metaDescription: 'The Higgs boson is the most expensive confirmation in scientific history. Here\'s what it tells us about fundamental reality — and what it leaves open.',
      publishedAt: new Date('2026-04-25T09:00:00Z'),
    },
    {
      title: 'The Quiet Death of the Steady-State Universe',
      excerpt: 'For decades, two cosmological models competed. The Big Bang seemed philosophically unsatisfying to many scientists — a literal beginning was too close to theology. The data settled the argument.',
      content: scienceContent,
      coverImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&h=675&fit=crop',
      coverImageAlt: 'Deep space nebula in rich oranges and blues',
      category: scienceCat,
      metaTitle: 'The Quiet Death of the Steady-State Universe',
      metaDescription: 'The scientific battle between the Big Bang and steady-state cosmologies is a case study in how evidence defeats aesthetics in physics.',
      publishedAt: new Date('2026-05-02T09:00:00Z'),
    },

    // ── Design ──────────────────────────────────────────────────────────
    {
      title: 'The Invisible Architecture: A Field Guide to Editorial Typography',
      excerpt: 'Good typography disappears. The reader notices only ideas, not letterforms or leading. This is the paradox that every typographer must eventually accept — and then spend a career pursuing.',
      content: designContent,
      coverImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&h=675&fit=crop',
      coverImageAlt: 'Open book with beautiful serif typography on cream pages',
      category: designCat,
      metaTitle: 'A Field Guide to Editorial Typography',
      metaDescription: 'Why typography is the invisible architecture of communication — and how line length, leading, and typeface choice shape the reading experience.',
      publishedAt: new Date('2026-04-12T09:00:00Z'),
    },
    {
      title: 'Variable Fonts and the End of the Type Family',
      excerpt: 'Variable fonts collapse the design space of a typeface into a single file with infinite intermediate positions. This is not an incremental improvement — it is a different kind of object entirely.',
      content: designContent,
      coverImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=675&fit=crop',
      coverImageAlt: 'Close-up of bold typographic letters in warm amber light',
      category: designCat,
      metaTitle: 'Variable Fonts and the End of the Type Family',
      metaDescription: 'How variable fonts work, why they change the economics of type design, and what they mean for the future of web typography.',
      publishedAt: new Date('2026-04-30T09:00:00Z'),
    },
    {
      title: 'Reading on Glass: Designing for Screens Without Apologising for Paper',
      excerpt: 'Screen typography doesn\'t need to apologise for not being print. It needs its own conventions — designed for emitted light, variable viewing distance, and interaction.',
      content: designContent,
      coverImage: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=1200&h=675&fit=crop',
      coverImageAlt: 'Modern tablet showing clean editorial layout',
      category: designCat,
      metaTitle: 'Reading on Glass: Screen Typography Without Print Apologies',
      metaDescription: 'Screen typography has unique constraints: emitted light, variable distance, interaction. This piece argues for screen-native conventions rather than adapted print ones.',
      publishedAt: new Date('2026-05-04T09:00:00Z'),
    },
  ]

  let created = 0
  for (const a of articles) {
    const s = slug(a.title)
    const existing = await prisma.article.findUnique({ where: { slug: s } })
    if (existing) {
      console.log(`   –  Skipped (exists): ${a.title.slice(0, 50)}…`)
      continue
    }

    await prisma.article.create({
      data: {
        title: a.title,
        slug: s,
        content: a.content.trim(),
        excerpt: a.excerpt,
        coverImage: a.coverImage,
        coverImageAlt: a.coverImageAlt,
        published: true,
        publishedAt: a.publishedAt,
        metaTitle: a.metaTitle,
        metaDescription: a.metaDescription,
        readingTimeMinutes: readingTime(a.content),
        authorId: author.id,
        categoryId: a.category.id,
      },
    })
    created++
    console.log(`   ✓  ${a.title.slice(0, 60)}`)
  }

  console.log(`\n🌱  Done — ${created} article(s) created.\n`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
