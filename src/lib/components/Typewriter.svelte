<script>
    import { currentDocumentObject, showSideView, currentlyAddingNewNote, currentlyEditingNote, findNewDocumentObjId, DocumentObject, documentTypes} from '../stores/stores.js';
    import {marked} from 'marked';
    import {editor} from '../stores/stores.js';
    import asRoot from 'typewriter-editor/lib/asRoot';
    import Toolbar from 'typewriter-editor/lib/Toolbar.svelte';
    import {documentList} from '../stores/stores.js';
    import toMarkdown from 'to-markdown';
    import {createEventDispatcher} from 'svelte';
    import {ParseMarkdown} from "../utils/markdown/Parsemarkdown"
    import { h as hFromTypewriter} from 'typewriter-editor';
  
    editor.typeset.formats.add({
      name: 'autocomplete',
      selector: 'autoSuggestion',
      render: (attributes, children) => hFromTypewriter('autoSuggestion', null, children),
    });
	
    let selectedDocType = "Velg dokumenttype";
    
    
    const dispatch = createEventDispatcher();

    $: w = window.innerWidth;
    $: h = window.innerHeight;

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
                //Lager et tre over markdown overskriftene i teksten
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
          if (selectedDocType !== documentTypes[0]) { //new Note
            console.log("New note")
            const readable = true;
            let newElement = new DocumentObject(findNewDocumentObjId($documentList.slice()), new Date().toDateString(), (toMarkdown(editor.getHTML())+" \n"), readable);
            newElement.readable = readable
            newElement.title = selectedDocType;

            //Lager et tre over markdown overskriftene i teksten
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

    
let autocompleteOn = true

//Put in Image:
let fileinput;
const onFileSelected =(e)=>{                      
  let image = e.target.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = e => {
    editor.setHTML(editor.getHTML()+"\n <img src=" + e.target.result + ">") 
  };      
}

function file_choser(){
  fileinput.click()
  editor.root.focus();
}

function set_autocomplete(){
  autocompleteOn = !autocompleteOn
  editor.root.focus();
}



let min_size = false;
let max_size = false;
let selected_text_size = 11

function set_text_size(direction){
  if (direction == "bigger"){
      selected_text_size++
      if (selected_text_size == 20){
        max_size=true
      }else if (selected_text_size>7){
      min_size =false
    }
  } else if (direction == "lower"){
    selected_text_size--
    if (selected_text_size == 7){
        min_size=true
    } else if (selected_text_size<20){
      max_size =false
    }
  }
  editor.root.focus();
}


</script>

<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>

<!-- source: https://github.com/typewriter-editor/typewriter -->
    <header class="tool-menu">
      <div>
        {#if w<600  &&(!$showSideView || $currentlyAddingNewNote)}
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
        <button title="Lagre"class="save " class:mobile={w<600} on:click={save}> <i class="material-icons">save</i></button>
        <button title="Avbryt" class = "save" class:mobile={w<600} on:click={cancel} > <i class="material-icons">close</i></button>
      </div>
    </header>


  <div class="toolbar" class:mobile-toolbar = {w<600}>
    <Toolbar {editor} let:active let:commands>

      <div class="main-functions">

        <button
          title="Overskrift"
          class="toolbar-button"
          class:active={active.header === 1}
          class:mobile={w<600}
          on:click={commands.header1}><i class="material-icons">title</i></button>
    
        <button
          title="Underskrift"
          class="toolbar-button"
          class:active={active.header === 2}
          class:mobile={w<600}
          on:click={commands.header2}><i class="material-icons header2">title</i></button>
    
        <button
          title="Uthevet"
          class="toolbar-button"
          class:active={active.bold}
          class:mobile={w<600}
          on:click={commands.bold}><i class="material-icons">format_bold</i></button>
    
        <button
          title="Kursiv"
          class="toolbar-button"
          class:active={active.italic}
          class:mobile={w<600}
          on:click={commands.italic}><i class="material-icons">format_italic</i></button>

        <button
          title="Punktliste"
          class="toolbar-button"
          class:active={active.bulletList}
          class:mobile={w<600}
          on:click={commands.bulletList}><i class="material-icons">format_list_bulleted</i></button>
        <button
          title="Nummerert liste"
          class="toolbar-button"
          class:active={active.orderedList}
          class:mobile={w<600}
          on:click={commands.orderedList}><i class="material-icons">format_list_numbered</i></button>
        <button
          title="Angre"
          class="toolbar-button arrow"
          disabled={!active.undo}
          class:mobile={w<600}
          on:click={commands.undo}><i class="material-icons">undo</i></button>

        <button
          title="Gjøre om"
          class="toolbar-button arrow"
          disabled={!active.redo}
          class:mobile={w<600}
          on:click={commands.redo}><i class="material-icons">redo</i></button>
      </div>

      <div class="secondary-functions">

        <div class="extra-functions" class:no-border={w<600}>
  
          <button 
          title="Legg til bilde"
          class="toolbar-button"
          class:mobile={w<600}
          on:click={file_choser}  ><i class="material-icons">image</i></button>
  
          <input style="display:none" type="file" accept="*/image" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
  
          <button
          title="Autocomplete"
          class="toolbar-button "
          class:active={autocompleteOn}
          class:mobile={w<600}
          on:click={set_autocomplete}><i class="material-icons">auto_awesome</i></button>
  
        </div>
  
        <div class="extra-functions" class:no-border={w<600}>
          <button
          title="Zoom out"
          class="toolbar-button"
          disabled={min_size}
          class:mobile={w<600}
          on:click={() => {set_text_size("lower")}}><i class="material-icons">zoom_out</i></button>
          <button
          title="Zoom in"
          class="toolbar-button"
          disabled={max_size}
          class:mobile={w<600}
          on:click={() => {set_text_size("bigger")}}><i class="material-icons">zoom_in</i></button>
        </div>
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
  
  {#if !$currentlyAddingNewNote  && $currentDocumentObject} 

    <div class="title">{$currentDocumentObject.title}</div>
    <div class="meta">Skrevet av {$currentDocumentObject.author}, {$currentDocumentObject.date.toDateString()}</div>
  {/if}
  <!-- svelte-ignore a11y-autofocus -->
    <div class="editor" style="font-size: {selected_text_size}pt" autofocus use:asRoot = {editor} on:keyup={check_text} on:keydown={whenKeyDown} on:click={clear_check_text}></div>


<style>
  .active {
  border-color: #80bdff;
  background: #eaf4ff;
}


.toolmenu-title{
  align-self: center;
}


.main-functions{
  display: inline-flex;
  background: whitesmoke;
}

.secondary-functions{
  display: inline-flex;
  background: whitesmoke;

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
  /* :global(.editor p){
    font-size: xx-large;
  } */
  :global(.editor img){
    max-height: 50%;
    max-width: 50%
  }
  .toolbar {
    display:flex;
    background: whitesmoke;
    /* margin-left:5px;
    margin-right:5px; */
    /* border-radius: 3px; */
    padding: 10px;
    box-shadow: 0 3px 5px -2px rgba(57, 63, 72, 0.3);
    margin-bottom: 3px;
    /* min-width: min-content; */
  }

  .mobile-toolbar{
    display: contents;
  }

  :global(body.dark-mode) .toolbar{
    background: rgb(32, 32, 32);
  }

  :global(body.dark-mode) .main-functions{
    background: rgb(32, 32, 32);
  }
  :global(body.dark-mode) .secondary-functions{
    background: rgb(32, 32, 32);
  }

  .toolbar-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    margin-top: 0.5vh;
    width: 2.3rem;
    height: 2.3rem;
    margin-right: 0.4rem;
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

  :global(body.dark-mode) .toolbar-button{
    background-color: #353535;
    color: #cccccc;
    border: none;
  }

  :global(body.dark-mode) .toolbar-button:hover{
    border-color: #b7daff;
    box-shadow: 0 0 0 0.2rem rgba(104, 177, 255, 0.5);
  }

  :global(body.dark-mode) .toolbar-button.active{
    border-color: #b7daff;
    box-shadow: 0 0 0 0.2rem rgba(104, 177, 255, 0.5);
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
    display: inline-flex;
    align-items: center;
  }

  .dropdown{
    margin: 2vh;
  }

  .dropdown-menu {
    background: #fff;
    width: 21vh;
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
    margin-right: 1vh;
    margin-left: 1vh;
    padding-left:1vw;
    padding-right:1vw;
    height: 100%;
    overflow-y: auto;
    font-size: 11pt;
  }

  :global(body.dark-mode) .editor{
    background-color: rgb(49,49,49);
  }
  .extra-functions{
    display: flex;
    border-left: solid rgb(74, 74, 74);
    padding-left: 0.5vw;
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

  .no-border{
    border:none;
    padding-left:0;
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

  .mobile{
    margin: 2px;
    height: 2rem;
    width: 2rem;
  }

</style>