
export interface LoginMsg {
    user: string;
    pwd: string;
}
export interface RespAuthMsg {
    IdUsuario?: number;
    Nombre?: string;
    Perfiles?: string[];
    correo?: string;
    UserName?: string;
    GruposDirectorioActivo?: string[];
}
