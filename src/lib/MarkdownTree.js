

export class MarkdownNode{
    constructor(id, markdownCode, overskrift, content, object){
        this.id = id;
        this.markdownCode = markdownCode;
        this.overskrift = overskrift;
        this.content = content;
        this.level = 0; //Hvilket nivå i treet/ settes når den blir satt inn i treet
        this.parent = null; 
        this.children = [];
        this.object = object;
    }

    isLeaf(){
        return this.children.length == 0;
    }
    is_parent_of(node){
        for (let i = 0; i < this.children.length; i++) {
            if ((this.children[i].id == node.id) && (this.children[i].object.id == node.object.id)) return true;
        }
        return false;
    }

    format_string(){
        let string = "";
        for(let i = 0; i < this.markdownCode.length; i++){
            string += "-"
        }
        string += " " + this.overskrift
        return string
    }
 
    printNode(node){
        console.log("\nNODEN: ")
        console.log("id: " + node.id)
        console.log("Overskrift: " + node.overskrift)
        console.log("Content: " + node.content)
        console.log("Level: " + node.level)
        console.log("\n")
    }

}
class Queue {
    constructor() {
        this.items = [];
    }
    
    // add element to the queue
    enqueue(element) {
        return this.items.push(element);
    }
    
    // remove element from the queue
    dequeue() {
        if(this.items.length > 0) {
            return this.items.shift();
        }
    }
    
    // view the last element
    peek() {
        return this.items[this.items.length - 1];
    }
    
    // check if the queue is empty
    isEmpty(){
    return this.items.length == 0;
    }

    // the size of the queue
    size(){
        return this.items.length;
    }

    // empty the queue
    clear(){
        this.items = [];
    }
}

export class Tree {
    
    constructor(object){
        this.root = new MarkdownNode(0, "", "Root", "", object)
        this.queue_read = [] //The order of witch the nodes were inserted
        
    }
    insert(parent, newNode) { 
        newNode.level = parent.level+1;
        parent.children.push(newNode)
        newNode.parent = parent; 
        this.queue_read.push(newNode)
    }
    get_nodes_in_order(){
        return this.queue_read
    }
    // program to implement queue data structure

    // traverseBFS() {
    //     //if there is no root, return false
    //     if (!this.root) {
    //       return [];
    //     }
    //     //start a new Queue
    //     let queue = new Queue();
    //     //keep a tally of all values in the tree
    //     let treeValues = [];
    //     //add root to queue
    //     queue.enqueue(this.root);
    //     //while queue is not empty
    //     while (queue.size() !== 0) {
    //       //get TreeNode Children
    //       let nodeChildren = queue.items[0].children;
    //       //if node has children, loop and add each to queue
    //       if (nodeChildren.length !== 0) {
    //         nodeChildren.forEach(child => queue.enqueue(child));
    //       }
    //       //push the first item in the queue to the tree values
    //       treeValues.push(queue.items[0]);
    //       //remove first node from queue
    //       queue.dequeue();
    //     }
    //     //return values, should be all TreeNodes
    //     return treeValues;
    // }
    
    indent = 1;
    print_tree(tree) {
        tree.forEach((node) => {
            console.log('--' + Array(this.indent).join('--'), node.overskrift);
            if(node.children) {
                this.indent ++;
                this.print_tree(node.children);
            }
            if(tree.indexOf(node) === tree.length - 1) {
                this.indent--;
            }
        })
    }
}

