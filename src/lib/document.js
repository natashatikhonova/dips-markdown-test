export class DocumentObject{
    constructor(id, date, context, title, readable){
        this.id = id;
        this.title = title;
        this.date = new Date(date);
        this.author = "Dr.Who";
        this.context = context;
        this.readable =readable
        this.markdownTree = null;
        this.temp_filtered_context = "" //Her må vi legge til midlertidig context når vi sorterer etter overskrifter/avsnitt
        //Når vi redigerer så skal dermed hele dokumentet havne i editoren (this.context)
    }
}
