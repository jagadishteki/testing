import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuLinkComponent } from '../components/menu-link/menu-link.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/crm/data.service';
import { Menu } from '../../models/menu.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MenuLinkComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {

  menuLinks: Menu[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    public dataService: DataService
  ) { }

  ngOnInit(): void {

    this.dataService.setMenuData(this.dataService.getMenuDataDB());
    const dataSub = this.dataService.menuData.subscribe({
      next: (menu) => {
        this.menuLinks = menu;
      }
    })
    this.subscriptions.push(dataSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
