<script>
    import {documentList} from '../stores/stores.js';
    import ScrollItem from "./ScrollItem.svelte";
    import Typewriter from './Typewriter.svelte';
    import {currentlyAddingNewNote} from '../stores/stores.js';
    
    let show = false;
    let sortedData = $documentList;
    let ascendingOrder = false;
    let lengde = $documentList.length;
    
    function save(){ 
        show = false;
    }

    function cancel(){
        show = !show
    }

    function addNote(){
        $currentlyAddingNewNote = true;
        show =true;
    }

    const sortByString = (colHeader) => {
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

    <div class="scroll-container">
        <div class:container={show} class:full-container={!show}> 
            {#each $documentList as item}
                <ScrollItem on:editItem = {()=>show=!show} document = {item} deactivate ={show}/>
            {/each}
            {#if !show}
                <button on:click = {addNote}>+</button>
            {/if}
        </div>
        {#if show}
            <div class="editor">
                <Typewriter on:save = {save} on:cancel={cancel} on:saveScroll={save} />
            </div>
        {/if}

    </div>

<style>
    .scroll-container{ 
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
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
        resize: horizontal;
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

    .editor{
        display:flex;
        flex-direction: column;
        overflow-y:auto;
        width: 100%;
        background: #ffffff;
        border: solid 1px black;
        flex-grow: 1;
    }

    button{
        position: absolute;
        margin-bottom: 1vh;
        font-size:xx-large;
        color:#ffffff;
        right:5vh;
        width:8vh;
        height: 8vh;
        align-items: center;
        justify-content: center;
        background: #80bdff;
        border-radius: 50%;
        border: 1px solid #ced4da;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;
    }

    button:hover{
        border: solid 0.1em;
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
</style>