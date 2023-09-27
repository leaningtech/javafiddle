<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { basicSetup } from 'codemirror';
	import { EditorView, keymap } from '@codemirror/view';
	import { Compartment, EditorState } from '@codemirror/state';
	import { indentWithTab } from '@codemirror/commands';
	import { indentUnit } from '@codemirror/language';
	import { lintGutter } from '@codemirror/lint';
	import { java } from '@codemirror/lang-java';
	import { files, selectedFilePath, type File } from './state';
	import './codemirror.css';
	import { compartment, diagnostic, parseCompileLog } from './linter';
	import { effectiveTheme } from '$lib/settings/store';
	import { coolGlow, tomorrow } from 'thememirror';

	let container: HTMLDivElement;
	let editorStates: Map<string, EditorState> = new Map();
	let editorView: EditorView | undefined;
	const themeCompartment = new Compartment();

	$: theme = $effectiveTheme === 'dark' ? coolGlow : tomorrow;

	$: reset($files);

	const extensions = () => [
		basicSetup,
		keymap.of([/*{ key: 'Tab', run: acceptCompletion },*/ indentWithTab]),
		indentUnit.of('    '),
		lintGutter(),
		compartment.of(diagnostic.of([])),
		themeCompartment.of(theme)
	];

	// Resets states to files
	let skipReset = false;
	function reset(files: File[]) {
		if (skipReset) return;

		for (const file of files) {
			let state = editorStates.get(file.path);
			if (state) {
				// Update state to match filesystem
				const existing = state.doc.toString();
				if (file.content !== existing) {
					const transaction = state.update({
						changes: {
							from: 0,
							to: existing.length,
							insert: file.content
						}
					});
					state = transaction.state;
				}
			} else {
				const extension = file.path.split('.').pop();
				state = EditorState.create({
					doc: file.content,
					extensions: extension === 'java' ? [...extensions(), java()] : extensions()
				});
			}

			editorStates.set(file.path, state);
			if (file.path === $selectedFilePath) {
				editorView?.setState(state);
			}
		}
	}

	onMount(() => {
		editorView = new EditorView({
			parent: container,
			state: editorStates.get($selectedFilePath),
			async dispatch(transaction) {
				editorView?.update([transaction]);
				editorStates.set($selectedFilePath, transaction.state);

				if (transaction.docChanged) {
					skipReset = true;
					files.update((files) =>
						files.map((file) => {
							if (file.path === $selectedFilePath) {
								return {
									...file,
									content: transaction.state.doc.toString()
								};
							} else {
								return file;
							}
						})
					);
					await tick();
					skipReset = false;
				}
			}
		});
		return () => {
			editorView?.destroy();
		};
	});
	/*
	beforeNavigate(() => {
		skipReset = true;
	});
	afterNavigate(() => {
		skipReset = false;
		editorStates.clear();
		reset(files);
	});*/

	// Look at the selected file
	$: {
		const state = editorStates.get($selectedFilePath);
		if (state) {
			editorView?.setState(state);
		}
	}

	// Linter
	export let compileLog: string;
	$: {
		const diagnostics = parseCompileLog(compileLog, $files);
		for (let fileIndex = 0; fileIndex < diagnostics.length; fileIndex++) {
			const diagnosticsForFile = diagnostics[fileIndex];
			const path = $files[fileIndex].path;
			const tr = {
				effects: compartment.reconfigure(diagnostic.of(diagnosticsForFile))
			};
			if ($selectedFilePath === path) {
				editorView?.dispatch(tr);
			} else {
				// If we're not viewing the state, update it in place.
				// This is so that we don't have to re-lint the file when we switch to it.
				const state = editorStates.get(path);
				if (!state) continue;
				editorStates.set(path, state.update(tr).state);
			}
		}
	}

	$: {
		const tr = {
			effects: themeCompartment.reconfigure(theme)
		};

		editorView?.dispatch(tr); // Current file
		for (const [key, value] of editorStates.entries()) {
			// Other files
			editorStates.set(key, value.update(tr).state);
		}
	}
</script>

<div bind:this={container} class="grow overflow-hidden" />
