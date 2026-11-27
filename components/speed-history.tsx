"use client";

import {
  memo,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Switch } from "@/components/benchmarks";
import { COMMITS, RELEASES, SERIES } from "@/lib/history";

type View = "chart" | "table";

const ROW_HEIGHT = 24;
const STEP_MS = 380;
const LAST = COMMITS.length - 1;

const date = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(day: string): string {
  return date.format(new Date(`${day}T00:00:00`));
}

function formatTime(us: number): string {
  if (us >= 1000) {
    return `${(us / 1000).toFixed(us >= 10000 ? 0 : 1)} ms`;
  }
  if (us >= 10) {
    return `${us.toFixed(0)} μs`;
  }
  if (us >= 1) {
    return `${us.toFixed(1)} μs`;
  }
  return `${(us * 1000).toFixed(0)} ns`;
}

function formatTimes(x: number): string {
  if (x >= 10) {
    return `${Math.round(x)}x`;
  }
  return `${x.toFixed(1)}x`;
}

type Series = {
  name: string;
  // The time at each commit, with a commit that could not time it keeping the previous time
  filled: (number | null)[];
  first: number;
  baseline: number;
};

const ALL: Series[] = SERIES.map((series) => {
  let previous: number | null = null;
  let first = -1;
  const filled = series.times.map((time, index) => {
    if (time !== null) {
      previous = time;
      if (first === -1) {
        first = index;
      }
    }
    return previous;
  });
  return {
    name: series.name,
    filled,
    first,
    baseline: series.times[first] ?? 1,
  };
}).filter((series) => series.first !== -1);

function speedup(series: Series, index: number): number {
  const time = series.filled[index];
  return time === null ? 1 : series.baseline / time;
}

let largest = 1;
for (const series of ALL) {
  for (let index = series.first; index <= LAST; index++) {
    largest = Math.max(largest, speedup(series, index));
  }
}
const DOMAIN_MAX = 10 ** (Math.ceil(Math.log10(largest) * 4) / 4);
const TICKS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].filter(
  (tick) => tick <= DOMAIN_MAX,
);

function majorOf(tag: string): number {
  return Number(tag.replace(/^v/, "").split(".")[0]);
}

// Each major version's stretch of commits, from the commit its x.0.0 release maps to
// until the next major starts.
const ERAS = RELEASES.filter((release) => release.major).map(
  (release, position, majors) => ({
    major: majorOf(release.tag),
    start: release.index,
    end: position + 1 < majors.length ? majors[position + 1].index : LAST,
  }),
);

// The major version a commit belongs to, and whether a new major starts there.
function versionAt(index: number): { major: number; from?: number } | null {
  let current: (typeof ERAS)[number] | null = null;
  for (const era of ERAS) {
    if (era.start <= index) {
      current = era;
    }
  }
  if (current === null) {
    return null;
  }
  const previous = ERAS[ERAS.indexOf(current) - 1];
  return current.start === index && previous !== undefined
    ? { major: current.major, from: previous.major }
    : { major: current.major };
}

// A stretch narrower than this share of the slider gets no label, so labels never overlap.
const MIN_LABEL_SHARE = 0.06;

function Scrubber({
  index,
  playing,
  onIndex,
  onPlay,
}: {
  index: number;
  playing: boolean;
  onIndex: (index: number) => void;
  onPlay: () => void;
}) {
  const commit = COMMITS[index];
  const version = versionAt(index);
  return (
    <div className="rounded-xl border bg-fd-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onPlay}
          className="min-w-20 rounded-lg bg-fd-primary px-3 py-1.5 text-sm font-medium text-fd-primary-foreground"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <div className="min-w-0 flex-1" aria-live="polite">
          <div className="text-xs text-fd-muted-foreground tabular-nums">
            {formatDate(commit.date)} · <code>{commit.sha}</code> · commit{" "}
            {index + 1} of {COMMITS.length}
            {version === null ? null : (
              <span className="ml-2 rounded-full border px-2 font-semibold text-fd-foreground">
                {version.from === undefined
                  ? `v${version.major}`
                  : `v${version.from} → v${version.major}`}
              </span>
            )}
          </div>
          <div className="break-words text-sm font-semibold text-fd-card-foreground">
            {commit.msg}
          </div>
        </div>
      </div>
      <div className="relative mt-3 pt-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-4"
        >
          {RELEASES.map((release) => (
            <span
              key={release.tag}
              className={
                release.major
                  ? "absolute top-1 h-2.5 w-px bg-fd-muted-foreground"
                  : "absolute top-2 h-1.5 w-px bg-fd-border"
              }
              style={{ left: `${(release.index / LAST) * 100}%` }}
            />
          ))}
          {ERAS.filter(
            (era) => (era.end - era.start) / LAST >= MIN_LABEL_SHARE,
          ).map((era) => (
            <span
              key={era.major}
              className="absolute -top-2 -translate-x-1/2 text-[10px] font-semibold text-fd-muted-foreground"
              style={{ left: `${((era.start + era.end) / 2 / LAST) * 100}%` }}
            >
              v{era.major}
            </span>
          ))}
        </div>
        <input
          type="range"
          aria-label="Commit"
          min={0}
          max={LAST}
          step={1}
          value={index}
          onChange={(event) => onIndex(Number(event.target.value))}
          className="w-full"
          style={{ accentColor: "var(--viz-accent)" }}
        />
      </div>
    </div>
  );
}

// The race is drawn with plain elements rather than a chart library, so a row can slide to its
// new rank and a bar can grow between commits instead of jumping.
const LABEL_COLUMN = "clamp(88px, 28%, 170px)";
const VALUE_ROOM = 104;
const MOVE_MS = 520;
const SPRING = "cubic-bezier(0.34, 1.4, 0.64, 1)";
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

// Where a speed-up sits along the bar, as a percentage of the lane, on a log scale
function share(value: number): number {
  const percent =
    (Math.log10(Math.max(1, value)) / Math.log10(DOMAIN_MAX)) * 100;
  return Math.round(percent * 100) / 100;
}

function Lanes({ children }: { children: ReactNode }) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `${LABEL_COLUMN} 1fr` }}
    >
      {children}
    </div>
  );
}

const Race = memo(function Race({ index }: { index: number }) {
  const reduced = useReducedMotion();
  const live = ALL.filter((series) => series.first <= index)
    .map((series) => ({
      name: series.name,
      value: speedup(series, index),
      time: series.filled[index] ?? series.baseline,
    }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  const rank = new Map(live.map((row, position) => [row.name, position]));
  const rows = new Map(live.map((row) => [row.name, row]));
  const move = (property: string, curve: string) =>
    reduced ? "none" : `${property} ${MOVE_MS}ms ${curve}`;

  return (
    <figure className="m-0 rounded-xl border bg-fd-card p-4">
      <div className="relative" style={{ height: ALL.length * ROW_HEIGHT }}>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Lanes>
            <div />
            <div
              className="relative"
              style={{
                height: ALL.length * ROW_HEIGHT,
                marginRight: VALUE_ROOM,
              }}
            >
              {TICKS.map((tick) => (
                <span
                  key={tick}
                  className="absolute inset-y-0 w-px"
                  style={{
                    left: `${share(tick)}%`,
                    backgroundColor: "var(--viz-grid)",
                  }}
                />
              ))}
            </div>
          </Lanes>
        </div>
        {ALL.map((series) => {
          const row = rows.get(series.name);
          const position = rank.get(series.name) ?? ALL.length - 1;
          const width = row === undefined ? 0 : share(row.value);
          return (
            <div
              key={series.name}
              className="absolute inset-x-0 top-0"
              style={{
                height: ROW_HEIGHT,
                transform: `translateY(${position * ROW_HEIGHT}px)`,
                opacity: row === undefined ? 0 : 1,
                transition: reduced
                  ? "none"
                  : `transform ${MOVE_MS}ms ${SPRING}, opacity 300ms ease`,
              }}
            >
              <Lanes>
                <div
                  className="truncate text-right text-xs leading-6 text-fd-foreground"
                  title={series.name}
                >
                  {series.name}
                </div>
                <div
                  className="relative h-6"
                  style={{ marginRight: VALUE_ROOM }}
                >
                  <div
                    className="absolute left-0 top-1 h-4 rounded-r-[4px]"
                    style={{
                      width: `max(2px, ${width}%)`,
                      backgroundColor: "var(--viz-accent)",
                      transition: move("width", EASE_OUT),
                    }}
                  />
                  <div
                    className="absolute top-0 whitespace-nowrap text-[11px] leading-6 tabular-nums"
                    style={{
                      left: `calc(${width}% + 6px)`,
                      transition: move("left", EASE_OUT),
                    }}
                  >
                    <span className="font-semibold text-fd-foreground">
                      {row === undefined ? "" : formatTimes(row.value)}
                    </span>
                    <span className="ml-1.5 text-fd-muted-foreground">
                      {row === undefined ? "" : formatTime(row.time)}
                    </span>
                  </div>
                </div>
              </Lanes>
            </div>
          );
        })}
      </div>
      <div className="mt-1">
        <Lanes>
          <div />
          <div
            className="relative h-5 border-t"
            style={{ borderColor: "var(--viz-axis)", marginRight: VALUE_ROOM }}
          >
            {TICKS.map((tick) => (
              <span
                key={tick}
                className="absolute top-1 -translate-x-1/2 text-[11px] tabular-nums text-fd-muted-foreground"
                style={{ left: `${share(tick)}%` }}
              >
                {tick}x
              </span>
            ))}
          </div>
        </Lanes>
      </div>
    </figure>
  );
});

function PointTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { index: number; time: number | null } }[];
}) {
  const item = payload?.[0]?.payload;
  if (!active || !item || item.time === null) {
    return null;
  }
  const commit = COMMITS[item.index];
  return (
    <div className="rounded-lg border bg-fd-popover px-3 py-2 text-xs shadow-md">
      <div className="text-sm font-semibold text-fd-popover-foreground">
        {formatTime(item.time)}
      </div>
      <div className="text-fd-muted-foreground">
        {formatDate(commit.date)} · {commit.sha}
      </div>
    </div>
  );
}

const History = memo(function History({
  series,
  index,
}: {
  series: Series;
  index: number;
}) {
  const data = useMemo(
    () =>
      series.filled.map((time, at) => ({
        index: at,
        time: at >= series.first ? time : null,
        // Plotted as log10 so a 100x drop and a 2x drop both stay readable on one small chart
        logTime: at >= series.first && time !== null ? Math.log10(time) : null,
      })),
    [series],
  );
  const now = series.filled[LAST] ?? series.baseline;
  return (
    <figure className="m-0 rounded-xl border bg-fd-card p-4">
      <figcaption className="mb-2">
        <div className="font-semibold text-fd-card-foreground">
          {series.name}
        </div>
        <div className="text-xs text-fd-muted-foreground tabular-nums">
          {formatTime(series.baseline)} to {formatTime(now)},{" "}
          {formatTimes(series.baseline / now)} faster
        </div>
      </figcaption>
      <ResponsiveContainer width="100%" height={96}>
        <LineChart
          data={data}
          margin={{ top: 6, right: 6, bottom: 0, left: 6 }}
        >
          <XAxis dataKey="index" type="number" domain={[0, LAST]} hide />
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Tooltip
            content={<PointTooltip />}
            cursor={{ stroke: "var(--viz-axis)" }}
            isAnimationActive={false}
          />
          <ReferenceLine x={index} stroke="var(--viz-axis)" />
          <Line
            type="linear"
            dataKey="logTime"
            stroke="var(--viz-accent)"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </figure>
  );
});

function Table() {
  return (
    <div className="overflow-x-auto rounded-xl border bg-fd-card p-4">
      <table className="w-full whitespace-nowrap text-xs tabular-nums">
        <thead className="text-fd-muted-foreground">
          <tr>
            <th className="py-1 pr-2 text-left font-medium">Primitive</th>
            <th className="px-2 py-1 text-right font-medium">First timed</th>
            <th className="px-2 py-1 text-right font-medium">Then</th>
            <th className="px-2 py-1 text-right font-medium">Now</th>
            <th className="py-1 pl-2 text-right font-medium">Times faster</th>
          </tr>
        </thead>
        <tbody>
          {ALL.map((series) => {
            const now = series.filled[LAST] ?? series.baseline;
            return (
              <tr key={series.name} className="border-t">
                <td className="py-1 pr-2">{series.name}</td>
                <td className="px-2 py-1 text-right">
                  {formatDate(COMMITS[series.first].date)}
                </td>
                <td className="px-2 py-1 text-right">
                  {formatTime(series.baseline)}
                </td>
                <td className="px-2 py-1 text-right">{formatTime(now)}</td>
                <td className="py-1 pl-2 text-right">
                  {formatTimes(series.baseline / now)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function SpeedHistory() {
  const [view, setView] = useState<View>("chart");
  const [index, setIndex] = useState(LAST);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) {
      return;
    }
    timer.current = setInterval(() => {
      setIndex((current) => {
        if (current >= LAST) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, STEP_MS);
    return () => {
      if (timer.current !== null) {
        clearInterval(timer.current);
      }
    };
  }, [playing]);

  function togglePlay() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (index >= LAST) {
      setIndex(0);
    }
    setPlaying(true);
  }

  return (
    <div className="viz not-prose my-6 grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Switch
          label="View"
          value={view}
          options={[
            { key: "chart", label: "Chart" },
            { key: "table", label: "Table" },
          ]}
          onChange={setView}
        />
      </div>
      {view === "table" ? (
        <Table />
      ) : (
        <>
          <Scrubber
            index={index}
            playing={playing}
            onIndex={(next) => {
              setPlaying(false);
              setIndex(next);
            }}
            onPlay={togglePlay}
          />
          <Race index={index} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL.map((series) => (
              <History key={series.name} series={series} index={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
