"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WindowState {
  left: number;
  right: number;
  charSet: string[];
  result: number;
  action: string;
}

interface SlidingWindowDiagramProps {
  input: string;
  steps: WindowState[];
  /** Label shown in the status bar for the data structure */
  dataLabel?: string;
}

const CELL_W = 52;
const CELL_H = 52;
const GAP = 6;
const PAD_X = 24;
const PAD_Y = 40;

export default function SlidingWindowDiagram({
  input,
  steps,
  dataLabel = "Set",
}: SlidingWindowDiagramProps) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const current = steps[step];

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }, [steps.length]);

  const prev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setStep(0);
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(next, 900);
    return () => clearTimeout(timer);
  }, [playing, step, next, steps.length]);

  const svgW = PAD_X * 2 + input.length * (CELL_W + GAP) - GAP;
  const svgH = PAD_Y + CELL_H + 50;

  return (
    <div>
      {/* SVG diagram */}
      <div className="flex justify-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          width="100%"
          style={{ maxWidth: svgW }}
        >
          {input.split("").map((char, i) => {
            const x = PAD_X + i * (CELL_W + GAP);
            const y = PAD_Y;
            const inWindow =
              current.right >= 0 && i >= current.left && i <= current.right;
            const isLeft = i === current.left && current.right >= 0;
            const isRight = i === current.right;
            const isDuplicate =
              current.right >= 0 &&
              i === current.right &&
              current.action.startsWith("Remove");

            return (
              <g key={i}>
                <text
                  x={x + CELL_W / 2}
                  y={PAD_Y - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--muted-text)"
                >
                  {i}
                </text>

                <motion.rect
                  x={x}
                  y={y}
                  width={CELL_W}
                  height={CELL_H}
                  rx={8}
                  animate={{
                    fill: inWindow ? "var(--accent-color)" : "var(--card-bg)",
                    opacity: inWindow ? 1 : 0.5,
                    stroke: isDuplicate
                      ? "#e74c3c"
                      : inWindow
                        ? "var(--accent-color)"
                        : "var(--border-color)",
                    strokeWidth: isDuplicate ? 2.5 : inWindow ? 2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />

                <motion.text
                  x={x + CELL_W / 2}
                  y={y + CELL_H / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="18"
                  fontWeight="600"
                  fontFamily="monospace"
                  animate={{
                    fill: inWindow ? "var(--bg-color)" : "var(--text-color)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {char}
                </motion.text>

                <AnimatePresence>
                  {isLeft && (
                    <motion.text
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      x={x + CELL_W / 2}
                      y={y + CELL_H + 18}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fill="#2a8a5a"
                    >
                      L
                    </motion.text>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isRight && (
                    <motion.text
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      x={x + CELL_W / 2}
                      y={y + CELL_H + 32}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fill="var(--accent-color)"
                    >
                      R
                    </motion.text>
                  )}
                </AnimatePresence>
              </g>
            );
          })}

          {current.right >= 0 && (
            <motion.rect
              animate={{
                x: PAD_X + current.left * (CELL_W + GAP) - 3,
                width:
                  (current.right - current.left + 1) * (CELL_W + GAP) -
                  GAP +
                  6,
              }}
              y={PAD_Y - 3}
              height={CELL_H + 6}
              rx={10}
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth={2}
              strokeDasharray="4 3"
              opacity={0.5}
              transition={{ duration: 0.3 }}
            />
          )}
        </svg>
      </div>

      {/* Status bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 mt-4 px-3 py-2.5 rounded-lg text-xs"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center gap-4">
          <span style={{ color: "var(--muted-text)" }}>
            {dataLabel}:{" "}
            <span
              style={{ color: "var(--primary-color)" }}
              className="font-mono font-semibold"
            >
              {"{ "}
              {current.charSet.join(", ")}
              {" }"}
            </span>
          </span>
          <span style={{ color: "var(--muted-text)" }}>
            Best:{" "}
            <span
              style={{ color: "var(--accent-color)" }}
              className="font-mono font-bold"
            >
              {current.result}
            </span>
          </span>
        </div>
        <span
          style={{ color: "var(--text-color)" }}
          className="font-medium"
        >
          {current.action}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200"
          style={{
            border: "1px solid var(--border-color)",
            color: "var(--muted-text)",
            backgroundColor: "transparent",
          }}
        >
          Reset
        </button>
        <button
          onClick={prev}
          disabled={step === 0}
          className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 disabled:opacity-30"
          style={{
            border: "1px solid var(--border-color)",
            color: "var(--primary-color)",
            backgroundColor: "transparent",
          }}
        >
          Prev
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="px-4 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200"
          style={{
            backgroundColor: "var(--primary-color)",
            color: "var(--bg-color)",
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={next}
          disabled={step === steps.length - 1}
          className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 disabled:opacity-30"
          style={{
            border: "1px solid var(--border-color)",
            color: "var(--primary-color)",
            backgroundColor: "transparent",
          }}
        >
          Next
        </button>
        <span
          className="text-[10px] font-mono"
          style={{ color: "var(--muted-text)" }}
        >
          {step + 1}/{steps.length}
        </span>
      </div>
    </div>
  );
}

// --- Step builders ---

const DEFAULT_INPUT = "abcabcbb";

/** O(n²) approach: s[right] in s[left:right] */
export function buildNaiveSteps(input: string = DEFAULT_INPUT): WindowState[] {
  const steps: WindowState[] = [];
  let left = 0;
  let result = 0;

  steps.push({
    left: 0,
    right: -1,
    charSet: [],
    result: 0,
    action: "Initialize: empty window, result = 0",
  });

  for (let right = 0; right < input.length; right++) {
    const char = input[right];
    // Check if char exists in window s[left:right]
    const window = input.slice(left, right);
    if (window.includes(char)) {
      while (left < right && input.slice(left, right).includes(char)) {
        const removed = input[left];
        left++;
        steps.push({
          left,
          right: right - 1,
          charSet: input.slice(left, right).split(""),
          result,
          action: `Remove '${removed}', shrink left to ${left}`,
        });
      }
    }
    result = Math.max(result, right - left + 1);
    steps.push({
      left,
      right,
      charSet: input.slice(left, right + 1).split(""),
      result,
      action:
        result === right - left + 1 && result > (steps[steps.length - 1]?.result ?? 0)
          ? `Add '${char}' — new best = ${result}`
          : `Add '${char}' — window = [${left}, ${right}]`,
    });
  }

  return steps;
}

/** O(n) approach: hash set with add/remove */
export function buildSetSteps(input: string = DEFAULT_INPUT): WindowState[] {
  const steps: WindowState[] = [];
  const charSet = new Set<string>();
  let left = 0;
  let result = 0;

  steps.push({
    left: 0,
    right: -1,
    charSet: [],
    result: 0,
    action: "Initialize: empty window, result = 0",
  });

  for (let right = 0; right < input.length; right++) {
    const char = input[right];
    if (charSet.has(char)) {
      while (charSet.has(char)) {
        const removed = input[left];
        charSet.delete(removed);
        left++;
        steps.push({
          left,
          right: right - 1,
          charSet: Array.from(charSet),
          result,
          action: `Remove '${removed}', shrink left to ${left}`,
        });
      }
    }
    charSet.add(char);
    result = Math.max(result, right - left + 1);
    steps.push({
      left,
      right,
      charSet: Array.from(charSet),
      result,
      action:
        result === right - left + 1 && result > (steps[steps.length - 1]?.result ?? 0)
          ? `Add '${char}' — new best = ${result}`
          : `Add '${char}' — window = [${left}, ${right}]`,
    });
  }

  return steps;
}
