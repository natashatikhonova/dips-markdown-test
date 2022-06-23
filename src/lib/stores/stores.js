import { writable } from "svelte/store";

import { Editor } from 'typewriter-editor';

export const currentDocumentObject = writable();

export const documentList=writable([]);

export const editor = new Editor();
