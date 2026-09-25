const NBSP = '\u00A0'

const shortWords = [
  'а', 'в', 'во', 'и', 'к', 'ко', 'о', 'об', 'обо', 'с', 'со', 'у', 'я',
  'на', 'над', 'по', 'под', 'за', 'из', 'изо', 'от', 'ото', 'до', 'для', 'без', 'при', 'про', 'через',
  'не', 'ни', 'но', 'да', 'или', 'либо', 'что', 'чтобы', 'как', 'чем', 'если', 'уже', 'ещё', 'еще',
  'жана', 'же', 'бул', 'ар',
  'a', 'an', 'the', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'and', 'or', 'but', 'with', 'from', 'no', 'not', 'if',
]

// A word counts as "short" only when it is not glued to a preceding letter, digit or hyphen.
const shortWordPattern = new RegExp(`(?<![\\p{L}\\p{N}-])(${shortWords.join('|')}) +`, 'giu')
const dashPattern = / +([—–])/g
const numberPattern = /(\d) +(?=[\p{L}₽%])/gu

export function typograph(text: string): string {
  return text
    .replace(shortWordPattern, `$1${NBSP}`)
    .replace(dashPattern, `${NBSP}$1`)
    .replace(numberPattern, `$1${NBSP}`)
}

const skippedParents = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'])

function fixTextNode(node: Node) {
  const value = node.nodeValue
  if (!value || !value.includes(' ') || skippedParents.has(node.parentNode?.nodeName ?? '')) return
  const fixed = typograph(value)
  if (fixed !== value) node.nodeValue = fixed
}

function fixTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    fixTextNode(root)
    return
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) fixTextNode(node)
}

// React writes text nodes directly, so rendered text is re-checked whenever it changes.
export function keepTypography(root: HTMLElement) {
  fixTree(root)
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') fixTextNode(mutation.target)
      else mutation.addedNodes.forEach(fixTree)
    }
  }).observe(root, { childList: true, characterData: true, subtree: true })
}
