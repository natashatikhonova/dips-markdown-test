

export class MarkdownNode{
    constructor(id, markdownCode, overskrift, content, object){
        this.id = id;
        this.markdownCode = markdownCode;
        this.overskrift = overskrift.trim().replace(/[&\/\\#^+()$~%.'":*?<>{}!@]/g, '') ;
        this.content = content;
        this.level = 0; //Hvilket nivå i treet/ settes når den blir satt inn i treet
        this.parent = null; 
        this.children = [];
        this.object = object;
    }
    compare(cmp_node){
        return ( (cmp_node.id == this.id) && (cmp_node.object.id == this.object.id))
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

    get_nodes_in_order(startNode){ //Gets the nodes in order from wich they were read from file, starting from a startNode. Or if startNode is null, it is starting from the root
        let indeks_in_queue = -1;

        if (startNode == null) return this.queue_read

       for (let i = 0; i < this.queue_read.length; i++){
            if (this.queue_read[i].compare(startNode)) {
                indeks_in_queue = i;
                break;
            }
       }
       if (indeks_in_queue == -1) {
            return []
       }
       let queue_read_from_startNode = this.queue_read.slice(indeks_in_queue, this.queue_read.length)
    //    console.log("New queue:")
    //    console.log(queue_read_from_startNode)
    //    console.log("Old queue")
    //    console.log(this.queue_read)

        return queue_read_from_startNode
    }
    get_text_under(startNode){ //Gets the text from this node and the nodes under this headline

        let markdown_headline_length = startNode.markdownCode.length
        let nodes = this.get_nodes_in_order(startNode)

        let string = (startNode.markdownCode + " " + startNode.overskrift + "\n" + startNode.content + "\n")
        for (let i = 1; i < nodes.length; i++) {
            if (nodes[i].markdownCode.length > markdown_headline_length)
            string += (nodes[i].markdownCode + " " + nodes[i].overskrift + "\n" + nodes[i].content + "\n")
        }
        console.log(string)
        return string;
    }
   
    
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

