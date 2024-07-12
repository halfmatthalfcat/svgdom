const fonts = {}

export const getFonts = () => fonts
export const setFont = (family, font) => {
  if (!Buffer.isBuffer(font)) {
    throw new Error(`Font family ${family} not a Buffer`)
  }

  fonts[family] = font
}
export const setFonts = (map) => {
  if (typeof map !== 'object') {
    throw new Error('Must supply an object of string->Buffer to setFonts')
  }

  Object.entries(map).forEach(([ family, font ]) => {
    setFont(family, font)
  })
}

export const config = {
  getFonts,
  setFont,
  setFonts
}
