// Game data: challenges, clothing items, scoring.
// Keep this file pure — no React, no DOM.

export const CHALLENGES = [
  {
    id: 'coffee',
    name: 'Coffee Date',
    emoji: '☕',
    tagline: 'soft morning energy',
    tags: ['cozy', 'cute', 'casual', 'soft', 'warm'],
    palette: 'warm',
  },
  {
    id: 'demo',
    name: 'Startup Demo Day',
    emoji: '🚀',
    tagline: 'pitch the dream',
    tags: ['smart', 'minimal', 'clean', 'confident', 'sharp'],
    palette: 'mono',
  },
  {
    id: 'tokyo',
    name: 'Rainy Tokyo',
    emoji: '🌧️',
    tagline: 'neon puddles, late train',
    tags: ['edgy', 'urban', 'waterproof', 'dark', 'layered'],
    palette: 'cool',
  },
  {
    id: 'night',
    name: 'Night Market',
    emoji: '🌃',
    tagline: 'street food and stickers',
    tags: ['bold', 'playful', 'neon', 'fun', 'street'],
    palette: 'neon',
  },
]

export const CATEGORIES = [
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessories', label: 'Accessories' },
]

// Each item has a category, name, emoji glyph for the chip + a layer style
// (color/shape) for stacking on the avatar.
export const ITEMS = [
  // Tops
  { id: 't-tee', category: 'tops', name: 'Cropped Tee', emoji: '👕',
    tags: ['casual', 'soft', 'playful'], color: '#ffd1e0' },
  { id: 't-blazer', category: 'tops', name: 'Power Blazer', emoji: '🧥',
    tags: ['smart', 'minimal', 'clean', 'confident'], color: '#1f2937' },
  { id: 't-hoodie', category: 'tops', name: 'Oversized Hoodie', emoji: '🥷',
    tags: ['cozy', 'casual', 'urban', 'soft'], color: '#a5b4fc' },
  { id: 't-mesh', category: 'tops', name: 'Mesh Top', emoji: '✨',
    tags: ['bold', 'edgy', 'neon'], color: '#f472b6' },
  { id: 't-knit', category: 'tops', name: 'Knit Sweater', emoji: '🧶',
    tags: ['cozy', 'cute', 'soft', 'warm'], color: '#fcd34d' },
  { id: 't-trench', category: 'tops', name: 'Trench Coat', emoji: '🕵️',
    tags: ['waterproof', 'urban', 'smart', 'layered'], color: '#9ca3af' },

  // Bottoms
  { id: 'b-jeans', category: 'bottoms', name: 'Mom Jeans', emoji: '👖',
    tags: ['casual', 'urban', 'soft'], color: '#60a5fa' },
  { id: 'b-skirt', category: 'bottoms', name: 'Pleated Skirt', emoji: '🩰',
    tags: ['cute', 'soft', 'playful'], color: '#fbcfe8' },
  { id: 'b-wide', category: 'bottoms', name: 'Wide Trousers', emoji: '🪢',
    tags: ['clean', 'minimal', 'smart', 'sharp'], color: '#111827' },
  { id: 'b-cargo', category: 'bottoms', name: 'Cargo Pants', emoji: '🎒',
    tags: ['urban', 'edgy', 'street', 'layered'], color: '#4b5563' },
  { id: 'b-shorts', category: 'bottoms', name: 'Neon Shorts', emoji: '🩳',
    tags: ['bold', 'neon', 'fun', 'playful'], color: '#22d3ee' },

  // Shoes
  { id: 's-sneakers', category: 'shoes', name: 'Crisp Sneakers', emoji: '👟',
    tags: ['clean', 'minimal', 'casual', 'sharp'], color: '#ffffff' },
  { id: 's-heels', category: 'shoes', name: 'Kitten Heels', emoji: '👠',
    tags: ['smart', 'confident', 'cute'], color: '#e11d48' },
  { id: 's-boots', category: 'shoes', name: 'Combat Boots', emoji: '🥾',
    tags: ['edgy', 'urban', 'waterproof', 'dark'], color: '#1c1917' },
  { id: 's-mary', category: 'shoes', name: 'Mary Janes', emoji: '🩴',
    tags: ['cute', 'soft', 'playful', 'warm'], color: '#92400e' },
  { id: 's-platform', category: 'shoes', name: 'Platforms', emoji: '🛼',
    tags: ['bold', 'fun', 'neon', 'street'], color: '#a855f7' },

  // Accessories
  { id: 'a-tote', category: 'accessories', name: 'Linen Tote', emoji: '👜',
    tags: ['casual', 'cozy', 'soft'], color: '#f5deb3' },
  { id: 'a-shades', category: 'accessories', name: 'Slim Shades', emoji: '🕶️',
    tags: ['confident', 'minimal', 'clean', 'sharp'], color: '#0f172a' },
  { id: 'a-umbrella', category: 'accessories', name: 'Clear Brolly', emoji: '☂️',
    tags: ['waterproof', 'urban', 'layered'], color: '#7dd3fc' },
  { id: 'a-led', category: 'accessories', name: 'LED Earrings', emoji: '💡',
    tags: ['neon', 'fun', 'bold'], color: '#facc15' },
  { id: 'a-beret', category: 'accessories', name: 'Mini Beret', emoji: '🎩',
    tags: ['cute', 'playful', 'soft', 'warm'], color: '#be123c' },
  { id: 'a-briefcase', category: 'accessories', name: 'Slim Briefcase', emoji: '💼',
    tags: ['smart', 'minimal', 'confident', 'sharp'], color: '#334155' },
]

export function itemsByCategory(category) {
  return ITEMS.filter((it) => it.category === category)
}

export function getItem(id) {
  return ITEMS.find((it) => it.id === id)
}

// Score: per-item tag overlap * 10 + category-coverage bonus, clamped to 100.
// Picking ~2 matching tags per filled category yields ~80+.
export function scoreLook(selectedIds, challenge) {
  if (!challenge) return 0
  const challengeTags = new Set(challenge.tags)
  const selected = selectedIds.map(getItem).filter(Boolean)

  let matches = 0
  const filledCats = new Set()
  for (const item of selected) {
    filledCats.add(item.category)
    for (const tag of item.tags) {
      if (challengeTags.has(tag)) matches += 1
    }
  }

  const base = matches * 10
  const coverage = filledCats.size * 5 // up to +20
  return Math.max(0, Math.min(100, base + coverage))
}

export function verdictFor(score, challenge) {
  const lines = VERDICTS[challenge?.id] ?? VERDICTS._default
  if (score >= 80) return lines.iconic
  if (score >= 60) return lines.good
  if (score >= 40) return lines.mid
  return lines.bad
}

const VERDICTS = {
  coffee: {
    iconic: 'Latte art with legs. Absolutely iconic.',
    good: 'Cute and very kissable.',
    mid: 'Decaf vibes — fine, but no second date.',
    bad: 'Reads more "in line at the DMV".',
  },
  demo: {
    iconic: 'Series A energy. Term sheet incoming.',
    good: 'Investors are leaning forward.',
    mid: 'You\'ll need slide 14 to carry this.',
    bad: 'They thought you were the catering.',
  },
  tokyo: {
    iconic: 'Cyberpunk royalty. The rain is jealous.',
    good: 'Last train protagonist core.',
    mid: 'Slightly damp NPC.',
    bad: 'You forgot the brolly AND the vibe.',
  },
  night: {
    iconic: 'Main character of the night market.',
    good: 'You\'re getting the free extra dumpling.',
    mid: 'Cute, but the LEDs aren\'t blinking.',
    bad: 'The skewers feel sorry for you.',
  },
  _default: {
    iconic: 'Iconic. Absolutely iconic.',
    good: 'Solid look.',
    mid: 'It\'s a look.',
    bad: 'Try again, stylist.',
  },
}

// Deterministically pick a different challenge using Math.random.
export function pickDifferentChallenge(currentId, rng = Math.random) {
  const others = CHALLENGES.filter((c) => c.id !== currentId)
  const idx = Math.floor(rng() * others.length)
  return others[Math.min(idx, others.length - 1)]
}
