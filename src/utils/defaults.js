import { join } from 'node:path'

export const fontSize = 16
export const fontFamily = 'sans-serif'
export const fontDir = join(__dirname, '../../', 'fonts/')
export const fontFamilyMappings = {
  'sans-serif': 'OpenSans-Regular.ttf',
  'Open Sans': 'OpenSans-Regular.ttf'
}
