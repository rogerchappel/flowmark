export type RunbookFormat = 'markdown' | 'yaml';

export type Severity = 'error' | 'warning';

export interface SourceLocation {
  line: number;
  column: number;
}

export interface RunbookSection {
  key: string;
  title: string;
  line: number;
  body: string;
  items: string[];
}

export interface RunbookStep {
  id: string;
  title: string;
  owner?: string;
  inputs: string[];
  outputs: string[];
  safety: string[];
  verification: string[];
  line: number;
}

export interface RunbookDocument {
  path: string;
  format: RunbookFormat;
  title: string;
  sections: RunbookSection[];
  steps: RunbookStep[];
  raw: string;
}

export interface LintMessage {
  code: string;
  severity: Severity;
  message: string;
  line: number;
  column: number;
}

export interface RuleContext {
  requiredSections: string[];
  confirmDestructive: boolean;
}

export interface LintResult {
  file: string;
  ok: boolean;
  messages: LintMessage[];
  outline: ExecutionOutline;
}

export interface ExecutionOutline {
  source: string;
  format: RunbookFormat;
  title: string;
  goal: string;
  inputs: string[];
  boundaries: string[];
  steps: RunbookStep[];
  verification: string[];
  rollback: string[];
  doneCriteria: string[];
}
