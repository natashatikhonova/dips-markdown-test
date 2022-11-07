<script lang="ts">
  import {Router, Route} from "svelte-navigator"
  import DocumentList from './lib/components/documentview/DocumentList.svelte';
  import ContentView from './lib/components/ContentView.svelte';
  import ScrollView from './lib/components/scrollview/ScrollView.svelte';
  import { currentlyAddingNewNote, currentDocumentObject, smallDevice, openedDocTabs} from './lib/stores/stores.js';
  import { Pane, Splitpanes } from 'svelte-splitpanes';
  import Device from 'svelte-device-info'
  import ScrollyTellingView from './lib/components/scrollytelling/ScrollyTellingView.svelte';
  import DocumentsTabs from './lib/components/scrollview/DocumentsTabs.svelte';
  import Launch from "./Launch.svelte";
  import Load from "./Load.svelte";


  $smallDevice = (Device.isPhone || Device.isTablet || Device.isMobile)

  let typewriter_size = 50
  console.log("APP")

  //tilpasser til mobilversjon
  $: contentWiewSize = $smallDevice && $currentDocumentObject ? 100: 50

  function set_content_view_size(event){
    //If on mobile the, only one content/pane at time
    if($smallDevice){
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

  function set_typewriter_size(event){
    //Different outcome based on panes current size
    if(typewriter_size > 70 && event.detail == 0){
      typewriter_size = 50
    }
    else if(typewriter_size < 30 && event.detail == 100){
      typewriter_size = 50
    }
    else{
      typewriter_size = event.detail
    }
  }

  function updateContentWiewSize(e){
    if(e.detail[1]){
    contentWiewSize = e.detail[1].size
    }
  }

  function updateTypewriterSize(e){
    if(e.detail[1]){
    typewriter_size = e.detail[1].size
    }
  }

</script>

<head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>

<Router>
    <div class = "main">

      <Route path="/" primary={false}>
        <Launch/>
      </Route>

      <Route path="/app" primary={false}>
        <Load/>
      </Route>

      <Route path="dokumentliste">
        <div class="side-container"  >
          {#if $currentlyAddingNewNote}
            {#if !$smallDevice}
              <Splitpanes theme = "modern-theme" on:resized="{updateTypewriterSize}">
                <Pane size={(100-typewriter_size).toString()}> <ScrollView on:set_typewriter_size={set_typewriter_size} tempView={true}/> </Pane>
                <Pane minSize="35" size={typewriter_size.toString()}> <ContentView on:set_typewriter_view_size={set_typewriter_size}/> </Pane>
              </Splitpanes>
            {:else}  
                <ScrollView tempView={true} />
            {/if}
    
          {:else}
            <Splitpanes theme = "modern-theme" style="overflow:hidden;" on:resized="{updateContentWiewSize}">
              <Pane size={(100-contentWiewSize).toString()} >
                  <DocumentList on:set_content_view_size={set_content_view_size}/>
              </Pane>
            {#if $currentDocumentObject}
              <Pane size={contentWiewSize.toString()} ><ContentView on:set_content_view_size={set_content_view_size}/></Pane>
            {/if}
            </Splitpanes>
          {/if}
        </div>
      </Route>
      
      <Route path="scrollview">
        <Splitpanes theme = "modern-theme">
          <Pane size={$openedDocTabs.length== 0? "100": "50"}>
            <ScrollView/>
          </Pane>
          <Pane size={$openedDocTabs.length== 0? "0": "50"}>
            {#if $openedDocTabs.length>0}
              <DocumentsTabs/>
            {/if}
          </Pane>
        </Splitpanes>
      </Route>

    <Route path="scrollytelling">
        <ScrollyTellingView/>
    </Route>

    </div>
  
</Router>

<style>

   .main {
    height: 100%;
    overflow-y: none;
    overflow-x: hidden;
  }

  .side-container{
    height: calc(100%);
    width: 100%;
    display: flex;
    flex-direction: row;
  }

</style>
