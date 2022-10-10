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
    $currentDocumentObject = $documentList[value]
    let sortedData = $documentList;
 
    // let points = [
        // 	{x: 0, y: 37},
	// 	{x: 1, y: 38},
    
	// 	{x: 16, y: 37},
	// 	{x: 17, y: 38},
	// 	{x: 18, y: 39},
	// 	{x: 19, y: 45},
	// 	{x: 20, y: 43},
	// 	{x: 21, y: 41},
	// 	{x: 22, y: 37},
	// 	{x: 23, y: 38},
	// 	{x: 24, y: 47},
	// 	{x: 25, y: 38},
	// 	{x: 26, y: 39},
	// 	{x: 27, y: 36},
	// 	{x: 28, y: 40},
	// 	{x: 29, y: 41},
	// 	{x: 30, y: 46},
	// 	{x: 31, y: 42},
	// ]
    let points = []
    
    let current_index = -1;

    //sort documents by date
    const sortByString = (colHeader) => {
        sortedData = sortedData.sort((obj1, obj2) => {
            if (obj1[colHeader] < obj2[colHeader]) {
                return -1;
            } else if (obj1[colHeader] > obj2[colHeader]) {
                    return 1;
                }
                return 0; //string code values are equal		
            });
            $documentList = sortedData;
        }
        
    sortByString("date")
    function add_points(docObj){
        let temp = docObj.get_temp()
        points.push({x: points.length, y: temp, data: docObj})
        points = points
    }

    $:{
        if (!value){
            value=0
        }
        $currentDocumentObject = $documentList[value]
        $currentDocumentObject = $currentDocumentObject
        if (value > current_index ) {
            if ($currentDocumentObject.temperature != null){
                add_points($currentDocumentObject)
            }
            current_index = value;
        }
    }

    function check_steps(event){
        let steps = event.detail
        let currentStepRatio = steps[value];
        current_opacity = currentStepRatio
    }
  
</script>

    <div class="main">
  
        <ToolMenu hideToolBar = {false}/>

        <div class="scrolly-telling">

            <div class="scroll">
                <Scrolly bind:value on:steps_ratio={check_steps}>
                    {#each $documentList as item, i}
                        <div class="step" class:active={value === i}>
                            <ScrollyElement htmlText = {marked(item.context)} date = {marked(item.date.toDateString())} title = {marked(item.title)} author = {marked(item.author)} document = {item}/>
                        </div>

                    {/each}
                </Scrolly>
            </div>
            
           {#if $currentDocumentObject.get_temp() != null && points.length != 0}
            <div in:fly="{{ x: -170, duration: 2000 }}" out:fade class = "graph" >
                <h4> Temperatur </h4>
                <Graph height={500} width = {500} points = {points.slice(0, value)} xName = {"Målinger"} yName = {"Grader"} removed = {points.length != points.slice(0, value).length }/>
            </div>
            {/if}
           
        </div>

    </div>




<style>

    .main{
        height: 100%;
        width: 100%;
        display: flex; 
        flex-direction: column;   
    }

    .graph{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 50%;
        width: 20%;
        position: absolute;
        right: 10%;
        top:20%;
        box-shadow: 10px;
       
    }

    .scrolly-telling{
        display:flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        overflow-y: auto;      
       
    }

	.scroll{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
       
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
        box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
	}
</style>