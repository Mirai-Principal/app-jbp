export enum MessageType {
    info,
    warning,
    error
}
export class AlertMsg {
    private _tipo: MessageType;
    messageTitle: string;
    headerColor: string;
    message: string;
    iconString: string;
    //#region Properties
    get tipo(): MessageType {
        return this._tipo;
    }
    set tipo(me: MessageType) {
        this._tipo = me;
        switch (me) {
            case MessageType.info:
                this.headerColor = '#009dff';
                this.messageTitle = 'Información';
                this.iconString = 'info';
                break;
            case MessageType.warning:
                this.headerColor = '#ffae00';
                this.messageTitle = 'Advertencia';
                this.iconString = 'warning';
                break;
            case MessageType.error:
                this.headerColor = 'darkred';
                this.messageTitle = 'Error';
                this.iconString = 'error';
                break;
        }
    }
    //#endregion
    constructor(msg, tipo = MessageType.info) {
        this.message = msg;
        this.tipo = tipo;
    }
}
