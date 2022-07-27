<script>
    import {doctype_filter_groups, titles_filter_groups} from '../stores/stores';
    import { getContext, setContext } from 'svelte';
    
    export let edit_bool;
    export let typeOfForm;
    let saved_groups = typeOfForm == "doc" ? $doctype_filter_groups : $titles_filter_groups

    export let newFilterObj = {id: findNewId(), name: "", filters: []}
    export let data;

    
    const { open, close } = getContext('simple-modal');
    setContext('modal', this) 

    let filter_searched_value = "";
    let allFiltersChecked = false

    let editFilterGroup = newFilterObj.filters
    let editFilterName = newFilterObj.name

    let manageName = edit_bool ? "Rediger filtergruppe" : "Opprett ny filtergruppe"

    $: searchedFilters = data.filter(item => (item.toLowerCase().includes(filter_searched_value.toLowerCase())));
    console.log(newFilterObj)

    
    $: if(editFilterGroup.length == data.length){
        allFiltersChecked = true
    }
    else if (editFilterGroup.length < data.length){
        allFiltersChecked = false
    }
    
    function add_to_groupStore(new_group){
        if (typeOfForm == "doc"){
            $doctype_filter_groups.push(new_group)
            $doctype_filter_groups = $doctype_filter_groups
        } else {
            $titles_filter_groups.push(new_group)
            $titles_filter_groups = $titles_filter_groups
        }
    }
    //Functions for adding new filtergroups
    function findNewId(){
        let ids = []
        saved_groups.forEach((filter)=>ids.push(filter.id))
        let num = 1;
        while(ids.includes(num)){
            num += 1;
        }
        return num;
    }
    
    function name_used(group_name){
        if(group_name != newFilterObj.name){
            for(let i = 0; i < saved_groups.length; i++){
                if ( (saved_groups[i].name == group_name)) return true;
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

                if(!saved_groups.includes(newFilterObj)){
                    add_to_groupStore(newFilterObj)
                }
                close()
            }
        }
    }

    function checkAll(){
        if(editFilterGroup.length <data.length){
            editFilterGroup = data
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
        {#if searchedFilters.length == 0}
            <div class = "no-titles">Ingen documentyper</div>
        {:else}
            {#each searchedFilters as item}    
                <div class="title">
                <input type="checkbox"  bind:group={editFilterGroup} value={item} >
                <div class="title">
                    {item} 
                </div>
            </div>
            {/each}
        {/if}
    </div>

    <button class="main-button" on:click={save}>Lagre</button>
</div>
<style>

button{
    position: absolute;
    right: 2vw;
    bottom: 2vh;
    width: 6vw;
    height: 4vh;
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
/* Darkmode */
:global(body.dark-mode) .main{
    background: rgb(49, 49, 49);
}

:global(body.dark-mode) input{
    background-color: rgb(49, 49, 49);
    border-bottom: 1px solid #cccccc;
    color:#cccccc;
}

:global(body.dark-mode) ::placeholder {
    color: #cccccc;   
}

:global(body.dark-mode) h2{
    color:#cccccc;
}

:global(body.dark-mode) h3{
    color:#cccccc;
}

:global(body.dark-mode) .title{
    color:#cccccc;
}

:global(body.dark-mode) .title:hover{
    color:#d43838;
}

</style>