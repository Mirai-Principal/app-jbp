
export interface LoginMsg {
    User: string;
    Pwd: string;
}
export interface RespAuthMsg {
    IdUsuario: number;
    Nombre: string;
    Perfiles: string[];
    correo: string;
    UserName: string;
    GruposDirectorioActivo: string[];
}
