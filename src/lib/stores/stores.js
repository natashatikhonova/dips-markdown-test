import { onDestroy } from "svelte";
import { writable } from "svelte/store";

import { Editor } from 'typewriter-editor';

export const currentDocumentObject = writable();

export const documentList=writable([]);

export const editor = new Editor();

export let currentlyAddingNewNote = writable(false);

export let currentlyEditingNote = writable(false);

export let showSideView = writable(true)

// let parseMarkdown = new ParseMarkdown();
// export let parse = writable(parseMarkdown);

export const selectedDocumentList=writable([]);
export let documentTypes = ["Epikrise","hehehe", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Røntgen bilde", "typ1", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10", "typ11", "typ12", "typ13", "typ14", "typ1", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10", "typ11", "typ12", "typ13", "typ14"].sort();
let copyDocumentTypes = documentTypes.slice()
export let nofilter = writable({id: 0, name: "Alle", filters: copyDocumentTypes}); //default
export let allfilterOff = writable(false);

export let current_doctype_filtergroup = writable({id: -1, name: "", filters: copyDocumentTypes});
export let doctype_filter_groups = writable([
    {id: 1, name: "Filter 1", filters: ["Epikrise"]},
    {id: 2, name: "Sindres filter", filters: ["Lab", "Sykepleier notat", "Rutinekontroll"]},
    {id: 3, name: "Natashas filter", filters: ["Epikrise", "Poliklinisk notat", "Lab", "Rutinekontroll"]},
    {id: 4, name: "Torkilds filter", filters: ["Epikrise", "Lab", "Rutinekontroll"]},
    {id: 5, name: "Thors filter", filters: ["Lab"]}
]);

export let all_markdown_titles = writable([]) //in diffrent object wich depends on name 
export let checked_titles_filters = writable([]) //checked filters on title on form: {overskrift: overskrift, nodes: [..], checked: true }

export let searchValue = writable("")
export let amount_searched_words = writable(0)


export let showTitles = writable(false)

export let showFiltermenu = writable(false)

export let searchResult = writable([])

export let selected_line_height = writable("1.5")

export let selected_text_size = writable(11)

function nodeList_to_documentObjList(node_list) {

    let documentObj_list = []
    for (let i = 0; i <node_list.length; i++){
        documentObj_list[i] = node_list[i].object
    }
    return documentObj_list
}

function is_in_subtree(to_node, add_node){

    let subtree = to_node.object.markdownTree.get_subtree(to_node)
    for(let i = 0; i < subtree.length; i++) {
        let check_node = subtree[i]
        if (check_node.compare(add_node)) {
            return true; //add_node is in subtree of to_node
        }
    }
    return false; //add_node is not in subtree of to_node
}

export function set_filtered_text(){
    console.log("Starten av set_filtered_text()")
    let obj_list = []
    const unsubscribe = checked_titles_filters.subscribe(value => {
        obj_list = value
        console.log("subscribe checked_titles_filters")
    })
    onDestroy(unsubscribe)
    let selected_titles_nodes_List = []
    //Loop through the whole documentList and sets the filtered text to empty string
    
    obj_list.forEach((item)=>{

        item.nodes.forEach((node)=> {
            
            let indeks = -1

            for (let i = 0; i < selected_titles_nodes_List.length; i++) { 
                //check if document have been created
                if (selected_titles_nodes_List[i].object.id == node.object.id) { 
                    //If they belong to the same object
                    indeks = i;
                    break;
                }
            }
            if (indeks != -1){ 
                if (!is_in_subtree(selected_titles_nodes_List[indeks], node)){ //sets node in this place instead
                    if (is_in_subtree(node, selected_titles_nodes_List[indeks])) { //if node is over in the tree
                        node.object.temp_filtered_context = node.object.markdownTree.get_text_under(node)
                        console.log("Satt temp_filtered_text: " + node.object.temp_filtered_context)
                        selected_titles_nodes_List[indeks] = node;
                    } else { 
                        //if they are in the same tree
                        if (node.object.temp_filtered_context == "" ){

                            node.object.temp_filtered_context =  selected_titles_nodes_List[indeks].object.markdownTree.get_text_under(selected_titles_nodes_List[indeks]) + "\n" + node.object.markdownTree.get_text_under(node)
                            console.log("Satt temp_filtered_text: " + node.object.temp_filtered_context)
                        } else {
                            node.object.temp_filtered_context +=  "\n" +  node.object.markdownTree.get_text_under(node)
                            console.log("Satt temp_filtered_text: " + node.object.temp_filtered_context)
                            
                        }
                        selected_titles_nodes_List[indeks] = node;
                    }
                } 

            } else { 
                //Set the variable temp_filtered_context i objectet til teksten som skal vises
                node.object.temp_filtered_context = node.object.markdownTree.get_text_under(node)
                console.log("Satt temp_filtered_text: " + node.object.temp_filtered_context)
                selected_titles_nodes_List.push(node)
                console.log(node)
            }
        })
    })
    console.log(selected_titles_nodes_List)
    return nodeList_to_documentObjList(selected_titles_nodes_List)
}

    //load all title nodes to variables
    export function load_markdownNodes(chosen_documents, oldObjList, checked_titles) {
        console.log("Load markdown nodes")
        let all_nodes = [] 
        let searched_titles_nodes = []
        let titles_nodes = []
        chosen_documents.forEach((document) => {
            //Return the nodes in the same order as it was read from file
            let nodes_array = document.markdownTree.get_nodes_in_order() 
            nodes_array.forEach((node)=> {all_nodes.push(node)})
        }) 
        
        //All the nodes containing the searched_value
        searched_titles_nodes = all_nodes.filter(item => (item.id != 0));
        titles_nodes = make_titles_obj_list(searched_titles_nodes, oldObjList, checked_titles)
        
        // $all_markdown_titles = []
        // //copy some values to the store:
        // for (let i = 0 ; i<original_titles_list_obj.length; i++){
        //     $all_markdown_titles.push({overskrift: original_titles_list_obj[i].overskrift, nodes: original_titles_list_obj[i].nodes})
        
        // }
       titles_nodes = sortByString(titles_nodes)
       return titles_nodes
}

    //sorts alphabetically
    const sortByString = (list) => {

        let sortedData = list.sort((obj1, obj2) => {
            if (obj1.overskrift < obj2.overskrift) {
                    return -1;
            } else if (obj1.overskrift > obj2.overskrift) {
                return 1;
            }
            return 0; //string code values are equal		
        });

       
        return sortedData
    }



    //creates a list of objects from a list of nodes
    function make_titles_obj_list(node_list, oldObjList, checked_titles){
       let obj_list = []

       for (let i = 0; i<node_list.length; i++){
           let new_element = {}
           let node = node_list[i]
           let found = false;
           for (let j= 0; j<obj_list.length; j++){
               if(obj_list[j].overskrift == node.overskrift){
                   obj_list[j].nodes.push(node)
                   found = true
                   break;
               }
           }
           if (!found){
               if (oldObjList.length == 0) { 
                    //First time
                    if (is_checked(node.overskrift, checked_titles)){
                        new_element = {overskrift: node.overskrift, nodes: [node], checked: true }
                    } else {
                        new_element = {overskrift: node.overskrift, nodes: [node], checked: false }

                    }

               } else { 
                    //Check if the node is checked in original_titles_obj_list
                   let found_in_list = false
                   for (let i = 0; i < oldObjList.length; i++) {
                       if (node.overskrift == oldObjList[i].overskrift) {
                           if (oldObjList[i].checked) {
                               new_element = {overskrift: node.overskrift, nodes: [node], checked: true }
                               found_in_list = true
                           } 
                           break;
                       }
                   }
                   if (!found_in_list){
                       new_element = {overskrift: node.overskrift, nodes: [node], checked: false }
                   }
               }
               obj_list.push(new_element)
           }
       }
       return obj_list
   }

   
   function is_checked(title, checked_titles){
    let bool = false

    for (let i = 0; i < checked_titles.length; i++){
        if (checked_titles[i].overskrift == title) {
            bool = true
        }
    }

    return bool
   }



