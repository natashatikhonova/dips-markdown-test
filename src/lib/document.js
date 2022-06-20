export class DocumentObject{
    constructor(title, date, author, context){
        this.title = title;
        this.date = new Date(date);
        this.author = author;
        this.context = context;
        this.chosen = false;
    }
}