<script>
    import { currentDocumentObject, currentlyAddingNewNote, currentlyEditingNote, documentList, smallDevice } from '../stores/stores.js';
    import {marked } from 'marked';
    import Typewriter from './Typewriter.svelte';
    import {editor} from '../stores/stores.js';
    import {createEventDispatcher} from 'svelte';


    let edit = $currentlyAddingNewNote;
    const dispatch = createEventDispatcher()

    $: if ($currentDocumentObject!=null && !$currentlyAddingNewNote){
        editor.setHTML(marked($currentDocumentObject.context));
    } else if($currentlyAddingNewNote){
        editor.setHTML(marked(""));
    } 

    function changeEdit(){
          edit=!edit;
          edit ? $currentlyEditingNote = true: $currentlyEditingNote = false
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
      
    function showDocumentlist(){
      dispatch("set_content_view_size", 0)
    }
       
</script>

<head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
  
<div class="content-container">
  {#if $currentDocumentObject || $currentlyAddingNewNote}
    {#if edit}
        <Typewriter on:editable={changeEdit} on:set_typewriter_view_size={(e)=> dispatch("set_typewriter_view_size", e)}/>
    {:else}
        <header class="header-bar">
          <button title = "Vis dokumentliste" class="arrow-keys" on:click={showDocumentlist}><i class="material-icons">keyboard_arrow_right</i></button>
          <div class="doc-title">{$currentDocumentObject.title.toUpperCase()}</div>
          {#if $currentDocumentObject.readable}
            <button  title="Rediger" class="edit-button" on:click={changeEdit}><i class="material-icons">edit</i></button>
            <button  title="Slett" class="edit-button" on:click={deleteNote}><i class="material-icons">delete</i></button>
          {/if}
        </header>
        <div class="textfield">
          <br>
          <div class="doc-meta">Skrevet av {$currentDocumentObject.author}, {$currentDocumentObject.date.toDateString()}</div>
          {#if $currentDocumentObject.readable}
            <div class = "editor ">{@html marked($currentDocumentObject.context)}</div>
          {:else}
            <div class="link"><a href={$currentDocumentObject.context} target="_blank">Klikk her for å åpne dokumentet i egen visning</a></div>
          {/if}
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
    border-left: 2px solid rgb(187, 187, 187);
  }

  :global(body.dark-mode) .content-container {
    background-color: rgb(49, 49, 49);
  }

  .header-bar {
    background: whitesmoke;
    box-shadow: 0 3px 5px -2px rgba(57, 63, 72, 0.3);
    margin-bottom: 3px;
    display: flex;
  }
  
  :global(body.dark-mode) .header-bar{
    background-color: rgb(49, 49, 49);
  }

  :global(body.dark-mode) .arrow-keys {
    color: #cccccc;
  }
  :global(body.dark-mode) .arrow-keys:hover{
    color: #d43838;
  }

  :global(body.dark-mode) .arrow-keys:disabled{
    color:#585858;
  }

  :global(body.dark-mode) .edit-button{
    color: #cccccc;
  }

  .link{
    padding: 1vh;
    margin-top: 3vh;
  }

  :global(body.dark-mode) a{
    color:#d43838;
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

  :global(body.dark-mode) .edit-button:hover{
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
