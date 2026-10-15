"use client";

import { useMemo } from "react";
import { useLokasi } from "./hooks/useLokasi";
import { useJadwal } from "./hooks/useJadwal";
import { useJamBerjalan } from "./hooks/useJamBerjalan";
import { useAdzan } from "./hooks/useAdzan";
import { hitungProgres, hitungSholat } from "./utils";
import KartuUtama from "./components/KartuUtama";
import PengaturanAdzan from "./components/PengaturanAdzan";
import DaftarWaktu from "./components/DaftarWaktu";

export default function JadwalSholat() {
  const { koordinat, statusLokasi, mintaLokasi } = useLokasi();
  const { hasil, status } = useJadwal(koordinat.lat, koordinat.lng);
  const now = useJamBerjalan();
  const {
    pengingat,
    suaraAktif,
    sedangBunyi,
    pesanSuara,
    aktifkanSuara,
    nonaktifkanSuara,
    togglePengingat,
    hentikanAdzan,
  } = useAdzan(hasil, now);

  const info = useMemo(
    () => (hasil && now ? hitungSholat(hasil.waktu, now) : null),
    [hasil, now],
  );
  const { progres, sisa } =
    info && now
      ? hitungProgres(info, now)
      : { progres: 0, sisa: { h: 0, m: 0, s: 0 } };

  return (
    <div className="space-y-5 pb-18">
      <KartuUtama
        hasil={hasil}
        info={info}
        progres={progres}
        sisa={sisa}
        statusLokasi={statusLokasi}
        namaLokasi={koordinat.nama}
        status={status}
        onRefreshLokasi={mintaLokasi}
      />
      <PengaturanAdzan
        suaraAktif={suaraAktif}
        sedangBunyi={sedangBunyi}
        pesan={pesanSuara}
        onAktifkan={aktifkanSuara}
        onNonaktifkan={nonaktifkanSuara}
        onHentikan={hentikanAdzan}
      />
      <DaftarWaktu
        hasil={hasil}
        info={info}
        pengingat={pengingat}
        onToggle={togglePengingat}
      />
    </div>
  );
}
