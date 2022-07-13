import { writable } from "svelte/store";

import { Editor } from 'typewriter-editor';

export const currentDocumentObject = writable();

export const documentList=writable([]);

export const editor = new Editor();

export let currentlyAddingNewNote = writable(false);

// let parseMarkdown = new ParseMarkdown();
// export let parse = writable(parseMarkdown);

export let globalCurrentFilterGroup = writable([]);

export let noDocumentFilter = writable(true);

export const selectedDocumentList=writable([]);

export let myFilters =writable([
    {id: 1, name: "Filter 1", filters: ["Epikrise"]},
    {id: 2, name: "Sindres filter", filters: ["Lab", "Sykepleier notat", "Rutinekontroll"]},
    {id: 3, name: "Natashas filter", filters: ["Epikrise", "Poliklinisk notat", "Lab", "Rutinekontroll"]},
    {id: 4, name: "Torkilds filter", filters: ["Epikrise", "Lab", "Rutinekontroll"]},
    {id: 5, name: "Thors filter", filters: ["Lab"]}
]);


export let searchValue = writable("")

export let showTitles = writable(false)

export let saved_filter_groups = writable([])


