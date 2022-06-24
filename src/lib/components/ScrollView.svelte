<script>
    
    import {documentList, currentDocumentObject} from '../stores/stores.js';
    import ScrollItem from "./ScrollItem.svelte";
    import Typewriter from './Typewriter.svelte';
    import toMarkdown from 'to-markdown';
    import {editor} from '../stores/stores.js';
    

    let show = false;
    
    function save(){ 
        $documentList.forEach((element)=>{
          if (element.id === $currentDocumentObject.id){
              element.context= toMarkdown(editor.getHTML());
          }
        })
        show = !show;
    }
    function cancel(){
        show = !show
        
    }

    
    // let sortedData = $documentList;
    // let ascendingOrder = false;
    // let lengde = 0;
    // const sortByString = (colHeader) => {
    //     console.log("click tittel");
	// 	sortedData = sortedData.sort((obj1, obj2) => {
	// 		if (obj1[colHeader] < obj2[colHeader]) {
	// 				return -1;
	// 		} else if (obj1[colHeader] > obj2[colHeader]) {
	// 			return 1;
	// 		}
	// 		return 0; //string code values are equal		
	// 	});

	// 	if (!ascendingOrder) {
	// 		sortedData = sortedData.reverse()
	// 	}
        

    //     console.log(sortedData);

    //     $documentList = sortedData;
    //     ascendingOrder = !ascendingOrder;
    //     lengde = $documentList.length-1;
    //     console.log("lengde:"+lengde);
	// }
    
    // console.log("lengde1:"+lengde);
    // console.log("lengde2:"+ $documentList.length);
    // $: if ($documentList.length>lengde) {
    //     ("er her");
    //     ascendingOrder = false;
    //     sortByString("date");
    // }


</script>

        <div class="box">
            <div id="container" class:container={show} class:full-container={!show}> 

                {#each $documentList as item}
                        <ScrollItem on:editItem = {()=>show=!show} document = {item} deactivate ={show}/>
                {/each}
            </div>
            {#if show}
                <div class="editor">
                    <Typewriter on:cancel = {cancel} on:save = {save}/>
                </div>
            {/if}
        </div>


<style>
    .box{
        display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    .container{
        overflow-y: auto; 
        display:flex;
        flex-direction: column-reverse;
        background-color: white;
        width: 100%;
        height: 100%;
        border: solid;
        resize: vertical;

    }

    .full-container{
        flex-grow: 1;
        overflow-y: auto;
        display: flex; 
        flex-direction: column-reverse;
        background-color: white;
        width: 100%;
        height: 100%;
        border: solid;
        min-width: none;

    }

    .editor{
        display:flex;
        flex-direction: column;
        overflow-y:auto;
        width: 100%;
        background: #ffffff;
        border: solid 1px black;
        flex-grow: 1;
    }
</style>