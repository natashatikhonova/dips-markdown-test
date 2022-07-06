<script>
    import { documentList } from '../stores/stores';
    export let searched_value = "";
    let show = false;

    let all_nodes = []
    $documentList.forEach((document) => {
        let nodes_array = document.markdownTree.traverseBFS()
        nodes_array.forEach((node)=> {
            all_nodes.push(node)
        })
    })
    
     $: searched_titles = all_nodes.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())) && item.id != 0);

     function make_titles_obj_list(obj_list, node_list){
        let previous_node = null;
        let element = {};

        for (let i = 0; i < node_list.length; i++){
            let node = node_list[i];
            element = {node: node, show_title: false, show_children: false};
            if(previous_node == null){
                element.show_title = true;

            } else if(previous_node.object!= node.object){
                element.show_title = true;
            } 

           
            obj_list.push(element)
            previous_node = node;
        }
        
        console.log(obj_list)
        return obj_list
    }

    
     $: titles_list_obj = make_titles_obj_list([], searched_titles)




     function show_children(obj){
         if(obj.node.children.length > 0) {
            console.log(titles_list_obj)

            let new_titles_list_obj = []
            for(let i = 0; i < titles_list_obj.length; i++){
                new_titles_list_obj.push(titles_list_obj[i])
    
                if(titles_list_obj[i].node.id == obj.node.id) {//Adds the node's children to the list
    
                    if(obj.show_children == false) {
                            console.log("Legger til barn")
                            obj.node.children.forEach((node) => {
                                let newElement = {node: node, show_title: false, show_children: false}
                                new_titles_list_obj.push(newElement)
                            })
                            titles_list_obj[i].show_children = true;
    
                        } else { //Removes the node's children
                            console.log("Fjerner barna")
                            titles_list_obj[i].show_children = false;
                            i++;
                            while(i < titles_list_obj.length){
                                if (titles_list_obj[i].node.parent.id == obj.node.id) {
                                    console.log("Legger ikke til " + titles_list_obj[i].node.overskrift + " i listen")
                                    i++;
    
                                } else {
                                    break
                                }
                            }
                            i--
                        }
                    
                }
            }
            titles_list_obj = new_titles_list_obj
            console.log(titles_list_obj)
        }
    }

</script>

<div class="main">
    <h2>
        Overskrifter
    </h2>
    {#if searched_titles.length == 0}
        <div>Ingen overskrifter</div>
    {:else}
    
        {#each titles_list_obj as elementObj}
            {#if elementObj.show_title}
                <div style="font-weight: bold">{(elementObj.node.object.date.toDateString() + ": " + elementObj.node.object.title)} </div>
            {/if}
            <div class="title" on:click={() => show_children(elementObj)}> {elementObj.node.format_string()} </div>
            
        {/each} 
    {/if}
 

</div>

<style>
    .main{
        height: 100%;
        overflow-y: scroll;
    }

    .title{
        cursor: pointer;
    }

    .title:hover{
        color:#d43838;
    }

</style>