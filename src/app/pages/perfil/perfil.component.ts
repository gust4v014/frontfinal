import { Component, OnInit } from '@angular/core';
import { Rol } from './../../_model/rol';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: string = "";
  roles: Rol[];
  rol: string = "";
  constructor() { }

  ngOnInit() {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    console.log(decodedToken);
    this.usuario = decodedToken.user_name;
    console.log(this.usuario);
    this.roles = decodedToken.authorities;
    console.log(this.rol);
  }

}

