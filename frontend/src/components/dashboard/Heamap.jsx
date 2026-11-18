import { useMemo } from "react";

const HALF = 1;
const DONE = 2;

const LABEL = {
  0: "No activity",
  1: "Partially completed",
  2: "All habits completed",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const fmt = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const FILL = {
  0: "bg-white/5 border-white/10",
  [HALF]: "bg-grape border-grape",
  [DONE]: "bg-lime border-lime",
};

export const cellCls = (v) =>
  `inline-block size-[15px] rounded-[4px] border p-0 ${FILL[v] || FILL[0]}`;

export default function Heatmap({ year, view, log, onCycle }) {
  const today = new Date();
  const todayKey = fmt(today);

  const { cells, monthCols } = useMemo(() => {
    const first = new Date(year, 0, 1);
    const cells = Array(first.getDay()).fill(null);
    const monthCols = [];

    for (
      let d = new Date(first);
      d.getFullYear() === year;
      d.setDate(d.getDate() + 1)
    ) {
      if (d.getDate() === 1) {
        monthCols.push({
          m: d.getMonth(),
          col: Math.floor(cells.length / 7),
        });

        // Add a small visual gap between months
        if (view === "months" && d.getMonth() !== 0) {
          cells.push(...Array(7).fill(null));
        }
      }

      cells.push(new Date(d));
    }

    return { cells, monthCols };
  }, [year, view]);

  const renderCell = (d, i) => {
    if (!d) {
      return <i key={i} className="size-[15px]" />;
    }

    const k = fmt(d);
    const v = log[k] || 0;
    const future = d > today && k !== todayKey;

    return (
      <button
        key={i}
        disabled={future}
        onClick={() => onCycle(k)}
        title={`${d.toDateString()} · ${LABEL[v]}`}
        aria-label={`${d.toDateString()}: ${LABEL[v]}`}
        className={`
          ${cellCls(v)}
          relative cursor-pointer transition-all duration-150
          enabled:hover:z-10 enabled:hover:scale-125
          enabled:hover:ring-2 enabled:hover:ring-lime/40
          disabled:cursor-default disabled:opacity-20
          ${k === todayKey ? "outline-2 outline-offset-2 outline-lime" : ""}
        `}
      />
    );
  };

  // Calculate columns based on the final cell layout
  const cols = Math.ceil(cells.length / 7);

  const colStyle = {
    gridTemplateColumns: `repeat(${cols}, 15px)`,
  };

  return (
    <div className="overflow-x-auto px-1 pb-3 pt-1">
      {/* MONTH LABELS */}
      <div
        className="mb-2 grid h-4 w-max gap-x-1 text-xs text-white/40"
        style={colStyle}
      >
        {monthCols.map(({ m, col }) => (
          <span
            key={m}
            className="whitespace-nowrap"
            style={{ gridColumn: col + 1 }}
          >
            {MONTHS[m]}
          </span>
        ))}
      </div>

      {/* HEATMAP */}
      <div
        className="grid w-max grid-flow-col gap-1"
        style={{
          ...colStyle,
          gridTemplateRows: "repeat(7, 15px)",
        }}
      >
        {cells.map(renderCell)}
      </div>
    </div>
  );
}