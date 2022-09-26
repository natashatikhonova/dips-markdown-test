<script>
	import Scrolly from "./Scrolly.svelte";
    import {documentList, currentDocumentObject, smallDevice} from "../stores/stores.js"
    import ScrollItem from "./ScrollItem.svelte";
    import { Pane, Splitpanes } from 'svelte-splitpanes';
    import { marked } from 'marked';
    import ToolMenu from './ToolMenu.svelte'
    import DocumentInfo from "./DocumentInfo.svelte";
    
	let value = 0

    $:{
        $currentDocumentObject = $documentList[value]
        $currentDocumentObject = $currentDocumentObject
    }
  
</script>

    <div class="main">
        <div class="scroll">
            <div>
                <ToolMenu hideToolBar = {false}/>
            </div>

            <div class="scrolly-telling">
                <Scrolly bind:value>
                    {#each $documentList as item, i}
                    <div class="step" class:active={value === i}>
                        <ScrollItem htmlText = {marked(item.context)} date = {marked(item.date.toDateString())} title = {marked(item.title)} author = {marked(item.author)} document = {item}/>
                        </div>
                    {/each}
                </Scrolly>
            </div>
        </div>
         <div class="content-view">
            <DocumentInfo />
         </div> 
    </div>




<style>
    .main{
        height: calc(100%);
        width: 100%;
        display: flex; 
        flex-direction: row;       
    }
    .scroll{
        display:flex;
        flex-direction: column;
        width: 70%;
    }
	.scrolly-telling{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow-x:hidden;

    }

    .content-view{
        display: flex;
        width: 30%;
        height: 100%;
    }

	.step {
		transition: background 100ms;
	}

	.step.active {
		background: rgb(224, 224, 224);
	}
</style>