<script>
    import { noDocumentFilter, currentFilterGroup, myFilters} from '../stores/stores.js';

    //const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];
    const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];

    let filterMenuOpen = false;

    let newFilterMode = false;

    let newFilterButtonName = "Nytt filter"

    let newFilterName ="";

    let newFilterGroup = documentTypes;

    let searched_value = "";

    let allFilterMarked = true;


    $currentFilterGroup = documentTypes

    const filterMenuHandler = () => {
        filterMenuOpen = !filterMenuOpen
    }


    //Functions for adding new filtergroups
    function clickedAll(){

        if(newFilterGroup.length < documentTypes.length){
            newFilterGroup = documentTypes
        }
        else{
            newFilterGroup = []
        }
    }


    $: if(newFilterGroup.length == documentTypes.length){
        allFilterMarked = true
    }
    else if(newFilterGroup.length < documentTypes.length){
        allFilterMarked = false
    }

    function turnOffFilter(){
        $noDocumentFilter = true
        $currentFilterGroup = documentTypes
    }

    function newFilterClicked(){
        newFilterMode = !newFilterMode
        if(newFilterMode){
            newFilterButtonName = "Dine filter"
        }
        else{
            newFilterButtonName = "Nytt filter"
        }
    }

    function findNewId(){
        let ids = []
        $myFilters.forEach((filter)=>ids.push(filter.id))
        let num = 0;
        while(ids.includes(num)){
            num += 1;
        }
        return num;
    }

    function saveFilter(){

        let newFilterObj = {id: findNewId(), name: newFilterName, filters: newFilterGroup}
        $myFilters.push(newFilterObj)
        $currentFilterGroup = newFilterObj.filters
        newFilterClicked()
        console.log(newFilterObj)
    }


    function showFilter(){
        $currentFilterGroup = newFilterGroup
    }

    function deleteFilter(deletetId){
        $myFilters = $myFilters.filter(item => (item.id != deletetId))
    }



</script>
    <div class="filtermenu">
        <button on:click={filterMenuHandler} class:active={filterMenuOpen} class="dropdown-button" >Filter</button>

        <div class:show={filterMenuOpen} class="filtermenu-dropdown" >

            <button on:click={newFilterClicked}>{newFilterButtonName}</button>

            {#if newFilterMode}
                <button on:click={showFilter}>Vis</button>
                <button on:click={saveFilter}>Lagre</button>
                <input bind:value={newFilterName} type="text" placeholder="Filternavn..." name="search">
                <input bind:value={searched_value} type="text" placeholder="Søk.." name="search">
                <label class="filterItem" >
                    <input type="checkbox" on:click={clickedAll} bind:checked={allFilterMarked} value="alle" >
                    Alle
                    <span class="checkmark"></span>
                </label>

                <div class= "filteroption-conteiner">
            {#each documentTypes as item}    
                <label class="filterItem" >
                <input type="checkbox"  bind:group={newFilterGroup} value={item} >
                {item}
                <span class="checkmark"></span>
                </label>
            {/each}
                </div>	

            {:else}
                    <h4>Dine filter:</h4>
                    <div class="filterItem-button" class:active={$currentFilterGroup == documentTypes} on:click={() => $currentFilterGroup = documentTypes} value="alle">Vis allt</div>
                    <div class= "myFilters-conteiner">
                        {#each $myFilters as filter}
                            <div class="filterItem-button" class:active={$currentFilterGroup == filter.filters} on:click={()=> $currentFilterGroup = filter.filters} value={filter.filters}>
                                <t>{filter.name}</t> 
                                <button  on:click={deleteFilter(filter.id)} title="Slett" class="delete-button" value={filter.id}><i class="material-icons">delete</i></button>
                            </div>
                            

                        {/each}
                    </div>
            {/if}
        </div>
        
        {#if $currentFilterGroup.length != documentTypes.length}
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
        z-index: 2;
        max-height: 80vh;
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
        border: none;
        background: none;
        height:4vh;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;

    }
    .filteroff-button:hover {
        color:#666363;
    }

    .filterItem-button{
        align-items: center;
        display: flex;
        flex-direction: row;
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        border-bottom:  1px solid #666363;
    }

    .filterItem-button:hover {
        background-color: #e6f2ff;
    }

    .filterItem-button.active{
        background-color: #ccebff;
    }

    .myFilters-conteiner{
        max-height: 70vh;
        overflow-y: auto;

    }
    .filteroption-conteiner{
        max-height: 60vh;
        overflow-y: auto;
    }

    .delete-button {
        position: absolute;
        right: 0;
        background: none;
        margin-right: 1vw;
        border:none;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;
  }

  .delete-button:hover {
    color: #d43838;
  }
</style>