/**
 * Split markdown content into slides on `---` horizontal rules.
 * Each standalone `---` line creates a new slide boundary.
 */
export function splitSlides(markdown: string): string[] {
  // Split on lines that contain only three or more dashes (with optional whitespace)
  const slides = markdown
    .split(/^---+\s*$/gm)
    .map((s) => s.trim())
    .filter(Boolean)

  return slides
}
