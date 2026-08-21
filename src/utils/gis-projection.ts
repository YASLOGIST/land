/**
 * 6G GIS Geographic Projection & Route Interpolation Matrix
 * Converts real-world GPS WGS-84 Coordinates [longitude, latitude] into 
 * exact cartographic SVG coordinates on a 1000x500 Equirectangular canvas.
 */

export interface GeoCoordinate {
  lng: number
  lat: number
}

/**
 * Projects a [longitude, latitude] pair onto a standard SVG canvas.
 * @param lng Longitude (-180 to 180)
 * @param lat Latitude (-90 to 90)
 * @param width Canvas width in SVG units (default 1000)
 * @param height Canvas height in SVG units (default 500)
 */
export function projectGeo(
  [lng, lat]: [number, number],
  width = 1000,
  height = 500,
): [number, number] {
  const x = ((lng + 180) / 360) * width
  const y = ((90 - lat) / 180) * height
  return [Number(x.toFixed(2)), Number(y.toFixed(2))]
}

/**
 * Returns an SVG percentage string for HTML overlay positioning.
 */
export function projectGeoPercent([lng, lat]: [number, number]): { left: string; top: string } {
  const [x, y] = projectGeo([lng, lat], 1000, 500)
  return {
    left: `${(x / 10).toFixed(2)}%`,
    top: `${(y / 5).toFixed(2)}%`,
  }
}
