import type { Conducteur } from "@/types/types";
import { StarIcon } from "lucide-react";

const conducteur: Conducteur = {
  nom: "Thomas Durand",
  membreDepuis: "2021",
  note: 4.9,
  trajetsRecents: [
    { depart: "Cotonou", arrivee: "Abomey-Calavi", date: "12/05/2024", prix: "1 000 FCFA" },
    { depart: "Porto-Novo", arrivee: "Cotonou", date: "05/04/2024", prix: "1 500 FCFA" },
  ],
};

export default function DriverSpotlight() {
  return (
    <section id="conducteurs" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-10 text-2xl font-bold text-[#1E293B]">Nos conducteurs</h2>

      <div className="mx-auto max-w-sm overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="bg-linear-to-br from-[#6D9EEB] to-[#245FDB] px-6 pb-12 pt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-lg font-bold text-[#245FDB]">
            TD
          </div>
          <h3 className="mt-3 font-semibold text-white">{conducteur.nom}</h3>
          <p className="text-xs text-white/80">Membre depuis {conducteur.membreDepuis}</p>
        </div>

        <div className="-mt-6 rounded-t-2xl bg-white px-6 pb-6 pt-4">
          <div className="mb-4 flex items-center justify-center gap-1 text-[#F59E0B]">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${i < Math.round(conducteur.note) ? "" : "text-[#E5E7EB]"}`}
              />
            ))}
            <span className="ml-2 text-sm font-medium text-[#1E293B]">{conducteur.note}</span>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            Trajets récents
          </p>
          <ul className="space-y-2">
            {conducteur.trajetsRecents.map((t) => (
              <li
                key={`${t.depart}-${t.arrivee}`}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-[#1E293B]">{t.depart} → {t.arrivee}</span>
                <span className="text-[#64748B]">{t.date}</span>
              </li>
            ))}
          </ul>

          <a
            href="/conducteurs/thomas-durand"
            className="mt-5 block rounded-full bg-[#245FDB] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#1E4FBB]"
          >
            Voir le profil
          </a>
        </div>
      </div>
    </section>
  );
}
