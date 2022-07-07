export class DocumentObject{
    constructor(id, date, context){
        this.id = id;
        this.title = "Dokument";
        this.date = new Date(date);
        this.author = "Dr.Who";
        this.context = context;
        this.markdownTree = null;
    }
}