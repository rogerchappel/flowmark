import { createOutline } from './outline.js';
import { defaultRequiredSections, humanizeSectionKey } from './sections.js';
import type { LintMessage, LintResult, RuleContext, RunbookDocument } from './types.js';

const destructivePattern = /\b(rm\s+-rf|git\s+reset\s+--hard|kubectl\s+delete|drop\s+table|terraform\s+destroy)\b/i;
const confirmationPattern = /\b(confirm|approval|approved|rollback|backout)\b/i;

export function lintDocument(document: RunbookDocument, context: Partial<RuleContext> = {}): LintResult {
  const ruleContext: RuleContext = {
    requiredSections: [...defaultRequiredSections],
    confirmDestructive: true,
    ...context
  };
  const messages: LintMessage[] = [];
  const sections = new Map(document.sections.map((section) => [section.key, section]));

  for (const key of ruleContext.requiredSections) {
    if (!sections.has(key)) {
      messages.push({
        code: 'missing-section',
        severity: 'error',
        message: `Missing required section: ${humanizeSectionKey(key)}`,
        line: 1,
        column: 1
      });
    }
  }

  if (document.steps.length === 0) {
    messages.push({
      code: 'missing-steps',
      severity: 'error',
      message: 'Add at least one actionable step under Steps.',
      line: sections.get('steps')?.line ?? 1,
      column: 1
    });
  }

  if (ruleContext.confirmDestructive && destructivePattern.test(document.raw) && !confirmationPattern.test(document.raw)) {
    messages.push({
      code: 'destructive-without-confirmation',
      severity: 'error',
      message: 'Destructive commands need an explicit confirmation, approval, or rollback note.',
      line: 1,
      column: 1
    });
  }

  return {
    file: document.path,
    ok: !messages.some((message) => message.severity === 'error'),
    messages,
    outline: createOutline(document)
  };
}
