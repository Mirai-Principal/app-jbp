export interface producto {
    TreeCode: string;
    ProductDescription: string;
}

export interface listaMateriales {
    message: string,
    data: {
        TreeCode: string;
        ProductDescription: string;
        U_JB_APROBADO_ASUNTOS_REGULATORIOS: string;
        Warehouse: string;
        Quantity: number;
        materiales: ProductTreeLines[];
        etapas: ProductTreeStages[];
    },
}

export interface ProductTreeLines {
    ItemCode: string;
    ParentItem: string;
    ItemName: string;
    Quantity: number;
    Warehouse: string;
    ChildNum?: number;
}

export interface ProductTreeStages {
    Father: string;
    Name: string;
    Sequence: number;
}

//materiales o componentes necesarios para la fabricacion de un producto
export interface Item {
    ItemCode: string;
    ItemName: string;
    InventoryUOM?: string;
    Uom?: string;
    DefaultWarehouse?: string;
    ItemType?: string;
    OnHand?: number;
    IsCommited?: number;
    Available?: number;
}