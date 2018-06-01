import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs'; //duct tape for Import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators'; //duct tape for import 'rxjs/add/operator/map';


import { GLOBAL } from './global';

@Injectable()
export class UserService{

  public url: string;
  public identity;
  public token;


  constructor(private _http: Http){
    this.url = GLOBAL.url;
  }

  signup(user_to_login, gethash = null){

    if (gethash != null){
      user_to_login.gethash = gethash;
    }
    let json = JSON.stringify(user_to_login);

    let params = json;
    let headers = new Headers ({'Content-Type':'application/json'});
/*
Change this,

this.myObservable().map(data => {})
to this

this.myObservable().pipe(map(data => {}))
*/
    return this._http.post(this.url + 'login', params, {headers: headers})
                //.map(res => res.json())
                .pipe(map(res => res.json()))
                ;
  }

  register(user_to_register){
    let params = JSON.stringify(user_to_register);
    let headers = new Headers ({'Content-Type':'application/json'});
    return this._http.post(this.url + 'register', params, {headers: headers})
                //.map(res => res.json())
                .pipe(map(res => res.json()))
                ;
  }

  updateUser(user_to_update){
    let params = JSON.stringify(user_to_update);

    let headers = new Headers ({
      'Content-Type':'application/json',
      'Authorization':this.getToken()
    });

    return this._http.put(this.url + 'update-user/' + user_to_update._id,
    params, {headers: headers})
                .pipe(map(res => res.json()));
  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity'));
    console.log("obtiene id: "+identity);
    if (identity != "undefined"){
      //this.identity = identity;
      return identity;
    }else{
      this.identity = null;
    }
  }
  getToken(){
    let token = localStorage.getItem('token');
    console.log("obtiene token: " + token);
    if (token != "undefined"){
      //this.token = token;
      return token;
    }else{
      this.token = null;
    }
  }
}


