
<script>
  import documents from './assets/documents.json'
  import { DocumentObject } from './lib/document';
  import DocumentList from './lib/components/DocumentList.svelte';
  import ContentView from './lib/components/ContentView.svelte';
  import ScrollView from './lib/components/ScrollView.svelte';
  import { documentList, currentlyAddingNewNote,currentlyEditingNote,  currentDocumentObject, showSideView, all_markdown_titles, checked_titles_filters, load_markdownNodes} from './lib/stores/stores.js';
  import { Pane, Splitpanes } from 'svelte-splitpanes';
  import {ParseMarkdown} from './lib/ParseMarkdown'
  import ThemeButton from './lib/components/ThemeButton.svelte';
  import ToolMenu from './lib/components/ToolMenu.svelte';
  // import {load_markdownNodes} from "./lib/components/filterDocumentText"


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
    console.log("Setter inn dokumenter i app")
    $all_markdown_titles = load_markdownNodes($documentList,[], $checked_titles_filters)
    console.log($all_markdown_titles)
  }

  $: $currentDocumentObject, console.log($currentDocumentObject)

  function set_default(){
    if($currentlyAddingNewNote){
      alert("Vennligst lagre eller avbryt!");
    } else {

      $currentDocumentObject = null
      $showSideView = true;
    }

  }


  function changeView(){
    if($currentlyAddingNewNote || $currentlyEditingNote){
      alert("Vennligst lagre eller avbryt!");
    } else{
      $showSideView = !$showSideView;
    }
  }
  let w
  let h
  $: w = window.innerWidth;
  $: h = window.innerHeight;

  $: contentWiewSize = w<600 && $currentDocumentObject ? 100: 50
  function set_content_view_size(event){
    contentWiewSize = event.detail
  }
</script>

<header>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <img on:click={set_default} src="https://f.hubspotusercontent-eu1.net/hubfs/25152567/Dips_logo.png" alt="test"/>
  <h3>PASIENTJOURNAL</h3>
  <div>
    <button class="switch-view-button" disabled={$showSideView} title="Dokument visning" on:click={changeView}><i class="material-icons">vertical_split</i></button>
    <button class="switch-view-button" disabled={!$showSideView} title="Kontinuerlig visning" on:click={changeView}><i class="material-icons">horizontal_split</i></button>
    <ThemeButton/>
  </div>
</header>


<div class="main">
  {#if $showSideView}
    <div class="side-container"  >
      {#if $currentlyAddingNewNote}
        {#if w > 600}
        <Splitpanes theme = "modern-theme">
          <Pane>
              <ScrollView/>
          </Pane>
          <Pane minSize="30"><ContentView width={w}/></Pane>
        </Splitpanes>
        {:else} 

            <ScrollView/>
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

  /* Dips Logo */
  img{
    max-height: 60%;
    min-height: 60%;
  }

  /* Buttons that switch between views */
  .switch-view-button{
    display: inline-flex;
    align-items: center;
    background: none;;
    margin-right: 2px;
    border:none;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;
  }

  .switch-view-button i{
    font-size: xx-large;
  }

  .switch-view-button:hover {
    color:#666363;
  }

  .switch-view-button:disabled,
  .switch-view-button[disabled]{
    color:#d43838;
  }

  /* Darkmode */
  :global(body.dark-mode) .switch-view-button{
    color:white;
  }

  :global(body.dark-mode) .switch-view-button:hover {
    color:#cccccc;
  }

  :global(body.dark-mode) .switch-view-button:disabled,
  .switch-view-button[disabled]{
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
