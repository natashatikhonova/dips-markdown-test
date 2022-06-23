<script>
    import { currentDocumentObject } from '../stores/stores.js';
    import {marked, } from 'marked';
    import {editor} from '../stores/stores.js';
    import asRoot from 'typewriter-editor/lib/asRoot';
    import Toolbar from 'typewriter-editor/lib/Toolbar.svelte';
    import {documentList} from '../stores/stores.js';
    import toMarkdown from 'to-markdown';
    import {createEventDispatcher} from 'svelte';

    $: if ($currentDocumentObject!=null){
        editor.setHTML(marked($currentDocumentObject.context));
    }
    
    const dispatch = createEventDispatcher();

    function changeEdit(){
        dispatch('editable');
    }

    function cancel(){
      changeEdit();
      dispatch("cancel");
      editor.setHTML(marked($currentDocumentObject.context));
    }

    function save(){
      changeEdit();
      dispatch("save");
      console.log(toMarkdown(editor.getHTML()));
      $documentList[$currentDocumentObject.id].context = toMarkdown(editor.getHTML());
    }
    
</script>

<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<div class="main-conteiner">
  <div class="toolbar">
    <Toolbar {editor} let:active let:commands>
        <button
          class="toolbar-button"
          class:active={active.header === 1}
          on:click={commands.header1}><i class="material-icons">title</i></button>
    
        <button
          class="toolbar-button"
          class:active={active.header === 2}
          on:click={commands.header2}><i class="material-icons header2">title</i></button>
    
        <button
          class="toolbar-button"
          class:active={active.bold}
          on:click={commands.bold}><i class="material-icons">format_bold</i></button>
    
        <button
          class="toolbar-button"
          class:active={active.italic}
          on:click={commands.italic}><i class="material-icons">format_italic</i></button>
  
        <button
          class="toolbar-button"
          class:active={active.bulletList}
          on:click={commands.bulletList}><i class="material-icons">format_list_bulleted</i></button>
        <button
          class="toolbar-button"
          class:active={active.orderedList}
          on:click={commands.orderedList}><i class="material-icons">format_list_numbered</i></button>
        <button
          class="toolbar-button arrow"
          disabled={!active.undo}
          on:click={commands.undo}>←</button>
  
        <button
          class="toolbar-button arrow"
          disabled={!active.redo}
          on:click={commands.redo}>→</button>
  
        <div class = "controls">
          <button class=" toolbar-button save " on:click={save}> Lagre</button>
          <button class = "toolbar-button save" on:click={cancel} >Avbryt</button>
        </div>
  </Toolbar>
</div>

  <div class="text-conteiner">
  <div class="title">{$currentDocumentObject.title}</div>
  <div class="meta">Skrevet av {$currentDocumentObject.author}, {$currentDocumentObject.date.toDateString()}</div>

  <div class="editor" use:asRoot = {editor} ></div>
</div>
</div>


<style>
    .main-conteiner{
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .text-conteiner{
      height: 100%;
      overflow-y: auto;
    }
    .title{
        font-weight: bold;
        font-style: italic;
    }

    .meta{
        font-style: italic;
    }

    .editor{
      padding: 1vh;
    }

    .toolbar {
      display: flex;
      background: #eee;
      padding: 8px;
      border-radius: 3px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px rgba(0, 0, 0, .1);
    /* display: flex;
    background: #eee;
    width: 90vh;
    position: fixed;
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px rgba(0, 0, 0, .1); */
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
    margin-right: 0;
    display: inline-flex;
  }


</style>