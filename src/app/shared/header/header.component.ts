import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  @Output() onToggle = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

  }

  toggle(){
    this.onToggle.emit();
  }
}
