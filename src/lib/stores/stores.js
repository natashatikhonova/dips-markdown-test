import { writable } from "svelte/store";

import { Editor } from 'typewriter-editor';

export const currentDocumentObject = writable();

export const documentList=writable([]);

export const editor = new Editor();

export let currentlyAddingNewNote = writable(false);

export let filterGroup =writable(["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"]);

export let noDocumentFilter = writable(true);

export let searchValue = writable("")

export let showTitles = writable(false)

