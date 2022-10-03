<script>
	import Scrolly from "./Scrolly.svelte";
    import {documentList, currentDocumentObject, smallDevice} from "../../stores/stores.js"
    import ScrollyElement from "./ScrollyElement.svelte";
    import { marked } from 'marked';
    import ToolMenu from '../ToolMenu.svelte'
    import Graph from "./Graph/Graph.svelte";
    import { fly, fade } from 'svelte/transition';

    
	let value = 0
    let current_opacity = 0;
    let points = [
		{x: 0, y: 37},
		{x: 1, y: 38},
		{x: 2, y: 39},
		{x: 3, y: 36},
		{x: 4, y: 40},
		{x: 5, y: 41},
		{x: 6, y: 37},
		{x: 7, y: 38},
		{x: 8, y: 37},
		{x: 9, y: 38},
		{x: 10, y: 35},
		{x: 11, y: 34},
		{x: 12, y: 44},
		{x: 13, y: 41},
		{x: 14, y: 37},
		{x: 15, y: 38},
		// {x: 16, y: 37},
		// {x: 17, y: 38},
		// {x: 18, y: 39},
		// {x: 19, y: 45},
		// {x: 20, y: 43},
		// {x: 21, y: 41},
		// {x: 22, y: 37},
		// {x: 23, y: 38},
		// {x: 24, y: 47},
		// {x: 25, y: 38},
		// {x: 26, y: 39},
		// {x: 27, y: 36},
		// {x: 28, y: 40},
		// {x: 29, y: 41},
		// {x: 30, y: 46},
		// {x: 31, y: 42},
	]

    $:{
        $currentDocumentObject = $documentList[value]
        $currentDocumentObject = $currentDocumentObject
    }
    function check_steps(event){
        let steps = event.detail
        let currentStepRatio = steps[value];
        current_opacity = currentStepRatio
    }
  
</script>

    <div class="main">
        <div>
            <ToolMenu hideToolBar = {false}/>
        </div>

        <div class="scroll">
            <div class="element">

                <div class="scrolly-telling">
                    <Scrolly bind:value on:steps_ratio={check_steps}>
                        {#each $documentList as item, i}
    
                            <div class="step" class:active={value === i}>
                                <ScrollyElement htmlText = {marked(item.context)} date = {marked(item.date.toDateString())} title = {marked(item.title)} author = {marked(item.author)} document = {item}/>
                            </div>
    
                        {/each}
                    </Scrolly>
                    
                    {#if value%2==0}
                        <div in:fly="{{ x: -170, duration: 2000 }}" out:fade class = "graph">
                            <h2> Kroppstemperatur </h2>
                            <Graph height={500} width = {500} points = {points} xName = {"Dager"} yName = {"Grader"}/>
                        </div>
                    {/if}
                 
                </div>
            </div>
        </div>
        

    </div>




<style>
    .main{
        height: calc(100%);
        width: 100%;
        display: flex; 
        flex-direction: column;       
    }
    .graph{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 500px;
        width: 500px;
        position: absolute;
        right: 5%;
        top:20%;
    }

    .element{
        display: flex;

    }
    .scroll{
        display:flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow-y:auto;
        
    }
	.scrolly-telling{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow-x:hidden;
        margin-bottom: 30%;
        
    }
    
	.step {
        transition: background 100ms;
        width: 60%;
        margin: 5% 0 5% 50px;
        opacity: 0.5;
	}
    
	.step.active {
        background: whitesmoke;
        border-radius: 20px;
        opacity: 1;
	}
</style>