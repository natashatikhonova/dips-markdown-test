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
  let w
  let h
  $: w = window.innerWidth;
  $: h = window.innerHeight;


</script>


<header>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <img src="https://f.hubspotusercontent-eu1.net/hubfs/25152567/Dips_logo.png" alt="test" />
  <h3>PASIENTJOURNAL</h3>
  <div>
    <button disabled={showSideview} title="Dokument visning" on:click={changeView}><i class="material-icons">vertical_split</i></button>
    <button disabled={!showSideview} title="Kontinuerlig visning" on:click={changeView}><i class="material-icons">horizontal_split</i></button>
  </div>
</header>

<div class="main">
  {#if showSideview}
    <div class="side-container"  >
      {#if $currentlyAddingNewNote}
        {#if w > 900}
        <Splitpanes>
          <Pane ><ScrollView/></Pane>
          <Pane minSize="30"><ContentView /></Pane>
        </Splitpanes>
        {:else} <!-- For smaaler platforms -->
          <Splitpanes horizontal={true}>
            <Pane ><ScrollView/></Pane>
            <Pane ><ContentView/></Pane><!--  Uses the typewriter in this component -->
          </Splitpanes>
          
        {/if}

      {:else}
        <Splitpanes>
          <Pane ><DocumentList/></Pane>
        {#if $currentDocumentObject}
          {#if w < 600}
            <Pane size="100"><ContentView goBackButton={true}/></Pane>
            
          {:else}
            <Pane minSize="20"><ContentView/></Pane>
          {/if}
        {/if}
        </Splitpanes>
      {/if}
    </div>
  {:else}
    <div class="scroll-container"><ScrollView /></div>
  {/if}
  </div>

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
    width:100vw;
    margin:0;
    padding: 0;
    height:5vh;
    background-color: #dadada;
    display: flex;
    align-items: flex-start;
    justify-content:space-between;
    
  }

  img{
    margin: 0.5vh;
    height:4vh;
  }

  h3{
    margin-top:0.5%;
    margin-bottom:0.5%;
  }

   .main {
    margin: 0;
    padding: 0;
    height: 95vh;
    width:100vw;
  }

  .side-container{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;

    
  }

  .scroll-container{
    height: 100%;
    width: 100%;
   
  }

  button{
    display: inline-flex;
    align-items: center;
    background: none;;
    margin-top: 0.5vh;
    margin-bottom: 0.5vh;
    margin-right: 2vh;
    height:4vh;
    border:none;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;
  }

  button i{
    font-size: xx-large;
  }

  button:hover {
    color:#666363;
  }

  button:disabled,
  button[disabled]{
    color:#d43838;
  }


  /* Tilpasser skjermen og innholdet til vinduet */
  @media (max-width: 430px) {
    button i {
      font-size: x-large;
    }
    img {
      height: small;
    }
    h3 {
      font-size: medium;
    }

  }

  @media (max-height: 1000px) {
    header {
      height: 35px;
    }

    img {
      height: 22px;
    }

  }

</style>
