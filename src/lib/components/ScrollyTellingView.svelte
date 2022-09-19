<script>
	import Scrolly from "./Scrolly.svelte";
    import {documentList, currentDocumentObject} from "../stores/stores.js"
    import ScrollItem from "./ScrollItem.svelte";
    import ContentView from "./ContentView.svelte";
    import { marked } from 'marked';
    import ToolMenu from './ToolMenu.svelte'
    
	let value = 0
    
    $:{
        $currentDocumentObject = $documentList[value]
        $currentDocumentObject = $currentDocumentObject
    }
    
  
</script>

    <div class="main">
        <div class="scrolly-telling">
            <ToolMenu hideToolBar = {false}/>

            <Scrolly bind:value>
                {#each $documentList as item, i}
                <div class="step" class:active={value === i}>
                    <ScrollItem htmlText = {marked(item.context)} date = {marked(item.date.toDateString())} title = {marked(item.title)} author = {marked(item.author)} document = {item}/>
                    </div>
                {/each}
            </Scrolly>

        </div>
        <div class="content-view">
            <ContentView/>
        </div>
    </div>




<style>
    .main{
        height: calc(100%);
        width: 100%;
        display: flex;
        flex-direction: row;        
    }

	.scrolly-telling{
        display: flex;
        flex-direction: column;
        width: 70%;
        height: 100%;
        overflow-x:hidden;

    }

    .content-view{
        display: flex;
        flex-direction: column;
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