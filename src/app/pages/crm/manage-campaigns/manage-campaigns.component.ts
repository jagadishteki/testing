import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../services/crm/data.service';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { ContactsService } from '../../../services/crm/contacts.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CampaignService } from '../../services/campaign.service';


@Component({
  selector: 'app-manage-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgMultiSelectDropDownModule, 
    NgxPaginationModule, AngularEditorModule],
  providers: [

    ],
  templateUrl: './manage-campaigns.component.html',
  styleUrl: './manage-campaigns.component.scss'
})
export class ManageCampaignsComponent {

  campaignTemplate!: NgForm;

  editCampaignId!: number;
  formType!: string;

  message!: string; 
  messageType!: string;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
   
  };

  campaigns: any;
  filteredCampaigns: any;
  p: number = 1;
  ipp: number = 2;
  businessUnits!: any;
  groups: any;

  campaignForm!: FormGroup;


  emailContent!: any;
  whatsAppContent!: any;



  headers = [
    { id: 1, field: 'campaignName', displayField: true, header: "Campaign", iconDisplay: true},
    { id: 2, field: 'campaignIds', displayField: true, header: "Campaign Type", iconDisplay: true},
    { id: 3, field: 'groupIds', displayField: true, header: "Contact Group", iconDisplay: true},
    { id: 4, field: 'scheduledOn', displayField: true, header: "Scheduled", iconDisplay: true},
    { id: 5, field: 'unitId', displayField: true, header: "Unit Name", iconDisplay: true},
    { id: 6, field: 'approved', displayField: true, header: "Approved", iconDisplay: true},
    { id: 7, field: 'campStatus', displayField: true, header: "Camp Status", iconDisplay: true},
    { id: 8, field: 'createdOn', displayField: true, header: "Created", iconDisplay: true}
  ];

  dropdowns = [2,3,5,6,7];

  dropdownList = this.headers;

  dropdownListType = [
    { id: 1, campaignType: "SMS", validation: false },
    { id: 2, campaignType: "Email", validation: false },
    { id: 3, campaignType: "WhatsApp", validation: false },
  ];

  dropdownListGroup: any = [];

  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'header',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: true
  };

  dropdownSettingsType = {
    singleSelection: false,
    idField: 'id',
    textField: 'campaignType',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: true
  };

  dropdownSettingsGroup = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    enableCheckAll: false,
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: true
  };

  selectedItems = [
    { id: 1, header: "Campaign" },
    { id: 2, header: "Campaign Type" },
    { id: 3, header: "Contact Group" },
    { id: 4, header: "Scheduled" },
    { id: 5, header: "Unit Name" },
    { id: 6, header: "Approved" },
    { id: 7, header: "Camp Status" },
    { id: 8, header: "Scheduled" }
];

  selectedItemsType: any = [];

  selectedItemsGroup: any = [];

  smsTemplate: boolean = false;
  emailTemplate: boolean = false;
  whatsAppTemplate: boolean = false;
  


  constructor(
    private dataService: DataService, 
    private contactService: ContactsService,
    private campaignService: CampaignService,
    private formBuilder: FormBuilder
    ){

  }

  ngOnInit(): void{
    this.getCampaigns();
    this.getAllBusinessUnits();
    this.getGroups();
    this.createCampaign();
  }

  updateValidation(){
    this.dropdownListType.forEach((item:any)=>{
      item.validation = false;
    })
    this.selectedItemsType.forEach((item:any)=>{
      this.dropdownListType.forEach((ele:any)=>{
        if(item.id==ele.id){
          ele.validation = true;
        }
      })
    })
  }
  
  createCampaign(){
    this.campaignForm = this.formBuilder.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      time: [''],
      businessUnit: ['-1', Validators.required],
      dltId: ['', Validators.required],
      senderId: ['', Validators.required],
      smsTemplate: ['Hi {PatientName}, Write SMS Body Here', Validators.required],
      fromName: ['', Validators.required],
      fromEmail: ['', Validators.required],
      emailSubject: ['', Validators.required],
      emailTemplate: ['', Validators.required],
      whatsAppId: ['', Validators.required],
      whatsAppSenderId: ['', Validators.required],
      whatsAppTemplate: ['', Validators.required]
    })
  }

  getGroups() {
    this.contactService.getGroups().subscribe({
      next: (res) => {
        this.dropdownListGroup = res;
      }
    })
  }

  submitCampaign(campaign: any, template: any){

    let campaignIds = this.selectedItemsType.map((item: any)=>{
      return item.id;
    })

    let groupIds = this.selectedItemsGroup.map((item: any)=>{
      return item.id;
    })
    let campaignData = {
      "campaignName": campaign.name,
      "campaignIds": campaignIds,
      "dltId": campaign.dltId,
      "senderId": campaign.senderId,
      "smsTemplate": campaign.smsTemplate,
      "fromName": campaign.fromName,
      "fromEmail": campaign.fromEmail,
      "emailSubject": campaign.emailSubject,
      "emailTemplate": campaign.emailTemplate,
      "whatsAppId": campaign.whatsAppId,
      "whatsAppSenderId": campaign.whatsAppSenderId,
      "whatsAppTemplate": campaign.whatsAppTemplate,
      "groupIds": groupIds,
      "scheduledOn": campaign.date+" "+campaign.time,
      "createdOn": new Date().toISOString().split(".")[0].replace('T', " "),
      "unitId": campaign.businessUnit,
      "approved": 0,
      "campStatus": 1 
    }
    console.log(campaignData);

    this.campaignService.addCampaign(campaignData).subscribe({
      next: (res) => {
        console.log(res);
        this.message = "Contact Added Successfully";
        this.messageType = "success";
        this.createCampaign();
        template.submitted = false;
        this.selectedItemsType = [];
        this.selectedItemsGroup = [];
        setTimeout(() => {
          this.message = ""; this.messageType = "";
        }, 3000)
        this.getCampaigns();
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

  modalOpen(popup: any) {
    let modal = document.getElementById(popup);
    if (modal) {
      modal.style.display = 'block';
    }
  }

  modalClose(popup: any) {
    let modal = document.getElementById(popup);
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  addCampaign(){
    this.formType = 'add';
    let formTitle = document.getElementById('form-title');
    if (formTitle) {
      formTitle.innerText = 'Add Campaign';
    }
    this.modalOpen('campaign');
  }

  editCampaign(campaign: any) {
    this.editCampaignId = campaign.id;
    this.formType = 'edit';
    let formTitle = document.getElementById('form-title');
    if (formTitle) {
      formTitle.innerText = 'Edit Campaign';
    }
    let date = campaign.scheduledOn.split(" ")[0];
    let time = (campaign.scheduledOn.split(" ")[1])?(campaign.scheduledOn.split(" ")[1]) : "00:00";

    this.campaignForm.setValue({
      name: campaign.campaignName,
      date: date,
      time: time,
      businessUnit: campaign.unitId,
      dltId: campaign.dltId,
      senderId: campaign.senderId,
      smsTemplate: campaign.smsTemplate,
      fromName: campaign.fromName,
      fromEmail: campaign.fromEmail,
      emailSubject: campaign.emailSubject,
      emailTemplate: campaign.emailTemplate,
      whatsAppId: campaign.whatsAppId,
      whatsAppSenderId: campaign.whatsAppSenderId,
      whatsAppTemplate: campaign.whatsAppTemplate
    })

    campaign.campaignIds.forEach((item: any)=>{
      this.dropdownListType.forEach((ele: any)=>{
        if(item==ele.id){
          this.selectedItemsType.push({
            id: ele.id,
            campaignType: ele.campaignType
          })
        }
      })
    });
    this.selectedItemsType = [...this.selectedItemsType];


    this.getGroups();
    campaign.groupIds.forEach((item: any)=>{
      this.dropdownListGroup.forEach((ele: any)=>{
        if(item==ele.id){
          this.selectedItemsGroup.push({
            id: ele.id,
            name: ele.name
          })
        }
      })
    });
    this.selectedItemsGroup = [...this.selectedItemsGroup];
    this.modalOpen('campaign');    
  }

  updateCampaign(){

    let campaignIds = this.selectedItemsType.map((item: any)=>{
      return item.id;
    })

    let groupIds = this.selectedItemsGroup.map((item: any)=>{
      return item.id;
    })
    let campaignData = {
      "id": this.editCampaignId,
      "campaignName": this.campaignForm.controls['name'].value,
      "campaignIds": campaignIds,
      "dltId": this.campaignForm.controls['dltId'].value,
      "senderId": this.campaignForm.controls['senderId'].value,
      "smsTemplate": this.campaignForm.controls['smsTemplate'].value,
      "fromName": this.campaignForm.controls['fromName'].value,
      "fromEmail": this.campaignForm.controls['fromEmail'].value,
      "emailSubject": this.campaignForm.controls['emailSubject'].value,
      "emailTemplate": this.campaignForm.controls['emailTemplate'].value,
      "whatsAppId": this.campaignForm.controls['whatsAppId'].value,
      "whatsAppSenderId": this.campaignForm.controls['whatsAppSenderId'].value,
      "whatsAppTemplate": this.campaignForm.controls['whatsAppTemplate'].value,
      "groupIds": groupIds,
      "scheduledOn": this.campaignForm.controls['date'].value+" "+this.campaignForm.controls['time'].value,
      "unitId": this.campaignForm.controls['businessUnit'].value,
    }
    console.log(campaignData);

    this.campaignService.updateCampaign(campaignData).subscribe({
      next: (res) => {
        console.log(res);
        this.message = "Campaign Updated Successfully";
        this.messageType = "success";

        this.filteredCampaigns.forEach((item:any)=>{
          if(item.id==campaignData.id){
            
            item.name = campaignData.campaignName,
            item.campaignIds = campaignData.campaignIds,
            item.groupIds = campaignData.groupIds,
            item.scheduledOn = campaignData.scheduledOn,
            item.unitId = campaignData.unitId
          }
        })

        setTimeout(() => {
          this.message = ""; this.messageType = "";
        }, 3000)
        this.modalClose('campaign');
      },
      error: (error) => {
        this.message = error.error.error;
        this.messageType = "error";
        setTimeout(() => {
          this.message = ""; this.messageType = "";
        }, 3000)
        this.modalClose('campaign');
      }
    })

  }


  campaignStatus(campaignId: number, status: number){

  }

  deleteCampaign(campaignId: any){
    this.campaignService.deleteCampaign(campaignId).subscribe({
      next: (res)=>{
        this.filteredCampaigns = this.filteredCampaigns.filter((campaign: any) => {
          return campaign.id != campaignId;
        })
      }
    })
  }

  inputSearch(event: any, column: any) {
    this.p = 1;
    let searchText = event.target.value;
    this.filteredCampaigns = this.campaigns.filter((campaign: any) => {

      if(Number.isInteger(campaign[column])){
        if(searchText==-1){
          return true;
        }else{
          return campaign[column]==Number(searchText);
        }
      }else{
        return campaign[column].toLowerCase().includes(searchText.toLowerCase());
      }
    })
  }

  getCampaigns(){
    this.campaignService.getCampaigns().subscribe({
      next: (res)=>{
        this.campaigns = res;
        this.filteredCampaigns = this.campaigns;
      }
    })
  }

  sortAsc(col: string) {
    this.headers.filter((sortId) => {
      if (sortId.field == col) {
        sortId.iconDisplay = false;
      }
    })
    this.filteredCampaigns = this.filteredCampaigns.sort((a: any, b: any) => a[col] > b[col] ? 1 : -1);
  }

  sortDsc(col: string) {
    this.headers.filter((sortId) => {
      if (sortId.field == col) {
        sortId.iconDisplay = true;
      }
    })
    this.filteredCampaigns = this.filteredCampaigns.sort((a: any, b: any) => b[col] > a[col] ? 1 : -1);
  }

  onItemSelect(event: any){
    this.headers.forEach((item)=>{
      if(event.id==item.id){
        item.displayField = true;
      }
    })
  }

  onItemSelect2(event: any){
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

  onSelectAll2(event: any){
  }

  searchStatus(searchForm: any) {
    // debugger;
    this.p = 1;
    let fromDate = searchForm.fromDate || '2000-01-01';
    // let fromDate = searchForm.fromDate?searchForm.fromDate:'2000-01-01';
    let toDate = searchForm.toDate || '9999-12-31';
    let businessUnit = Number(searchForm.businessUnit);
    console.log(fromDate, toDate, businessUnit);

    this.filteredCampaigns = this.campaigns.filter((campaign: any) => {
      return (campaign.createdOn > fromDate) && (campaign.createdOn < toDate) && ((businessUnit !== -1) ? (campaign.unitName == businessUnit) : (campaign.unitName !== businessUnit));
    })
  }
  getAllBusinessUnits(){
    this.dataService.getAllBussinessUnits().subscribe({
      next: (res: any)=>{
        this.businessUnits = res.response;
      }
    })
  }

  campaignTypes(campaigns: any[]){
    let camps: any = [];
    campaigns.forEach((item: any)=>{
      this.dropdownListType.forEach((ele: any)=>{
        if(item==ele.id){
          camps.push(ele.campaignType);
        }
      })
    })
    return camps;
  }

  campaignGroups(groupIds: any[]){
    let groups: any = [];
    groupIds.forEach((item: any)=>{
      this.dropdownListGroup.forEach((ele: any)=>{
        if(item==ele.id){
          groups.push(ele.name);
        }
      })
    })
    return groups;
  }

  records(event: any){
    console.log(event.target.value);
    this.ipp = event.target.value;
  }

}
