<script>
  import { DocumentObject } from './lib/document';
  import DocumentList from './lib/components/DocumentList.svelte';
  import ContentView from './lib/components/ContentView.svelte';
  import ScrollView from './lib/components/ScrollView.svelte';
  import { documentList, currentlyAddingNewNote, currentDocumentObject} from './lib/stores/stores.js';
  import { Pane, Splitpanes } from 'svelte-splitpanes';


  let showSideview = true;

  //get data from file
  fetch('src/data/documents.json')
  .then(response => response.json())
  .then(jsonResponse => jsonResponse.documents.forEach(putInDocumentList));  

  function putInDocumentList(item){
    let document = new DocumentObject(item.id, item.date, item.content);
    $documentList.push(document);
    $documentList = $documentList;
  }

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
  <div class="menu">
    <button on:click={changeView}>Bytt visning</button>
    <button class:visible={!showSideview} on:click={addNote}>Ny notat</button>    
  </div> 



  {#if showSideview}
    <div class="side-container"  >
    {#if $currentlyAddingNewNote}
    <Splitpanes>
      <Pane class = "document-list"><ScrollView/></Pane>
      <Pane class = "content-view" minSize="30"><ContentView /></Pane>
    </Splitpanes>
    {:else}
    <Splitpanes>

      <Pane class = "document-list" ><DocumentList/></Pane>
    {#if $currentDocumentObject}
      <Pane class = "content-view" minSize="20" ><ContentView/></Pane>
    {/if}
    </Splitpanes>

    {/if}
    </div>

  {:else}
    <div class="scroll-container"><ScrollView/></div>
  {/if}
</body>

<style>

  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  :global(.splitpanes__pane) {
    box-shadow: 0 0 3px rgba(0, 0, 0, .2) inset;
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
    
  }

   body {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: flex-start;
    height: 97vh;
    width:100%;
  }

  .menu{
    height: 100%;
    width: 60px;
    text-align: center;
    border-bottom: solid;
    border-left: solid;
    border-top:solid;
    background-color: lightgray;
  }

  .side-container{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
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

  .scroll-container{
    height: 100%;
    width: 100%;
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

   .visible{
        visibility: hidden;
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
