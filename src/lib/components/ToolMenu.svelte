<script>
    import { noDocumentFilter, filterGroup} from '../stores/stores.js';

    const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];
    let filterMenuOpen = false;

    const filterMenuHandler = () => {
        filterMenuOpen = !filterMenuOpen
    }

    function clickedAll(){
        if($noDocumentFilter){
            $filterGroup = []
        }
        else{
            $filterGroup = documentTypes
        }
    }

    $: if($filterGroup.length == documentTypes.length){
    $noDocumentFilter = true
    }
    else if($filterGroup.length < documentTypes.length){
        $noDocumentFilter = false
    }

    function turnOffFilter(){
        $noDocumentFilter = true
        $filterGroup = documentTypes
    }
</script>


    <div class="filtermenu">
        <button on:click={filterMenuHandler} class:active={filterMenuOpen} class="dropdown-button" >Filter</button>

        <div class:show={filterMenuOpen} class="filtermenu-dropdown" >
          <label class="filterItem" >
            <input type="checkbox" on:click={clickedAll} bind:checked={$noDocumentFilter} value="alle" >
              Alle
            <span class="checkmark"></span>
          </label>
            {#each documentTypes as item}
            <label class="filterItem" >
              <input type="checkbox"  bind:group={$filterGroup} value={item} >
              {item}
              <span class="checkmark"></span>
            </label>
            {/each}	
        </div>
        
        {#if !$noDocumentFilter}
          <button class="filteroff-button" on:click={turnOffFilter}>Skru av filter</button>
        {/if}	
    </div>

<style>

    .filtermenu {
    position: relative;
    display: inline-block;
    
    }
        
    .filtermenu-dropdown {
    display: none;
    position: absolute;
    background-color: #f6f6f6;
    min-width: 230px;
    border: 1px solid #ddd;
    z-index: 1;
    }

    .show {
    display:block;
    }

    .dropdown-button {
    display: inline-flex;
    align-items: center;
    margin: 0.5vh;
    margin-bottom: 0vh;
    margin-right: 2vh;
    height:4vh;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    background: #d43838;
    color:#ffffff;
    padding: 16px;
    font-size: 16px;
    cursor: pointer;
    border: solid 0.1em rgb(255, 92, 81 ,0);
    box-shadow: 0 0 0 0.2rem rgb(255, 92, 81, 0);
    }
        
    .dropdown-button:hover, .dropdown-button.active {
    color:#ffffff;
    border: solid 0.1em;
    box-shadow: 0 0 0 0.2rem rgb(255, 92, 81);
    }

    .filterItem {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    }	
        
    .filterItem:hover {
    background-color: #ddd
    }

    .filteroff-button{
        display: inline-flex;
        align-items: center;
        background: none;
        height:4vh;
        border:none;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;
    }
    .filteroff-button:hover {
        color:#666363;
    }
</style>