const stats = [
  { valeur: "12 400", label: "Trajets partagés ce mois" },
  { valeur: "3 200", label: "Conducteurs vérifiés" },
  { valeur: "4,8/5", label: "Note moyenne des trajets" },
];

export default function StatsSection() {
  return (
    <section className="border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-[#E5E7EB] px-6 py-10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-4 text-center sm:py-0">
            <div className="text-3xl font-bold text-[#245FDB]">{s.valeur}</div>
            <div className="mt-1 text-sm text-[#64748B]">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
