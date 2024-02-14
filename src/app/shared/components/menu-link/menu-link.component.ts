import { Component, Input } from '@angular/core';
import { Menu } from '../../../models/menu.model';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-link',
  standalone: true,
  imports: [CommonModule, NgbCollapseModule, RouterModule],
  templateUrl: './menu-link.component.html',
  styleUrl: './menu-link.component.scss'
})
export class MenuLinkComponent {

  @Input() menuLinks: Menu[] = [];

}
