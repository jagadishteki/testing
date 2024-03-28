import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../../../services/crm/contacts.service';
import * as xls from 'xlsx';
import jsPDF from 'jspdf';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataService } from '../../../services/crm/data.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


export interface CG_Interface {
  name: string,
  phone: string,
  email: string,
  speciality: string,
  description: string,
  status: string,
  created: string
}

@Component({
  selector: 'app-contact-groups',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule,
    NgMultiSelectDropDownModule
  ],
  templateUrl: './contact-groups.component.html',
  styleUrl: './contact-groups.component.scss'
})
export class ContactGroupsComponent {
  headers = [
    { header: "Group Name", sortIcon: true, field: 'name' },
    { header: "Description", sortIcon: true, field: 'description' },
    { header: "Group Status", sortIcon: true, field: 'status' },
    { header: "Created On", sortIcon: true, field: 'created' },
  ]

  userHeaders = [
    { header: "Name", sortIcon: true, field: 'name' },
    { header: "Mobile", sortIcon: true, field: 'phone' },
    { header: "Email", sortIcon: true, field: 'email' },
    { header: "Speciality", sortIcon: true, field: 'speciality' },
  ]

  groups!: any;
  filteredGroups!: any;
  contactGroup!: FormGroup;
  assignFormGroup!: FormGroup;
  specialities!: any;
  users!: any;
  filteredUsers!: any;
  p: number = 1;
  message!: string;
  messageType!: string;
  editGroupId!: string;
  formType!: string;
  exportTable: boolean = false;

  //Search Contacts
  specialityId: number = 0;
  assigned: any = "";

  //Add Contacts
  group!: any;

  // Group Users
  gu: number = 1;
  groupUsers!: any[];
  filteredGroupUsers!: any[];

  @ViewChild('tableGroup') tableGroup!: ElementRef;

  // ng select multiple Items
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};





  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactsService,
    private dataService: DataService,
  ) { }
  ngOnInit(): void {
    this.getGroups();
    this.groupForm();
    this.getSpecialities()
    this.assignForm();

    // ng multi select
    this.dropdownList = this.specialities;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'specalityId',
      textField: 'specalityName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }

  // ng multi select
  onItemSelect(item: any) {
    // console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }


  //assign - Add Contacts To Groups

  assign(group: any) {
    this.group = group;
    this.modalOpen('assign');
    this.getUsers();
  }

  groupUsersFun(group: any) {
    this.group = group;
    this.modalOpen('groupUsers');
    this.getGroupUsers(group.id);
  }

  assignForm() {
    this.assignFormGroup = this.formBuilder.group({
      contacts: this.formBuilder.array([])
    });
  }

  addContact(event: any) {
    let contacts = this.assignFormGroup.get('contacts') as FormArray;
    if (event.target.checked) {
      contacts.push(new FormControl(event.target.value));
    } else {
      contacts.controls.forEach((ele, ind, arr) => {
        if (ele.value == event.target.value) {
          contacts.removeAt(ind);
          return;
        }
      })
    }
  }
  assignCheck!: boolean;
  selectToggle(event: any) {
    let contacts = this.assignFormGroup.get('contacts') as FormArray;
    if (event.target.checked) {
      this.filteredUsers.forEach((item: any) => {
        contacts.push(new FormControl((item.id).toString()));
      })
      this.assignCheck = true;
    } else {
      this.assignForm();
      this.assignCheck = false;
    }
  }


  assignSubmit() {
    this.users.forEach((item: any) => {
      // console.log(this.assignFormGroup.get('contacts')?.value, item.id)
      // debugger;
      if ((this.assignFormGroup.get('contacts')?.value).includes((item.id).toString())) {
        let data = {
          'id': item.id,
          'groupId': this.group.id,
          'groupName': this.group.name
        }
        this.contactService.assignContacts(data).subscribe({
          next: (res) => {
            this.users.forEach((item: any) => {
              if ((this.assignFormGroup.get('contacts')?.value).includes((item.id).toString())) {
                item.groupId = this.group.id;
                item.groupName = this.group.name;
              }
            })
            this.assignForm();
            this.assignCheck = false;
          }
        });
      }
    })
    this.getUsers();
  }

  getSpecialities() {
    this.dataService.getSpecialities().subscribe((res: any) => {
      this.specialities = res.response;
    })
  }

  getUsers() {
    this.dataService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.filteredUsers = this.users;
      }
    })
  }



  getGroupUsers(groupId: number) {
    // debugger
    this.dataService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res;
        this.groupUsers = this.users.filter((item: any) => {
          return item.groupId == groupId
        });
        this.filteredGroupUsers = this.groupUsers;
      }
    })
  }

  // searchContacts() {
  //   console.log(this.specialityId, this.assigned);
  //   this.filteredUsers = this.users.filter((item: any) => {
  //     return (this.specialityId > 0 ? (item.specialityId == this.specialityId) : true) && ((this.assigned !== "") ? (item.groupId == this.assigned) : true)
  //   })
  // }
  selectedIds!: any;
  searchContacts() {
    this.selectedIds = this.selectedItems.map((item: any) => {
      return item.specalityId;
    })

    this.filteredUsers = this.users.filter((item: any)=>{
      if(this.selectedIds){
        return this.selectedIds.includes(item.specialityId)
      }else{
        return true;
      }
    }).filter((item: any)=>{
      if(this.assigned){
        return item.groupId == this.assigned;
      }else{
        return true;
      }
    })
  }

  

  getGroups() {
    this.contactService.getGroups().subscribe({
      next: (res) => {
        this.groups = res;
        this.filteredGroups = this.groups;
      }
    })
  }

  groupForm() {
    this.contactGroup = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  get cg() {
    return this.contactGroup.controls;
  }

  modalOpen(popup: any) {
    let modal = document.getElementById(popup);
    if (modal) {
      modal.style.display = 'block';
    }
  }

  modalClose(popup: any) {
    if (popup == 'assign' || popup == 'groupUsers') {
      this.getGroups();
    }
    let modal = document.getElementById(popup);
    if (modal) {
      modal.style.display = 'none';
    }
  }

  sortAsc(field: string) {
    this.headers.filter((header) => {
      if (header.field == field) {
        header.sortIcon = false;
      }
    })
    this.filteredGroups = this.filteredGroups.sort((a: any, b: any) => a[field] > b[field] ? 1 : -1);
  }

  sortUserAsc(field: string) {
    this.userHeaders.filter((header) => {
      if (header.field == field) {
        header.sortIcon = false;
      }
    })
    this.filteredGroupUsers = this.filteredGroupUsers.sort((a: any, b: any) => a[field] > b[field] ? 1 : -1);
  }

  sortDsc(field: string) {
    this.headers.filter((header) => {
      if (header.field == field) {
        header.sortIcon = true;
      }
    })
    this.filteredGroups = this.filteredGroups.sort((a: any, b: any) => a[field] < b[field] ? 1 : -1);
  }

  sortUserDsc(field: string) {
    this.userHeaders.filter((header) => {
      if (header.field == field) {
        header.sortIcon = true;
      }
    })
    this.filteredGroupUsers = this.filteredGroupUsers.sort((a: any, b: any) => a[field] < b[field] ? 1 : -1);
  }

  inputSearch(event: any, column: keyof CG_Interface) {
    let columns = ['status'];
    this.p = 1;
    let searchText = event.target.value;
    let isColumn = columns.some((item: any) => {
      return item == column;
    })

    this.filteredGroups = this.groups.filter((group: any) => {
      if (isColumn) {
        if (searchText) {
          return (group[column] == searchText);
        } else {
          return true;
        }
      } else {
        return group[column].toLowerCase().includes(searchText.toLowerCase());
      }
    })
  }

  inputUserSearch(event: any, column: keyof CG_Interface) {
    let searchText = event.target.value;
    this.filteredGroupUsers = this.groupUsers.filter((group: any) => {
      return group[column].toLowerCase().includes(searchText.toLowerCase());
    })
  }



  onSubmit(formData: any) {
    const controls = this.contactGroup.controls;
    /** check form */
    if (this.contactGroup.invalid) {
      for (const name in controls) {
        if (controls[name].invalid) {
          controls[name].markAsTouched()
        }
      }
      return;
    } else {

      let groupData = {
        "name": this.cg['name'].value,
        "description": this.cg['description'].value,
        "status": "1",
        "created": new Date().toISOString().split('T')[0],
      }
      this.contactService.addGroup(groupData).subscribe({
        next: (res) => {
          this.message = "Contact Added Successfully";
          this.messageType = "success";
          setTimeout(() => {
            this.message = ""; this.messageType = "";
          }, 3000);
          this.modalClose('group');
          this.getGroups();
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

  addGroup() {
    this.formType = 'add';
    let formTitle = document.getElementById('form-title');
    if (formTitle) {
      formTitle.innerText = 'Add Group';
    }
    this.groupForm();
    this.modalOpen('group');
  }

  editGroup(group: any) {
    this.editGroupId = group.id;
    this.formType = 'edit';
    let formTitle = document.getElementById('form-title');
    if (formTitle) {
      formTitle.innerText = 'Edit Group';
    }
    this.contactGroup.setValue({
      name: group.name,
      description: group.description
    })
    this.modalOpen('group');
  }

  updateGroup() {
    let groupData = {
      "id": this.editGroupId,
      "name": this.cg['name'].value,
      "description": this.cg['description'].value
    }
    this.contactService.updateGroup(groupData).subscribe({
      next: (res) => {
        this.groupForm();
        this.message = "Group Updated Successfully";
        this.messageType = "success";
        this.formType = "";

        setTimeout(() => {
          this.message = ""; this.messageType = "";
          this.modalClose('group');
          this.getGroups();
        }, 3000)
        this.filteredGroups.forEach((item: any) => {
          if (item.id == groupData.id) {
            item.name = groupData.name;
            item.description = groupData.description;
          }
        })
      },
      error: (error) => {
        this.message = error.error.error;
        this.messageType = "error";

        setTimeout(() => {
          this.message = ""; this.messageType = "";
          this.modalClose('group');
        }, 3000)

      }
    })
  }

  groupStatus(groupId: number, value: number) {
    let group = { "id": groupId, "status": value };
    let status;
    (value == 1) ? status = "Active" : status = "Deactive";
    if (window.confirm(`Are you Sure You want to make it ${status}?`)) {
      return this.contactService.groupStatus(group).subscribe({
        next: (res) => {
          this.filteredGroups.forEach((item: any) => {
            if (item.id == groupId) {
              item.status = value;
            }
          })
        }
      }
      );
    } else { return false }
  }

  deleteGroup(groupId: number) {
    this.contactService.deleteGroup(groupId).subscribe({
      next: (res) => {
        this.updateFilterGroups(groupId);
      }
    })
  }

  updateFilterGroups(id: any) {
    this.filteredGroups = this.filteredGroups.filter((user: any) => {
      return user.id != id;
    })
  }

  getExcelFile() {
    this.exportTable = true;
    // this.itemsPerPage = this.filteredUsers.length;
    // let currentPage = this.p;
    // this.p = 1;
    setTimeout(() => {
      let workbook = xls.utils.table_to_book(this.tableGroup.nativeElement);
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
      doc.html(this.tableGroup.nativeElement, {
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
