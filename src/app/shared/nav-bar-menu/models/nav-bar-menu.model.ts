export interface MenuItem {
    name: string;
    icon: string;
    url?: string;
    children?: MenuItem[];
    visible?: boolean;
    external?: boolean;
    download?: boolean;
}