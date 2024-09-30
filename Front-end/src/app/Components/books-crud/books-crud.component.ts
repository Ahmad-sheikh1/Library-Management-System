import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminCrudComponent } from '../admin-crud/admin-crud.component';
import { AdminApprovalComponent } from '../admin-approval/admin-approval.component';


@Component({
  selector: 'app-books-crud',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule , AdminCrudComponent , AdminApprovalComponent],
  templateUrl: './books-crud.component.html',
  styleUrl: './books-crud.component.css'
})
export class BooksCrudComponent  {

  
  selectedTab: string = 'crud';



  selectTab(tab: string) {
    this.selectedTab = tab;
  }



}
