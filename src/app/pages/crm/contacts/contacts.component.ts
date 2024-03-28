import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { User } from '../../../interfaces/user';
import * as xls from 'xlsx';
import jsPDF from 'jspdf';
import { DataService } from '../../../services/crm/data.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ContactsService } from '../../../services/crm/contacts.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule, FormsModule, NgMultiSelectDropDownModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

  // ng select multiple Items
  
  selectedItems = [
    {
        id: 1,
        header: "Name"
    },
    {
        id: 2,
        header: "Mobile"
    },
    {
        id: 3,
        header: "Email"
    },
    {
        id: 4,
        header: "Speciality"
    },
    {
        id: 5,
        header: "Source"
    },
    {
        id: 6,
        header: "Created"
    }
];
  dropdownSettings: any;
  
  dropdownList: any[] = [];

  exportTable: boolean = false;
  addContactForm: boolean = false;
  itemsPerPage: number = 2;
  @ViewChild('tableContact') tableContact!: ElementRef;
  message: string = '';
  messageType!: string;
  formType!: string;
  editUserId!: number;

  headers = [
    { id: 1, displayField:true, header: "Name", iconDisplay: true, field: 'name' },
    { id: 2, displayField:true, header: "Mobile", iconDisplay: true, field: 'phone' },
    { id: 3, displayField:true, header: "Email", iconDisplay: true, field: 'email' },
    { id: 4, displayField:true, header: "Speciality", iconDisplay: true, field: 'speciality' },
    { id: 5, displayField:true, header: "Source", iconDisplay: true, field: 'source' },
    { id: 6, displayField:true, header: "Created", iconDisplay: true, field: 'created' },
  ];

  createForm!: FormGroup;
  p: number = 1;
  users!: any;


  filteredUsers!: any;
  specialities!: any;
  countryCodes: any[] = [];
  countries!: any;

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private contactsService: ContactsService) {

  }
  ngOnInit(): void {
    this.getUsers();
    this.registerForm();
    this.ngDropdown()
  }

  
  //ng select
  ngDropdown(){
    this.dropdownList = this.headers;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'header',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 6,
      allowSearchFilter: true
    };
  }
  
  onItemSelect(event: any){
    this.headers.forEach((item)=>{
      if(event.id==item.id){
        item.displayField = true;
      }
    })
  }

  onItemDeSelect(event: any){
    this.headers.forEach((item)=>{
      if(event.id==item.id){
        item.displayField = false;
      }
    })
  }

  onSelectAll(event: any){

  }

  getUsers() {
    this.dataService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.filteredUsers = this.users;
      }
    })
  }

  registerForm() {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      countryCode: ['0', Validators.required],
      mobileNo: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', Validators.required],
      source: ['', Validators.required],
      speciality: ['0', Validators.required]
    });
  }

  get cf() {
    return this.createForm.controls;
  }

  modalOpen() {
    let modal = document.getElementById('contact');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  modalClose() {
    let modal = document.getElementById('contact');
    if (modal) {
      modal.style.display = 'none';
    }
  }


  getCountryCodes() {
    this.dataService.getCountryCodes().subscribe((res: any) => {
      for (var key in res) {
        let row = { code: key, name: res[key].name };
        this.countryCodes.push(row);
      }
    })
  }

  getSpecialities() {
    this.dataService.getSpecialities().subscribe((res: any) => {
      this.specialities = res.response;
    })
  }

  searchStatus(searchForm: any) {
    // debugger;
    this.p = 1;
    let fromDate = searchForm.fromDate || '2000-01-01';
    // let fromDate = searchForm.fromDate?searchForm.fromDate:'2000-01-01';
    let toDate = searchForm.toDate || '9999-12-31';
    let status = Number(searchForm.status);

    this.filteredUsers = this.users.filter((user: any) => {
      return user.created > fromDate && user.created < toDate && ((status !== -1) ? (user.status == status) : (user.status !== status));
    })
  }


  sortAsc(col: string) {
    this.headers.filter((sortId) => {
      if (sortId.field == col) {
        sortId.iconDisplay = false;
      }
    })
    this.filteredUsers = this.filteredUsers.sort((a: any, b: any) => a[col] > b[col] ? 1 : -1);
  }

  sortDsc(col: string) {
    this.headers.filter((sortId) => {
      if (sortId.field == col) {
        sortId.iconDisplay = true;
      }
    })
    this.filteredUsers = this.filteredUsers.sort((a: any, b: any) => b[col] > a[col] ? 1 : -1);
  }

  inputSearch(event: any, column: any) {
    this.p = 1;
    let searchText = event.target.value;
    this.filteredUsers = this.users.filter((user: any) => {

      // debugger
      return user[column].toLowerCase().includes(searchText.toLowerCase());
    })
  }

  onSubmit(formData: any) {
    const controls = this.createForm.controls;
    /** check form */
    if (this.createForm.invalid) {
      for (const name in controls) {
        if (controls[name].invalid) {
          controls[name].markAsTouched()
        }
      }
      return;
    } else {

      let specialityId = this.specialities.filter((speciality:any)=>{
        if(speciality.specalityName == this.cf['speciality'].value){
          return speciality.specialityId;
        }
      })
      let contactData = {
        "groupId": 0,
        "groupName": "",
        "name": this.cf['name'].value,
        "email": this.cf['email'].value,
        "speciality": this.cf['speciality'].value,
        "specialityId": specialityId,
        "source": this.cf['source'].value + "",
        "created": new Date().toISOString().split('T')[0],
        "status": 1,
        "countryCode": this.cf['countryCode'].value,
        "phone": this.cf['mobileNo'].value + ""
      }
      this.contactsService.addContact(contactData).subscribe({
        next: (res) => {
          console.log(res);
          this.message = "Contact Added Successfully";
          this.messageType = "success";
          this.registerForm();
          setTimeout(() => {
            this.message = ""; this.messageType = "";
          }, 3000)
          this.getUsers();
        },
        error: (error) => {
          this.message = error.error.error;
          this.messageType = "error";
          setTimeout(() => {
            this.message = ""; this.messageType = "";
          }, 3000)

        }
      })
    }
  }

  addContact(){
    this.getSpecialities();
    this.getCountryCodes();
    this.formType = 'add';
    let formTitle = document.getElementById('form-title');
    if (formTitle) {
      formTitle.innerText = 'Add Contact';
    }
    this.registerForm();
    this.modalOpen();
  }

  editContact(user: any) {
    this.editUserId = user.id;
    this.formType = 'edit';
    this.getSpecialities();
    this.getCountryCodes();
    let formTitle = document.getElementById('form-title');
    if (formTitle) {
      formTitle.innerText = 'Edit Contact';
    }
    this.createForm.setValue({
      name: user.name,
      countryCode: user.countryCode,
      mobileNo: user.phone,
      email: user.email,
      source: user.source,
      speciality: user.speciality
    })
    this.modalOpen();
  }

  updateContact() {
    let currentPage = this.p;
    let contactData = {
      "id": this.editUserId,
      "name": this.cf['name'].value,
      "email": this.cf['email'].value,
      "speciality": this.cf['speciality'].value,
      "source": this.cf['source'].value + "",
      "countryCode": this.cf['countryCode'].value,
      "phone": this.cf['mobileNo'].value + ""
    }
    this.contactsService.updateContact(contactData).subscribe({
      next: (res) => {
        this.p = currentPage;
        this.message = "Contact Updated Successfully";
        this.messageType = "success";

        this.filteredUsers.forEach((item:any)=>{
          if(item.id==contactData.id){
            
            item.name = contactData.name,
            item.email = contactData.email,
            item.speciality = contactData.speciality,
            item.source = contactData.source,
            item.countryCode = contactData.countryCode,
            item.phone = contactData.phone
          }
        })
        setTimeout(() => {
          this.message = ""; this.messageType = "";
          this.modalClose();
        }, 3000)
      },
      error: (error) => {
        this.message = error.error.error;
        this.messageType = "error";

        setTimeout(() => {
          this.message = ""; this.messageType = "";
          this.modalClose();
        }, 3000)
      }
    })
  }

  contactStatus(userId: number, value: number) {
    let user = { "id": userId, "status": value };
    let status;
    (value == 1) ? status = "Activate" : "Deactivate";
    if (window.confirm(`Are you Sure You want to make it ${status}?`)) {
      return this.contactsService.contactStatus(user).subscribe({
        next: ()=>{
          this.filteredUsers.forEach((item:any)=>{
            if(item.id==userId){
              item.status = value;
            }
          })
        }
      }

      );
    } else { return false }
  }

  deleteContact(userId: number){
    this.contactsService.deleteContact(userId).subscribe({
      next: (res)=>{
        this.filteredUsers = this.filteredUsers.filter((user: any) => {
          return user.id != userId;
        })
      }
    })
  }


  getExcelFile() {
    this.exportTable = true;
    // this.itemsPerPage = this.filteredUsers.length;
    // let currentPage = this.p;
    // this.p = 1;
    setTimeout(() => {
      let workbook = xls.utils.table_to_book(this.tableContact.nativeElement);
      xls.writeFile(workbook, 'user-contacts.xlsx');
      // this.itemsPerPage = 2;
      // this.p = currentPage;
      this.exportTable = false;
    }, 0)
  }

  getPdfFile() {
    this.exportTable = true;
    // this.itemsPerPage = this.filteredUsers.length;
    // let currentPage = this.p;
    // this.p = 1;
    setTimeout(() => {
      let doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      doc.html(this.tableContact.nativeElement, {
        callback: function (doc) {
          // Save the PDF
          doc.save('users-contact.pdf');
        },
        x: 25,
        y: 10,
        width: 262, //target width in the PDF document
        windowWidth: 1000 //window width in CSS pixels
      });
      // this.itemsPerPage = 2;
      // this.p = currentPage;  
      this.exportTable = false;
    }, 0)
  }
}