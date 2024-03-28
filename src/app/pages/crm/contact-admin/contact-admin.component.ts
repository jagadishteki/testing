import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../services/crm/data.service';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-contact-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AngularEditorModule],
  templateUrl: './contact-admin.component.html',
  styleUrl: './contact-admin.component.scss'
})
export class ContactAdminComponent implements OnInit {

  mailForm!: FormGroup;
  message!: string;
  messageType!: string;
  patientName = "Jagadish";

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

  constructor(private formBuilder: FormBuilder, private dataService: DataService) {

  }

  ngOnInit(): void {
    this.createMailForm();

  }

  createMailForm() {
    this.mailForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['<p><img src="https://logowik.com/content/uploads/images/apollo-hospitals9684.jpg" width="250" alt="Apollo Hospitals Logo"><br></p><p><i>This is <b> {patientName} </b>,</i></p><p><b><font color="#307344" size="5">Apollo Hospitals</font></b>,</p><p><br></p><p><b style="">Thank You</b></p>', Validators.required]
    });
  }

  public sendMail() {
    try {
      emailjs.init('bCxfrQ_fHSDswaDHB');
      let response = emailjs.send("service_5fp4yer", "template_8safa5f", {
        to_name: "Jagadish",
        from_name: this.mailForm.get('name')?.value,
        subject: this.mailForm.get('subject')?.value,
        message: this.mailForm.get('message')?.value,
        reply_to: "jagadishteki@gmail.com"
      })
      this.message = "Mail Sent Successfully";
      this.messageType = "success";
      this.createMailForm();
    } catch (error) {
      this.message = "Mail is not Sent.  Try After Some time.";
      this.messageType = "error";
    }
    setTimeout(() => {
      this.message = "";
    }, 3000)
  }

}
