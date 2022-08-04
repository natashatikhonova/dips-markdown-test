import { MarkdownNode, Tree } from './MarkdownTree';

export class ParseMarkdown{
    idCounter = 1;
    

    parseAndSetIntoTree(object){
        this.tree = new Tree(object);
        let content = object.context;
        let substring = "";
        let markdownCode = "";
        let title = "";
        let newNode;
        let prevNode = this.tree.root;
        let possible_parent = null;
        let started = false

        let indeks = 0;
        while(indeks < content.length) {
            let char = content.charAt(indeks);

    
            if (char == "#") {
                if (started) {;
                    // console.log(markdownCode)
                    // console.log(title)

                    newNode = new MarkdownNode(this.idCounter++, markdownCode, title, substring, object);
     
                    // newNode.printNode(newNode)
                    this.tree.insert(possible_parent, newNode);
                    prevNode = newNode;
                }
                title = ""
                substring = ""
            
                markdownCode = "#";
                indeks++;
                //Lagrer alle hashtaggen i markdownCode variabelen
                while (content.charAt(indeks) == "#") {
                    // console.log(content.charAt(indeks))
                    markdownCode = markdownCode + "#" ;
                    indeks++;
                }
         
                //Finner parentnoden til neste node som skal settes inn
                possible_parent = prevNode
                while( markdownCode.length <= possible_parent.markdownCode.length ){ //Hvis denne markdowntaggen er mindre (større title) så fortsetter vi opp i treet til vi har funnet en parent som har mindre tag (større title). Roten har en tom streng som vil si at den har mindre tag enn alle andre markdown noder
                    possible_parent = possible_parent.parent;
                }
            
       
                let char = content.charAt(indeks);
                if (char == " ") { //Må være mellomrom etter markdownkoden
                    while (char != "\n") {
                        title += char;
                        indeks++;
                        char = content.charAt(indeks);
                        console.log("newLine check")
                    }
                    title += char;
                    indeks++;
                    // console.log("title: " + title)
                
                    started = true;
                } else {
                    started = false;
                }
            } else { //Registrerer teksten som følger fram til neste #
                // console.log("Substring: " + substring)
                substring += char; //Legger til den neste bokstaven
                indeks++;
            }
        }

        if (started) { //Legger til den siste noden
         
            newNode = new MarkdownNode(this.idCounter++, markdownCode, title, substring, object)

            this.tree.insert(possible_parent, newNode)
            // newNode.printNode(newNode)
        }
        return this.tree
    }
}