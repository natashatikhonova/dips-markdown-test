<script>
    import { currentDocumentObject, showSideView, currentlyAddingNewNote, currentlyEditingNote, all_markdown_titles, checked_titles_filters, load_markdownNodes, findNewDocumentObjId} from '../stores/stores.js';
    import {marked} from 'marked';
    import {editor} from '../stores/stores.js';
    import asRoot from 'typewriter-editor/lib/asRoot';
    import Toolbar from 'typewriter-editor/lib/Toolbar.svelte';
    import {documentList} from '../stores/stores.js';
    import toMarkdown from 'to-markdown';
    import {createEventDispatcher} from 'svelte';
    import { DocumentObject } from '../document.js';
    import { ParseMarkdown } from '../ParseMarkdown.js';
import { Delta, TextChange } from 'typewriter-editor';
import BubbleMenu from 'typewriter-editor/lib/BubbleMenu.svelte';
// import { load_markdownNodes } from './filterDocumentText.js';


    export let showTitleBar = true;

    let selectedDocType = "Velg dokumenttype";

    const documentTypes = ["Velg dokumenttype", "Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];

    let w
    let h
    $: w = window.innerWidth;
    $: h = window.innerHeight;

    let autocompleteOn = true

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
      $currentlyEditingNote = false;
      
    }

    function mobileDown(){
      dispatch("cancel");
    }
    //Saves the text if the text is not empty and stores the text
    function save(){
      console.log(editor.change)
      console.log(editor.doc.getText())
      // editor.select([0, editor.doc.length-1]) 
      // editor.delete()
      // console.log(editor.doc.getText())

 

      changeEdit();
      if( toMarkdown(editor.getHTML()) === ""){ //Empty note
        alert("Tom notat!");
        $currentlyAddingNewNote=false;
        dispatch("save");
      }else{
        if($currentlyEditingNote){ //Edit note
          dispatch("save");
          $currentlyEditingNote = false;
          $documentList.forEach((element)=>{
            if (element.id === $currentDocumentObject.id){
                element.context= toMarkdown(editor.getHTML()) + " \n";
                //Lager et tre over markdown overskriftene i teksten
                let parse = new ParseMarkdown()
                console.log("Før parse")
                let tree = parse.parseAndSetIntoTree(element) //Her henger programmet!!. FIKSET:)
                console.log("Etter parse")
                element.markdownTree = tree;

            }
          })
          $documentList = $documentList;
          console.log("Setter inn dokumenter i typewriter Edit")
          $all_markdown_titles = load_markdownNodes($documentList,[], $checked_titles_filters)
          $all_markdown_titles =  $all_markdown_titles

        } else{
          if (selectedDocType !== documentTypes[0]) { //new Note
            console.log("New note")
            const readable = true;
            let newElement = new DocumentObject(findNewDocumentObjId(), new Date().toDateString(), (toMarkdown(editor.getHTML())+" \n"), readable);
            newElement.readable = readable
            newElement.title = selectedDocType;
            //Lager et tre over markdown overskriftene i teksten
            let parse = new ParseMarkdown()
            // console.log("Før parse")
            let tree = parse.parseAndSetIntoTree(newElement) //Her henger programmet!!. FIKSET:)
            // console.log("Etter parse")
            newElement.markdownTree = tree;

            $documentList.push(newElement);
            $documentList = $documentList;
            console.log("Setter inn dokumenter i Typewriter. New note")
            $all_markdown_titles = load_markdownNodes($documentList.slice(),[], $checked_titles_filters)
            $all_markdown_titles =  $all_markdown_titles
            console.log($all_markdown_titles)
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

  let waitingForSpaceOrEnterOrDot = false
  if (editor.getText().length <= 1){
    waitingForSpaceOrEnterOrDot = true
  }

  let dot_has_happend = false

  function clear_check_text(){
    remove_suggestion()
    waitingForSpaceOrEnterOrDot = false
    dot_has_happend = false
  }

  function check_text(event){
    
    let key = event.key
    
    if(key == "Backspace"){
      waitingForSpaceOrEnterOrDot = false
      dot_has_happend = false
    }

    if(waitingForSpaceOrEnterOrDot && (key == " " || key == "Enter" || key == ".")){
        //find the previous word
        for(let i = editor.doc.selection[0]-1; i >= 0; i--){ //goes backwards throught the text
          let char = editor.getText()[i-1]
          if (char == " " || i == 0 || char == "\n") {

            let update_delta = new Delta().retain(i).insert(editor.getText()[i].toUpperCase()).delete(1)

            editor.setDelta(editor.getDelta().compose(update_delta)) //Sets the updated delta to the current delta
            break;
          }
        }
        waitingForSpaceOrEnterOrDot = false
        dot_has_happend = false
    }

      if(key == "Enter"){
        waitingForSpaceOrEnterOrDot = true
        dot_has_happend = true
      }

      if (key == ".") {
        dot_has_happend = true
      }

      if (key == " " && dot_has_happend) {
        waitingForSpaceOrEnterOrDot = true
      }

  }
  // console.log(marked("|  |  |  |  |  | \n |:---:|---|---|---|---| \n |  |  |  |  |  | \n |  |  |  |  |  | \n |  |  |  |  |  |"))


  //Put in Image:
  let  fileinput;
	
	const onFileSelected =(e)=>{                      
  let image = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {

                 editor.setHTML(editor.getHTML()+"\n <img src=" + e.target.result + ">") 
            };
            
}
let suggestions_words = ["epikrise", "sykepleier", "lege", "sykdom", "sykehus", "legevakt", "fastlege"]
let prev_suggested_word = ""
let suggested_word_startindex = -1
let complete_suggested_word = ""
let prev_selection = 0

function file_choser(){
  fileinput.click()
  editor.root.focus();
}

//Autocomplete:
function autocomplete(event){

  let key = event.key
  if (key == "Tab") {
    remove_suggestion()
    editor.insert("        ");
  }
  if (!autocompleteOn){
    return
  }
  if ((37 <= event.keyCode) && (event.keyCode <= 40)){
      // console.log("arrow key")
      remove_suggestion()
    }else if (key == " " || key == "Enter" || key == "."){ //add in the suggested word

      if (prev_suggested_word.length > 0){
        
        let current_indeks = key == "Enter" ? editor.doc.selection[0]-1: editor.doc.selection[0]; 
        // console.log("legger til " + prev_suggested_word + " etter bokstav " + editor.getText()[current_indeks])
        let update_delta = new Delta().retain(current_indeks).insert(prev_suggested_word).delete(prev_suggested_word.length+1)
        editor.setDelta(editor.getDelta().compose(update_delta)) //Sets the updated delta to the current delta
        editor.select(current_indeks + prev_suggested_word.length)
        console.log(editor.getDelta())
        prev_suggested_word = ""

        if(key == "Enter"){
          console.log("length: "+ current_indeks + prev_suggested_word.length)
          editor.insert('\n');
          console.log(editor.getDelta())
        }


      }
      

     
    } else if( (key.length == 1) || key == "Backspace") {//new suggested word
      console.log("suggests new word")
    
      let current_indeks = editor.doc.selection[0]
    
      let suggested_word = ""
      let word = ""
      let editor_text = editor.getText().substring(0, current_indeks) + key
      // console.log("text i editor " + editor_text)
      for (let i = current_indeks; i >= 0; i--){
       
        if (editor_text[i] == " " || editor_text[i] == "\n" ){
          break
        }
        word += editor_text[i]
        
      }
      word = word.split("").reverse().join("");
      // console.log("word: " + word)
      if (word.length != 0) {
        for (let i = 0; i < suggestions_words.length; i++){
          let check_word = suggestions_words[i]
          let found_word = true
          
          for (let j = 0; j < word.length; j++){
            if (word[j].toLowerCase() != check_word[j]){
              found_word = false
              break;
            }
          }
          if (found_word) {
            suggested_word = check_word.substring(word.length)
            complete_suggested_word = check_word
            break;
          }
        }
    
      }
    
      // console.log("Suggested word " + suggested_word)
      // console.log(word)
      let update_delta = new Delta().retain(current_indeks).delete(prev_suggested_word.length).insert(suggested_word, {code:true})
      editor.setDelta(editor.getDelta().compose(update_delta)) //Sets the updated delta to the current delta
      prev_suggested_word = suggested_word
      suggested_word_startindex = current_indeks
      prev_selection = current_indeks

      

    }
}
function remove_suggestion(){
  if (prev_selection != editor.doc.selection[0]) {
    // console.log("removes suggested word")
    let update_delta = new Delta().retain(suggested_word_startindex+1).delete(prev_suggested_word.length)
    editor.setDelta(editor.getDelta().compose(update_delta)) //Sets the updated delta to the current delta
    prev_suggested_word = ""
  }
}
// $: editor.doc.selection[0], remove_suggestion() //Fjerner suggestion
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
let alignment = "left"
function align(value) {
    alignment = value;
    editor.root.focus();
  }

function set_autocomplete(){
  autocompleteOn = !autocompleteOn
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
  
  <!-- Image menu for when images are selected
<BubbleMenu {editor} let:active let:commands let:placement offset={8} for={'image'}>
  <div class="bubble-menu">
    <div data-arrow class="arrow {placement}"></div>
    <button
      class="bubble-menu-button"
      class:active={active.style === 'outset-left'}
      on:click={() => editor.formatLine({ ...editor.doc.getLineFormat(), style: 'outset-left' })}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <rect fill="none" width="24" height="24"/>
        <path d="M22,19 L22,21 L7,21 L7,19 L22,19 Z M22,15 L22,17 L16,17 L16,15 L22,15 Z M14,7 L14,17 L2,17 L2,7 L14,7 Z M22,11 L22,13 L16,13 L16,11 L22,11 Z M22,7 L22,9 L16,9 L16,7 L22,7 Z M22,3 L22,5 L7,5 L7,3 L22,3 Z"></path>
      </svg>
    </button>

    <button
      class="bubble-menu-button header3"
      class:active={!active.style}
      on:click={() => editor.formatLine({ ...editor.doc.getLineFormat(), style: null })}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <rect fill="none" width="24" height="24"/>
        <path d="M19,19 L19,21 L5,21 L5,19 L19,19 Z M19,7 L19,17 L5,17 L5,7 L19,7 Z M19,3 L19,5 L5,5 L5,3 L19,3 Z"></path>
      </svg>
    </button>

    <button
      class="bubble-menu-button"
      class:active={active.style === 'outset-center'}
      on:click={() => editor.formatLine({ ...editor.doc.getLineFormat(), style: 'outset-center' })}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <rect fill="none" width="24" height="24"/>
        <path d="M19,19 L19,21 L5,21 L5,19 L19,19 Z M21,7 L21,17 L3,17 L3,7 L21,7 Z M19,3 L19,5 L5,5 L5,3 L19,3 Z"></path>
      </svg>
    </button>

    <button
      class="bubble-menu-button"
      class:active={active.style === 'fill-width'}
      on:click={() => editor.formatLine({ ...editor.doc.getLineFormat(), style: 'fill-width' })}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <rect fill="none" width="24" height="24"/>
        <path d="M18,19 L18,21 L6,21 L6,19 L18,19 Z M21,3 L21,17 L3,17 L3,3 L21,3 Z"></path>
      </svg>
    </button>
 </div>
</BubbleMenu> -->


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
  
        <div class="extra-functions" class:no-border={w<600}>
          <button
          title="venstre"
          class="toolbar-button"
          class:active={alignment === 'left'}
          class:mobile={w<600}
          on:click={() => align("left")}><i class="material-icons">format_align_left</i></button>
  
          <button
          title="midten"
          class="toolbar-button"
          class:active={alignment === 'center'}
          class:mobile={w<600}
          on:click={() => align("center")}><i class="material-icons">format_align_center</i></button>
  
          <button
          title="høyre"
          class="toolbar-button"
          class:active={alignment === 'right'}
          class:mobile={w<600}
          on:click={() => align("right")}><i class="material-icons">format_align_right</i></button>
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

    <div class="editor" class:center={alignment === 'center'} class:right={alignment === 'right'} class:left={alignment === 'left'} style="font-size: {selected_text_size}pt" autofocus use:asRoot = {editor} on:keyup={check_text} on:keydown={autocomplete} on:click={clear_check_text}></div>


<style>
  .active {
  border-color: #80bdff;
  background: #eaf4ff;
}

.right {
  text-align: right;
}
.center {
  text-align: center;

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



  
  
  /*
    .toolbar {
    display: flex;
    background: #eee;
    margin-left:1%;
    margin-right:2%;
    padding: 0.6%;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px rgba(0, 0, 0, .1);
    min-width: 15vw;
  }
  
  .toolbar-button {
    
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    margin-top: 0.5vh;
    width: calc(2.5vw);
    height: calc(4.5vh);
    margin-right: calc(0.5vw);
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
  } */

  /* .header2{
    font-size:large;
  }



  .arrow{
    color:black;
    font-weight: bolder;
    font-size:x-large;
  }

  .controls{
    margin-left: auto;
    margin-right: calc(0.5vw);
    display: inline-flex;
  }

  .dropdown{
    margin: 2vh;
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
    padding:0.5vh;
    height: 100%;
    overflow-y: auto;
  }

  .save{
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    width: calc(3vw);
    height: calc(5vh);
    margin-right: calc(0.3vh);
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

  .mobile{
    margin: 1vw;
    height: calc(4vh);
    width: calc(7vw);
  } */


</style>