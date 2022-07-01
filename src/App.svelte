<script>
  import documents from './assets/documents.json'
  import { DocumentObject } from './lib/document';
  import DocumentList from './lib/components/DocumentList.svelte';
  import ContentView from './lib/components/ContentView.svelte';
  import ScrollView from './lib/components/ScrollView.svelte';
  import { documentList, currentlyAddingNewNote, currentDocumentObject} from './lib/stores/stores.js';
  import { Pane, Splitpanes } from 'svelte-splitpanes';

  let showSideview = true;

  //get data from file
  documents.forEach(putInDocumentList);  

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

</script>

<head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>

<header>
  <img src="https://f.hubspotusercontent-eu1.net/hubfs/25152567/Dips_logo.png" alt="test" />
  <h3>PASIENTJOURNAL</h3>
  <div>
    <button disabled={showSideview} title="Liste visning" on:click={changeView}><i class="material-icons">vertical_split</i></button>
    <button disabled={!showSideview} title="Kontinuerlig visning" on:click={changeView}><i class="material-icons">horizontal_split</i></button>
  </div>
</header>

<body>
  {#if showSideview}
    <div class="side-container"  >
      {#if $currentlyAddingNewNote}
        <Splitpanes>
          <Pane ><ScrollView/></Pane>
          <Pane minSize="30"><ContentView /></Pane>
        </Splitpanes>
      {:else}
        <Splitpanes>
          <Pane ><DocumentList/></Pane>
        {#if $currentDocumentObject}
          <Pane minSize="20" ><ContentView/></Pane>
        {/if}
        </Splitpanes>
      {/if}
    </div>
  {:else}
    <div class="scroll-container"><ScrollView /></div>
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

  header{
    width:100%;
    height:6vh;
    background-color: #fcd7d7;
    border-top: solid;
    border-right: solid;
    border-left: solid;
    display: flex;
    align-items: flex-start;
    justify-content:space-between;
  }

  img{
    margin: 0.5vh;
    height:5vh;
  }

  h3{
    margin-top:0.8%;
    margin-bottom:0.8%;
  }

   body {
    margin: 0;
    padding: 0;
    height: 91vh;
    width:100%;
  }

  .side-container{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    border: solid;
  }

  .scroll-container{
    height: 100%;
    width: 100%;
    border: solid;
  }

  button{
    display: inline-flex;
    align-items: center;
    background: none;;
    margin-top: 0.5vh;
    margin-bottom: 0.5vh;
    margin-right: 3vh;
    height:5vh;
    border:none;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;
  }

  button

  i{
    font-size: xx-large;
  }

  button:hover {
    color:#666363;
  }

  button:disabled,
  button[disabled]{
    color:#d43838;
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
