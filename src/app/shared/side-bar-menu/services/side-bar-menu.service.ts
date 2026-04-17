import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../models/side-bar-menu.model';

@Injectable({ providedIn: 'root' })
export class SidebarMenuService {

    private readonly _menu = signal<MenuItem[]>([
        {
            name: 'Directorio',
            icon: 'contacts',
            url: '/directorio'
        },
        {
            name: 'Dashboard',
            icon: 'dashboard',
            url: '/dashboard'
        },
        {
            name: 'Products',
            icon: 'inventory',
            children: [
                { name: 'List', icon: 'list', url: '/login' },
                { name: 'Create', icon: 'add', url: '/products/create' }
            ]
        },
        {
            name: 'Orders',
            icon: 'receipt',
            url: '/orders'
        },
        {
            name: 'Customers',
            icon: 'group',
            url: '/customers'
        },
        {
            name: 'Settings',
            icon: 'settings',
            url: '/settings'
        }
    ]);

    getMenu() {
        return this._menu();
    }
}