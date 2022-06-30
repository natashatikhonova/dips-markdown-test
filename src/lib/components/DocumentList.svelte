<script>
    import DocumentItem from "./DocumentItem.svelte";
    import {currentDocumentObject, documentList, currentlyAddingNewNote} from '../stores/stores.js';

    let sortedData = $documentList;
    const tableHeaders = ["title", "date","author"];
    let selectedHeader = "date";
    let ascendingOrder = false;
    let lengde;

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

</script>

<div class="table-container" >
    <table>
        <!--copied from https://svelte.dev/repl/f04266dcd39c4024b1e89084aa549844?version=3.31.2 -->
        <thead>
            <tr>
                {#each tableHeaders as header}
                    <th class:highlighted={selectedHeader === header}
                                on:click={() => sortByString(header)}>
                            {header.replace("_", " ")}
            
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
            {#each $documentList as item}
                {#if $currentDocumentObject === item}
                    <DocumentItem document = {item} chosen = {true} /> <!--add color if file is chosen -->
                {:else} 
                    <DocumentItem document = {item} chosen = {false} />
                {/if}
            {/each} 
        </tbody>
        
    </table>
</div>
<button title="Ny notat"class="add-button" class:visible={$currentlyAddingNewNote} on:click = {addNote}>+</button>

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
        border-top:0.5px solid rgb(0, 0, 0);
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

    .add-button{
        position: absolute;
        bottom: 4vh;
        font-size:xx-large;
        color:#ffffff;
        right:5vh;
        width:8vh;
        height: 8vh;
        align-items: center;
        justify-content: center;
        background: #d43838;
        border-radius: 50%;
        border: 1px solid #ced4da;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;
    }

    .add-button:hover{
        border: solid 0.1em;
        box-shadow: 0 0 0 0.2rem rgb(255, 92, 81);
    }

</style>

