import {ItemMsg, BaseMsg} from './common.msg';
import { ProductItem } from './pedidos.msg';

export class CatalogoMsg extends BaseMsg {
    ListGenero: ItemMsg[];
    FechaCatalogo: Date;
    ListProductoPedido: ProductItem[];
}
