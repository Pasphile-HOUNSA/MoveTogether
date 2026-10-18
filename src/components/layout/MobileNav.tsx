import { useState } from "react";
import { ChatIcon, HomeIcon, PlusIcon, ProfileIcon } from "../ui/Icons";

const onglets = [
  { id: "accueil", label: "Accueil", icone: HomeIcon },
  { id: "messages", label: "Messages", icone: ChatIcon },
  { id: "profil", label: "Profil", icone: ProfileIcon },
] as const;

export default function MobileNav() {
  const [actif, setActif] = useState<(typeof onglets)[number]["id"]>("accueil");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[#E5E7EB] bg-white px-6 py-2 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] sm:hidden">
      <button
        type="button"
        onClick={() => setActif("accueil")}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
          actif === "accueil" ? "text-[#245FDB]" : "text-[#94A3B8]"
        }`}
      >
        <HomeIcon className="h-5 w-5" />
        Accueil
      </button>

      <button
        type="button"
        onClick={() => setActif("messages")}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
          actif === "messages" ? "text-[#245FDB]" : "text-[#94A3B8]"
        }`}
      >
        <ChatIcon className="h-5 w-5" />
        Messages
      </button>

      <a
        href="/trajets/publier"
        className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-[#6D9EEB] to-[#245FDB] text-white shadow-md"
      >
        <PlusIcon className="h-6 w-6" />
      </a>

      <button
        type="button"
        onClick={() => setActif("profil")}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
          actif === "profil" ? "text-[#245FDB]" : "text-[#94A3B8]"
        }`}
      >
        <ProfileIcon className="h-5 w-5" />
        Profil
      </button>
    </nav>
  );
}
