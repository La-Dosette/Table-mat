import { useMemo, useState } from 'react';
import type { Attempt, UserVote } from './types';
import { ATTEMPTS } from './data/attempts';
import { MATERIALS, getMachine, getMaterial } from './data/materials';
import { Filters, type FilterState } from './components/Filters';
import { CompatibilityMatrix } from './components/CompatibilityMatrix';
import { CellDetailDrawer } from './components/CellDetailDrawer';
import { ProtocolPanel } from './components/ProtocolPanel';

/** Clé non ordonnée d'une paire de matériaux : pair(a,b) === pair(b,a). */
function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

export default function App() {
  const [attempts, setAttempts] = useState<Attempt[]>(ATTEMPTS);
  const [userVotes, setUserVotes] = useState<Record<string, UserVote>>({});
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    system: 'all',
    hideEmpty: false,
  });
  const [selected, setSelected] = useState<{ a: string; b: string } | null>(null);

  // --- Filtrage des essais selon la barre de filtres ---
  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return attempts.filter((a) => {
      if (filters.system !== 'all') {
        const machine = getMachine(a.machineId);
        if (!machine || machine.system !== filters.system) return false;
      }
      if (q) {
        const matA = getMaterial(a.materialA);
        const matB = getMaterial(a.materialB);
        const haystack = [
          a.brandA,
          a.brandB,
          a.author,
          a.notes,
          matA?.name,
          matA?.fullName,
          matB?.name,
          matB?.fullName,
          getMachine(a.machineId)?.name,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [attempts, filters.system, filters.query]);

  // --- Index paire -> essais ---
  const byPair = useMemo(() => {
    const map = new Map<string, Attempt[]>();
    for (const a of filtered) {
      const key = pairKey(a.materialA, a.materialB);
      const list = map.get(key);
      if (list) list.push(a);
      else map.set(key, [a]);
    }
    return map;
  }, [filtered]);

  const attemptsFor = (a: string, b: string) => byPair.get(pairKey(a, b)) ?? [];

  // --- Matériaux visibles (option « masquer les combinaisons vides ») ---
  const visibleMaterials = useMemo(() => {
    if (!filters.hideEmpty) return MATERIALS;
    const used = new Set<string>();
    for (const a of filtered) {
      used.add(a.materialA);
      used.add(a.materialB);
    }
    return MATERIALS.filter((m) => used.has(m.id));
  }, [filters.hideEmpty, filtered]);

  // --- Vote communautaire (état local) ---
  function vote(id: string, dir: 'up' | 'down') {
    const prev = userVotes[id] ?? null;
    const next: UserVote = prev === dir ? null : dir;
    setAttempts((list) =>
      list.map((a) => {
        if (a.id !== id) return a;
        let { votesUp, votesDown } = a;
        if (prev === 'up') votesUp--;
        if (prev === 'down') votesDown--;
        if (next === 'up') votesUp++;
        if (next === 'down') votesDown++;
        return { ...a, votesUp, votesDown };
      }),
    );
    setUserVotes((v) => ({ ...v, [id]: next }));
  }

  const totalVotes = attempts.reduce((s, a) => s + a.votesUp + a.votesDown, 0);
  const selectedMatA = selected ? getMaterial(selected.a) : null;
  const selectedMatB = selected ? getMaterial(selected.b) : null;
  const selectedAttempts = selected ? attemptsFor(selected.a, selected.b) : [];

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img className="brand-logo" src="./favicon.svg" alt="" />
          <div>
            <h1>Table-Mat</h1>
            <p className="tag">La matrice communautaire de l’impression multi-matériaux</p>
          </div>
        </div>
        <div className="spacer" />
        <span className="pill-stat">
          <b>{attempts.length}</b> essais
        </span>
        <span className="pill-stat">
          <b>{totalVotes}</b> votes
        </span>
        <span className="pill-stat">
          <b>{MATERIALS.length}</b> matériaux
        </span>
      </header>

      <div className="intro">
        <p>
          Bienvenue&nbsp;! Chaque case croise deux matériaux et affiche le{' '}
          <b>score de viabilité</b> calculé à partir des essais partagés par la
          communauté. <b>Survolez</b> une case pour un aperçu, <b>cliquez</b> pour
          voir tous les réglages (machine, températures, purge…), et <b>votez</b>{' '}
          pour faire vivre les notes selon vos propres résultats.
        </p>
      </div>

      <Filters value={filters} onChange={setFilters} />

      {visibleMaterials.length === 0 ? (
        <div className="matrix-wrap">
          <div className="empty-state">
            Aucun essai ne correspond à ces filtres. Essayez d’élargir la recherche.
          </div>
        </div>
      ) : (
        <CompatibilityMatrix
          materials={visibleMaterials}
          attemptsFor={attemptsFor}
          selected={selected}
          onSelect={(a, b) => setSelected({ a, b })}
        />
      )}

      <ProtocolPanel />

      <footer className="footer">
        Table-Mat · prototype communautaire open-source — données d’exemple.
        <br />
        Prochaine étape&nbsp;: comptes utilisateurs, soumission d’essais et backend partagé.
      </footer>

      {selected && selectedMatA && selectedMatB && (
        <CellDetailDrawer
          matA={selectedMatA}
          matB={selectedMatB}
          attempts={selectedAttempts}
          userVotes={userVotes}
          onVote={vote}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
