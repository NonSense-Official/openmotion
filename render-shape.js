function refHelperOuter(refArgTotal, refArgMin) {
  for (let refShapeType of refArgTotal.layers || []) refShapeType.shapeType && refShapeType.shapeType[0] === '.' && refArgMin.add(refShapeType.shapeType), refShapeType.scene && refHelperOuter(refShapeType.scene, refArgMin);
  return refArgMin;
}
export { refHelperOuter };
