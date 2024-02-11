import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

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
}
