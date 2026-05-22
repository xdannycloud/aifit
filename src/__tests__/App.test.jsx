import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'

const CHALLENGE_NAMES = [
  'Coffee Date',
  'Startup Demo Day',
  'Rainy Tokyo',
  'Night Market',
]

function setup() {
  return {
    user: userEvent.setup(),
    ...render(<App />),
  }
}

describe('AIFit', () => {
  beforeEach(() => {
    // Reset any random-related state between tests
  })

  it('renders the title "AIFit"', () => {
    setup()
    expect(
      screen.getByRole('heading', { name: /aifit/i, level: 1 }),
    ).toBeInTheDocument()
  })

  it('renders a challenge whose name is from the known list', () => {
    setup()
    const brief = screen.getByTestId('challenge-name').textContent || ''
    expect(CHALLENGE_NAMES).toContain(brief.trim())
  })

  it('renders the four outfit categories', () => {
    setup()
    for (const cat of ['Tops', 'Bottoms', 'Shoes', 'Accessories']) {
      expect(
        screen.getByRole('heading', { name: new RegExp(`^${cat}$`, 'i') }),
      ).toBeInTheDocument()
    }
  })

  it('selecting a clothing item marks it as selected and updates the avatar', async () => {
    const { user } = setup()
    const avatar = screen.getByTestId('avatar')
    // grab the first item in the Tops category
    const topsButtons = screen.getAllByTestId('item-tops')
    const first = topsButtons[0]
    expect(first).toHaveAttribute('aria-pressed', 'false')

    await user.click(first)

    expect(first).toHaveAttribute('aria-pressed', 'true')
    // avatar reflects the item somehow (label or layer)
    expect(
      within(avatar).getByTestId(`layer-${first.dataset.itemId}`),
    ).toBeInTheDocument()
  })

  it('clicking Runway shows a score and a verdict', async () => {
    const { user } = setup()
    // pick at least one item from each category
    const cats = ['tops', 'bottoms', 'shoes', 'accessories']
    for (const cat of cats) {
      const items = screen.getAllByTestId(`item-${cat}`)
      await user.click(items[0])
    }
    await user.click(screen.getByRole('button', { name: /runway/i }))

    const result = screen.getByTestId('result-card')
    const score = Number(
      within(result).getByTestId('score-value').textContent,
    )
    expect(Number.isFinite(score)).toBe(true)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
    expect(within(result).getByTestId('verdict').textContent).toMatch(/\S/)
  })

  it('clicking Reset clears selections and hides the result card', async () => {
    const { user } = setup()
    const topsButtons = screen.getAllByTestId('item-tops')
    const first = topsButtons[0]
    await user.click(first)
    expect(first).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: /runway/i }))
    expect(screen.getByTestId('result-card')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /reset/i }))

    expect(first).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByTestId('result-card')).not.toBeInTheDocument()
  })

  it('Shuffle Brief changes the challenge to another valid challenge', async () => {
    const { user } = setup()
    const before = screen.getByTestId('challenge-name').textContent
    await user.click(screen.getByRole('button', { name: /shuffle brief/i }))
    const after = screen.getByTestId('challenge-name').textContent
    expect(after).not.toEqual(before)
    expect(CHALLENGE_NAMES).toContain((after || '').trim())
  })

  it('shows "Iconic" styling when score >= 80', async () => {
    const { user } = setup()
    // Pick the special test challenge that we know is easy:
    // Repeatedly shuffle until "Coffee Date" appears, then pick cozy items.
    // For simplicity we just pick items from every category and check the
    // resulting card optionally carries the iconic flag. To deterministically
    // hit >=80 we use the dedicated optimize-button if available.
    const optimize = screen.queryByTestId('cheat-iconic')
    if (optimize) {
      await user.click(optimize)
    } else {
      // fallback: pick all items in each category
      for (const cat of ['tops', 'bottoms', 'shoes', 'accessories']) {
        const items = screen.getAllByTestId(`item-${cat}`)
        for (const item of items) await user.click(item)
      }
    }
    await user.click(screen.getByRole('button', { name: /runway/i }))
    const card = screen.getByTestId('result-card')
    const score = Number(within(card).getByTestId('score-value').textContent)
    if (score >= 80) {
      expect(card).toHaveAttribute('data-iconic', 'true')
    } else {
      expect(card).not.toHaveAttribute('data-iconic', 'true')
    }
  })
})
