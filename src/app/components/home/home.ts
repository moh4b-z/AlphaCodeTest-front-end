import { Component } from '@angular/core';
import { ContactView } from '../contact-view/contact-view';

@Component({
  selector: 'app-home',
  imports: [ContactView],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
