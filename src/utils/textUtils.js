import * as fontkit from 'fontkit'
import { Box, NoBox } from '../other/Box.js'
import { getFonts } from '../config.js'

export const textBBox = function (text, x, y, details) {

  if (!text) return new NoBox()

  const fonts = Object.entries(getFonts())
  const fontSize = details.fontSize ?? 16

  if (!fonts.length) {
    console.warn('No fonts loaded, using empty bbox.')
    return new NoBox()
  }

  const families = (details.fontFamily ?? '').split(/\s*,\s*/)

  if (!families.length) {
    console.warn('Not font family supplied, using empty bbox.')
    return new NoBox()
  }

  const foundFont = families.find((family) => fonts[family])

  if (!foundFont) {
    console.warn(`Not loaded font found for supplied families ${families.join(',')}, using empty bbox.`)
    return new NoBox()
  }

  const font = fontkit.create(foundFont)

  const fontHeight = font.ascent - font.descent
  const lineHeight = fontHeight > font.unitsPerEm ? fontHeight : fontHeight + font.lineGap

  const height = lineHeight / font.unitsPerEm * fontSize
  const width = font.layout(text).glyphs.reduce((last, curr) => last + curr.advanceWidth, 0) / font.unitsPerEm * fontSize

  // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor
  let xAdjust = 0
  if (details.textAnchor === 'end') {
    xAdjust = -width
  } else if (details.textAnchor === 'middle') {
    xAdjust = -width / 2
  }

  // https://www.w3.org/TR/2002/WD-css3-linebox-20020515/
  // 4.2. Baseline identifiers
  let yAdjust = font.ascent // alphabetic
  if (details.dominantBaseline === 'before-edge' || details.dominantBaseline === 'text-before-edge') {
    yAdjust = 0
  } else if (details.dominantBaseline === 'hanging') {
    yAdjust = font.ascent - font.xHeight - font.capHeight
  } else if (details.dominantBaseline === 'mathematical') {
    yAdjust = font.ascent - font.xHeight
  } else if (details.dominantBaseline === 'middle') {
    yAdjust = font.ascent - font.xHeight / 2
  } else if (details.dominantBaseline === 'central') {
    yAdjust = font.ascent / 2 + font.descent / 2
  } else if (details.dominantBaseline === 'ideographic') {
    yAdjust = font.ascent + font.descent
  }

  return new Box(x + xAdjust, y - yAdjust / font.unitsPerEm * fontSize, width, height)
}
