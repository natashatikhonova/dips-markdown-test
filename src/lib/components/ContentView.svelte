<script>
    import { currentDocumentObject, currentlyAddingNewNote, documentList } from '../stores/stores.js';
    import {marked } from 'marked';
    import Typewriter from './Typewriter.svelte';
    import {editor} from '../stores/stores.js';

    let edit = ($currentlyAddingNewNote)? true: false;

    function changeEdit(){
          edit=!edit;
    }

    function deleteNote(){
      let retval = confirm("Er du sikker på at du vil slette notat?");
      if (retval == true){
        for (let i = 0; i<$documentList.length; i++){
          $documentList = $documentList.filter((value) => value.id !== $currentDocumentObject.id);
        }
        $currentDocumentObject = null;
     }  
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
          <button  title="Rediger" class="edit-button" on:click={changeEdit}><i class="material-icons">edit</i></button>
          <button  title="Slett" class="edit-button" on:click={deleteNote}><i class="material-icons">delete</i></button>
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
    background-color: white;
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
    background: none;
    height: 40px;
    margin-right: 4px;
    border:none;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;
  }

  .edit-button:hover {
    color: #d43838;
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
