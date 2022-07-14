export class DocumentObject{
    constructor(id, date, context, title, readable){
        this.id = id;
        this.date = new Date(date);
        this.context = context;
        this.title = title;
        this.readable = readable;
        this.author = "Dr.Who";
        this.markdownTree = null;
        this.temp_filtered_context = "" //Her må vi legge til midlertidig context når vi sorterer etter overskrifter/avsnitt
        //Når vi redigerer så skal dermed hele dokumentet havne i editoren (this.context)
    }
}
