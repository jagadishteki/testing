import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './crm.component.html',
  styleUrl: './crm.component.scss'
})
export class CrmComponent implements OnInit, OnDestroy, AfterViewInit {


  toggle: boolean = true;
  constructor(
    @Inject(DOCUMENT) private _document: Document
  ) { }
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    var sidebarWrapper = this._document.getElementById('sidebar-wrapper');
    var pageWrapper = this._document.getElementById('page-content-wrapper');
    if (sidebarWrapper && pageWrapper) {

    }
  }

  onToggle(ev: any) {
    // var sidebarWrapper = this._document.getElementById('sidebar-wrapper');
    // var pageWrapper = this._document.getElementById('page-content-wrapper');
    var wrapper = this._document.getElementById('wrapper');
    this.toggle = !this.toggle;
    if (wrapper) {
      if(!this.toggle){
        wrapper.classList.add('toggled-2');
      }
      else{
        wrapper.classList.remove('toggled-2');
      }
    }
  }
  ngOnDestroy(): void {

  }

}
