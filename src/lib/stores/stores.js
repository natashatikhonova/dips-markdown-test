import { writable } from "svelte/store";
// import { ParseMarkdown } from "../ParseMarkdown";

import { Editor } from 'typewriter-editor';

export const currentDocumentObject = writable();

export const documentList=writable([]);

export const editor = new Editor();

export let currentlyAddingNewNote = writable(false);

export let filterGroup =writable(["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"]);

export let noDocumentFilter = writable(true);

export const selectedDocumentList=writable([]);