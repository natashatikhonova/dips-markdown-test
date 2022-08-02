

export class DocumentObject{
    constructor(id, date, context, title, readable){
        this.id = id;
        this.date = new Date(date);
        this.context = context;
        this.title = title;
        this.readable = readable;
        this.author = "Dr.Who";
        this.markdownTree = null;
        //Sorting on titles
        this.temp_filtered_context = "" 
        
     
    }
}
