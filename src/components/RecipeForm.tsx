import { useMemo, useState } from 'react';
import type {
  GlobalRatings,
  MaterialInterface,
  MaterialSlot,
  Recipe,
} from '../types';
import { MATERIALS, MACHINES, getMaterial } from '../data/materials';
import { CRITERIA, scoreColor } from '../lib/scoring';
import { useEscapeKey } from '../lib/useEscapeKey';

interface Props {
  onSubmit: (recipe: Recipe) => void;
  onClose: () => void;
  /** Recette à éditer ; absent = création d'une nouvelle recette. */
  initial?: Recipe;
}

interface SlotDraft {
  material: string;
  brand: string;
  nozzleTemp: string;
  label: string;
}

const GLOBAL_CRITERIA = CRITERIA.filter((c) => !c.perInterface);

function emptySlot(material = ''): SlotDraft {
  return { material, brand: '', nozzleTemp: '', label: '' };
}

function pairKey(a: string, b: string) {
  return [a, b].sort().join('|');
}

/** Paires de matériaux candidates (distinctes + auto-paires si doublon). */
function computeCandidatePairs(mats: string[]): [string, string][] {
  const present = mats.filter(Boolean);
  const distinct = [...new Set(present)];
  const pairs: [string, string][] = [];
  for (let i = 0; i < distinct.length; i++)
    for (let j = i + 1; j < distinct.length; j++) pairs.push([distinct[i], distinct[j]]);
  const counts: Record<string, number> = {};
  present.forEach((m) => (counts[m] = (counts[m] || 0) + 1));
  distinct.forEach((m) => counts[m] >= 2 && pairs.push([m, m]));
  return pairs;
}

export function RecipeForm({ onSubmit, onClose, initial }: Props) {
  useEscapeKey(onClose);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [author, setAuthor] = useState(initial?.author ?? '');
  const [machineId, setMachineId] = useState(initial?.machineId ?? MACHINES[0].id);
  const [slots, setSlots] = useState<SlotDraft[]>(() =>
    initial
      ? initial.slots.map((s) => ({
          material: s.material, brand: s.brand, nozzleTemp: String(s.nozzleTemp), label: s.label ?? '',
        }))
      : [emptySlot('pla'), emptySlot('petg')],
  );
  const [adhesion, setAdhesion] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    initial?.interfaces.forEach((i) => (m[pairKey(i.a, i.b)] = i.adhesion));
    return m;
  });
  const [excluded, setExcluded] = useState<Set<string>>(() => {
    if (!initial) return new Set();
    const present = new Set(initial.interfaces.map((i) => pairKey(i.a, i.b)));
    return new Set(
      computeCandidatePairs(initial.slots.map((s) => s.material))
        .map(([a, b]) => pairKey(a, b))
        .filter((k) => !present.has(k)),
    );
  });
  const [global, setGlobal] = useState<GlobalRatings>(
    initial?.global ?? {
      printQuality: 3, reliability: 3, warpResistance: 3, interfaceCleanliness: 3, separability: 3,
    },
  );
  const [params, setParams] = useState(() =>
    initial
      ? {
          bedTemp: String(initial.params.bedTemp),
          chamberTemp: initial.params.chamberTemp ? String(initial.params.chamberTemp) : '',
          layerHeight: String(initial.params.layerHeight),
          printSpeed: String(initial.params.printSpeed),
          nozzleDiameter: String(initial.params.nozzleDiameter),
          purgeVolume: initial.params.purgeVolume ? String(initial.params.purgeVolume) : '',
          interfaceLayers: initial.params.interfaceLayers ? String(initial.params.interfaceLayers) : '',
        }
      : {
          bedTemp: '60', chamberTemp: '', layerHeight: '0.2', printSpeed: '80',
          nozzleDiameter: '0.4', purgeVolume: '', interfaceLayers: '',
        },
  );
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState('');

  // Paires candidates déduites des matériaux choisis.
  const candidatePairs = useMemo<[string, string][]>(
    () => computeCandidatePairs(slots.map((s) => s.material)),
    [slots],
  );

  const activePairs = candidatePairs.filter(([a, b]) => !excluded.has(pairKey(a, b)));

  function updateSlot(i: number, patch: Partial<SlotDraft>) {
    setSlots((s) => s.map((slot, idx) => (idx === i ? { ...slot, ...patch } : slot)));
  }
  function addSlot() {
    setSlots((s) => [...s, emptySlot()]);
  }
  function removeSlot(i: number) {
    setSlots((s) => (s.length > 2 ? s.filter((_, idx) => idx !== i) : s));
  }

  function handleSubmit() {
    if (!title.trim()) return setError('Donne un titre à ta recette.');
    const cleanSlots = slots.filter((s) => s.material);
    if (cleanSlots.length < 2) return setError('Il faut au moins 2 matériaux.');
    if (activePairs.length === 0) return setError('Il faut au moins une interface en contact.');

    const finalSlots: MaterialSlot[] = cleanSlots.map((s) => ({
      material: s.material,
      brand: s.brand.trim() || 'Marque inconnue',
      nozzleTemp: Number(s.nozzleTemp) || 0,
      label: s.label.trim() || undefined,
    }));

    const interfaces: MaterialInterface[] = activePairs.map(([a, b]) => ({
      a, b, adhesion: adhesion[pairKey(a, b)] ?? 3,
    }));

    const recipe: Recipe = {
      id: initial?.id ?? `r${Date.now()}`,
      title: title.trim(),
      slots: finalSlots,
      interfaces,
      machineId,
      author: author.trim() || 'anonyme',
      date: initial?.date ?? new Date().toISOString().slice(0, 10),
      global,
      params: {
        bedTemp: Number(params.bedTemp) || 0,
        chamberTemp: params.chamberTemp ? Number(params.chamberTemp) : undefined,
        layerHeight: Number(params.layerHeight) || 0.2,
        printSpeed: Number(params.printSpeed) || 0,
        nozzleDiameter: Number(params.nozzleDiameter) || 0.4,
        purgeVolume: params.purgeVolume ? Number(params.purgeVolume) : undefined,
        interfaceLayers: params.interfaceLayers ? Number(params.interfaceLayers) : undefined,
      },
      notes: notes.trim(),
      votesUp: initial?.votesUp ?? 0,
      votesDown: initial?.votesDown ?? 0,
    };
    onSubmit(recipe);
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer form-drawer" role="dialog" aria-label="Ajouter une recette">
        <div className="drawer-head">
          <div style={{ flex: 1 }}>
            <h3>{initial ? '✎ Éditer la recette' : '➕ Nouvelle recette'}</h3>
            <p className="sub">
              {initial ? 'Modifie les réglages puis enregistre.' : 'Nouvelle entrée.'}
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <div className="drawer-body">
          {/* Infos générales */}
          <div className="form-group">
            <label className="field">
              <span>Titre de la recette *</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ex. Figurine multicolore + support" />
            </label>
            <div className="field-row">
              <label className="field">
                <span>Pseudo</span>
                <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="anonyme" />
              </label>
              <label className="field">
                <span>Machine</span>
                <select value={machineId} onChange={(e) => setMachineId(e.target.value)}>
                  {MACHINES.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} (max {m.maxMaterials})</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Matériaux (slots) */}
          <div className="section-title">Matériaux ({slots.length})</div>
          {slots.map((s, i) => {
            const m = getMaterial(s.material);
            return (
              <div className="slot-edit" key={i}>
                <span className="mat-dot" style={{ background: m?.accent ?? '#334' }} />
                <select value={s.material} onChange={(e) => updateSlot(i, { material: e.target.value })}>
                  <option value="">— matière —</option>
                  {MATERIALS.map((mm) => <option key={mm.id} value={mm.id}>{mm.name}</option>)}
                </select>
                <input className="grow" value={s.brand} onChange={(e) => updateSlot(i, { brand: e.target.value })} placeholder="Marque / filament" />
                <input className="mini" value={s.label} onChange={(e) => updateSlot(i, { label: e.target.value })} placeholder="rôle" />
                <input className="mini" type="number" value={s.nozzleTemp} onChange={(e) => updateSlot(i, { nozzleTemp: e.target.value })} placeholder="°C" />
                <button className="icon-btn" onClick={() => removeSlot(i)} disabled={slots.length <= 2} title="Retirer">✕</button>
              </div>
            );
          })}
          <button className="add-btn" onClick={addSlot}>+ Ajouter un matériau</button>

          {/* Interfaces (contacts entre matériaux) */}
          <div className="section-title" style={{ marginTop: 18 }}>
            Interfaces — note l’adhérence de chaque contact
          </div>
          {activePairs.length === 0 && (
            <p className="hint">Choisis au moins deux matériaux pour générer les interfaces.</p>
          )}
          {candidatePairs.map(([a, b]) => {
            const key = pairKey(a, b);
            const ma = getMaterial(a);
            const mb = getMaterial(b);
            const isExcluded = excluded.has(key);
            const val = adhesion[key] ?? 3;
            return (
              <div className={`iface-edit ${isExcluded ? 'off' : ''}`} key={key}>
                <span className="iface-pair">
                  <span className="mat-dot" style={{ background: ma?.accent }} />
                  {ma?.name}
                  <span className="iface-link">↔</span>
                  <span className="mat-dot" style={{ background: mb?.accent }} />
                  {mb?.name}
                </span>
                {isExcluded ? (
                  <span className="off-tag">ne se touchent pas</span>
                ) : (
                  <>
                    <input
                      type="range" min={0} max={5} step={1} value={val}
                      aria-label={`Adhérence ${ma?.name} ↔ ${mb?.name}`}
                      onChange={(e) => setAdhesion((p) => ({ ...p, [key]: Number(e.target.value) }))}
                    />
                    <span className="val" style={{ color: scoreColor((val / 5) * 100) }}>{val}/5</span>
                  </>
                )}
                <button
                  className="icon-btn"
                  title={isExcluded ? 'Remettre en contact' : 'Pas en contact'}
                  onClick={() =>
                    setExcluded((s) => {
                      const n = new Set(s);
                      n.has(key) ? n.delete(key) : n.add(key);
                      return n;
                    })
                  }
                >
                  {isExcluded ? '+' : '–'}
                </button>
              </div>
            );
          })}

          {/* Critères globaux */}
          <div className="section-title" style={{ marginTop: 18 }}>Critères globaux</div>
          {GLOBAL_CRITERIA.map((c) => {
            const val = global[c.key as keyof GlobalRatings];
            return (
              <div className="rating-edit" key={c.key} title={c.help}>
                <span className="crit-label">{c.label}</span>
                <input
                  type="range" min={0} max={5} step={1} value={val}
                  aria-label={c.label}
                  onChange={(e) => setGlobal((g) => ({ ...g, [c.key]: Number(e.target.value) }))}
                />
                <span className="val" style={{ color: scoreColor((val / 5) * 100) }}>{val}/5</span>
              </div>
            );
          })}

          {/* Réglages */}
          <div className="section-title" style={{ marginTop: 18 }}>Réglages d’impression</div>
          <div className="params-edit">
            <ParamInput label="Plateau °C" v={params.bedTemp} on={(x) => setParams((p) => ({ ...p, bedTemp: x }))} />
            <ParamInput label="Caisson °C" v={params.chamberTemp} on={(x) => setParams((p) => ({ ...p, chamberTemp: x }))} ph="—" />
            <ParamInput label="Couche mm" v={params.layerHeight} on={(x) => setParams((p) => ({ ...p, layerHeight: x }))} />
            <ParamInput label="Vitesse mm/s" v={params.printSpeed} on={(x) => setParams((p) => ({ ...p, printSpeed: x }))} />
            <ParamInput label="Buse Ø mm" v={params.nozzleDiameter} on={(x) => setParams((p) => ({ ...p, nozzleDiameter: x }))} />
            <ParamInput label="Purge mm³" v={params.purgeVolume} on={(x) => setParams((p) => ({ ...p, purgeVolume: x }))} ph="—" />
            <ParamInput label="Interface (c.)" v={params.interfaceLayers} on={(x) => setParams((p) => ({ ...p, interfaceLayers: x }))} ph="—" />
          </div>

          <label className="field" style={{ marginTop: 14 }}>
            <span>Notes / retour d’expérience</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Astuces, pièges, séchage, purge…" />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn-primary" onClick={handleSubmit}>
              {initial ? 'Enregistrer les modifications' : 'Publier la recette'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function ParamInput({ label, v, on, ph }: { label: string; v: string; on: (x: string) => void; ph?: string }) {
  return (
    <label className="param-edit">
      <span>{label}</span>
      <input type="number" value={v} onChange={(e) => on(e.target.value)} placeholder={ph ?? ''} />
    </label>
  );
}
