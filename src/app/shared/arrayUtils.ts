import { Injectable } from '@angular/core';
import { StringUtils } from './stringUtils';

@Injectable()
export class ArrayUtils {
    static contieneTokens(texto: string, matrixToken: string[]) {
        if (texto) {
            texto = texto.toLocaleLowerCase();
            texto = StringUtils.quitarTildes(texto);
        }
        for (let token of matrixToken) {
            if (token) {
                token = token.toLowerCase();
                token = StringUtils.quitarTildes(token);
            }
            if (!texto.includes(token)) {
                return false;
            }
        }
        return true;
    }
    static OrderByLastFirst(me: any[]): any[] {
        if (me != null && me.length > 1) {
            const tmpMe = Array.from(me); // se copia para no vaciar el objeto me
            const tmp: any[] = [];
            while (tmpMe.length > 0) {
                tmp.push(tmpMe.pop());
            }
            return tmp;
        }
        return me;
    }
}
