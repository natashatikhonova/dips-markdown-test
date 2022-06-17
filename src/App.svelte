<script>
  import { DocumentObject } from './document';
  import DocumentList from './DocumentList.svelte';
  import ContentView from './ContentView.svelte';
  import ScrollView from './ScrollView.svelte';
  import {documentList} from './stores.js';

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
  console.log($documentList);

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
  </div>

  {#if showSideview}
    <div class="side-container">
      <div class = "document-list">
        <DocumentList/>
      </div>
      <div class = "content-view">
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
    padding: 1em;
    margin: 0 auto;
  }

  .meny{
    width: 100%;
    text-align: right;
    margin-bottom: 0.8em;
  }

  .side-container{
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-evenly;
  }

  

  .content-view, .document-list{
    width: 100%;
    height: 85vh;
    background: #ffffff;
    border: solid 1px black;
  }

  .content-view{
    overflow: auto;
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
