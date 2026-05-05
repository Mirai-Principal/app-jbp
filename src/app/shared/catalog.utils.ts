import { Injectable } from '@angular/core';
import { CatalogoMsg } from '../core/models/catalogo.msg';
import { eTipoStorage } from '../core/models/enums.msg';


@Injectable({
    providedIn: 'root'
})
export class CatalogUtils {
    private _catalog!: CatalogoMsg;
    get catalog() {
        if (!this._catalog) {
            const cacheCatalog = localStorage.getItem(eTipoStorage.Catalogo.toString());
            if (cacheCatalog) {
                this._catalog = <CatalogoMsg>JSON.parse(cacheCatalog);
            }
        }
        return this._catalog;
    }
    set catalog(me: CatalogoMsg) {
        this._catalog = me;
        localStorage.setItem(eTipoStorage.Catalogo.toString(), JSON.stringify(me));
    }
}
