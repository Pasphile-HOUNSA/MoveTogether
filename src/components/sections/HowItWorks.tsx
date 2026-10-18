import { CarIcon } from "lucide-react";
import { ProfileIcon, ChatIcon } from "../ui/Icons";

const etapes = [
  {
    icone: CarIcon,
    titre: "Proposez un trajet",
    texte: "Indiquez votre ville de départ, votre destination et le prix par personne.",
  },
  {
    icone: ProfileIcon,
    titre: "Réservez une place",
    texte: "Choisissez un conducteur, payez en ligne et recevez votre confirmation.",
  },
  {
    icone: ChatIcon,
    titre: "Échangez par message",
    texte: "Convenez du point de rendez-vous directement avec votre conducteur ou passager.",
  },
];

export default function HowItWorks() {
  return (
    <section id="comment" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-10 text-center text-2xl font-bold text-[#1E293B]">
        Comment ça marche
      </h2>
      <div className="grid gap-8 sm:grid-cols-3">
        {etapes.map(({ icone: Icone, titre, texte }) => (
          <div key={titre} className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-[#6D9EEB] to-[#245FDB] text-white">
              <Icone className="h-6 w-6" />
            </span>
            <h3 className="mb-2 text-base font-semibold text-[#1E293B]">{titre}</h3>
            <p className="text-sm text-[#64748B]">{texte}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
