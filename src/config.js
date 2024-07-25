import * as fontkit from "fontkit";

const _fonts = {};

export const getFonts = () => _fonts;
export const setFonts = (...fonts) => {
  for (const font of fonts) {
    if (!Buffer.isBuffer(font)) {
      throw new Error(`Must pass Buffer to setFonts`);
    }

    const loaded = fontkit.create(font);

    if (loaded.postscriptName && !(loaded.postscriptName in _fonts)) {
      _fonts[loaded.postscriptName] = loaded;
    }
  }
};

export const getPostscriptName = (font) => {
  try {
    const loaded = fontkit.create(font);
    return loaded.postscriptName;
  } catch {
    return null;
  }
};

export const config = {
  getFonts,
  setFonts,
  getPostscriptName,
};
