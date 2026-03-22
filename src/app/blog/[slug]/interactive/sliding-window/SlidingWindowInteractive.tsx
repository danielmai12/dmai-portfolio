"use client";

import SlidingWindowDiagram, {
  buildNaiveSteps,
  buildSetSteps,
} from "./SlidingWindowDiagram";

const INPUT = "abcabcbb";
const NAIVE_STEPS = buildNaiveSteps(INPUT);
const SET_STEPS = buildSetSteps(INPUT);

function DiagramBlock({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 mb-6"
      style={{
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="px-1.5 py-0.5 rounded text-[13px] font-mono"
      style={{
        backgroundColor: "var(--hover-bg)",
        color: "var(--accent-color)",
      }}
    >
      {children}
    </code>
  );
}

export default function SlidingWindowInteractive() {
  return (
    <div className="space-y-14">
      {/* Problem Statement */}
      <section>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Given a string <Code>s</Code>, find the length of the{" "}
            <strong style={{ color: "var(--primary-color)" }}>
              longest substring
            </strong>{" "}
            without repeating characters.
          </p>

          <div
            className="rounded-lg p-4 text-sm space-y-2"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div>
              <strong style={{ color: "var(--primary-color)" }}>
                Example 1:
              </strong>{" "}
              <Code>s = &quot;abcabcbb&quot;</Code> &rarr; <Code>3</Code>{" "}
              <span style={{ color: "var(--muted-text)" }}>
                (the answer is &quot;abc&quot;)
              </span>
            </div>
            <div>
              <strong style={{ color: "var(--primary-color)" }}>
                Example 2:
              </strong>{" "}
              <Code>s = &quot;bbbbb&quot;</Code> &rarr; <Code>1</Code>{" "}
              <span style={{ color: "var(--muted-text)" }}>
                (the answer is &quot;b&quot;)
              </span>
            </div>
            <div>
              <strong style={{ color: "var(--primary-color)" }}>
                Example 3:
              </strong>{" "}
              <Code>s = &quot;pwwkew&quot;</Code> &rarr; <Code>3</Code>{" "}
              <span style={{ color: "var(--muted-text)" }}>
                (the answer is &quot;wke&quot;)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Intuition */}
      <section>
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--heading-color)" }}
        >
          Intuition
        </h2>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            The brute-force approach checks every possible substring for
            uniqueness. Why is that{" "}
            <span style={{ color: "#e74c3c" }}>O(n&sup3;)</span>?
          </p>

          <div
            className="rounded-lg p-4 text-sm space-y-3"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="flex items-start gap-2">
              <span
                className="font-bold text-xs mt-0.5"
                style={{ color: "var(--accent-color)" }}
              >
                1.
              </span>
              <span>
                <strong style={{ color: "var(--primary-color)" }}>
                  Iterating through all possible substrings
                </strong>{" "}
                takes{" "}
                <span style={{ color: "#e74c3c" }}>
                  O(n&sup2;)
                </span>{" "}
                time &mdash; we pick a start index and an end index, each
                ranging up to n.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span
                className="font-bold text-xs mt-0.5"
                style={{ color: "var(--accent-color)" }}
              >
                2.
              </span>
              <span>
                <strong style={{ color: "var(--primary-color)" }}>
                  Checking if a substring has all unique characters
                </strong>{" "}
                takes{" "}
                <span style={{ color: "#e74c3c" }}>O(n)</span> time
                &mdash; we scan through it and use a hash set to track each
                character. If we encounter a character already in the set,
                we know it&apos;s a duplicate.
              </span>
            </div>
            <div
              className="h-px"
              style={{ backgroundColor: "var(--border-color)" }}
            />
            <div className="flex items-start gap-2">
              <span>
                Combined:{" "}
                <span style={{ color: "#e74c3c", fontWeight: 600 }}>
                  O(n&sup2;) &times; O(n) = O(n&sup3;)
                </span>
                . This is quite slow, largely because we look through{" "}
                <em>every</em> substring from scratch each time.
              </span>
            </div>
          </div>

          <p>
            Why{" "}
            <strong style={{ color: "var(--accent-color)" }}>
              sliding window
            </strong>
            ? Two signals point us to this pattern:
          </p>

          <div
            className="rounded-lg p-4 text-sm space-y-3"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="flex items-start gap-2">
              <span
                className="font-bold text-xs mt-0.5"
                style={{ color: "#2a8a5a" }}
              >
                1.
              </span>
              <span>
                We&apos;re looking for the{" "}
                <strong style={{ color: "var(--primary-color)" }}>
                  longest contiguous sequence
                </strong>{" "}
                that satisfies a condition &mdash; whenever a problem asks for
                the longest (or shortest) subarray/substring meeting some
                constraint, sliding window is the go-to.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span
                className="font-bold text-xs mt-0.5"
                style={{ color: "#2a8a5a" }}
              >
                2.
              </span>
              <span>
                The condition is{" "}
                <strong style={{ color: "var(--primary-color)" }}>
                  &quot;all unique characters&quot;
                </strong>
                . When we add a character that breaks this condition, we
                don&apos;t need to start over &mdash; we just shrink the
                window from the left until the condition holds again.
              </span>
            </div>
          </div>

          <p>
            The idea: maintain a window{" "}
            <Code>[left, right]</Code> that always contains unique
            characters. As we{" "}
            <span style={{ color: "#2a8a5a" }}>
              expand <Code>right</Code>
            </span>
            , if we encounter a character already in the window, we{" "}
            <span style={{ color: "#e74c3c" }}>
              shrink from <Code>left</Code>
            </span>{" "}
            until the duplicate is removed.
          </p>
        </div>
      </section>

      {/* Implementation — O(n²) */}
      <section>
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--heading-color)" }}
        >
          Implementation
        </h2>
        <div
          className="rounded-xl overflow-hidden mb-6"
          style={{
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--card-bg)",
          }}
        >
          <div
            className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider"
            style={{
              color: "var(--muted-text)",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            Python
          </div>
          <pre
            className="p-4 overflow-x-auto text-[13px] leading-relaxed"
            style={{ color: "var(--text-color)" }}
          >
            <code className="font-mono">{`def lengthOfLongestSubstring(s: str) -> int:
    left = 0
    result = 0

    for right in range(len(s)):
        while left < right and s[right] in s[left:right]:
            left += 1
        result = max(result, right - left + 1)

    return result`}</code>
          </pre>
        </div>

        <div className="space-y-4 text-base leading-relaxed">
          <div
            className="rounded-lg p-4 text-sm"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p
              className="mb-3 font-semibold"
              style={{ color: "var(--primary-color)" }}
            >
              How it works:
            </p>
            <div className="space-y-2">
              {[
                [
                  "Expand",
                  "Move right pointer forward to grow the window.",
                ],
                [
                  "Shrink",
                  "If s[right] already exists in the current window s[left:right], advance left until the duplicate is excluded.",
                ],
                [
                  "Track",
                  "After each step, update the result with the current window size if it's the largest seen.",
                ],
              ].map(([title, desc], i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="font-bold text-xs mt-0.5"
                    style={{ color: "var(--accent-color)" }}
                  >
                    {i + 1}.
                  </span>
                  <span>
                    <strong style={{ color: "var(--primary-color)" }}>
                      {title}:
                    </strong>{" "}
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p>
            This is clean and correct, but checking{" "}
            <Code>s[right] in s[left:right]</Code> scans the window each
            time &mdash;{" "}
            <span style={{ color: "#e74c3c" }}>O(n) per check</span>,
            giving us{" "}
            <span style={{ color: "#e74c3c", fontWeight: 600 }}>
              O(n&sup2;)
            </span>{" "}
            overall.
          </p>
        </div>
      </section>

      {/* Visual walk-through — O(n²) */}
      <section>
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--heading-color)" }}
        >
          Visual Walk-through
        </h2>
        <p
          className="text-base leading-relaxed mb-6"
          style={{ color: "var(--text-color)" }}
        >
          Step through the algorithm on <Code>&quot;abcabcbb&quot;</Code>. The{" "}
          <span style={{ color: "#2a8a5a", fontWeight: 600 }}>L</span> and{" "}
          <span style={{ color: "var(--accent-color)", fontWeight: 600 }}>
            R
          </span>{" "}
          pointers define the current window. Highlighted cells are inside the
          window.
        </p>
        <DiagramBlock>
          <SlidingWindowDiagram
            input={INPUT}
            steps={NAIVE_STEPS}
            dataLabel="Window"
          />
        </DiagramBlock>
      </section>

      {/* Optimized Approach — O(n) */}
      <section>
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--heading-color)" }}
        >
          Optimized Approach
        </h2>
        <div className="space-y-4 text-base leading-relaxed mb-6">
          <p>
            The bottleneck is{" "}
            <Code>s[right] in s[left:right]</Code> &mdash; Python slices
            the string and scans it linearly every iteration. We can replace
            that with a{" "}
            <strong style={{ color: "var(--primary-color)" }}>hash set</strong>{" "}
            that tracks which characters are currently in the window. Set
            lookups are{" "}
            <span style={{ color: "#2a8a5a" }}>O(1)</span> instead of O(n),
            dropping the total from O(n&sup2;) to{" "}
            <span style={{ color: "#2a8a5a", fontWeight: 600 }}>O(n)</span>.
          </p>
          <p>
            When we encounter a duplicate, we remove characters from the
            set starting at <Code>left</Code> until the duplicate is gone
            &mdash; same shrinking logic, but now each check is constant time.
          </p>
        </div>

        <div
          className="rounded-xl overflow-hidden mb-6"
          style={{
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--card-bg)",
          }}
        >
          <div
            className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider"
            style={{
              color: "var(--muted-text)",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            Python — Optimized
          </div>
          <pre
            className="p-4 overflow-x-auto text-[13px] leading-relaxed"
            style={{ color: "var(--text-color)" }}
          >
            <code className="font-mono">{`def lengthOfLongestSubstring(s: str) -> int:
    char_set = set()
    left = 0
    result = 0

    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        result = max(result, right - left + 1)

    return result`}</code>
          </pre>
        </div>

        <div className="space-y-4 text-base leading-relaxed">
          <div
            className="rounded-lg p-4 text-sm"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p
              className="mb-3 font-semibold"
              style={{ color: "var(--primary-color)" }}
            >
              What changed:
            </p>
            <div className="space-y-2">
              {[
                [
                  "Hash set for O(1) lookups",
                  "Instead of scanning the window substring each time, we check the set — constant time regardless of window size.",
                ],
                [
                  "Explicit add/remove",
                  "We add s[right] to the set when expanding and remove s[left] when shrinking, keeping the set in sync with the window.",
                ],
                [
                  "Why O(n) total?",
                  "Each character is added to the set at most once and removed at most once. Both pointers only move forward, so the total work across all iterations is 2n.",
                ],
              ].map(([title, desc], i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="font-bold text-xs mt-0.5"
                    style={{ color: "var(--accent-color)" }}
                  >
                    {i + 1}.
                  </span>
                  <span>
                    <strong style={{ color: "var(--primary-color)" }}>
                      {title}:
                    </strong>{" "}
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visual walk-through — O(n) optimized */}
      <section>
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--heading-color)" }}
        >
          Optimized Walk-through
        </h2>
        <p
          className="text-base leading-relaxed mb-6"
          style={{ color: "var(--text-color)" }}
        >
          The same input, but now tracking a{" "}
          <strong style={{ color: "var(--primary-color)" }}>set</strong> for
          O(1) lookups. The pointer movement is identical &mdash; the
          improvement is that each duplicate check no longer scans the window.
        </p>
        <DiagramBlock>
          <SlidingWindowDiagram
            input={INPUT}
            steps={SET_STEPS}
            dataLabel="Set"
          />
        </DiagramBlock>
      </section>

      {/* Complexity */}
      <section>
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--heading-color)" }}
        >
          Complexity
        </h2>
        <div
          className="rounded-lg p-4 text-sm space-y-3"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ color: "#e74c3c", border: "1px solid #e74c3c" }}
            >
              Sliding window
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span
              className="font-bold flex-shrink-0"
              style={{ color: "#e74c3c" }}
            >
              Time: O(n&sup2;)
            </span>
            <span style={{ color: "var(--text-color)" }}>
              The outer loop runs n times. The <Code>in</Code> check on the
              substring is O(n) in the worst case.
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span
              className="font-bold flex-shrink-0"
              style={{ color: "#2a5a8a" }}
            >
              Space: O(1)
            </span>
            <span style={{ color: "var(--text-color)" }}>
              No extra data structure &mdash; just two pointers and the input
              string.
            </span>
          </div>

          <div
            className="h-px my-2"
            style={{ backgroundColor: "var(--border-color)" }}
          />

          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ color: "#2a8a5a", border: "1px solid #2a8a5a" }}
            >
              Optimized with set
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span
              className="font-bold flex-shrink-0"
              style={{ color: "#2a8a5a" }}
            >
              Time: O(n)
            </span>
            <span style={{ color: "var(--text-color)" }}>
              Each character is added and removed from the set at most once.
              Both pointers traverse the string at most once &mdash; 2n
              operations total.
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span
              className="font-bold flex-shrink-0"
              style={{ color: "#2a5a8a" }}
            >
              Space: O(min(n, m))
            </span>
            <span style={{ color: "var(--text-color)" }}>
              Where m is the character set size. The set holds at most min(n,
              26) entries for lowercase letters, or min(n, 128) for ASCII.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
