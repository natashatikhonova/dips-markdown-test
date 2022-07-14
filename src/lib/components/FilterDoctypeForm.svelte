<script>
    import {myFilters} from '../stores/stores';
    import { getContext, setContext } from 'svelte';

    export let edit_bool;
    export let newFilterObj = {id: findNewId(), name: "", filters: []}

    
    const { open, close } = getContext('simple-modal');
    setContext('modal', this) 

    const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Røntgen bilde", "typ1", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10"];
    documentTypes.sort()

    let filter_searched_value = "";
    let allFiltersChecked = false

    let editFilterGroup = newFilterObj.filters
    let editFilterName = newFilterObj.name

    let manageName = edit_bool ? "Rediger filtergruppe" : "Opprett ny filtergruppe"

    $: searchedDocumentTypes = documentTypes.filter(item => (item.toLowerCase().includes(filter_searched_value.toLowerCase())));


    
    $: if(editFilterGroup.length == documentTypes.length){
        allFiltersChecked = true
    }
    else if (editFilterGroup.length < documentTypes.length){
        allFiltersChecked = false
    }
    
    //Functions for adding new filtergroups
    function findNewId(){
        let ids = []
        $myFilters.forEach((filter)=>ids.push(filter.id))
        let num = 1;
        while(ids.includes(num)){
            num += 1;
        }
        return num;
    }
    
    function name_used(group_name){
        if(group_name != newFilterObj.name){
            for(let i = 0; i < $myFilters.length; i++){
                if ( ($myFilters[i].name == group_name)) return true;
            }
        }

        return false
    }

    function save(){
        if (editFilterName == "") {
            alert("Vennligst skriv inn gruppenavn!")
        } 
        
        else if (name_used(editFilterName)) {
            alert("Gruppenavnet finnes fra før!")    
        }
        else {
            if (editFilterGroup.length == 0) {
                alert("Du må velge minst 1 overskrift")
            } 
            else {
                newFilterObj.filters = editFilterGroup
                newFilterObj.name = editFilterName

                if(!$myFilters.includes(newFilterObj)){
                    $myFilters.push(newFilterObj)
                }
                $myFilters = $myFilters
                close()
            }
        }
    }

    function checkAll(){
        if(editFilterGroup.length <documentTypes.length){
            editFilterGroup = documentTypes
        }
        else{
            editFilterGroup =[]
        }
    }

  
</script>
<div class = "main">

    <h2>{manageName}</h2>
    
    <input bind:value ={editFilterName} type="text" placeholder="Skriv inn gruppenavn.." name="search">
    <h3>Velg typer:</h3>
    <input bind:value ={filter_searched_value} type="text" placeholder="Søk.." name="search">
    <div class="title">
        <input type="checkbox" on:click={checkAll} bind:checked={allFiltersChecked}>
        <div class="title">
            Alle
        </div>
    </div>

    <div class="titles">
        {#if searchedDocumentTypes.length == 0}
            <div class = "no-titles">Ingen documentyper</div>
        {:else}
            {#each searchedDocumentTypes as item}    
                <div class="title">
                <input type="checkbox"  bind:group={editFilterGroup} value={item} >
                <div class="title">
                    {item} 
                </div>
            </div>
            {/each}
        {/if}
    </div>

    <button on:click={save}>Lagre</button>
</div>
<style>

button {
    position: absolute;
    right: 2vw;
    bottom: 2vh;
    background-color: #d43838;
    color: white;
    width: 6vw;
    height: 4vh;
    border: none;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
}

button:hover{
    border: solid 0.1em;
    box-shadow: 0 0 0 0.2rem rgb(255, 92, 81);
}
.main {
    height: 70vh;
    overflow: hidden;
}

.titles{
    padding-right: 2vw;
    height: 50%;
    overflow-y: auto;
}


input[type=text] {

    padding: 6px;
    border: none;
    border-bottom: solid;
    margin-bottom: 2vh;
    font-size: 17px;
    width:90%;
}

.title{
    cursor: pointer;
    display: flex;
}

.title:hover{
    color:#d43838;
}

.no-titles{
    margin-top: 2vh;
}

</style>