<script>
    import { currentDocumentObject, currentlyAddingNewNote } from '../stores/stores.js';
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


    let selectedDocType = "Velg dokumenttype";

    const documentTypes = ["Velg dokumenttype", "Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];

    let w
    let h
    $: w = window.innerWidth;
    $: h = window.innerHeight;

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
        if(!$currentlyAddingNewNote){ //Edit note
          dispatch("save");
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
        } else{
          if (selectedDocType !== documentTypes[0]) { //new Note
            console.log("New note")
            const readable = true;
            let newElement = new DocumentObject($documentList.length, new Date().toDateString(), (toMarkdown(editor.getHTML())+" \n"), readable);
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

  let dot_char = true //when dot has been entered
  let space_char = true //when space has been entered
  let enter_char = true
  let possible_large_char = -1;


  function check_text(event){
    console.log(event)
    console.log("space_char: " + space_char)
    console.log("Dot_char: " + dot_char)
    console.log(editor.getText())

    if (event.key == "Enter") {
      enter_char = true;
    }
    

    if (event.key == " " || event.key == "Enter"){

      if ((dot_char && space_char) || (enter_char && space_char)) {
        // possible_large_char = editor.doc.selection[0]
        // console.log(editor.doc.selection[0])

        //find the previous word
        for(let i = editor.getText().length-1; i >= 0; i--){ //goes backwards throught the text
          let char = editor.getText()[i-1]
          console.log("Char: " + char)
          if (char == " " || i == 0 || char == "\n") {
            console.log("Endrer til stor bokstav på " + editor.getText()[i])

            let update_delta = new Delta().retain(i).insert(editor.getText()[i].toUpperCase()).delete(1)

            editor.setDelta(editor.getDelta().compose(update_delta)) //Sets the updated delta to the current delta
            console.log(editor.getDelta())
            console.log(editor.getText())
          
            break;
          }

        }

        dot_char = false
        space_char = false
      } else if (dot_char || event.key == "Enter"){

        
        //denne skal ikke alltid kalles
        space_char = true; //
      }
      
    }
    if (event.key == ".") {

      dot_char = true

    }

  }



    
</script>

<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<!-- source: https://github.com/typewriter-editor/typewriter -->

  <div class="toolbar">
    <Toolbar {editor} let:active let:commands>
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
          title="Nummeret liste"
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

        <div class = "controls">
          <button title="Lagre"class="save " class:mobile={w<600} on:click={save}> <i class="material-icons">save</i></button>
          <button title="Avbryt" class = "save" class:mobile={w<600} on:click={cancel} > <i class="material-icons">close</i></button>
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
    <div class="editor" style="border:none" autofocus use:asRoot = {editor} on:keyup={check_text}></div>

<style>

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
  }

</style>