/**
 * Split markdown content into slides on `---` horizontal rules.
 * Each standalone `---` line creates a new slide boundary.
 *
 * Also extracts:
 * - Speaker notes: `<!-- notes: ... -->` (removed from slide content)
 * - Transition: `<!-- transition: fade|slide|zoom -->` (removed from slide content)
 */

export interface SlideData {
  content: string
  notes: string
  transition: 'slide' | 'fade' | 'zoom'
}

const NOTES_REGEX = /<!--\s*notes:\s*([\s\S]*?)\s*-->/i
const TRANSITION_REGEX = /<!--\s*transition:\s*(fade|slide|zoom)\s*-->/i

function parseSlide(raw: string): SlideData {
  let content = raw.trim()
  let notes = ''
  let transition: 'slide' | 'fade' | 'zoom' = 'slide'

  // Extract notes
  const notesMatch = content.match(NOTES_REGEX)
  if (notesMatch) {
    notes = notesMatch[1].trim()
    content = content.replace(NOTES_REGEX, '').trim()
  }

  // Extract transition
  const transitionMatch = content.match(TRANSITION_REGEX)
  if (transitionMatch) {
    transition = transitionMatch[1].toLowerCase() as 'slide' | 'fade' | 'zoom'
    content = content.replace(TRANSITION_REGEX, '').trim()
  }

  return { content, notes, transition }
}

export function splitSlides(markdown: string): SlideData[] {
  const rawSlides = markdown
    .split(/^---+\s*$/gm)
    .map((s) => s.trim())
    .filter(Boolean)

  return rawSlides.map(parseSlide)
}

/**
 * Legacy: returns just content strings
 */
export function splitSlidesContent(markdown: string): string[] {
  return splitSlides(markdown).map((s) => s.content)
}
