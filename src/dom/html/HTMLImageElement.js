import { Event } from '../Event.js'
import { HTMLElement } from './HTMLElement.js'
import { Buffer } from 'node:buffer'
import sizeOf from 'buffer-image-size'
// import { getFileBufferFromURL } from '../../utils/fileUrlToBuffer.js'
// import path from 'path'

export class HTMLImageElement extends HTMLElement {
  constructor (...args) {
    super(...args)
    this.naturalWidth = 0
    this.naturalHeight = 0
    this.complete = false
  }
}

Object.defineProperties(HTMLImageElement.prototype, {
  src: {
    get () {
      return this.getAttribute('src')
    },
    set (val) {
      this.setAttribute('src', val)
      // const url = path.resolve(this.ownerDocument.defaultView.location, val)
      // getFileBufferFromURL(url, (buffer) => {
      fetch(val)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => Buffer.from(arrayBuffer))
        .then((buffer) => {
          const { width, height } = sizeOf(buffer)
          this.naturalWidth = width
          this.naturalHeight = height
          this.complete = true
          this.dispatchEvent(new Event('load'))
        }).catch(() => {
          this.dispatchEvent(new Event('error'))
        })
      // })
    }
  },
  height: {
    get () {
      return this.getAttribute('height') || this.naturalHeight
    },
    set (val) {
      this.setAttribute('height', val)
    }
  },
  width: {
    get () {
      return this.getAttribute('width') || this.naturalWidth
    },
    set (val) {
      this.setAttribute('width', val)
    }
  }
})
