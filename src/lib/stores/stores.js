import { writable } from "svelte/store";
// import { ParseMarkdown } from "../ParseMarkdown";

import { Editor } from 'typewriter-editor';

export const currentDocumentObject = writable();

export const documentList=writable([]);

export const editor = new Editor();

export let currentlyAddingNewNote = writable(false);

// let parseMarkdown = new ParseMarkdown();
// export let parse = writable(parseMarkdown);

export let filterGroup =writable(["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"]);

export let noDocumentFilter = writable(true);

export const selectedDocumentList=writable([]);

export let myFilters =writable({
    "Filter 1": ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"],
    "Filter 2": ["Epikrise"],
    "Filter 3": ["Epikrise", "Rutinekontroll"],
    "Filter 4": ["Sykepleier notat", "Rutinekontroll"],
    "Filter 5": ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat"]}
    );