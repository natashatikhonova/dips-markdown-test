
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

  function set_default(){
    if($currentlyAddingNewNote){
      alert("Vennligst lagre eller avbryt!");
    } else {

      $currentDocumentObject = null
      showSideview = true;
    }

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

  let contentWiewSize = 50
  function set_content_view_size(event){
    contentWiewSize = event.detail
  }
</script>

<header>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <img on:click={set_default} src="https://f.hubspotusercontent-eu1.net/hubfs/25152567/Dips_logo.png" alt="test"/>
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
        <Splitpanes theme = "modern-theme">
          <Pane>
              <ScrollView/>
          </Pane>
          <Pane minSize="30"><ContentView width={w}/></Pane>
        </Splitpanes>
        {:else} 
          <Splitpanes  theme = "modern-theme" horizontal={true}>
            <Pane >
              <ScrollView/>
            </Pane>
            <Pane ><ContentView width={w}/></Pane> 
          </Splitpanes>
          
        {/if}

      {:else}
        <Splitpanes  theme = "modern-theme">

          <Pane size={(100-contentWiewSize).toString()}>
              <DocumentList/>
          </Pane>
        {#if $currentDocumentObject}
          {#if w < 600}
            <Pane size="100"><ContentView goBackButton={true} width={w}/></Pane>
          {:else}
            <Pane size={contentWiewSize.toString()} ><ContentView on:set_content_view_size={set_content_view_size} width={w}/></Pane>
          {/if}
        {/if}
        </Splitpanes>
      {/if}
    </div>
  {:else}
        <ScrollView/>
  {/if}
  </div>

<style>

  header{
      max-height: 40px;
      min-height: 40px;
      align-items: center;
      display: flex;
      justify-content:space-between;
      background-color:rgb(236, 236, 236);
    }

   .main {
    height: 100%;
    overflow: auto;
  }

  .side-container{
    height: calc(100%);
    width: 100%;
    display: flex;
    flex-direction: row;
  }


  button{
    display: inline-flex;
    align-items: center;
    background: none;;
    margin-right: 2px;
    border:none;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;
  }

  img{
    max-height: 60%;
    min-height: 60%;
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
