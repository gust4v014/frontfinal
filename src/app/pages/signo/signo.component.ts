import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { Signo } from 'src/app/_model/signo';
import { SignoService } from './../../_service/signo.service';


@Component({
  selector: 'app-signo',
  templateUrl: './signo.component.html',
  styleUrls: ['./signo.component.css']
})
export class SignoComponent implements OnInit {

  dataSource: MatTableDataSource<Signo>;
  displayedColumns = ['idSigno', 'nombres', 'fecha', 'temperatura', 'pulso', 'ritmo', 'acciones'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private signoService: SignoService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.signoService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }


  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

}
