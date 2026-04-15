import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlServices } from '../core/services/url.service';
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
                this._catalog = <CatalogoMsg> JSON.parse(cacheCatalog);
            }
        }
        return this._catalog;
    }
    set catalog(me: CatalogoMsg) {
        this._catalog = me;
        localStorage.setItem(eTipoStorage.Catalogo.toString(),  JSON.stringify(me));
    }
    constructor(
        private http: HttpClient,
        private urls: UrlServices,
    ) {}
    setCatalogFromBdd() {
        // this.http.get<CatalogoMsg>(this.urls.catalogoUrl).subscribe(resp => {
        //     this.catalog = resp;
        //     console.log('catalog arrived from server');
        // });
    }
    checkIfCatalogIsUpToDate () {
        // this.http.get<Date>(this.urls.fechaCatalogoUrl).subscribe(resp => {
        //     const fechaCatalogo = resp;
        //     console.log('catalog date from server: ' + fechaCatalogo);
        //     if (!this.catalog) {
        //         this.setCatalogFromBdd();
        //     } else {
        //         if (this.catalog && this.catalog.FechaCatalogo < fechaCatalogo) {
        //             console.log('order to update catalog from server');
        //             this.setCatalogFromBdd();
        //         }
        //     }
        // });
    }
}
