export interface UsuarioSap {
  InternalKey: number;
  UserCode: string;
  UserName: string;
  Locked: 'tNO' | 'tYES' | string;
  LastLogoutDate: string | null;
}

export interface UsuariosSapOData {
  '@odata.context'?: string;
  '@odata.nextLink'?: string;
  value: UsuarioSap[];
}

export interface UsuariosSapResponse {
  message: string;
  data: UsuariosSapOData;
}
