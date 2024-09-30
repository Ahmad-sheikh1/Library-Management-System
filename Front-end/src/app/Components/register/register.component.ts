import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/counter.state';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  store = inject(Store<AppState>);
  RegisterObj: any = {
    fullname: '',
    email: '',
    password: '',
    confirmpassword: '',
    isAccept: false
  }
  formdata: any;
  FormData() {
    this.formdata = this.RegisterObj
    if(this.formdata.password === this.formdata.confirmpassword){
      // debugger
    }
  }
}
