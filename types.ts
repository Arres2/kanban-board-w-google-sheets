export type Id = string | number;

export type Column = {
    id:Id;
    title:string;
}

export type Lead = {
    Id: Id;
    columnId:Id|null;
    Agendacion: string|null;
    Closer: string|null;
    Status: string|null;
    Email: string|null;
    UTM_Campaign:string|null;
    UTM_Content:string|null;
    UTM_Medium:string|null;
    UTM_Source:string|null;
    UTM_Term:string|null;
}