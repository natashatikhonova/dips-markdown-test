<script>
    import { currentDocumentObject, currentlyAddingNewNote } from '../stores/stores.js';
    import {marked } from 'marked';
    import Typewriter from './Typewriter.svelte';
    import {editor} from '../stores/stores.js';

    let edit = ($currentlyAddingNewNote)? true: false;

    function changeEdit(){
          edit=!edit;
    }

    $: if ($currentDocumentObject!=null && !$currentlyAddingNewNote){
        editor.setHTML(marked($currentDocumentObject.context));
    } else if($currentlyAddingNewNote){
        editor.setHTML(marked(""));
    } 
       
</script>

<head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
  
<div class="content-container">
  {#if $currentDocumentObject || $currentlyAddingNewNote}
    {#if edit} 
        <Typewriter on:editable={changeEdit} />
    {:else}
        <div class="header-bar">
          <div class="doc-title">{$currentDocumentObject.title.toUpperCase()}</div>
          <button class="edit-button" on:click={changeEdit}>Rediger</button>
        </div>
        <div class="textfield">
          <br>
          <div class="doc-meta">Skrevet av {$currentDocumentObject.author}, {$currentDocumentObject.date.toDateString()}</div>
          <div class = "editor ">{@html marked($currentDocumentObject.context)}</div>
        </div>
    {/if}
  {/if}
</div>

<style>

  .content-container{
        display: flex;
        flex-direction: column;
        height: 100%;
        flex-grow:1;
  }
  
  .header-bar{
    display: flex;
    background: #eee;
    padding: 8px;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px rgba(0, 0, 0, .1);
    border-bottom: solid 1px black;
  }

  .doc-title{
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .edit-button {
    display: inline-flex;
    align-items: center;
    background: #fff;
    height: 40px;
    margin-right: 4px;
    border-radius: 4px;
    border: 1px solid #ced4da;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;
  }

  .edit-button:hover {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }

  .doc-meta{
    font-style: italic;
    margin-left:1vh;
  }

  .textfield{
      height: 100%;
      flex-grow: 1;
      overflow-y: auto;
    }
    
  .editor{
    padding: 1vh;
  }

</style>
