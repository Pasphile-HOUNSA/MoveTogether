import type { Trajet } from "@/types/types";

const trajets: Trajet[] = [
  { depart: "Cotonou", arrivee: "Abomey-Calavi", prix: "1 000 FCFA", duree: "30 min", places: 2 },
  { depart: "Porto-Novo", arrivee: "Cotonou", prix: "1 500 FCFA", duree: "45 min", places: 3 },
  { depart: "Cotonou", arrivee: "Lomé", prix: "7 500 FCFA", duree: "3 h 20", places: 4 },
  { depart: "Cotonou", arrivee: "Parakou", prix: "9 000 FCFA", duree: "6 h", places: 1 },
];

function TripCard({ depart, arrivee, prix, duree, places }: Trajet) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-[#64748B]">
        <span>{duree}</span>
        {places !== undefined && (
          <span>{places} place{places > 1 ? "s" : ""}</span>
        )}
      </div>
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-[#1E293B]">
        <span className="h-2 w-2 rounded-full bg-[#245FDB]" />
        {depart}
      </div>
      <div className="ml-0.75 h-4 border-l-2 border-dotted border-[#CBD5E1]" />
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E293B]">
        <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
        {arrivee}
      </div>
      <div className="text-lg font-bold text-[#245FDB]">{prix}</div>
    </div>
  );
}

export default function PopularTrips() {
  return (
    <section className="bg-[#EEF2F8] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-10 text-2xl font-bold text-[#1E293B]">Trajets populaires</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trajets.map((t) => (
            <TripCard key={`${t.depart}-${t.arrivee}`} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
