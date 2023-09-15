import { linter, type Diagnostic } from "@codemirror/lint";
import { Compartment, Facet } from "@codemirror/state";
import type { File } from "./state";

const linterService = linter(view => {
	return view.state.facet(diagnostic).flat();
}, {
	needsRefresh: update => update.startState.facet(diagnostic) !== update.state.facet(diagnostic),
});

export const diagnostic = Facet.define<Diagnostic[]>({
	enables: linterService,
});

export const compartment = new Compartment;

export function parseCompileErrorConsole(log: string, sourceFile: File): Diagnostic[] {
	const logLines = log.split("\n");
	const diagnostics: Diagnostic[] = [];
	const re = /^\/str\/([^:]+):(\d+): ([^:]+): ([^:]+)$/;

	for (let i = 0; i < logLines.length; i++) {
		const line = logLines[i];
		const groups = line.match(re);
		if (!groups) continue;
		const [, path, lineNoStr, severity, message] = groups;
		if (path !== sourceFile.path) continue;
		const lineNo = parseInt(lineNoStr);

		// Find index that the line starts in the source file
		let pos = 0;
		for (let linesLeft = lineNo; linesLeft > 1 && pos < sourceFile.content.length; pos++) {
			if (sourceFile.content[pos] === "\n") linesLeft--;
		}

		// Column; position of "^"
		pos += logLines[i + 2].length - 1;

		diagnostics.push({
			from: pos,
			to: pos + 1,
			severity: severity === "error" ? "error" : "warning",
			message,
		});
	}
	return diagnostics;
}
