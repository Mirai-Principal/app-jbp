export enum MessageType {
    info = "info",
    warning = "warning",
    error = "error"
}
export class AlertMsg {
    private tipo: MessageType;
    messageTitle: string;
    headerColor: string;
    message: string;
    iconString: string;

    constructor(msg: string, tipo: MessageType = MessageType.info) {
        this.message = msg;
        this.tipo = tipo;
        this.messageTitle = this.getMessageTitle(tipo);
        this.headerColor = this.getHeaderColor(tipo);
        this.iconString = this.getIconString(tipo);
    }

    private getMessageTitle(tipo: MessageType): string {
        switch (tipo) {
            case MessageType.info:
                return 'Información';
            case MessageType.warning:
                return 'Advertencia';
            case MessageType.error:
                return 'Error';
            default:
                return 'Información';
        }
    }

    private getHeaderColor(tipo: MessageType): string {
        switch (tipo) {
            case MessageType.info:
                return '#009dff';
            case MessageType.warning:
                return '#ffae00';
            case MessageType.error:
                return 'darkred';
            default:
                return '#009dff';
        }
    }

    private getIconString(tipo: MessageType): string {
        switch (tipo) {
            case MessageType.info:
                return MessageType.info;
            case MessageType.warning:
                return MessageType.warning;
            case MessageType.error:
                return MessageType.error;
            default:
                return MessageType.info;
        }
    }
}
