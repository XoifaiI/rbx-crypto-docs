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
const AXIS_BAND = 28;

const number = new Intl.NumberFormat("en-US");

function ours(library: string): boolean {
  return library.startsWith(OURS);
}

function sorted(test: Test): Row[] {
  return [...test.rows].sort((a, b) => a.time - b.time);
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
  return (
    <text
      x={x}
      y={y}
      dy={4}
      textAnchor="end"
      fontSize={12}
      fontWeight={highlighted ? 600 : 400}
      fill={
        highlighted
          ? "var(--color-fd-foreground)"
          : "var(--color-fd-muted-foreground)"
      }
    >
      {name}
    </text>
  );
}

function TestTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Row }[];
}) {
  const item = payload?.[0]?.payload;
  if (!active || !item) {
    return null;
  }
  return (
    <div className="rounded-lg border bg-fd-popover px-3 py-2 text-xs shadow-md">
      <div className="text-sm font-semibold text-fd-popover-foreground">
        {number.format(item.time)} μs
      </div>
      <div className="text-fd-muted-foreground">{item.library}</div>
    </div>
  );
}

const TestChart = memo(function TestChart({ test }: { test: Test }) {
  const rows = sorted(test);
  return (
    <ResponsiveContainer
      width="100%"
      height={rows.length * ROW_HEIGHT + AXIS_BAND}
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
          width={168}
          interval={0}
          tickLine={false}
          axisLine={false}
          tick={<LibraryTick />}
        />
        <Tooltip
          cursor={{ fill: "var(--viz-hover)" }}
          content={<TestTooltip />}
          isAnimationActive={false}
        />
        <Bar
          dataKey="time"
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
            dataKey="time"
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
  const fastest = sorted(test)[0]?.time ?? 1;
  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap text-xs tabular-nums">
        <thead className="text-fd-muted-foreground">
          <tr>
            <th className="py-1 pr-2 text-left font-medium">Library</th>
            <th className="px-2 py-1 text-right font-medium">Median</th>
            <th className="py-1 pl-2 text-right font-medium">
              Times the fastest
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted(test).map((row) => (
            <tr
              key={row.library}
              className={
                ours(row.library) ? "border-t font-semibold" : "border-t"
              }
            >
              <td className="py-1 pr-2">{row.library}</td>
              <td className="px-2 py-1 text-right">
                {number.format(row.time)} μs
              </td>
              <td className="py-1 pl-2 text-right">
                {(row.time / fastest).toFixed(1)}x
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
          {test.input} input. Median time in μs, lower is better.
        </div>
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
