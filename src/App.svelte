<script>
  import { DocumentObject } from './lib/document';
  import DocumentList from './lib/components/DocumentList.svelte';
  import ContentView from './lib/components/ContentView.svelte';
  import ScrollView from './lib/components/ScrollView.svelte';
  import {documentList} from './lib/stores/stores.js';
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
    showSideview = !showSideview;
  }

  

</script>

<main>
  <div class="meny">
    <button on:click={changeView}>
      Bytt visning
    </button>
    <button>Ny notat</button>    
  </div>

  {#if showSideview}
    <div class="side-container"  >
      <div class = "document-list" >
        <DocumentList/>
      </div>
      <div class = "content-view" >
        <ContentView/>
      </div>
    </div>

  {:else}

    <div class="scroll-container">
      <ScrollView/>
    </div>

  {/if}



 
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    display: flex;
    align-items: flex-start;
  }

  .meny{
    width: 8vh;
    min-width: none;
    height:97vh;
    text-align: center;
    border-bottom: solid;
    border-left: solid;
    border-top: solid;
    background-color: lightgray;
  }

  .scroll-container{
    width: 100%;
  }

  .side-container{
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-evenly;
  }

  button{
    background:whitesmoke;
    border: thin;
    width: 8vh;
    height:7.4vh;
    margin-bottom: 3vh;

  }

  button:hover{
    border: solid 0.3em;
    border-color: #ccebff;
    border-radius: 20%;
  }

  .document-list{
    resize: horizontal;
    min-width: none;
  }

  .document-list{
    overflow:auto;
    width: 100%;
    height: 97vh;
    background: #ffffff;
    border: solid 1px black;
  }

  .content-view{
    overflow: auto;
    padding: 3vh;
    padding-top: 0vh; 
    height:94vh;
    width: 100%;
    background: #ffffff;
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
