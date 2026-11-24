"use client";

import { memo, type ReactNode, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type Row, TESTS, type Test } from "@/lib/benchmarks";

type View = "chart" | "table";

const OURS = "rbx-cryptography";
const ROW_HEIGHT = 24;
const WRAPPED_ROW_HEIGHT = 36;
const AXIS_BAND = 28;
const LABEL_GAP = 12;
const MAX_LABEL_WIDTH = 230;
const MIN_LABEL_WIDTH = 96;

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

type Point = Row & { value: number };

function ours(library: string): boolean {
  return library.startsWith(OURS);
}

// Rough width of a label in pixels at 12 px Inter, semibold, erring wide so nothing is clipped
function textWidth(text: string): number {
  let width = 0;
  for (const character of text) {
    if (/[A-Z0-9]/.test(character)) {
      width += 8;
    } else if (/[a-z]/.test(character)) {
      width += 6.8;
    } else {
      width += 4;
    }
  }
  return width;
}

// A label too wide for the label column splits into two lines at the space nearest its middle
function labelLines(text: string): string[] {
  if (textWidth(text) <= MAX_LABEL_WIDTH) {
    return [text];
  }
  let split = -1;
  for (let index = 0; index < text.length; index++) {
    if (
      text[index] === " " &&
      (split === -1 ||
        Math.abs(index - text.length / 2) < Math.abs(split - text.length / 2))
    ) {
      split = index;
    }
  }
  return split === -1 ? [text] : [text.slice(0, split), text.slice(split + 1)];
}

function labelWidth(rows: Point[]): number {
  let widest = 0;
  for (const row of rows) {
    for (const line of labelLines(row.library)) {
      widest = Math.max(widest, textWidth(line));
    }
  }
  return Math.max(MIN_LABEL_WIDTH, Math.ceil(widest) + LABEL_GAP);
}

function isWrapped(rows: Point[]): boolean {
  return rows.some((row) => labelLines(row.library).length > 1);
}

function unit(test: Test): string {
  return test.bytes === undefined ? "μs" : "MB/s";
}

function points(test: Test): Point[] {
  const bytes = test.bytes;
  const list = test.rows.map((row) => ({
    ...row,
    value: bytes === undefined ? row.time : bytes / row.time,
  }));
  return list.sort((a, b) =>
    bytes === undefined ? a.value - b.value : b.value - a.value,
  );
}

function Switch<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { key: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="m-0 inline-flex rounded-lg border p-0.5 text-sm">
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          aria-pressed={value === option.key}
          onClick={() => onChange(option.key)}
          className={
            value === option.key
              ? "rounded-md bg-fd-accent px-3 py-1 font-medium text-fd-accent-foreground"
              : "rounded-md px-3 py-1 text-fd-muted-foreground hover:text-fd-foreground"
          }
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}

function LibraryTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  const name = payload?.value ?? "";
  const highlighted = ours(name);
  const lines = labelLines(name);
  return (
    <text
      x={x}
      y={y}
      textAnchor="end"
      fontSize={12}
      fontWeight={highlighted ? 600 : 400}
      fill={
        highlighted
          ? "var(--color-fd-foreground)"
          : "var(--color-fd-muted-foreground)"
      }
    >
      {lines.map((line, index) => (
        <tspan
          key={line}
          x={x}
          dy={index === 0 ? (lines.length === 1 ? 4 : -3) : 14}
        >
          {line}
        </tspan>
      ))}
    </text>
  );
}

function TestTooltip({
  active,
  payload,
  suffix,
}: {
  active?: boolean;
  payload?: { payload: Point }[];
  suffix?: string;
}) {
  const item = payload?.[0]?.payload;
  if (!active || !item) {
    return null;
  }
  return (
    <div className="rounded-lg border bg-fd-popover px-3 py-2 text-xs shadow-md">
      <div className="text-sm font-semibold text-fd-popover-foreground">
        {number.format(item.value)} {suffix}
      </div>
      <div className="text-fd-muted-foreground">{item.library}</div>
    </div>
  );
}

const TestChart = memo(function TestChart({ test }: { test: Test }) {
  const rows = points(test);
  const rowHeight = isWrapped(rows) ? WRAPPED_ROW_HEIGHT : ROW_HEIGHT;
  return (
    <ResponsiveContainer
      width="100%"
      height={rows.length * rowHeight + AXIS_BAND}
    >
      <BarChart
        data={rows}
        layout="vertical"
        margin={{ top: 0, right: 56, bottom: 0, left: 0 }}
        barCategoryGap={6}
      >
        <CartesianGrid horizontal={false} stroke="var(--viz-grid)" />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={{ stroke: "var(--viz-axis)" }}
          tick={{ fontSize: 11, fill: "var(--color-fd-muted-foreground)" }}
          tickFormatter={(value: number) => number.format(value)}
        />
        <YAxis
          type="category"
          dataKey="library"
          width={labelWidth(rows)}
          interval={0}
          tickLine={false}
          axisLine={false}
          tick={<LibraryTick />}
        />
        <Tooltip
          cursor={{ fill: "var(--viz-hover)" }}
          content={<TestTooltip suffix={unit(test)} />}
          isAnimationActive={false}
        />
        <Bar
          dataKey="value"
          maxBarSize={16}
          minPointSize={2}
          radius={[0, 4, 4, 0]}
          isAnimationActive={false}
        >
          {rows.map((row) => (
            <Cell
              key={row.library}
              fill={ours(row.library) ? "var(--viz-accent)" : "var(--viz-rest)"}
            />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            fontSize={11}
            fill="var(--color-fd-foreground)"
            content={(props) => {
              const { x, y, width, height, value, index } = props as {
                x: number;
                y: number;
                width: number;
                height: number;
                value: number;
                index: number;
              };
              const row = rows[index];
              if (!row) {
                return null;
              }
              return (
                <text
                  x={x + width + 6}
                  y={y + height / 2}
                  dy={4}
                  fontSize={11}
                  fontWeight={ours(row.library) ? 600 : 400}
                  fill="var(--color-fd-foreground)"
                >
                  {number.format(value)}
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
});

const TestTable = memo(function TestTable({ test }: { test: Test }) {
  const rows = points(test);
  const best = rows[0]?.value ?? 1;
  const throughput = test.bytes !== undefined;
  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap text-xs tabular-nums">
        <thead className="text-fd-muted-foreground">
          <tr>
            <th className="py-1 pr-2 text-left font-medium">Library</th>
            <th className="px-2 py-1 text-right font-medium">
              {throughput ? "Throughput" : "Time"}
            </th>
            <th className="py-1 pl-2 text-right font-medium">
              Times slower than the fastest
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.library}
              className={
                ours(row.library) ? "border-t font-semibold" : "border-t"
              }
            >
              <td className="py-1 pr-2">{row.library}</td>
              <td className="px-2 py-1 text-right">
                {number.format(row.value)} {unit(test)}
              </td>
              <td className="py-1 pl-2 text-right">
                {(throughput ? best / row.value : row.value / best).toFixed(1)}x
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

function TestCard({ test, children }: { test: Test; children: ReactNode }) {
  return (
    <figure className="m-0 rounded-xl border bg-fd-card p-4">
      <figcaption className="mb-3">
        <div className="font-semibold text-fd-card-foreground">{test.name}</div>
        <div className="text-xs text-fd-muted-foreground">
          {test.input === undefined ? "" : `${test.input} input. `}
          {test.bytes === undefined
            ? "Time per call in μs, lower is better."
            : "Throughput in MB/s, higher is better."}
        </div>
        {test.note === undefined ? null : (
          <div className="mt-1 text-xs text-fd-muted-foreground">
            {test.note}
          </div>
        )}
      </figcaption>
      {children}
    </figure>
  );
}

export function Benchmarks() {
  const [view, setView] = useState<View>("chart");
  const charts = view === "chart";
  return (
    <div className="viz not-prose my-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
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
      <div className="relative">
        <div
          aria-hidden={!charts}
          className={
            charts
              ? "grid gap-4 lg:grid-cols-2"
              : "invisible absolute inset-x-0 top-0 grid h-0 gap-4 overflow-hidden lg:grid-cols-2"
          }
        >
          {TESTS.map((test) => (
            <TestCard key={test.name} test={test}>
              <TestChart test={test} />
            </TestCard>
          ))}
        </div>
        <div className={charts ? "hidden" : "grid gap-4"}>
          {TESTS.map((test) => (
            <TestCard key={test.name} test={test}>
              <TestTable test={test} />
            </TestCard>
          ))}
        </div>
      </div>
    </div>
  );
}
