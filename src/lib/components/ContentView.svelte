<script>
    import { currentDocumentObject } from '../stores/stores.js';
    import {marked, } from 'marked';
    import { Editor } from 'typewriter-editor';
    import asRoot from 'typewriter-editor/lib/asRoot';
    import Toolbar from 'typewriter-editor/lib/Toolbar.svelte';
    import {documentList} from '../stores/stores.js';

    //npm install to-markdown
    import toMarkdown from 'to-markdown';
    

    let edit = false;
    function changeEdit(){
        edit=!edit;
    }

    const editor = new Editor();

    $: if ($currentDocumentObject!=null){
        edit = false;
        editor.setHTML(marked($currentDocumentObject.context));
    }

    function save(){
      changeEdit();
      $documentList[$currentDocumentObject.id].context = toMarkdown(editor.getHTML());
    }
   
        
</script>


  {#if $currentDocumentObject!=null}
    {#if edit} 
        <button class = "cancel" on:click={changeEdit} >Avbryt</button>
        <button class="save" on:click={save}>Lagre</button>
        <Toolbar {editor} let:active let:commands>
            <div class="toolbar">
              <button
                class="toolbar-button"
                class:active={active.header === 1}
                on:click={commands.header1}>H1</button>
          
              <button
                class="toolbar-button"
                class:active={active.header === 2}
                on:click={commands.header2}>H2</button>
          
              <button
                class="toolbar-button"
                class:active={active.bold}
                on:click={commands.bold}>B</button>
          
              <button
                class="toolbar-button"
                class:active={active.italic}
                on:click={commands.italic}>I</button>
          
              <button
                class="toolbar-button"
                disabled={!active.undo}
                on:click={commands.undo}>←</button>
          
              <button
                class="toolbar-button"
                disabled={!active.redo}
                on:click={commands.redo}>→</button>
            </div>
        </Toolbar>
        <div use:asRoot = {editor} ></div>
    {:else}
        <button class="edit" on:click={changeEdit}>Rediger</button>
        {console.log($currentDocumentObject.context)}
        <div>{@html marked($currentDocumentObject.context)}</div>

    {/if}
{/if}
  

<style>

    .edit{
        position: absolute;
        top:0;
        right:0;
        margin: 3vh;
    }
    .cancel {
        position: absolute;
        top:2;
        right:1.5vh;
        margin: 3vh;
    }

    .save{
        position: absolute;
        top:2;
        right:10vh;    
        margin: 3vh;
    }

    .toolbar {
    display: flex;
    background: #eee;
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px rgba(0, 0, 0, .1);
  }
  .toolbar-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    margin: 0;
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
    border-color: #80bdff;
    background: #eaf4ff;
  }
</style>
