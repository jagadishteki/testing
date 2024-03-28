import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Menu } from '../../models/menu.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _menuData = new BehaviorSubject<Menu[]>([])

  constructor() { }
  http = inject(HttpClient);

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

  getAllBussinessUnits() {
    return this.http.get<any[]>("https://mycrm-stage-api.apollocare.in/api/v1/LookUp/FetchAllBussinessUnits"
    );
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
            icon_url: 'bi bi-person-fill',
            url: '/crm/contacts',
            childern: [],
            isCollapsible: false
          },
          {
            id: 8,
            name: 'Manage Contact Groups',
            icon_url: 'bi bi-people-fill',
            url: '/crm/contact-groups',
            childern: [],
            isCollapsible: false
          }
        ]
      },
      {
        id: 9,
        name: 'Campaigns',
        icon_url: 'bi bi-envelope-fill',
        url: '',
        isCollapsible: true,
        childern: [
          {
            id: 10,
            name: 'Manage Campaigns',
            icon_url: 'bi bi-envelope-plus-fill',
            url: '/crm/manage-campaigns',
            childern: [],
            isCollapsible: false
          },
          {
            id: 11,
            name: 'Campaign Approvals',
            icon_url: 'bi bi-envelope-check-fill',
            url: '/crm/campaign-approvals',
            childern: [],
            isCollapsible: false
          }
        ]
      },
      {
        id: 12,
        name: 'Contact Admin',
        icon_url: 'bi bi-person-fill-gear',
        url: '/crm/contact-admin',
        childern: [],
        isCollapsible: false
      },
      {
        id: 13,
        name: 'NGX Editor',
        icon_url: 'bi bi-pencil-fill',
        url: '/crm/ngx-editor',
        childern: [],
        isCollapsible: false
      }
    ]
  }

  getUsers() {
    return this.http.get('https://web-api-cu1b.onrender.com/contacts/')
  }

  getCampaigns() {
    return this.http.get('https://web-api-cu1b.onrender.com/campaigns/')
  }

  getCountryCodes() {
    return this.http.get<any[]>("assets/country-code.json");
  }

  getSpecialities() {
    return this.http.get('https://mycrm-stage-api.apollocare.in/api/v1/LookUp/FetchAllSpecalities')
  }


}
