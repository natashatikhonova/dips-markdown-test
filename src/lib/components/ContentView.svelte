<script>
    import { currentDocumentObject, currentlyAddingNewNote, documentList } from '../stores/stores.js';
    import {marked } from 'marked';
    import Typewriter from './Typewriter.svelte';
    import {editor} from '../stores/stores.js';
    import {createEventDispatcher} from 'svelte';

    export let goBackButton = false;
    export let width;

    let edit = $currentlyAddingNewNote;
    const dispatch = createEventDispatcher()

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
    let contentViewSize = 50
    function goBack(){
      editor.setHTML(marked(""));
      // $currentDocumentObject = null;
      if (contentViewSize == 100){
        dispatch("set_content_view_size", 50)
        contentViewSize = 50

      } else if (contentViewSize == 50){
        $currentDocumentObject = null
      }
    }
    function showContent(){
      dispatch("set_content_view_size", 100)
      contentViewSize = 100
    }
       
</script>

<head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
  
<div class="content-container" class:mobile={width<600}>
  {#if $currentDocumentObject || $currentlyAddingNewNote}
    {#if edit} 
        <Typewriter on:editable={changeEdit} />
    {:else}
        <header class="header-bar">
          {#if goBackButton } 
            <button title = "tilbake" class="back" on:click={goBack}><i class="material-icons">arrow_back</i></button>
          {:else}
            <button title = "Vis dokument" class="back" disabled = {contentViewSize==100} on:click={showContent}><i class="material-icons">arrow_back</i></button>
            <button title = "Vis dokumentliste" class="back" on:click={goBack}><i class="material-icons">arrow_forward</i></button>
          {/if}
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

  .header-bar {
    background: whitesmoke;
    box-shadow: 0 3px 5px -2px rgba(57, 63, 72, 0.3);
    margin-bottom: 3px;

    display: flex;
    /* margin-left:5px;
    margin-right:5px; */
    /* border-radius: 3px; */
    /* padding: 10px;*/
    
    /* display: flex;
    background: #eee;
    margin-left:5px;
    margin-right:5px;
    padding: 7px;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px rgba(0, 0, 0, .1);
    min-width: min-content; */
  }
  
  /* .header-bar{
    display: flex;
    background: #eee;
    margin-left:1%;
    margin-right:1%;
    padding: 0.6%;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px rgba(0, 0, 0, .1);
    border-bottom: solid 1px black;
  } */

  .link{
    padding: 1vh;
    margin-top: 3vh;
  }

  .back {
    display: inline-flex;
    align-items: center;
    background: none;
    height: 40px;
    border:none;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;
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

  .mobile{
    width: calc(100vw);
  }

</style>
