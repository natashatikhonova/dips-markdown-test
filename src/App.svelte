<script>
  import documents from './assets/documents.json'
  import { DocumentObject } from './lib/document';
  import DocumentList from './lib/components/DocumentList.svelte';
  import ContentView from './lib/components/ContentView.svelte';
  import ScrollView from './lib/components/ScrollView.svelte';
  import { documentList, currentlyAddingNewNote, currentDocumentObject} from './lib/stores/stores.js';
  import { Pane, Splitpanes } from 'svelte-splitpanes';
  import {ParseMarkdown} from './lib/ParseMarkdown'
  import ToolMenu from './lib/components/ToolMenu.svelte';

  let showSideview = true;

  //get data from file
  documents.forEach(putInDocumentList);  

  function putInDocumentList(item){
    let document = new DocumentObject(item.id, item.date, item.content, item.title, item.readable);
    let parse = new ParseMarkdown
    //Lager et tre over markdown overskriftene i teksten
    let tree = parse.parseAndSetIntoTree(document) 
    document.markdownTree = tree;
    
    // let nodes_array = document.markdownTree.get_nodes_in_order(null) //Return the nodes in the same order as it was read from file
    // console.log("\nnodes_array ")
    // console.log(nodes_array)
    $documentList.push(document);
    $documentList = $documentList;
  }

  $: $currentDocumentObject, console.log($currentDocumentObject)



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

<div class="top-header">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <img src="https://f.hubspotusercontent-eu1.net/hubfs/25152567/Dips_logo.png" alt="test" />
  <h3>PASIENTJOURNAL</h3>
  <div>
    <button disabled={showSideview} title="Dokument visning" on:click={changeView}><i class="material-icons">vertical_split</i></button>
    <button disabled={!showSideview} title="Kontinuerlig visning" on:click={changeView}><i class="material-icons">horizontal_split</i></button>
  </div>
</div>

<div class="tool-menu">
  <ToolMenu hideToolBar={showSideview}/>
</div>


<div class="main">
  {#if showSideview}
    <div class="side-container"  >
      {#if $currentlyAddingNewNote}
        {#if w > 900}
        <Splitpanes>
          <Pane ><ScrollView/></Pane>
          <Pane minSize="30"><ContentView width={w} /></Pane>
        </Splitpanes>
        {:else} 
    
          <Splitpanes horizontal={true}>
            <Pane ><ScrollView/></Pane>
            <Pane ><ContentView width={w}/></Pane>
  
          </Splitpanes>
          
        {/if}

      {:else}
        <Splitpanes>
          <Pane size=100><DocumentList/></Pane>
        {#if $currentDocumentObject}
          {#if w < 600}
            <Pane size="100"><ContentView goBackButton={true} width={w}/></Pane>
          {:else}
            <Pane size="50" minSize="30"><ContentView width={w}/></Pane>
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

  .top-header{
  
    display: flex;
    align-items: center;
    justify-content:space-between;
    border-bottom: 1px solid grey;
  }

  .main{
    overflow:auto;
  }



  .tool-menu{
    display: flex;
    align-items: center;
    justify-content:space-between;
    box-shadow: 0 3px 5px -2px rgba(57, 63, 72, 0.3);
    margin-bottom: 3px;
  }

  img{
    margin-left: 10px;
    height: 22px
  }

  .side-container{
    width: 100%;
    height: 100%;
    display: flex;
  }

  .scroll-container{
    display: flex;
    height: 100%;
    width: 100%;
   
  }

  button{
    background: none;;
    margin-right: 10px;
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
