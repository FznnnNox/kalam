"use client";

import { useKompas } from "./hooks/useKompas";
import { arahKiblat, jarakKiblat } from "./utils";
import PiringanKiblat from "./components/PiringanKiblat";
import WaktuSholatBawah from "./components/WaktuSholatBawah";

export default function Kompas() {
  const { koordinat, hasil, heading, perluIzinSensor, aktifkanSensor } = useKompas();

  const qibla = koordinat ? arahKiblat(koordinat.lat, koordinat.lng) : 0;
  const jarak = koordinat ? jarakKiblat(koordinat.lat, koordinat.lng) : null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 pb-14">
      <WaktuSholatBawah hasil={hasil} />
      <PiringanKiblat
        qibla={qibla}
        heading={heading}
        jarak={jarak}
        perluIzinSensor={perluIzinSensor}
        onAktifkanSensor={aktifkanSensor}
      />
    </div>
  );
}