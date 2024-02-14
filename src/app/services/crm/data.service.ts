import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Menu } from '../../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _menuData = new BehaviorSubject<Menu[]>([])

  constructor() { }

  get menuData() {
    return this._menuData.asObservable();
  }

  setMenuData(menu: Menu[]) {
    this._menuData.next(menu);
  }

  getMenuDataValue(): Menu[] {
    return this._menuData.value;
  }

  getDashboardData(): { name: string }[] {
    return [
      {
        name: 'test 1'
      },
      {
        name: 'test 2'
      },
      {
        name: 'test 3'
      },
      {
        name: 'test 4'
      },
      {
        name: 'test 5'
      }
    ]
  }

  getMenuDataDB(): Menu[] {
    return [
      {
        id: 1,
        name: 'Dashboard',
        icon_url: 'bi bi-house-door',
        url: '/crm/dashboard',
        childern: [],
        isCollapsible: false
      },
      {
        id: 2,
        name: 'Admin Tasks',
        icon_url: 'bi bi-gear',
        url: '',
        isCollapsible: true,
        childern: [
          {
            id: 3,
            name: 'Users',
            icon_url: 'bi bi-people',
            url: '/crm/users',
            childern: [],
            isCollapsible: false
          },
          {
            id: 4,
            name: 'Roles',
            icon_url: 'bi bi-list-task',
            url: '/crm/roles',
            childern: [],
            isCollapsible: false
          },
          {
            id: 5,
            name: 'Features',
            icon_url: 'bi bi-person-lines-fill',
            url: '/crm/add-featres-roles',
            childern: [],
            isCollapsible: false
          }
        ]
      },
      {
        id: 6,
        name: 'Contacts',
        icon_url: 'bi bi-people-fill',
        url: '',
        isCollapsible: true,
        childern: [
          {
            id: 7,
            name: 'Manage Contacts',
            icon_url: 'bi bi-person-fill-gear',
            childern: [],
            isCollapsible: false
          }
        ]
      }
    ]
  }
}
