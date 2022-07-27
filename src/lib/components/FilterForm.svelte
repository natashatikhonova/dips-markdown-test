<script>
    import {doctype_filter_groups, titles_filter_groups, all_markdown_titles} from '../stores/stores';
    import { getContext, setContext } from 'svelte';


    export let original_list_obj =[]
    export let edit_bool;
    export let edit_obj_indeks;
    export let typeOfForm;

    let saved_groups = typeOfForm == "doc" ? $doctype_filter_groups : $titles_filter_groups
    let group_name = edit_bool ? saved_groups[edit_obj_indeks].name : ""
   
    let manageName = edit_bool ? "Rediger filtergruppe" : "Opprett ny filtergruppe"
    let filterType = typeOfForm == "doc" ? "dokumenttyper" : "overskrifter"
    


    const { open, close } = getContext('simple-modal');
    setContext('modal', this)
    let show_list_obj =[]
    let searched_value = ""
    
    $: if (searched_value != ""){
        show_list_obj = original_list_obj.filter(item => (item.name.toLowerCase().includes(searched_value.toLowerCase())));
    }
        
  
    if (original_list_obj){
        console.log("her")

        if (edit_bool == true) {

            console.log("True")

            for (let i = 0; i < saved_groups[edit_obj_indeks].filters.length; i++) {
                 console.log (saved_groups[edit_obj_indeks].filters)

                for (let j = 0; j < original_list_obj.length; j++){
                    console.log(original_list_obj[j].name )
                    console.log(saved_groups[edit_obj_indeks].filters[i])

                    if (original_list_obj[j].name === saved_groups[edit_obj_indeks].filters[i].overskrift){
                        // console.log("\n\n")
                        // console.log(original_list_obj[j])
                        // console.log("Setter checked til true")
                        original_list_obj[j].checked = true
                        console.log(saved_groups)
                    }

                }
            }
        }

        show_list_obj = original_list_obj
    }
        
    
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
        for(let i = 0; i < saved_groups.length; i++){
            if ( (saved_groups[i].name == group_name) && (i != edit_obj_indeks)) return true;
        }
        return false
    }
    function add_to_groupStore(group_name, index, checked_filters){
        if (index != -1) {
            if (typeOfForm == "doc"){
                $doctype_filter_groups[index] = {id: findNewId(),name: group_name, filters: checked_filters}
                $doctype_filter_groups = $doctype_filter_groups
            } else {
                $titles_filter_groups[index] = {id: findNewId(), name: group_name, filters: checked_filters}
                $titles_filter_groups = $titles_filter_groups
            }  
            edit_bool = false
        } else{
            //new group
            if (typeOfForm == "doc"){
    
                $doctype_filter_groups.push({id: findNewId(), name: group_name, filters: checked_filters})
                $doctype_filter_groups = $doctype_filter_groups
            } else {
                $titles_filter_groups.push({id: findNewId(), name: group_name, filters: checked_filters})
                $titles_filter_groups = $titles_filter_groups
            }
        }
    }
    function find_nodes(node_name){
        console.log("findnodes")
        console.log(node_name)
        console.log($all_markdown_titles)
        for (let i = 0; i<$all_markdown_titles.length; i++){
            if($all_markdown_titles[i].overskrift == node_name){
                return $all_markdown_titles[i].nodes
            }
        }
        console.log("tom array")
        return []
    }

    function save(){
        if (group_name == "") {
            alert("Vennligst skriv inn gruppenavn!")
        } else if (name_used(group_name)) {
            alert("Gruppenavnet finnes fra før!")
            
        }else {
            let checked_filters = []
            for (let i = 0; i<original_list_obj.length; i++){
                if(original_list_obj[i].checked){

                    original_list_obj[i].checked = false
                    console.log(original_list_obj)
                    if(typeOfForm == "doc"){
                        checked_filters.push(original_list_obj[i].name)
                    }else{
                        console.log(original_list_obj[i].name)
                        let nodes = find_nodes(original_list_obj[i].name)
                        console.log(nodes)
                        for(let i = 0; i<nodes.length; i++){
                            checked_filters.push(nodes[i])
                        }
                        
                    }
                }
            }
            if (checked_filters.length == 0) {
                alert("Du må velge minst 1 overskrift")
            } else {
                if (edit_bool) { //Edited group
                    add_to_groupStore(group_name, edit_obj_indeks, checked_filters)
                    
                } else { //New group 
                    add_to_groupStore(group_name, -1, checked_filters)
                }
                console.log($titles_filter_groups)
                close()

            }
        }
    }

  
</script>
<!-- <button on:click={onClose}>Custom Close Button</button> -->
<div class = "main">

    <h2>{manageName}</h2>
    <input bind:value ={group_name} type="text" placeholder="Skriv inn gruppenavn.." name="search">
    <h3>Velg {filterType}</h3>
    <input bind:value ={searched_value} type="text" placeholder="Søk.." name="search">
    <div class="filters">

        {#if show_list_obj.length == 0}
            <div class = "no-filters">Ingen {filterType}</div>
        {:else}
        
            {#each show_list_obj as elementObj}
        
                <div class="title">
                    <input type="checkbox" bind:checked={elementObj.checked} />
        
                    <div class="title">
        
                        {elementObj.name} 
        
                    </div>
                </div>
                            
            {/each} 
        {/if}
    </div>

    <button class = "main-button" on:click={save}>Lagre</button>
    


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

.filters{
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

.no-filters{
    margin-top: 2vh;
}

/* Darkmode */

:global(body.dark-mode) button{
    background: #701c1c;
  border: 1px solid #cccccc;
  color:#cccccc;
}

:global(body.dark-mode) button:hover{
  box-shadow: 0 0 0 0.25rem rgb(126, 33, 26);
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