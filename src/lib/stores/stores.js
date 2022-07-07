import { writable } from "svelte/store";
import { ParseMarkdown } from "../ParseMarkdown";

import { Editor } from 'typewriter-editor';

export const currentDocumentObject = writable();

export const documentList=writable([]);

export const editor = new Editor();

export let currentlyAddingNewNote = writable(false);

let parseMarkdown = new ParseMarkdown();
export let parse = writable(parseMarkdown);

export let documentFilter = writable("Alle");