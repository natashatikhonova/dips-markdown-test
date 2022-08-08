<script>
    import { currentDocumentObject, showSideView, currentlyAddingNewNote, currentlyEditingNote, findNewDocumentObjId, DocumentObject, documentTypes, smallDevice} from "../stores/stores";
    import {marked} from 'marked';
    import {editor} from '../stores/stores.js';
    import {documentList} from '../stores/stores.js';
    import toMarkdown from 'to-markdown';
    import {createEventDispatcher} from 'svelte';
    import {ParseMarkdown} from "../utils/markdown/Parsemarkdown"
    import { h as hFromTypewriter} from 'typewriter-editor';
    import TypewriterToolbar from "./TypewriterToolbar.svelte";
    import TypewriterEditor from "./TypewriterEditor.svelte";
    
    let selectedDocType = "Velg dokumenttype";
    let documentTypesCpy = documentTypes.slice()
    documentTypesCpy.splice(0,0,"Velg dokumenttype")
    editor.typeset.formats.add({
      name: 'autocomplete',
      selector: 'autoSuggestion',
      render: (attributes, children) => hFromTypewriter('autoSuggestion', null, children),
    });
	
    const dispatch = createEventDispatcher();

    //Sets text in editor
    $: if ($currentDocumentObject && !$currentlyAddingNewNote){
        editor.setHTML(marked($currentDocumentObject.context));
    } else if($currentDocumentObject && $currentlyAddingNewNote){
        editor.setHTML(marked(""));
    } 
   
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
      $currentlyEditingNote = false;
    }

    function mobileDown(){
      dispatch("cancel");
    }

    //Saves the text if the text is not empty and stores the text
    function save(){
      remove_suggestion()

      changeEdit();
      if( toMarkdown(editor.getHTML()) === ""){
        //Empty note
        alert("Tom notat!");
        $currentlyAddingNewNote=false;
        dispatch("save");
      }else{
        if($currentlyEditingNote){ 
          //Edit note
          dispatch("save");
          $currentlyEditingNote = false;
          $documentList.forEach((element)=>{
            if (element.id === $currentDocumentObject.id){
                element.context= toMarkdown(editor.getHTML()) + " \n";
                //make an tree over all markdown titles
                let parse = new ParseMarkdown()
                console.log("Før parse")
                let tree = parse.parseAndSetIntoTree(element)
                console.log("Etter parse")
                element.markdownTree = tree;

            }
          })
          $documentList = $documentList;
          console.log("Setter inn dokumenter i typewriter Edit")

        } else{
          if (selectedDocType !== documentTypesCpy[0]) { //new Note
            console.log("New note")
            const readable = true;
            let newElement = new DocumentObject(findNewDocumentObjId($documentList.slice()), new Date().toDateString(), (toMarkdown(editor.getHTML())+" \n"), readable);
            newElement.readable = readable
            newElement.title = selectedDocType;

            //make an tree over all markdown titles
            let parse = new ParseMarkdown()
            let tree = parse.parseAndSetIntoTree(newElement)

            newElement.markdownTree = tree;

            $documentList.push(newElement);
            $documentList = $documentList;
            console.log("Setter inn dokumenter i Typewriter. New note")

            $currentDocumentObject = newElement;
            $currentlyAddingNewNote = false;
            dispatch("save");

          } else{ //must choose documenttype
            alert("Vennligst velg dokumenttype!");
            changeEdit();
          }  
        } 
      }
    }
    function remove_suggestion(data){
        if(!editor.doc.selection) return;
        if (data.prev_selection != editor.doc.selection[0]) {
            
            let historyStackBefore = editor.modules.history.getStack()
            editor.modules.history.clearHistory()

            let curSel = editor.doc.selection;
            editor.delete([data.suggested_word_startindex+1, data.suggested_word_startindex+1 + data.prev_suggested_word.length])
            editor.select(curSel)
            
            editor.modules.history.setStack(historyStackBefore)
            
            data.prev_suggested_word = ""
        }
    }



</script>

<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>

<!-- source: https://github.com/typewriter-editor/typewriter -->
    <header class="tool-menu">
      <div>
        {#if $smallDevice  &&(!$showSideView || $currentlyAddingNewNote)}
          <button class="arrow-down-button" on:click={mobileDown}> <i class="material-icons">keyboard_arrow_down</i></button>
        {/if}
      </div>
      <div class="toolmenu-title">
        <h4>
          {#if $currentlyAddingNewNote}
            NYTT DOKUMENT
          {:else}
            REDIGER DOKUMENT
          {/if}
        </h4>
      </div>
      <div class = "controls">
        <button title="Lagre"class="save " class:mobile={$smallDevice} on:click={save}> <i class="material-icons">save</i></button>
        <button title="Avbryt" class = "save" class:mobile={$smallDevice} on:click={cancel} > <i class="material-icons">close</i></button>
      </div>
    </header>

  <div class="toolbar" class:mobile-toolbar = {$smallDevice}>
    <TypewriterToolbar/>
  </div>

  {#if $currentlyAddingNewNote}
    <div class="dropdown">
      <select class="dropdown-menu" bind:value={selectedDocType} >
        {#each documentTypesCpy as value}<option {value}>{value}</option>{/each}
      </select>
    </div>
  {/if}
  
  {#if !$currentlyAddingNewNote  && $currentDocumentObject} 

    <div class="title">{$currentDocumentObject.title}</div>
    <div class="meta">Skrevet av {$currentDocumentObject.author}, {$currentDocumentObject.date.toDateString()}</div>
  {/if}

  <TypewriterEditor on:remove_suggestion={remove_suggestion}/>

<style>
  
.toolmenu-title{
  align-self: center;
}

.arrow-down-button{
  background: none;
  border:none;
}
:global(body.dark-mode) .arrow-down-button{
  color:#cccccc;
}
.tool-menu{
  width: 100%;
  height: 100%;
  max-height: 40px;
  min-height: 40px;
  align-items: center;
  display: flex;
  justify-content:space-between;
  background-color: whitesmoke;
}
:global(body.dark-mode) .tool-menu{
  background-color: rgb(49,49,49);
  color: #cccccc;
}
  :global(.editor code){
    color:lightgray;

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;;
  }
  :global(body.dark-mode .editor code) {
    color: #666666;
  }
  :global(.editor autoSuggestion){
    color:lightgray;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;;
  }
  :global(body.dark-mode .editor autoSuggestion) {
    color: #666666;
  }

  :global(.editor img){
    max-height: 50%;
    max-width: 50%
  }
  .toolbar {
    display:flex;
    background: whitesmoke;
    padding: 10px;
    box-shadow: 0 3px 5px -2px rgba(57, 63, 72, 0.3);
    margin-bottom: 3px;
  }
  .mobile-toolbar{
    display: contents;
  }
  :global(body.dark-mode) .toolbar{
    background: rgb(32, 32, 32);
  }
  
  .controls{
    display: inline-flex;
    align-items: center;
  }
  .save{
    background: none;
    width: 2.5rem;
    height: 2.5rem;
    margin-right: auto;
    border:none;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;
  }
  :global(body.dark-mode) .save{
    color:#cccccc;
  }
  .save:hover{
    color:#d43838;
    border:none;
    border-color: none;
    box-shadow: none;
  }  
  :global(body.dark-mode) .save:hover{
    color: #d43838;
  }

  .dropdown{
    margin-left: 10px;
  }
  .dropdown-menu {
    background: #fff;
    height: 35px;
    border-radius: 4px;
    border: 1px solid #ced4da;
    cursor: pointer;
  }
  .dropdown-menu:hover {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
  :global(body.dark-mode) .dropdown-menu:hover{
    border-color: #b7daff;
    box-shadow: 0 0 0 0.2rem rgba(104, 177, 255, 0.5);
  }
  :global(body.dark-mode) .dropdown-menu{
    background-color: rgb(49,49,49);
    color: #cccccc;
  }
  .title{
    font-weight: bold;
    font-style: italic;
    margin-left: 1vw;
    margin-top:1vh;
  }
  .meta{
    font-style: italic;
    margin-left:1vw;
    margin-top:1vh;
  }
  .mobile{
    margin: 2px;
    height: 2rem;
    width: 2rem;
  }
</style>