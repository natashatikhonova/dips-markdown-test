import { writable } from "svelte/store";

import { Editor } from 'typewriter-editor';

export const currentDocumentObject = writable();

export const documentList=writable([]);

export const editor = new Editor();

export let currentlyAddingNewNote = writable(false);

export let currentlyEditingNote = writable(false);

export let showSideView = writable(true)

// let parseMarkdown = new ParseMarkdown();
// export let parse = writable(parseMarkdown);

let documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Røntgen bilde", "typ1", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10", "typ11", "typ12", "typ13", "typ14", "typ1", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10", "typ11", "typ12", "typ13", "typ14"];
export let nofilter = writable({id: 0, name: "Alle", filters: documentTypes});
export let globalCurrentFilterGroup = writable({id: -1, name: "", filters: documentTypes});
export let allfilterOff = writable(false);

export const selectedDocumentList=writable([]);

export let myFilters = writable([
    {id: 1, name: "Filter 1", filters: ["Epikrise"]},
    {id: 2, name: "Sindres filter", filters: ["Lab", "Sykepleier notat", "Rutinekontroll"]},
    {id: 3, name: "Natashas filter", filters: ["Epikrise", "Poliklinisk notat", "Lab", "Rutinekontroll"]},
    {id: 4, name: "Torkilds filter", filters: ["Epikrise", "Lab", "Rutinekontroll"]},
    {id: 5, name: "Thors filter", filters: ["Lab"]}
]);


export let searchValue = writable("")
export let amount_searched_words = writable(0)

export let showTitles = writable(false)

export let showFiltermenu = writable(false)




export let saved_filter_groups = writable([])

export let searchResult = writable([])

export let selected_line_height = writable("1.5")

export let selected_text_size = writable(11)

