import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-ngx-editor',
  standalone: true,
  imports: [FormsModule, NgxEditorModule],
  templateUrl: './ngx-editor.component.html',
  styleUrl: './ngx-editor.component.scss'
})
export class NgxEditorComponent {
  editor!: Editor;
  html = '';

  constructor(){

  }

  ngOnInit(): void{
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }


}
