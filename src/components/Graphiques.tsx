/**
 * Graphiques (Recharts). Conventions :
 *  - un seul axe des ordonnées par graphique ;
 *  - le budget 2026 est hachuré, une simulation est en tirets ;
 *  - les textes restent dans les couleurs d'encre, la couleur porte l'identité des séries ;
 *  - infobulle au survol sur chaque marque.
 */
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts';
import { euros, nombre, pourcent, selonFormat } from '../lib/format';

export const couleurSerie = (i: number) => `var(--g${(i % 5) + 1})`;
const axe = { stroke: 'var(--c-ligne-forte)', tickLine: false, axisLine: false } as const;
const kFormat = (v: number) => (Math.abs(v) >= 1000 ? `${nombre(v / 1000)} k` : nombre(v));

/** Motifs hachurés du budget. Recharts n'affiche que ses propres enfants et les <defs> : on retourne donc directement un élément <defs>. */
function hachures(ids: number[]) {
  return (
    <defs>
      {ids.map((i) => (
        <pattern key={i} id={`hachure-${i}`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <rect width="6" height="6" style={{ fill: couleurSerie(i), opacity: 0.25 }} />
          <line x1="0" y1="0" x2="0" y2="6" style={{ stroke: couleurSerie(i), strokeWidth: 2.5 }} />
        </pattern>
      ))}
    </defs>
  );
}

function Infobulle({ active, payload, label, format = '€' }: TooltipProps<number, string> & { format?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="infobulle-graphique">
      <strong>{label}</strong>
      {payload.map((p) => (
        <div key={String(p.dataKey)}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <i style={{ width: 9, height: 9, background: p.color, display: 'inline-block', borderRadius: 2 }} />
            {p.name}
          </span>
          <span>{selonFormat(typeof p.value === 'number' ? p.value : null, format)}</span>
        </div>
      ))}
    </div>
  );
}

export interface Serie {
  cle: string;
  libelle: string;
  type?: 'barre' | 'ligne';
  /** Indice de couleur dans la palette du thème. */
  couleur?: number;
  empile?: boolean;
}

/**
 * Graphique par exercice : barres (éventuellement empilées) et/ou lignes,
 * avec hachures automatiques sur l'exercice budgété.
 */
export function GraphiqueAnnuel({
  titre,
  note,
  donnees,
  series,
  format = '€',
  hauteur = 280,
  budget = '2026 B',
}: {
  titre: string;
  note?: string;
  donnees: Record<string, string | number | null>[];
  series: Serie[];
  format?: string;
  hauteur?: number;
  budget?: string;
}) {
  const indices = series.map((s, i) => s.couleur ?? i);
  return (
    <figure className="graphique" style={{ margin: 0 }}>
      <h3>{titre}</h3>
      {note && <p className="legende-note">{note}</p>}
      <ResponsiveContainer width="100%" height={hauteur}>
        <ComposedChart data={donnees} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2} barCategoryGap="28%">
          {hachures(indices)}
          <CartesianGrid vertical={false} strokeDasharray="0" />
          <XAxis dataKey="annee" {...axe} />
          <YAxis {...axe} width={56} tickFormatter={format === '%' ? (v) => pourcent(v) : kFormat} />
          <ReferenceLine y={0} stroke="var(--c-ligne-forte)" />
          <Tooltip content={<Infobulle format={format} />} cursor={{ fill: 'var(--c-voile)' }} />
          {series.map((s, i) =>
            s.type === 'ligne' ? (
              <Line
                key={s.cle}
                dataKey={s.cle}
                name={s.libelle}
                stroke={couleurSerie(indices[i])}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: 'var(--c-fond)' }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            ) : (
              <Bar
                key={s.cle}
                dataKey={s.cle}
                name={s.libelle}
                stackId={s.empile ? 'pile' : undefined}
                fill={couleurSerie(indices[i])}
                radius={s.empile ? 0 : [3, 3, 0, 0]}
                maxBarSize={56}
                stroke="var(--c-fond)"
                strokeWidth={s.empile ? 1 : 0}
                isAnimationActive={false}
              >
                {donnees.map((d, j) => (
                  <Cell key={j} fill={d.annee === budget ? `url(#hachure-${indices[i]})` : couleurSerie(indices[i])} />
                ))}
              </Bar>
            ),
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <div className="legende">
        {series.map((s, i) => (
          <span key={s.cle}>
            <i style={s.type === 'ligne' ? { height: 2, background: couleurSerie(indices[i]) } : { background: couleurSerie(indices[i]) }} />
            {s.libelle}
          </span>
        ))}
        <span>
          <i className="hachure" /> Budget 2026
        </span>
      </div>
    </figure>
  );
}

/** Barres simples (catégories). */
export function GraphiqueBarres({
  titre,
  donnees,
  unite,
  horizontal,
  max,
  couleur = 0,
  format,
}: {
  titre: string;
  donnees: { nom: string; valeur: number }[];
  unite?: string;
  horizontal?: boolean;
  max?: number;
  couleur?: number;
  format?: string;
}) {
  const hauteur = horizontal ? Math.max(160, donnees.length * 38 + 30) : 220;
  const fmt = (v: number) => (format ? selonFormat(v, format) : `${nombre(v, 1)}${unite ? ` ${unite}` : ''}`);
  return (
    <figure className="graphique" style={{ margin: 0 }}>
      <h3>{titre}</h3>
      <ResponsiveContainer width="100%" height={hauteur}>
        <BarChart data={donnees} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 6, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid horizontal={!horizontal} vertical={!!horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" {...axe} domain={[0, max ?? 'auto']} tickFormatter={(v) => (format === '€' ? kFormat(v) : nombre(v, 1))} />
              <YAxis type="category" dataKey="nom" {...axe} width={170} />
            </>
          ) : (
            <>
              <XAxis dataKey="nom" {...axe} interval={0} />
              <YAxis {...axe} width={40} allowDecimals={false} />
            </>
          )}
          <Tooltip
            cursor={{ fill: 'var(--c-voile)' }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="infobulle-graphique">
                  <strong>{label ?? payload[0].payload.nom}</strong>
                  <div>{fmt(Number(payload[0].value))}</div>
                </div>
              ) : null
            }
          />
          <Bar dataKey="valeur" name={titre} fill={couleurSerie(couleur)} radius={horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0]} maxBarSize={40} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}

/** Trésorerie mensuelle : soldes mensuels (barres) et trésorerie cumulée (ligne), même échelle en euros. */
export function GraphiqueTresorerie({ titre, mois, solde, cumul, note }: { titre: string; mois: string[]; solde: number[]; cumul: number[]; note?: string }) {
  const donnees = mois.map((m, i) => ({ mois: m, solde: solde[i], cumul: cumul[i] }));
  return (
    <figure className="graphique" style={{ margin: 0 }}>
      <h3>{titre}</h3>
      {note && <p className="legende-note">{note}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={donnees} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="mois" {...axe} />
          <YAxis {...axe} width={56} tickFormatter={kFormat} />
          <ReferenceLine y={0} stroke="var(--c-encre)" strokeOpacity={0.5} />
          <Tooltip content={<Infobulle />} cursor={{ fill: 'var(--c-voile)' }} />
          <Bar dataKey="solde" name="Solde du mois" maxBarSize={28} radius={[2, 2, 2, 2]} isAnimationActive={false}>
            {donnees.map((d, i) => (
              <Cell key={i} fill={d.solde >= 0 ? couleurSerie(2) : 'var(--c-negatif)'} fillOpacity={0.75} />
            ))}
          </Bar>
          <Area dataKey="cumul" name="Trésorerie en fin de mois" type="monotone" stroke={couleurSerie(0)} strokeWidth={2} fill={couleurSerie(0)} fillOpacity={0.08} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="legende">
        <span>
          <i style={{ background: couleurSerie(2) }} /> Solde mensuel positif
        </span>
        <span>
          <i style={{ background: 'var(--c-negatif)' }} /> Solde mensuel négatif
        </span>
        <span>
          <i style={{ height: 2, background: couleurSerie(0) }} /> Trésorerie nette en fin de mois
        </span>
      </div>
    </figure>
  );
}

/** Courbes de simulation par scénario (tirets = simulation). */
export function GraphiqueScenarios({
  titre,
  note,
  donnees,
  series,
}: {
  titre: string;
  note?: string;
  donnees: Record<string, number | string>[];
  series: { cle: string; libelle: string; couleur: number; actif?: boolean }[];
}) {
  return (
    <figure className="graphique" style={{ margin: 0 }}>
      <h3>{titre}</h3>
      {note && <p className="legende-note">{note}</p>}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={donnees} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="annee" {...axe} tickFormatter={(v) => `A${v}`} />
          <YAxis {...axe} width={56} tickFormatter={kFormat} />
          <ReferenceLine y={0} stroke="var(--c-encre)" strokeOpacity={0.5} />
          <Tooltip content={<Infobulle />} labelFormatter={(v) => `Année ${v}`} />
          {series.map((s) => (
            <Line
              key={s.cle}
              dataKey={s.cle}
              name={s.libelle}
              stroke={couleurSerie(s.couleur)}
              strokeWidth={s.actif ? 2.5 : 1.5}
              strokeDasharray={s.actif ? undefined : '6 4'}
              dot={false}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="legende">
        {series.map((s) => (
          <span key={s.cle}>
            <i className={s.actif ? undefined : 'tirets'} style={s.actif ? { height: 2, background: couleurSerie(s.couleur) } : { borderTopColor: couleurSerie(s.couleur) }} />
            {s.libelle}
          </span>
        ))}
      </div>
    </figure>
  );
}

export const formatEuros = euros;
