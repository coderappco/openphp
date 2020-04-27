import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../pages/login/login.component';
import { BoardComponent } from '../pages/board/board.component';
import { UsuariosComponent } from '../pages/confg/usuarios/usuarios.component';
import { EmpresaComponent } from '../pages/confg/empresa/empresa.component';
import { SedeComponent } from '../pages/confg/sede/sede.component';
import { ConsultorioComponent } from '../pages/confg/consultorio/consultorio.component';
import { PacienteComponent } from '../pages/confg/paciente/paciente.component';
import { AdministradoraComponent } from '../pages/confg/administradora/administradora.component';
import { NolaboralComponent } from '../pages/confg/nolaboral/nolaboral.component';
import { ContratosComponent } from '../pages/confg/contratos/contratos.component';
import { AsignarComponent } from '../pages/cita/asignar/asignar.component';
import { ItemsComponent } from '../pages/confg/items/items.component';
import { AutorizacionComponent } from '../pages/confg/autorizacion/autorizacion.component';
import { GruposhComponent } from '../pages/confg/gruposh/gruposh.component';
import { AgendaComponent } from '../pages/agenda/agenda.component';
import { CitasComponent } from '../pages/informes/citas/citas.component';
import { ImportarComponent } from '../pages/importar/importar.component';
import { RangoeComponent } from '../pages/confg/rangoe/rangoe.component';
import { HistoriasComponent } from '../pages/historias/historias.component';
import { HistoriaComponent as GHistoria } from '../pages/confg/historias/historias.component';
import { CamasComponent } from '../pages/confg/camas/camas.component';
import { SearchComponent } from '../pages/cita/search/search.component';
import { TipocitaComponent } from '../pages/confg/tipocita/tipocita.component';
import { PromocionprevencionComponent } from '../pages/promocionprevencion/promocionprevencion.component';

import { AuthGuards } from '../guard/auth.guard';
import { HomeGuard } from '../guard/home.guard';

/*********************************
Configuración de las Rutas del APP
**********************************/

const appRoutes: Routes = [
	{ path: 'login', component: LoginComponent},
    { path: '', redirectTo: 'boards', pathMatch: 'full' },
    { path: 'boards', component: BoardComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR','PRESTADOR','CITAS', 'ADMIN']} },

    /*******************************************Configuracion*********************************************************/
    { path: 'confg/usuarios', component: UsuariosComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/empresas', component: EmpresaComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR']} },
    { path: 'confg/sedes', component: SedeComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/consultorios', component: ConsultorioComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/camas', component: CamasComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/pacientes', component: PacienteComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/administradoras', component: AdministradoraComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/nolaboral', component: NolaboralComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/contratos', component: ContratosComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/items', component: ItemsComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/gruposh', component: GruposhComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/import', component: ImportarComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/rangoe', component: RangoeComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/ghistoria', component: GHistoria, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    { path: 'confg/tipocita', component: TipocitaComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR', 'ADMIN']} },
    /*******************************************fin configuración*******************************************************/
    /*******************************************Citas*********************************************************/
    { path: 'citas/asignar', component: AsignarComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR','CITAS', 'ADMIN']} },
    { path: 'citas/autorizacion', component: AutorizacionComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR','CITAS', 'ADMIN']} },
    { path: 'citas/search', component: SearchComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR','CITAS', 'ADMIN', 'PRESTADOR']} },
    /*******************************************fin citas*******************************************************/
    /*******************************************Agenda médica*********************************************************/
    { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuards],data: {Role: ['PRESTADOR']} },
    /*******************************************fin agenda*******************************************************/
    /*******************************************Historia Clínica*********************************************************/
    { path: 'historias', component: HistoriasComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR','PRESTADOR', 'ADMIN']} },
    /*******************************************fin Historia Clínica*******************************************************/
    /*******************************************Agenda médica*********************************************************/
    { path: 'informes/citas', component: CitasComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR','CITAS', 'ADMIN']} },
    /*******************************************fin agenda*******************************************************/
    { path: 'promocion', component: PromocionprevencionComponent, canActivate: [AuthGuards],data: {Role: ['ADMINISTRADOR','PRESTADOR', 'ADMIN']} },
];

export const routing = RouterModule.forRoot(appRoutes);