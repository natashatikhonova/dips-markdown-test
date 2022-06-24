<script>
  import { DocumentObject } from './lib/document';
  import DocumentList from './lib/components/DocumentList.svelte';
  import ContentView from './lib/components/ContentView.svelte';
  import ScrollView from './lib/components/ScrollView.svelte';
  import {currentDocumentObject, documentList, currentlyAddingNewNote} from './lib/stores/stores.js';
import Typewriter from './lib/components/Typewriter.svelte';
  /*
  let doc1 = new DocumentObject("Notat", "01.01.01", "Dr.Thor", "# Dette er tekst.");
  let doc2 = new DocumentObject("Undersøkelse", "02.02.02", "Dr.Sindre", "Dette er underøkelse");
  let doc3 = new DocumentObject("Operasjon", "09.03.11", "Dr.Torkild", "Dette er operasjon");
  let doc4 = new DocumentObject("Rutinekontroll", "11.01.21", "Dr.Natasha", "Dette er rutinekontroll");
  let doc5 = new DocumentObject("Lab", "11.11.20", "Dr.Trond", "Dette er lab");
  let doc6 = new DocumentObject("Notat", "01.01.01", "Dr.Thor", "# Dette er tekst.");
  let doc7 = new DocumentObject("Undersøkelse", "02.02.02", "Dr.Sindre", "Dette er underøkelse");
  let doc8 = new DocumentObject("Operasjon", "09.03.11", "Dr.Torkild", "Dette er operasjon");
  let doc9 = new DocumentObject("Rutinekontroll", "11.01.21", "Dr.Natasha", "Dette er rutinekontroll");
  let doc10 = new DocumentObject("Lab", "11.11.20", "Dr.Trond", "Dette er lab");
  let doc11= new DocumentObject("Notat", "01.01.01", "Dr.Thor", "# Dette er tekst.");
  let doc12 = new DocumentObject("Undersøkelse", "02.02.02", "Dr.Sindre", "Dette er underøkelse");
  let doc13 = new DocumentObject("Operasjon", "09.03.11", "Dr.Torkild", "Dette er operasjon");
  let doc14 = new DocumentObject("Rutinekontroll", "11.01.21", "Dr.Natasha", "Dette er rutinekontroll");
  let doc15 = new DocumentObject("Lab", "11.11.20", "Dr.Trond", "Dette er lab");

  $documentList = [doc1, doc2, doc3, doc4, doc5, doc6, doc7, doc8, doc9, doc10, doc11, doc12, doc13, doc14, doc15];
  console.log($documentList);*/

  
  //get data from file
  fetch('src/data/documents.json')
  .then(response => response.json())
  .then(jsonResponse => jsonResponse.documents.forEach(putInDocumentList));  

  function putInDocumentList(item){
    let document = new DocumentObject(item.id, item.date, item.content);
    $documentList.push(document);
    $documentList = $documentList;
  }

  let showSideview = true;

  function changeView(){
    if($currentlyAddingNewNote){
      alert("Vennligst lagre eller avbryt!");
    } else{
      showSideview = !showSideview;
    }
  }


  function addNote(){
    $currentlyAddingNewNote = true;
  }


</script>

<body>
  <div class="meny">
    <button on:click={changeView}>
      Bytt visning
    </button>
    <button class:visible={!showSideview} on:click={addNote}>Ny notat</button>    
  </div>

  {#if showSideview}
    <div class="side-container"  >
     {#if $currentlyAddingNewNote}
      <div class = "document-list">
        <ScrollView/>
      </div>
      <div class = "content-view"><ContentView /></div>
     {:else}
      <div class = "document-list" >
        <DocumentList/>
      </div>
      <div class = "content-view" >
        <ContentView/>
      </div>
     {/if}
    </div>

  {:else}

    <div class="scroll-container">
      <ScrollView/>
    </div>

  {/if}



 
  </body>

<style>

  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 0;
  }

   body {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: flex-start;
    height: 97vh;
    width:100%;
  }

  .visible{
        visibility: hidden;
    }

  .meny{
    height: 100%;
    width: 4em;
    text-align: center;
    border-bottom: solid;
    border-left: solid;
    border-top:solid;
    background-color: lightgray;
  }

  

  .scroll-container{
    height: 100%;
    width: 100%;
  }

  .side-container{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  button{
    background:whitesmoke;
    border: thin;
    width: 4em;
    height:4em;
    margin-top: 0.8vh;

  }

  button:hover {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }

  .document-list{
    display: flex;
    flex-grow: 1;
    width: fit-content;
    height: 100%;
    background: #ffffff;
    border: solid 1px black;
  }

  .content-view{
    display: flex;
    flex-grow: 1;
    height:100%;
    width: 100%;
    border: solid 1px black;
   }

 

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }

</style>
