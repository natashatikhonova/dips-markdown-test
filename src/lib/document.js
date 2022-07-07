export class DocumentObject{
    constructor(id, date, context, title){
        this.id = id;
        this.title = title;
        this.date = new Date(date);
        this.author = "Dr.Who";
        this.context = context;
        this.markdownTree = null;
    }
}