<script>
    import { currentDocumentObject } from '../stores/stores.js';
    import {marked } from 'marked';
    import Typewriter from './Typewriter.svelte';
    import {editor} from '../stores/stores.js';

    let edit = false;
    function changeEdit(){
        edit=!edit;
    }

    $: if ($currentDocumentObject!=null){
        edit = false;
        editor.setHTML(marked($currentDocumentObject.context));
    }
       
</script>
  <head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  </head>
  

  {#if $currentDocumentObject!=null}
    {#if edit} 
        <Typewriter on:editable={changeEdit}/>
    {:else}
        <div class="editBox">
          <h3>{$currentDocumentObject.title.toUpperCase()}</h3>
          <button class="edit" on:click={changeEdit}>Rediger</button>
        </div>
        
        <div class="test">Skrevet av {$currentDocumentObject.author}, {$currentDocumentObject.date.toDateString()}</div>
        <div class = "editor ">{@html marked($currentDocumentObject.context)}</div>


    {/if}
{/if} 

<style>

  .test{
    margin-top: 10vh;
    font-style: italic;
  }
    
    .edit {
        position: fixed;
        right:10vh;
        top:2vh;
        width:13vh;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 4px;
        border: 1px solid #ced4da;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;

    }

  .edit:hover {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }


  h3{
    align-self: center;
    position: fixed;
    right:50vh;
  }

  .editor{
    border: none;
  }

  .editBox{
    display: flex;
    width: 90vh;
    position: fixed;
    height:5vh;
    padding: 8px;
    margin-bottom: 8px;
    background: #eee;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px rgba(0, 0, 0, .1);
    
  }

</style>
