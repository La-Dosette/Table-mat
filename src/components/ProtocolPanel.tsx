import { CRITERIA } from '../lib/scoring';

export function ProtocolPanel() {
  return (
    <section className="protocol" id="protocole">
      <h2>Le protocole Table-Mat</h2>
      <p>
        Chaque essai est noté par son auteur sur 6 critères (de 0 à 5). Le{' '}
        <b>score de viabilité</b> est une moyenne pondérée ramenée sur 100, puis{' '}
        <b>ajusté par la communauté</b> : qui reproduit un réglage peut voter
        « ça marche » ou « pas concluant ». Plus une combinaison est testée, plus
        son score gagne en fiabilité.
      </p>
      <div className="crit-grid">
        {CRITERIA.map((c) => (
          <div className="crit-card" key={c.key}>
            <div className="crit-head">
              <span className="name">{c.label}</span>
              <span className="w">{Math.round(c.weight * 100)}%</span>
            </div>
            <p>{c.help}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
