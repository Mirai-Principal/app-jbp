import { FormControl } from "@angular/forms";

export interface RespAuthMsg {
  IdUsuario: number;
  Nombre: string;
  Perfiles: string[];
  correo: string;
  UserName: string;
  GruposDirectorioActivo: string[];
}

export interface LoginData {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}