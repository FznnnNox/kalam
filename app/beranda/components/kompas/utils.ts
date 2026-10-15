export const KABAH = { lat: 21.4225, lng: 39.8262 };

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

// arah kiblat dalam derajat dari utara (searah jarum jam)
export function arahKiblat(lat: number, lng: number) {
  const φ1 = rad(lat);
  const φ2 = rad(KABAH.lat);
  const Δλ = rad(KABAH.lng - lng);
  const y = Math.sin(Δλ);
  const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

// jarak lingkaran besar (haversine) dalam kilometer
export function jarakKiblat(lat: number, lng: number) {
  const R = 6371;
  const dLat = rad(KABAH.lat - lat);
  const dLng = rad(KABAH.lng - lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat)) * Math.cos(rad(KABAH.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}