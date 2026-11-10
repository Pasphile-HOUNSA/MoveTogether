import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Search, Users } from 'lucide-react';
import { toast } from 'sonner';
import { listerTrajets, type Filtres, type Trajet } from '../../lib/trajets-api';

const LIMIT = 10;

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900';

function formatPrix(prix: string) {
  return `${new Intl.NumberFormat('fr-FR').format(Number(prix))} FCFA`;
}

function formatDate(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });
}

export default function RideSearchPage() {
  const [form, setForm] = useState({ lieu_depart: '', lieu_arrivee: '', date: '', max_price: '' });
  const [filtres, setFiltres] = useState<Filtres>({});
  const [page, setPage] = useState(1);
  const [trajets, setTrajets] = useState<Trajet[]>([]);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    let annule = false;
    setChargement(true);
    listerTrajets({ ...filtres, page, limit: LIMIT })
      .then((r) => {
        if (!annule) setTrajets(r.data);
      })
      .catch((e: Error) => {
        if (!annule) toast.error(e.message || 'Impossible de charger les trajets');
      })
      .finally(() => {
        if (!annule) setChargement(false);
      });
    return () => {
      annule = true;
    };
  }, [filtres, page]);

  const rechercher = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setFiltres(form);
  };

  const reinitialiser = () => {
    const vide = { lieu_depart: '', lieu_arrivee: '', date: '', max_price: '' };
    setForm(vide);
    setPage(1);
    setFiltres({});
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Rechercher un trajet</h1>

        <form
          onSubmit={rechercher}
          className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-5"
        >
          <input
            className={inputClass}
            placeholder="Départ"
            value={form.lieu_depart}
            onChange={(e) => setForm({ ...form, lieu_depart: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Arrivée"
            value={form.lieu_arrivee}
            onChange={(e) => setForm({ ...form, lieu_arrivee: e.target.value })}
          />
          <input
            type="date"
            className={inputClass}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            type="number"
            min="0"
            className={inputClass}
            placeholder="Prix max (FCFA)"
            value={form.max_price}
            onChange={(e) => setForm({ ...form, max_price: e.target.value })}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
            >
              <Search className="size-4" /> Chercher
            </button>
            <button
              type="button"
              onClick={reinitialiser}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
            >
              Effacer
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-3">
          {chargement && <p className="text-sm text-slate-500">Chargement...</p>}

          {!chargement && trajets.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
              Aucun trajet ne correspond à votre recherche.
            </p>
          )}

          {trajets.map((t) => (
            <Link
              key={t.idtrajet}
              to={`/rides/${t.idtrajet}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  {t.lieu_depart} <ArrowRight className="size-4 text-slate-400" /> {t.lieu_arrivee}
                </div>
                <div className="text-lg font-bold">{formatPrix(t.price)}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" /> {formatDate(t.datedepart)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-4" /> {t.heuredepart.slice(0, 5)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-4" /> {t.placesdispo} place{t.placesdispo > 1 ? 's' : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={page === 1 || chargement}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40 dark:border-slate-700"
          >
            Précédent
          </button>
          <span className="text-sm text-slate-500">Page {page}</span>
          <button
            disabled={trajets.length < LIMIT || chargement}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40 dark:border-slate-700"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}