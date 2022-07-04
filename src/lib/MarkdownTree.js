import { DocumentObject } from "./document";

export class MarkdownNode{
    constructor(id, overskrift, content, level, documentObject){
        this.id = id;
        this.overskrft = overskrift;
        this.content = content;
        this.parent = null;
        this.level = level; //Overskrift <nummer>
        this.children = [];
        this.documentObject = documentObject;
    }
    isLeaf(){
        return this.children.length == 0;
    }
    printNode(node){
        console.log(node.id)
        console.log(node.overskrift)
        console.log(node.content)
        console.log(node.level)
        console.log(node.documentObject)


    }
}
export class Tree {
    contructor() {
        this.root = new MarkdownNode(0, "Root" , "", 0)
    }

    insert(newNode) {
        BFS(this.root, newNode)

    }
}

function BFS(node, newNode){
    let last_level_added_dummy = -1;
    let previousNode = node;
    let currentNode;
    let q = new Queue();
    let explored = new Set();

    q.enqueue(node);
    explored.add(node);

    // We'll continue till our queue gets empty
    while (!q.isEmpty()) {
        currentNode = q.dequeue();

        if (previousNode.level != currentNode.level){ //Går til et nytt nivå
            if (last_level_added_dummy != previousNode.level) {
                //lager dummyNode
                let dummyNode = new MarkdownNode(-1, "Dummy", "", previousNode.level, newNode.documentObject)
                //Setter inn i forrige nivå
                dummyNode.parent = previousNode.parent;
                previousNode.parent.children.push(dummyNode)
                last_level_added_dummy = previousNode.level;
            }
        }
        
        if ( (currentNode.level == newNode.level-1) && (currentNode.documentObject.id == newNode.documentObject.id) ) {
            if (currentNode.documentObject.id == newNode.documentObject.id){
                currentNode.children.push(newNode)
                newNode.parent = currentNode; //Setter current node til å være foreldrenoden til
                return;
            } 
        }

        console.log(currentNode);
  
        // 1. In the edges object, we search for nodes this node is directly connected to.
        // 2. We filter out the nodes that have already been explored.
        // 3. Then we mark each unexplored node as explored and add it to the queue.

        let notExplored = currentNode.children.filter(n => !explored.has(n));
        notExplored.forEach(n => {
           explored.add(n);
           q.enqueue(n);
        });
        previousNode = currentNode;

     }
}

// program to implement queue data structure

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