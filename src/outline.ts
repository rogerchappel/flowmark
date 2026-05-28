import { firstParagraph } from './text.js';
import type { ExecutionOutline, RunbookDocument, RunbookSection } from './types.js';

export function createOutline(document: RunbookDocument): ExecutionOutline {
  const byKey = new Map(document.sections.map((section) => [section.key, section]));

  return {
    source: document.path,
    format: document.format,
    title: document.title,
    goal: firstParagraph(sectionBody(byKey.get('goal'))),
    inputs: sectionItems(byKey.get('inputs')),
    boundaries: sectionItems(byKey.get('boundaries')),
    steps: document.steps,
    verification: sectionItems(byKey.get('verification')),
    rollback: sectionItems(byKey.get('rollback')),
    doneCriteria: sectionItems(byKey.get('done-criteria'))
  };
}

function sectionBody(section: RunbookSection | undefined): string {
  return section?.body ?? '';
}

function sectionItems(section: RunbookSection | undefined): string[] {
  return section?.items ?? [];
}
