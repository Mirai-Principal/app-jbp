import { Observable } from 'rxjs';

export type KeyOrAccessor<T, R = any> = keyof T | ((item: T) => R);

export type BuscadorSearchFn<T = any> = (term: string) => Observable<T[] | any>;
