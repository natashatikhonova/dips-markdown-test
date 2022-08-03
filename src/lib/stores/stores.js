
import { writable } from "svelte/store";

import { Editor } from 'typewriter-editor';

export const currentDocumentObject = writable();

export let documentList=writable([]);

export const editor = new Editor();

export let currentlyAddingNewNote = writable(false);

export let currentlyEditingNote = writable(false);

export let showSideView = writable(true)

// let parseMarkdown = new ParseMarkdown();
// export let parse = writable(parseMarkdown);

export const selectedDocumentList=writable([]);
export let allfilterOff = writable(false);
export let documentTypes = ["Epikrise","hehehe", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Røntgen bilde", "typ1", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10", "typ11", "typ12", "typ13", "typ14", "typ1", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10", "typ11", "typ12", "typ13", "typ14"].sort();
let copyDocumentTypes = documentTypes.slice()
export let current_doctype_filtergroup = writable({id: -1, name: "", filters: copyDocumentTypes});
export let doctype_filter_groups = writable([
    {id: 1, name: "Filter 1", filters: ["Epikrise"]},
    {id: 2, name: "Sindres filter", filters: ["Lab", "Sykepleier notat", "Rutinekontroll"]},
    {id: 3, name: "Natashas filter", filters: ["Epikrise", "Poliklinisk notat", "Lab", "Rutinekontroll"]},
    {id: 4, name: "Torkilds filter", filters: ["Epikrise", "Lab", "Rutinekontroll"]},
    {id: 5, name: "Thors filter", filters: ["Lab"]}
]);

// export let all_markdown_titles = writable([]) //in diffrent object wich depends on name 
export let checked_titles_filters = writable([]) //checked filters on title on form: {title: title, nodes: [..], checked: true }

export let searchValue = writable("")
export let amount_searched_words = writable(0)


export let showTitles = writable(false)

export let showFiltermenu = writable(false)

export let searchResult = writable([])

export let selected_line_height = writable("1.5")

export let selected_text_size = writable(11)

export function findNewDocumentObjId(){
    let documentListCpy = []
    const unsubscribe4 = documentList.subscribe(value => {
        documentListCpy = value
    })
    unsubscribe4()
    let ids = []
    documentListCpy.forEach(docType => (ids.push(docType.id)))
    let num = 1;
    while(ids.includes(num)){
        num += 1;
    }
    return num;
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
function find_placement_among_nodes(nodes_list, node){

    for(let i = 0; i < nodes_list.length; i++){
        if (is_in_subtree(nodes_list[i], node)){
            //old node is over the new node
            return -1 //not adding to list because the parent node will show this node
        } else if (is_in_subtree(node, nodes_list[i])) {
            //new node is over the old node
            return i; //replace the allready added node with this new node, beause the new node wil show the old node's context
        }
    }
    return -2 //add into list. is sibling to all the other title nodes
}


let ascendingOrder = true;
const sortDate = (colHeader, sortData) => {
    let sortedData = sortData.sort((obj1, obj2) => {
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
    ascendingOrder = !ascendingOrder;
    return sortedData;
}



export function set_filtered_text(checked_titles){
    let obj_list = checked_titles
    // const unsubscribe = checked_titles_filters.subscribe(value => {
    //     //Sets obj_list to all the checked_titles_filters
    //     obj_list = value
    // })
    // unsubscribe()

    let selected_titles_objects = []
    //Loop through the whole documentList and sets the filtered text to empty string

    obj_list.forEach((item)=>{
        // console.log("\n\n                      selected_titles_objects:")
        // selected_titles_objects.forEach((obj)=>{
        //     console.dir(obj.docObject)
        //     obj.nodes.forEach((node)=>{
        //         console.dir(node)

        //     })
        // })
        // console.log("\n\n")
        // console.log("\n\mSer på objekt i listen:")
        // console.log(item)
        // console.log("Looper gjennom nodene under denne titleen")
        item.nodes.forEach((node)=> {
            
            // console.log("\nSer på node:")
            // console.log(node)
            let index = -1

            for (let i = 0; i < selected_titles_objects.length; i++) { 
                //check if document have been created
                if (selected_titles_objects[i].docObject.id == node.object.id) { 
                    //If they belong to the same object
                    index = i;
                    break;
                }
            }
            
            if (index != -1){ 
                //found an object with the same documentObject as node on index <index> in selected_titles_object[index]
                // console.log("fant objektet: " + selected_titles_objects[index].docObject.title + " med samme dokumentObjekt")
                // console.log("plasserer på rikitg plass blant nodes inn i rikitg i objektet som er på formen {docObject: .., nodes: [..]}")

                let nodes_index = find_placement_among_nodes(selected_titles_objects[index].nodes, node)
                if (nodes_index > -1){ 
                    //Found a node in the subtree of node in the list selected_titles_objects[index].nodes on index <nodes_index>
                    //Therefore, Replaces selected_titles_objects[index].nodes[nodes_index] with node b
                    // console.log("erstatter gammel node med ny node på indeks " + nodes_index)
                    selected_titles_objects[index].nodes[nodes_index] = node
                    let subtree = node.object.markdownTree.get_subtree(node)
                    // console.log("               Subtree:")
                    // console.log(subtree)
                    // console.log("\n\n                      Looper gjennom listen for å fjerne:")
                    // selected_titles_objects.forEach((obj)=>{
                    //     console.dir(obj.docObject)
                    //     obj.nodes.forEach((node)=>{
                    //         console.dir(node)
                
                    //     })
                    // })
                    // console.log("\n\n")
                    //Fjerner eventuelt de andre nodene som er i subtreet av den nye noden som ble satt inn 
                    let new_nodes_list = [] //new node list that only contain one node from each subtree, wich is the highest node in each subtree. Does only need this for showing the context later
                    for (let i = nodes_index; i < selected_titles_objects[index].nodes.length; i++){
                        if (!is_in_subtree(node, selected_titles_objects[index].nodes[i])){
                            // console.log("Legger til noden " + selected_titles_objects[index].nodes[i].title + " i nodes listen")
                            // console.log(selected_titles_objects[index].nodes[i])
                            new_nodes_list.push(selected_titles_objects[index].nodes[i])
                        } else {
                            // console.log("Fjerner noden " + selected_titles_objects[index].nodes[i].title + " i nodes listen")
                        }
                    }
                    selected_titles_objects[index].nodes = new_nodes_list


                } else if ( nodes_index == -2) {
                    //The node is a sibling to the ther nodes
                    //Finds the rigth placement among the nodes in comparison to the original document
                    let nodes_document_order = selected_titles_objects[index].docObject.markdownTree.get_nodes_in_order()
                    // console.log("               Nodes_in_order in current documentObject:")
                    // console.log(nodes_document_order)
                    let node_index = nodes_document_order.map(function(e) { return e.id; }).indexOf(node.id); //Index among all title nodes in the document
            

                    let inserted_bool = false
                    for (let i = 0; i < selected_titles_objects[index].nodes.length; i++){
                        let cmpNode = selected_titles_objects[index].nodes[i]
                        let tempIndex = nodes_document_order.map(function(e) { return e.id; }).indexOf(cmpNode.id);
                        if (tempIndex > node_index) {
                            //place in selected_titles_objects[index].nodes list before cmpNode
                           
                            selected_titles_objects[index].nodes.splice(i, 0, node)
                            // console.log("Satt " + node.title + " inn på index " + i )
                            inserted_bool = true
                            break
                        }
                    }
                    if (inserted_bool == false) {
                        // console.log("Satt " + node.title + " inn på slutten" )
                        selected_titles_objects[index].nodes.push(node)
                    }

                }

            } else { 
                // console.log("fant ingen tidligere objekter i selected_titles_objects med samme dokument objekt")
                // console.log("Legger til noden i nodes i objektet med samme dokumentObjekt")
                selected_titles_objects.push({docObject: node.object, nodes: [node]})
            }
            // console.log("\n\n                      selected_titles_objects:")
            // selected_titles_objects.forEach((obj)=>{
            //     console.dir(obj.docObject)
            //     obj.nodes.forEach((node)=>{
            //         console.dir(node)

            //     })
            // })
            // console.log("\n\n")
        })
    })
    // console.log("\n\n                      selected_titles_objects:")
    // selected_titles_objects.forEach((obj)=>{
    //     console.dir(obj.docObject)
    //     obj.nodes.forEach((node)=>{
    //         console.dir(node)

    //     })
    // })
    // console.log("\n\n")
    // console.log("Setter sammen teksten i noder til å bli temp_filtered_context")
    let new_documentObj_list = []
    for (let i = 0; i < selected_titles_objects.length; i++){
        new_documentObj_list.push(selected_titles_objects[i].docObject)
        selected_titles_objects[i].docObject.temp_filtered_context = ""
        for (let j = 0; j < selected_titles_objects[i].nodes.length; j++){
            let node = selected_titles_objects[i].nodes[j]
            selected_titles_objects[i].docObject.temp_filtered_context += selected_titles_objects[i].docObject.markdownTree.get_text_under(node)

        }
        // console.log("Temp_filtered_context:")
        // console.log(selected_titles_objects[i].docObject.temp_filtered_context)
    }
    ascendingOrder = true
    sortDate("date", new_documentObj_list);
    // console.log(selected_title_objected)
    return new_documentObj_list
}

    //load all title nodes to variables
    export function load_markdownNodes(chosen_documents, oldObjList, checked_titles) {
        // console.log("Load markdown nodes")
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
        //     $all_markdown_titles.push({title: original_titles_list_obj[i].title, nodes: original_titles_list_obj[i].nodes})
        
        // }
       titles_nodes = sortByString(titles_nodes)
       return titles_nodes
}

    //sorts alphabetically
    const sortByString = (list) => {

        let sortedData = list.sort((obj1, obj2) => {
            if (obj1.title < obj2.title) {
                    return -1;
            } else if (obj1.title > obj2.title) {
                return 1;
            }
            return 0; //string code values are equal		
        });

       
        return sortedData
    }



    //creates a list of objects on the form [{title: .., nodes: [..], checked: true/false},..] from a list of nodes [..node]
    //The checked value in each object is based on the checked_titles parameter
    function make_titles_obj_list(node_list, oldObjList, checked_titles){
       let obj_list = []

       for (let i = 0; i<node_list.length; i++){
           let new_element = {}
           let node = node_list[i]
           let found = false;
           for (let j= 0; j<obj_list.length; j++){
               if(obj_list[j].title == node.title){
                   obj_list[j].nodes.push(node)
                   found = true
                   break;
               }
           }
           if (!found){
               if (oldObjList.length == 0) { 
                    //First time
                    if (is_checked(node.title, checked_titles)){
                        new_element = {title: node.title, nodes: [node], checked: true }
                    } else {
                        new_element = {title: node.title, nodes: [node], checked: false }

                    }

               } else { 
                    //Check if the node is checked in original_titles_obj_list
                   let found_in_list = false
                   for (let i = 0; i < oldObjList.length; i++) {
                       if (node.title == oldObjList[i].title) {
                           if (oldObjList[i].checked) {
                               new_element = {title: node.title, nodes: [node], checked: true }
                               found_in_list = true
                           } 
                           break;
                       }
                   }
                   if (!found_in_list){
                       new_element = {title: node.title, nodes: [node], checked: false }
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
        if (checked_titles[i].title == title) {
            bool = true
            break
        }
    }

    return bool
   }



