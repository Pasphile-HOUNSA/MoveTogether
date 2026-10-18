export default function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-linear-to-r from-[#6D9EEB] to-[#245FDB] p-10 sm:p-12 lg:flex-row lg:items-center">
        <div>
          <h2 className="max-w-md text-2xl font-bold text-white">
            Vous roulez déjà ce trajet ? Faites-le payer un peu moins.
          </h2>
          <p className="mt-2 max-w-md text-white/85">
            Publiez votre trajet en 2 minutes et partagez vos frais avec des passagers vérifiés.
          </p>
        </div>
        <a
          href="/register?role=conducteur"
          className="whitespace-nowrap rounded-full bg-[#EF4444] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#DC2626]"
        >
          Publier un trajet
        </a>
      </div>
    </section>
  );
}
