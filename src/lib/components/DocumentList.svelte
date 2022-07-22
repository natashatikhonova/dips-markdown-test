<script>
    import DocumentItem from "./DocumentItem.svelte";
    import {currentDocumentObject, documentList, currentlyAddingNewNote, globalCurrentFilterGroup, showFiltermenu} from '../stores/stores.js';
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

    function close(){
        //show_titles_button=!show_titles_button;
        current_size = "0";
        documentview_size = "125";
        $showFiltermenu = false;
    }

    function open(){
        current_size = "25";
        documentview_size = "100";
    }

    $: if($showFiltermenu==true){
        open()
    }


</script>
<div class = "with-toolbar-conteiner">
    <ToolMenu hideToolBar={true}/>
<Splitpanes >
    <Pane minSize="20px" size={current_size} maxSize="50">
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
<button title="Ny notat"class="add-button" class:mobile = {w<600} class:visible={$currentlyAddingNewNote} on:click = {addNote}>+</button>

<style>

    table {
		width: 100%;
        border-collapse: collapse;
        background-color: white;
	}
    
	th {
		text-transform: uppercase;
        background: rgb(253, 253, 253);
		cursor: pointer;
        text-align: left;
		padding: 16px;
        border-bottom:1.5px solid rgb(0, 0, 0);
	}

	
	.order-icon {
		color: hsl(15, 100%, 25%);
	}
	
	.highlighted {
		color: #cf2417;
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

