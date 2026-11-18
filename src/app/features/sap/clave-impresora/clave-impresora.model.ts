export interface Respuesta {
  message: string;
  data?: {};
  resp?: number;
}

export interface ClaveImpresora{
  CODIGO: number,
  USERNAME: string,
  TIPO_IMPRESORA: string
}

export interface PaginatedClaveImpresoraResponse {
  total: number;
  pageIndex: number;
  pageSize: number;
  data: ClaveImpresora[];
}