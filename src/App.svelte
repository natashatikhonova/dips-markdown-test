
<script>
  import documents from './assets/documents.json'
  import { DocumentObject } from './lib/document';
  import DocumentList from './lib/components/DocumentList.svelte';
  import ContentView from './lib/components/ContentView.svelte';
  import ScrollView from './lib/components/ScrollView.svelte';
  import { documentList, currentlyAddingNewNote,currentlyEditingNote,  currentDocumentObject, showSideView, checked_titles_filters, load_markdownNodes} from './lib/stores/stores.js';
  import { Pane, Splitpanes } from 'svelte-splitpanes';
  import {ParseMarkdown} from './lib/ParseMarkdown'
  import ThemeButton from './lib/components/ThemeButton.svelte';

  //get data from JSON file
  documents.forEach(putInDocumentList);  

  //Makes a new DocumentObject for each file and adds it to the store array $documentList
  function putInDocumentList(item){
    let document = new DocumentObject(item.id, item.date, item.content, item.title, item.readable);
    //Makes a tree structur for all markdown formated titles:
    let parse = new ParseMarkdown
    let tree = parse.parseAndSetIntoTree(document) 
    document.markdownTree = tree;

    $documentList.push(document);
    $documentList = $documentList;
  }



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

    //If on mobile the, only one content/pane at time
    if(w<600){
      contentWiewSize = event.detail
    }

    //Different outcome based on panes current size
    if(contentWiewSize > 70 && event.detail == 0){
      contentWiewSize = 50
    }
    else if(contentWiewSize < 30 && event.detail == 100){
      contentWiewSize = 50
    }
    else{
      contentWiewSize = event.detail
    }
  }

  function updateContentWiewSize(e){
    if(e.detail[1]){
    contentWiewSize = e.detail[1].size
    }
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
        <Splitpanes theme = "modern-theme" style="overflow:hidden;" on:resized="{updateContentWiewSize}">
          <Pane size={(100-contentWiewSize).toString()} >
              <DocumentList on:set_content_view_size={set_content_view_size}/>
          </Pane>
        {#if $currentDocumentObject}
          <Pane size={contentWiewSize.toString()} ><ContentView on:set_content_view_size={set_content_view_size} width={w}/></Pane>
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
