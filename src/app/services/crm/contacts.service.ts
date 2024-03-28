import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  http = inject(HttpClient);
  
  constructor() { }

  getUsers() {
    return this.http.get('https://web-api-cu1b.onrender.com/contacts/')
  }

  addContact(record: any) {
    return this.http.post('https://web-api-cu1b.onrender.com/contacts/', record)
  }

  updateContact(data: any) {
    return this.http.patch('https://web-api-cu1b.onrender.com/contacts/' + data.id, data)
  }

  contactStatus(data: any) {
    return this.http.patch('https://web-api-cu1b.onrender.com/contacts/' + data.id, data)
  }

  deleteContact(userId: number) {
    return this.http.delete('https://web-api-cu1b.onrender.com/contacts/' + userId)
  }

  getGroups() {
    return this.http.get('https://web-api-cu1b.onrender.com/contact-groups/')
    // .pipe(tap((res)=>{
    //   this.fgSubject.next(res);
    // }))
  }

  addGroup(record: any) {
    return this.http.post('https://web-api-cu1b.onrender.com/contact-groups/', record)
  }

  updateGroup(data: any) {
    return this.http.patch('https://web-api-cu1b.onrender.com/contact-groups/' + data.id, data)
  }

  groupStatus(data: any) {
    return this.http.patch('https://web-api-cu1b.onrender.com/contact-groups/' + data.id, data);
  }

  deleteGroup(groupId: number) {
    return this.http.delete('https://web-api-cu1b.onrender.com/contact-groups/' + groupId)
  }

  assignContacts(data: any){
    return this.http.patch('https://web-api-cu1b.onrender.com/contacts/' + data.id, data)
  }

}
