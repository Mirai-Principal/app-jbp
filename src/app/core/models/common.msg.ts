
export class BaseMsg {
    Error: string;
}

export class ItemMsg {
    Id: number;
    Cod: string;
    Nombre: string;
}
export class ItemCodeMsg {
    Code: string;
    Name: string;
}
export class SavedME extends BaseMsg {
    Saved: boolean;
}
export class ListMe<T> extends BaseMsg {
    List: Array<T>;
    constructor() {
        super();
        this.List = [];
    }
}
export enum eTypeLog {
    None,
    Catalogo,
    Error,
    Info,
    Advertencia,
    Guardado
}
export class LogMsg {
    date: string;
    type: eTypeLog;
    msg: string;
    icon: string;
    iconClass: string;
}
export class StatusMsg {
    date: string;
    msg: string;
    msgColor: string;
}
