import { OM_DEFAULT_FONTS, omEnsureGoogleFont, renderer } from './state.js';
function omGetFontList() {
  const custom = (renderer && renderer.customFonts ? Array.from(renderer.customFonts.keys()) : []).filter(omGetFontListArg => !omGetFontListArg.includes("/"));
  const extra = (typeof window !== "undefined" && window.AM_FONTS ? window.AM_FONTS.map(omGetFontListArgValue => omGetFontListArgValue.name) : []);
  const omgetfontlisSet = new Set([...custom, ...extra, ...OM_DEFAULT_FONTS]);
  return Array.from(omgetfontlisSet);
}
async function omImportFontFile(file) {
  if (!file) return null;
  const fontName = file.name.replace(/\.[^/.]+$/, "");
  await window.AM.loadFont(fontName, file);
  if (renderer) {
    renderer.customFonts.set(fontName, fontName);
  }
  if (typeof window !== "undefined" && window.AM_FONTS) {
    window.AM_FONTS.unshift({ name: fontName, family: fontName, popular: true });
  }
  omEnsureGoogleFont(fontName);
  return fontName;
}
export { omGetFontList, omImportFontFile };
