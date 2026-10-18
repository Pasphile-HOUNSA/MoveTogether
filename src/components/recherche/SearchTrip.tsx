import type { Trajet } from "@/types/types";
import { useState } from "react";

const resultatsDemo: Trajet[] = [
  { depart: "Cotonou", arrivee: "Abomey-Calavi", prix: "1 000 FCFA" },
  { depart: "Porto-Novo", arrivee: "Cotonou", prix: "1 500 FCFA" },
];

export default function SearchTrip() {
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");

  return (
    <section id="rechercher" className="relative">
      {/* bandeau dégradé en fond */}
      <div className="bg-linear-to-br from-[#6D9EEB] to-[#245FDB] pb-28 pt-16 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Trouvez votre prochain trajet
        </h1>
        <p className="mx-auto mt-3 max-w-md text-white/85">
          Des conducteurs partent tous les jours près de chez vous. Trouvez le vôtre en
          quelques secondes.
        </p>
      </div>

      {/* panneau blanc qui chevauche le dégradé, comme sur la maquette */}
      <div className="mx-auto -mt-20 max-w-md px-6">
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="mb-4 text-base font-semibold text-[#1E293B]">
            Rechercher un trajet
          </h2>

          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              value={depart}
              onChange={(e) => setDepart(e.target.value)}
              placeholder="Ville de départ"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#1E293B] outline-none focus:border-[#245FDB] focus:ring-2 focus:ring-[#245FDB]/20"
            />
            <input
              value={arrivee}
              onChange={(e) => setArrivee(e.target.value)}
              placeholder="Destination"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#1E293B] outline-none focus:border-[#245FDB] focus:ring-2 focus:ring-[#245FDB]/20"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-linear-to-r from-[#6D9EEB] to-[#245FDB] py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Chercher
            </button>
          </form>

          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#245FDB]">
              Résultats
            </p>
            <ul className="divide-y divide-[#E5E7EB]">
              {resultatsDemo.map((r) => (
                <li key={`${r.depart}-${r.arrivee}`} className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-[#1E293B]">
                    {r.depart} → {r.arrivee}
                  </span>
                  <span className="text-sm font-semibold text-[#245FDB]">Prix: {r.prix}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
