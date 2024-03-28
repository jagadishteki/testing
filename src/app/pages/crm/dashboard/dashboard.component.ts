import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../services/crm/data.service';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
  }

  // @ViewChild('barChart', { static: true })barChart!: ElementRef;
  // @ViewChild('pieChart', { static: true })pieChart!: ElementRef;
  // @ViewChild('doughnutChart', { static: true })doughnutChart!: ElementRef;
  // @ViewChild('polarAreaChart', { static: true })polarAreaChart!: ElementRef;


  // data: { name: string }[] = [];

  // users: any[] = [];
  // chartData!: any[];
  // labelData: any[] = [];
  // realData: any[] = [];
  // colorData: any[] = [];



  // constructor(
  //   private dataService: DataService
  // ) { }

  // ngOnInit(): void {

  //   // this.data = this.dataService.getDashboardData();

  //   this.dataService.getUsers().subscribe({
  //     next: (res: any) => {
  //       this.users = res;
  //     }
  //   })

  //   this.users.forEach((ele) => {
  //     if (!this.labelData.includes(ele.speciality)) {
  //       this.labelData.push(ele.speciality);
  //     }
  //   })
  //   this.labelData = [...this.labelData];

  //   this.labelData.forEach((ele) => {
  //     let count = 0;
  //     this.users.forEach((ele2) => {
  //       if (ele == ele2.speciality) {
  //         count++
  //       }
  //     })
  //     this.realData.push(count);
  //   })
  //   this.realData = [...this.realData]

  //   this.RenderChart(this.labelData, this.realData, 'bar', this.barChart.nativeElement);
  //   this.RenderChart(this.labelData, this.realData, 'pie', this.pieChart.nativeElement);
  //   this.RenderChart(this.labelData, this.realData, 'doughnut', this.doughnutChart.nativeElement);
  //   this.RenderChart(this.labelData, this.realData, 'polarArea', this.polarAreaChart.nativeElement);    
  // }




  // RenderChart(labeldata: any, maindata: any, type: any, id: any) {
  //   const myChart = new Chart(id, {
  //     type: type,
  //     data: {
  //       labels: labeldata,
  //       datasets: [{
  //         label: '# of Votes',
  //         data: maindata,
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     }
  //   });
  // }

}
