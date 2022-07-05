<script>
    import { currentDocumentObject, currentlyAddingNewNote } from '../stores/stores.js';
    import {marked} from 'marked';
    import {editor} from '../stores/stores.js';
    import asRoot from 'typewriter-editor/lib/asRoot';
    import Toolbar from 'typewriter-editor/lib/Toolbar.svelte';
    import {documentList} from '../stores/stores.js';
    import toMarkdown from 'to-markdown';
    import {createEventDispatcher} from 'svelte';
    import { DocumentObject } from '../document.js';
import { ParseMarkdown } from '../ParseMarkdown.js';

    let selectedDocType = "Velg dokumenttype";

    const documentTypes = ["Velg dokumenttype", "Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];

    //Sets text in editor
    $: if ($currentDocumentObject && !$currentlyAddingNewNote){
        editor.setHTML(marked($currentDocumentObject.context));
    } else if($currentDocumentObject && $currentlyAddingNewNote){
        editor.setHTML(marked(""));
    } 
   
    const dispatch = createEventDispatcher();

    //Either editor shows or just the text
    function changeEdit(){
        dispatch('editable');
    }

    //Sets the text back to the previous shown text
    function cancel(){
      changeEdit();
      dispatch("cancel");
      if($currentDocumentObject){
        editor.setHTML(marked($currentDocumentObject.context));
      } else{
        editor.setHTML("");
      }
      $currentlyAddingNewNote=false;
      
    }
    //Saves the text if the text is not empty and stores the text
    function save(){
      changeEdit();
      if( toMarkdown(editor.getHTML()) === ""){
        alert("Tom notat!");
        $currentlyAddingNewNote=false;
        dispatch("save");
      }else{
        if(!$currentlyAddingNewNote){
          dispatch("save");
          $documentList.forEach((element)=>{
            if (element.id === $currentDocumentObject.id){
                element.context= toMarkdown(editor.getHTML());
            }
          })
          $documentList = $documentList;
        } else{
          if (selectedDocType !==documentTypes[0]){
            let newElement = new DocumentObject($documentList.length, new Date().toDateString(), toMarkdown(editor.getHTML())+"\n");
            newElement.title = selectedDocType;

            //Lager et tre over markdown overskriftene i teksten
            let parse = new ParseMarkdown();
            console.log("Før parse")
            let tree = parse.parseAndSetIntoTree(newElement) //Her henger programmet!!. FIKSET:)
            console.log("Etter parse")
            newElement.markdownTree = tree;

            $documentList.push(newElement);
            $documentList = $documentList;
            $currentDocumentObject = newElement;
            $currentlyAddingNewNote = false;
            dispatch("save");
          } else{ //must save the document
            alert("Vennligst velg dokumenttype!");
            changeEdit();
          }  
        } 
      }
      
    }

    
</script>

<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<!-- source: https://github.com/typewriter-editor/typewriter -->
<div class="toolbar">
  <Toolbar {editor} let:active let:commands>
      <button
        title="Overskrift"
        class="toolbar-button"
        class:active={active.header === 1}
        on:click={commands.header1}><i class="material-icons">title</i></button>
  
      <button
        title="Underskrift"
        class="toolbar-button"
        class:active={active.header === 2}
        on:click={commands.header2}><i class="material-icons header2">title</i></button>
  
      <button
        title="Uthevet"
        class="toolbar-button"
        class:active={active.bold}
        on:click={commands.bold}><i class="material-icons">format_bold</i></button>
  
      <button
        title="Kursiv"
        class="toolbar-button"
        class:active={active.italic}
        on:click={commands.italic}><i class="material-icons">format_italic</i></button>

      <button
        title="Punktliste"
        class="toolbar-button"
        class:active={active.bulletList}
        on:click={commands.bulletList}><i class="material-icons">format_list_bulleted</i></button>
      <button
        title="Nummeret liste"
        class="toolbar-button"
        class:active={active.orderedList}
        on:click={commands.orderedList}><i class="material-icons">format_list_numbered</i></button>
      <button
        title="Angre"
        class="toolbar-button arrow"
        disabled={!active.undo}
        on:click={commands.undo}><i class="material-icons">undo</i></button>

      <button
        title="Gjøre om"
        class="toolbar-button arrow"
        disabled={!active.redo}
        on:click={commands.redo}><i class="material-icons">redo</i></button>

      <div class = "controls">
        <button title="Lagre"class="save " on:click={save}> <i class="material-icons">save</i></button>
        <button title="Avbryt" class = "save" on:click={cancel} > <i class="material-icons">close</i></button>
      </div>
  </Toolbar>
</div>
{#if $currentlyAddingNewNote}
  <div class="dropdown">
    <select class="dropdown-menu" bind:value={selectedDocType} >
      {#each documentTypes as value}<option {value}>{value}</option>{/each}
    </select>
  </div>
{/if}
<div class="textfield">
  {#if !$currentlyAddingNewNote  && $currentDocumentObject} 

    <div class="title">{$currentDocumentObject.title}</div>
    <div class="meta">Skrevet av {$currentDocumentObject.author}, {$currentDocumentObject.date.toDateString()}</div>
  {/if}
  <!-- svelte-ignore a11y-autofocus -->
  <div class="editor" style="border:none" autofocus use:asRoot = {editor} ></div>
</div>

<style>

  .toolbar {
    display: flex;
    background: #eee;
    padding: 8px;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px rgba(0, 0, 0, .1);
    min-width: 440px;
  }

  .toolbar-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    width: 40px;
    height: 40px;
    margin-right: 4px;
    border-radius: 4px;
    border: 1px solid #ced4da;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;
  }

  .toolbar-button:hover {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }

  .toolbar-button.active {
    border: solid 2px;
    border-color: #80bdff;
  }

  .header2{
    font-size:large;
  }

  .arrow{
    color:black;
    font-weight: bolder;
    font-size:x-large;
  }

  .controls{
    margin-left: auto;
    margin-right: 6px;
    display: inline-flex;
  }

  .dropdown{
    margin: 1.5vh;
  }

  .dropdown-menu {
    background: #fff;
    width: 20vh;
    height: 40px;
    border-radius: 4px;
    border: 1px solid #ced4da;
    cursor: pointer;
  }

  .dropdown-menu:hover {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
  
  .textfield{
    height: 100%;
  }

  .title{
    font-weight: bold;
    font-style: italic;
    margin-left: 1vh;
    margin-top:1vh;
  }

  .meta{
    font-style: italic;
    margin-left:1vh;
    margin-top:1vh;
  }

  .editor{
    margin-top: 1vh;
    padding:0.7vh;
    height: 95%;
    overflow-y: auto;
  }

  .save{
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    width: 40px;
    height: 40px;
    margin-right: 4px;
    border:none;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;
  }

  .save:hover{
    color:#d43838;
    border:none;
    border-color: none;
    box-shadow: none;
  }  

</style>