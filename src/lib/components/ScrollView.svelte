<script>
    
    import {documentList, currentDocumentObject} from '../stores/stores.js';
    import ScrollItem from "./ScrollItem.svelte";
    import Typewriter from './Typewriter.svelte';
    import toMarkdown from 'to-markdown';
    import {editor, currentlyAddingNewNote} from '../stores/stores.js';
    import {marked} from 'marked';
    

    let show = false;
    
    function save(){ 
        console.log("sjekker save");
        console.log($currentDocumentObject);
        $documentList.forEach((element)=>{
          if (element.id === $currentDocumentObject.id){
              element.context= toMarkdown(editor.getHTML());
              console.log(element.context);
          }
        })
        $documentList = $documentList;
        console.log($currentDocumentObject);
        console.log($documentList);
        console.log("sjekker save");
        show = false;
    }
    function cancel(){
        show = !show

        console.log("sjekker cancel");
    }

    let sortedData = $documentList;
    let ascendingOrder = false;
    let lengde = $documentList.length;
    const sortByString = (colHeader) => {
        console.log("click tittel");
		sortedData = sortedData.sort((obj1, obj2) => {
			if (obj1[colHeader] < obj2[colHeader]) {
					return -1;
			} else if (obj1[colHeader] > obj2[colHeader]) {
				return 1;
			}
			return 0; //string code values are equal		
		});

		if (!ascendingOrder) {
			sortedData = sortedData.reverse()
		}

        $documentList = sortedData;
        ascendingOrder = !ascendingOrder;
	}
    
   
    $: if ($documentList.length>lengde) {
        ascendingOrder = false;
        sortByString("date");
    }


</script>

        <div class="box">
            <div id="container" class:container={show} class:full-container={!show}> 

                {#each $documentList as item}
                    <ScrollItem on:editItem = {()=>show=!show} document = {item} deactivate ={show}/>
                {/each}
            </div>
            {#if show}
                <div class="editor">
                    <Typewriter on:save = {save} on:cancel={cancel} />
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