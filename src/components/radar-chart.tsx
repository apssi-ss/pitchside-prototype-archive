type Datum = { key: string; score: number };

export function RadarChart({
  data,
  max = 10,
  size = 240,
}: {
  data: Datum[];
  max?: number;
  size?: number;
}) {
  const c = size / 2;
  const r = size / 2 - 34;
  const n = data.length;
  const point = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * r * (v / max), c + Math.sin(a) * r * (v / max)] as const;
  };
  const rings = [0.25, 0.5, 0.75, 1];
  const poly = data.map((d, i) => point(i, d.score).join(",")).join(" ");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-auto w-full max-w-[280px]"
      role="img"
      aria-label="Grafik perkembangan pemain"
    >
      {rings.map((k) => (
        <polygon
          key={k}
          points={data.map((_, i) => point(i, max * k).join(",")).join(" ")}
          className="fill-none stroke-border"
          strokeWidth={1}
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = point(i, max);
        return (
          <line key={i} x1={c} y1={c} x2={x} y2={y} className="stroke-border" strokeWidth={1} />
        );
      })}
      <polygon
        points={poly}
        className="fill-primary/20 stroke-primary"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {data.map((d, i) => {
        const [x, y] = point(i, d.score);
        return (
          <circle
            key={d.key}
            cx={x}
            cy={y}
            r={3.5}
            className="fill-signal stroke-pitch-deep"
            strokeWidth={1.5}
          />
        );
      })}
      {data.map((d, i) => {
        const [x, y] = point(i, max + 2.4);
        return (
          <g key={`l-${d.key}`}>
            <text
              x={x}
              y={y - 3}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px] font-semibold"
            >
              {d.key}
            </text>
            <text
              x={x}
              y={y + 10}
              textAnchor="middle"
              className="fill-foreground font-mono text-[10px] font-bold"
            >
              {d.score.toFixed(1)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
