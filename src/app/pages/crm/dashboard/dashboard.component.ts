import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../../services/crm/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

  data: { name: string }[] = [];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {

    this.data = this.dataService.getDashboardData();

  }
  ngOnDestroy(): void {

  }

}
