import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  username: string;
  loggedIn: boolean;

  constructor() { 
    this.username = '';
    this.loggedIn = false;
  }
}
