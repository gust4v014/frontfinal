import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { map, single, switchMap } from 'rxjs/operators';
import { Signo } from 'src/app/_model/signo';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SignoService } from './../../../_service/signo.service';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {

  id: number;
  form: FormGroup;
  pacientes: Paciente[] = [];
  myControlPaciente: FormControl = new FormControl();
  pacienteSeleccionado: Paciente;
  filteredOptions: Observable<any[]>;

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  temperatura: number;
  pulso: number;
  ritmo: number;

  edicion: boolean = false;


  constructor(private pacienteService: PacienteService, private signoService: SignoService, private route: ActivatedRoute,
    private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      this.edicion = params['id'] != null;
      this.initForm();
    });

  }

  initForm() {
    this.listarPacientes();
    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(val)));

    if (this.edicion) {
      this.signoService.listarPorId(this.id).subscribe(data => {
        this.myControlPaciente.setValue(data.paciente);
        let id = data.idSigno;
        let temperatura = data.temperatura;
        let pulso = data.pulso;
        let ritmo = data.pulso;
        let fecha = data.fecha;

        this.form = new FormGroup({
          'id': new FormControl(id),
          'paciente': this.myControlPaciente,
          'fecha': new FormControl(fecha),
          'temperatura': new FormControl(temperatura),
          'pulso': new FormControl(pulso),
          'ritmo': new FormControl(ritmo)
        });


      });
    }
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  filter(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }

  displayFn(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  operar() {
    let signo = new Signo();
    signo.idSigno = this.form.value['id'];
    signo.paciente = this.form.value['paciente'];
    var tzoffset = (this.form.value['fecha']).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString()
    signo.fecha = localISOTime;
    signo.temperatura = this.form.value['temperatura'];
    signo.pulso = this.form.value['pulso'];
    signo.ritmo = this.form.value['ritmo'];

    if (signo != null && signo.idSigno > 0) {
      this.signoService.modificar(signo).pipe(switchMap(() => {
        return this.signoService.listar();
      })).subscribe(data => {
        this.signoService.signoCambio.next(data);
        this.signoService.mensajeCambio.next("modificado");
      });
    } else {
      this.signoService.registrar(signo).pipe(switchMap(() => {
        return this.signoService.listar();
      })).subscribe(data => {
        this.signoService.signoCambio.next(data);
        this.signoService.mensajeCambio.next("modificado");
      });
    }
    this.router.navigate(['signal']);
  }

}
