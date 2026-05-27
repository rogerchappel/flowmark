import { fromMarkdown } from 'mdast-util-from-markdown';
import { normalizeSectionTitle } from './sections.js';
import { lineForOffset, slug, splitItems } from './text.js';
import type { RunbookDocument, RunbookSection, RunbookStep } from './types.js';

interface HeadingSpan {
  depth: number;
  title: string;
  line: number;
  start: number;
  end: number;
}

export function parseMarkdownRunbook(path: string, raw: string): RunbookDocument {
  fromMarkdown(raw);

  const headings = collectHeadings(raw);
  const title = headings.find((heading) => heading.depth === 1)?.title ?? path;
  const sectionHeadings = headings.filter((heading) => heading.depth === 2);
  const sections = sectionHeadings.map((heading, index): RunbookSection => {
    const next = sectionHeadings[index + 1];
    const body = raw.slice(heading.end, next?.start ?? raw.length).trim();
    return {
      key: normalizeSectionTitle(heading.title),
      title: heading.title,
      line: heading.line,
      body,
      items: splitItems(body)
    };
  });

  return {
    path,
    format: 'markdown',
    title,
    sections,
    steps: parseMarkdownSteps(raw, headings),
    raw
  };
}

function collectHeadings(raw: string): HeadingSpan[] {
  const headings: HeadingSpan[] = [];
  const pattern = /^(#{1,6})\s+(.+?)\s*#*\s*$/gm;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(raw)) !== null) {
    headings.push({
      depth: match[1].length,
      title: match[2].trim(),
      line: lineForOffset(raw, match.index),
      start: match.index,
      end: pattern.lastIndex
    });
  }
  return headings;
}

function parseMarkdownSteps(raw: string, headings: HeadingSpan[]): RunbookStep[] {
  const stepHeadings = headings.filter((heading) => heading.depth === 3);
  if (stepHeadings.length === 0) return parseListSteps(raw);

  return stepHeadings.map((heading, index) => {
    const next = stepHeadings[index + 1];
    const body = raw.slice(heading.end, next?.start ?? raw.length);
    return buildStep(heading.title, heading.line, body);
  });
}

function parseListSteps(raw: string): RunbookStep[] {
  const stepsSection = collectHeadings(raw).find(
    (heading) => heading.depth === 2 && normalizeSectionTitle(heading.title) === 'steps'
  );
  if (!stepsSection) return [];

  const nextSection = collectHeadings(raw).find(
    (heading) => heading.depth === 2 && heading.start > stepsSection.start
  );
  const body = raw.slice(stepsSection.end, nextSection?.start ?? raw.length);
  return splitItems(body).map((item, index) => buildStep(item, stepsSection.line + index + 1, ''));
}

function buildStep(title: string, line: number, body: string): RunbookStep {
  return {
    id: slug(title),
    title,
    owner: readInlineField(body, 'owner'),
    inputs: readListField(body, 'inputs'),
    outputs: readListField(body, 'outputs'),
    safety: readListField(body, 'safety'),
    verification: readListField(body, 'verification'),
    line
  };
}

function readInlineField(body: string, field: string): string | undefined {
  const pattern = new RegExp(`^[-*+]?\\s*${field}:\\s*(.+)$`, 'im');
  return pattern.exec(body)?.[1]?.trim();
}

function readListField(body: string, field: string): string[] {
  const inline = readInlineField(body, field);
  if (!inline) return [];
  return inline
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
