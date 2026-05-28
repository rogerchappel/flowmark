import { load } from 'js-yaml';
import { slug } from './text.js';
import type { RunbookDocument, RunbookSection, RunbookStep } from './types.js';

export function parseYamlRunbook(path: string, raw: string): RunbookDocument {
  const value = load(raw);
  if (!isRecord(value)) {
    throw new Error('YAML runbook must be an object.');
  }

  const title = stringValue(value.title) ?? path;
  const sections: RunbookSection[] = [];
  for (const [key, titleText] of [
    ['goal', 'Goal'],
    ['inputs', 'Inputs'],
    ['boundaries', 'Boundaries'],
    ['verification', 'Verification'],
    ['rollback', 'Rollback'],
    ['doneCriteria', 'Done Criteria']
  ] as const) {
    if (value[key] !== undefined) {
      sections.push({
        key: key === 'doneCriteria' ? 'done-criteria' : key,
        title: titleText,
        line: 1,
        body: arrayValue(value[key]).join('\n'),
        items: arrayValue(value[key])
      });
    }
  }

  const steps = arrayValue(value.steps).map((step, index): RunbookStep => {
    if (isRecord(step)) {
      const title = stringValue(step.title) ?? `Step ${index + 1}`;
      return {
        id: stringValue(step.id) ?? slug(title),
        title,
        owner: stringValue(step.owner),
        inputs: arrayValue(step.inputs),
        outputs: arrayValue(step.outputs),
        safety: arrayValue(step.safety),
        verification: arrayValue(step.verification),
        line: 1
      };
    }

    const title = String(step);
    return { id: slug(title), title, inputs: [], outputs: [], safety: [], verification: [], line: 1 };
  });

  if (steps.length > 0) {
    sections.push({ key: 'steps', title: 'Steps', line: 1, body: steps.map((step) => step.title).join('\n'), items: steps.map((step) => step.title) });
  }

  return { path, format: 'yaml', title, sections, steps, raw };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function arrayValue(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value.map((item) => typeof item === 'string' ? item : JSON.stringify(item));
  return [String(value)];
}
