import { CRITERIA } from '../lib/scoring';

export function ProtocolPanel() {
  return (
    <section className="protocol" id="protocole">
      <h2>Le protocole Table-Mat</h2>
      <p>
        Une <b>recette</b> est un essai d’impression à 2 à N matériaux. L’
        <b>adhérence est notée par interface</b> (chaque contact entre deux
        matériaux), les 5 autres critères sont globaux. Le <b>score de viabilité</b>{' '}
        (0–100) est une moyenne pondérée, <b>ajustée par les votes</b> de la
        communauté. Une recette à 4 matériaux se décompose en interfaces qui
        alimentent plusieurs cases de la matrice.
      </p>
      <div className="crit-grid">
        {CRITERIA.map((c) => (
          <div className="crit-card" key={c.key}>
            <div className="crit-head">
              <span className="name">{c.label}</span>
              <span className="w">{Math.round(c.weight * 100)}%</span>
            </div>
            <p>{c.help}</p>
            {c.perInterface && <span className="pi-tag">par interface</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
