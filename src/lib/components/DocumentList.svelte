<script>
    import DocumentItem from "./DocumentItem.svelte";
    import {currentDocumentObject, documentList, currentlyAddingNewNote, globalCurrentFilterGroup, showFiltermenu, showSideView} from '../stores/stores.js';
    import ToolMenu from './ToolMenu.svelte';
    import { Pane, Splitpanes } from 'svelte-splitpanes';
    import FilterMenu from './FilterMenu.svelte';

    let w
    $: w = window.innerWidth;
    let sortedData = $documentList;
    const tableHeaders = ["title", "date","author"];
    let selectedHeader = "date";
    let ascendingOrder = false;
    let lengde;

    $: filteredDocumentlist = ($documentList.filter(item => ($globalCurrentFilterGroup.filters.includes(item.title))));

    function addNote(){
        $currentlyAddingNewNote = true;
    }
        
    // SORT BY NUMBER
    /*
    const sortByNumber = (colHeader) => {
        sortedPersonData = sortedPersonData.sort((obj1, obj2) => {
            return ascendingOrder ? Number(obj1[colHeader]) - Number(obj2[colHeader])
            : Number(obj2[colHeader]) - Number(obj1[colHeader])
        });
        selectedHeader = colHeader;
    }*/
        
    // SORT BY STRINGs

    const sortByString = (colHeader) => {
        // console.log("click tittel");
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
        
        selectedHeader = colHeader;
        $documentList = sortedData;
        ascendingOrder = !ascendingOrder;
        lengde = $documentList.length;
    }

    //sorting by default
    sortByString(selectedHeader);

    //if documentlist updates, then sort
    $: if ($documentList.length>lengde) {
        ascendingOrder = false;
        sortByString("date");
    }
    let current_size= "0";
    let documentview_size = "125";
    let maxSize_filter = "0"


    function close(){
        //show_titles_button=!show_titles_button;
        current_size = "0";
        documentview_size = "125";
        $showFiltermenu = false;
        maxSize_filter = "0"
    }

    function open(){
        if(w<600){
            current_size = "100"
            maxSize_filter = "100"
            documentview_size="0"
        }else{

            current_size = "25";
            maxSize_filter = "50"
            documentview_size = "100";
        }
    }

    $: if($showFiltermenu==true){
        open()
    }
    $: if ($currentDocumentObject && $showFiltermenu && w>600){
        current_size = "60"
    }
    $: if (!$currentDocumentObject && $showFiltermenu&& w>600){
        current_size="25"
    }


</script>
<div class = "with-toolbar-conteiner">
    <ToolMenu hideToolBar={true}/>

    <div class="document-container">

        <Splitpanes theme="modern-theme">
    
            <Pane minSize={"20"} size={current_size} maxSize={maxSize_filter}>
                <FilterMenu on:close={close} showFilterByTitles={false}/>
            </Pane>
     
        
            <Pane size={documentview_size}>
                <div class="table-container" >
                    <table>
                        <!--copied from https://svelte.dev/repl/f04266dcd39c4024b1e89084aa549844?version=3.31.2 -->
                        <thead>
                            <tr>
                                {#each tableHeaders as header}
                                    <th class:highlighted={selectedHeader === header} on:click={() => sortByString(header)}>
                                        <!-- {header.replace("_", " ")} -->
                                        <!-- Swithes language to norwegian -->
                                        {#if header == "title"}
                                            {"Tittel"}
                                        {:else if header == "date"}
                                            {"Dato"}
                                        {:else if header == "author"}
                                            {"Forfatter"}
                                        {/if}
                                        
                            
                                        {#if header === selectedHeader}	
                                            <span class="order-icon" on:click={() => ascendingOrder = !ascendingOrder}>
                                                {@html ascendingOrder ? "&#9661;" : "&#9651;"}
                                            </span>		
                                        {/if}	
                                    </th>	
                                {/each}
                        </tr>
                        </thead>
    
                    
                        <tbody>
                            <!-- {#each $documentList as item} -->
                            {#each filteredDocumentlist as item}
                                {#if $currentDocumentObject === item}
                                    <DocumentItem document = {item} chosen = {true} /> <!--add color if file is chosen -->
                                {:else} 
                                    <DocumentItem document = {item} chosen = {false} />
                                {/if}
                            {/each} 
                        </tbody>
                        
                    </table>
                </div>
            </Pane>
        </Splitpanes>
    </div>
</div>

<button title="Ny notat"class="add-button" class:mobile = {w<600} class:visible={$currentlyAddingNewNote} on:click = {addNote}>+</button>

<style>

    table {
		width: 100%;
        border-collapse: collapse;
        background-color: white;
	}

    .document-container{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: auto;
    }

    :global(body.dark-mode) table{
        background-color: rgb(49, 49, 49);
    }

	th {
		text-transform: uppercase;
        background: rgb(253, 253, 253);
		cursor: pointer;
        text-align: left;
		padding: 16px;
        border-bottom:1.5px solid rgb(0, 0, 0);
	}

    :global(body.dark-mode) th{
        background-color: rgb(49, 49, 49);
        border-bottom:1.5px solid #cccccc;
        
    }

	.order-icon {
		color: hsl(15, 100%, 25%);
	}
	
	.highlighted {
		color: #cf2417;
	}

    :global(body.dark-mode) .highlighted{
        color: rgb(148, 17, 17);
    }

    .table-container{
        min-width: none;
        overflow-y: auto;
        height: 100%;
        width: 100%;
    }

    .table-container thead th{
        position:sticky;
        top:0;
    }
/*     
    .mobile{
        right: 3vw;
        bottom: 3vh;
        height: 6vh;
        width: 6vh;
        font-size:x-large;
    } */

</style>

