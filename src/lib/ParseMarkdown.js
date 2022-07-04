import { MarkdownNode, Tree } from './MarkdownTree';
import { DocumentObject } from './document';

export class ParseMarkdown{
    idCounter = 1;
    constructor() {
        this.tree = new Tree();
    }

    parseAndSetIntoTree(object){
    
        let content = object.context;
        let substring = "";
        let markdownCode = "";
        let overskrift = "";
        let newNode;
        let level;
        let started = false

        let indeks = 0;
        while(indeks < content.length) {
            let char = content.charAt(indeks);
    
            if (char == "#") {
                if (substring != "" && started) {
                    overskrift = markdownCode.concat(overskrift);
                    newNode = new MarkdownNode(this.idCounter++, overskrift, substring, level, object);
                    newNode.printNode(newNode)
                    this.tree.insert(newNode);
                }
                started = true;

                markdownCode = "#";
                indeks++;
                while (content.charAt[indeks] == "#") {
                    markdownCode = markdownCode + "#";
                    indeks++;
                }

                if (markdownCode == "#") { //Overskrift 1
                    level = 1;
                } else if (markdownCode == "##") { //Overskrift 2
                    level = 2;
                    
                } else if (markdownCode == "###") { //Overskrift 3
                    level = 3;
    
                } else if (markdownCode == "####") { //Overskrift 4
                    level = 4;
    
                } else if (markdownCode == "#####") { //Overskrift 5
                    level = 5;
    
                } else if (markdownCode == "######") { //Overskrift 6
                    level = 6;
                }

                let char = content.charAt(indeks);

                while (char != "\n") {
                    overskrift += char;
                    indeks++;
                    char = content.charAt(indeks);
                }
                overskrift += char;
                indeks++;
                substring = ""; //Registrerer teksten som følger fram til neste #
            } else {
                substring += char; //Legger til den neste bokstaven
                indeks++;
            }
        }

        if (substring != "") {
            newNode = new MarkdownNode(this.idCounter++, markdownCode, substring, )
        }
    }
}