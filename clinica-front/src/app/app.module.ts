import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { routing }        from './routes/app.routing';

import { ErrorInterceptor } from './help/error.interceptor';
import { JwtInterceptor } from './help/jwt.interceptor';

import { Globals } from './globals';

import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/partials/header/header.component';
import { SidebarComponent } from './pages/partials/sidebar/sidebar.component';
import { FooterComponent } from './pages/partials/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { BoardComponent } from './pages/board/board.component';
import { UsuariosComponent } from './pages/confg/usuarios/usuarios.component';
import { EmpresaComponent } from './pages/confg/empresa/empresa.component';
import { SedeComponent } from './pages/confg/sede/sede.component';
import { ConsultorioComponent } from './pages/confg/consultorio/consultorio.component';
import { PacienteComponent } from './pages/confg/paciente/paciente.component';
import { AdministradoraComponent } from './pages/confg/administradora/administradora.component';
import { NolaboralComponent } from './pages/confg/nolaboral/nolaboral.component';
import { ContratosComponent } from './pages/confg/contratos/contratos.component';
import { HistoriaComponent as GHistoria } from './pages/confg/historias/historias.component';
import { AsignarComponent } from './pages/cita/asignar/asignar.component';
import { ItemsComponent } from './pages/confg/items/items.component';
import { AutorizacionComponent } from './pages/confg/autorizacion/autorizacion.component';
import { GruposhComponent } from './pages/confg/gruposh/gruposh.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { CitasComponent } from './pages/informes/citas/citas.component';
import { ImportarComponent } from './pages/importar/importar.component';
import { SortablejsModule } from 'angular-sortablejs';
import { RangoeComponent } from './pages/confg/rangoe/rangoe.component';
import { HistoriasComponent } from './pages/historias/historias.component';
import { BasicaComponent } from './pages/historias/basica/basica.component';
import { AdultomayorComponent } from './pages/historias/adultomayor/adultomayor.component';
import { VisualComponent } from './pages/historias/visual/visual.component';
import { AiepiComponent } from './pages/historias/aiepi/aiepi.component';
import { AyudadComponent } from './pages/historias/ayudad/ayudad.component';
import { Consulta1vezComponent } from './pages/historias/consulta1vez/consulta1vez.component';
import { ConsultaexComponent } from './pages/historias/consultaex/consultaex.component';
import { CydaintegralComponent } from './pages/historias/cydaintegral/cydaintegral.component';
import { UrgenciasComponent } from './pages/historias/urgencias/urgencias.component';
import { CitologiaComponent } from './pages/historias/citologia/citologia.component';
import { MaternaComponent } from './pages/historias/materna/materna.component';
import { TraigeComponent } from './pages/historias/traige/traige.component';
import { DermatologicaComponent } from './pages/historias/dermatologica/dermatologica.component';
import { PlanifamComponent } from './pages/historias/planifam/planifam.component';
import { EnfermedadescComponent } from './pages/historias/enfermedadesc/enfermedadesc.component';
import { JovenpypComponent } from './pages/historias/jovenpyp/jovenpyp.component';
import { ReferenciaComponent } from './pages/historias/referencia/referencia.component';
import { VihComponent } from './pages/historias/vih/vih.component';
import { NenfermeriaComponent } from './pages/historias/nenfermeria/nenfermeria.component';
import { PsiquiatricaComponent } from './pages/historias/psiquiatrica/psiquiatrica.component';
import { PsicologicaComponent } from './pages/historias/psicologica/psicologica.component';
import { PedidoexamenComponent } from './pages/historias/pedidoexamen/pedidoexamen.component';
import { FormulamedicamentoComponent } from './pages/historias/formulamedicamento/formulamedicamento.component';
import { CamasComponent } from './pages/confg/camas/camas.component';
import { SearchComponent } from './pages/cita/search/search.component';
import { TipocitaComponent } from './pages/confg/tipocita/tipocita.component';
import { OdontologiaComponent } from './pages/historias/odontologia/odontologia.component';
import { EodontologiaComponent } from './pages/historias/eodontologia/eodontologia.component';
import { Aiepi2mComponent } from './pages/historias/aiepi2m/aiepi2m.component';
import { ConcentinfComponent } from './pages/historias/concentinf/concentinf.component';
import { EvolucionmedComponent } from './pages/historias/evolucionmed/evolucionmed.component';
import { ExternaComponent } from './pages/historias/externa/externa.component';
import { IngresourgenciaComponent } from './pages/historias/ingresourgencia/ingresourgencia.component';
import { NpsiquiatricaComponent } from './pages/historias/npsiquiatrica/npsiquiatrica.component';
import { OrdenesurgComponent } from './pages/historias/ordenesurg/ordenesurg.component';
import { RecetarioComponent } from './pages/historias/recetario/recetario.component';
import { SignosvitalesComponent } from './pages/historias/signosvitales/signosvitales.component';
import { OrdenesmedicasComponent } from './pages/historias/ordenesmedicas/ordenesmedicas.component';
import { EscalaabComponent } from './pages/historias/escalaab/escalaab.component';
import { EpicrisisComponent } from './pages/historias/epicrisis/epicrisis.component';
import { UodontologiaComponent } from './pages/historias/uodontologia/uodontologia.component';
import { OdontoComponent } from './pages/historias/odonto/odonto.component';
import { PromocionprevencionComponent } from './pages/promocionprevencion/promocionprevencion.component';
//import { DataTableModule } from 'primeng/primeng';


@NgModule({
  	declarations: [
      	AppComponent,
      	HeaderComponent,
      	SidebarComponent,
      	FooterComponent,
      	LoginComponent,
      	BoardComponent,
      	UsuariosComponent,
      	EmpresaComponent,
      	SedeComponent,
      	ConsultorioComponent,
        PacienteComponent,
        AdministradoraComponent,
        NolaboralComponent,
        ContratosComponent,
        AsignarComponent,
        ItemsComponent,
        AutorizacionComponent,
        GruposhComponent,
        AgendaComponent,
        CitasComponent,
        ImportarComponent,
        RangoeComponent,
        HistoriasComponent,
        BasicaComponent,
        AdultomayorComponent,
        VisualComponent,
        AiepiComponent,
        AyudadComponent,
        Consulta1vezComponent,
        ConsultaexComponent,
        CydaintegralComponent,
        UrgenciasComponent,
        CitologiaComponent,
        MaternaComponent,
        TraigeComponent,
        DermatologicaComponent,
        PlanifamComponent,
        EnfermedadescComponent,
        JovenpypComponent,
        ReferenciaComponent,
        GHistoria,
        VihComponent,
        NenfermeriaComponent,
        PsiquiatricaComponent,
        PsicologicaComponent,
        PedidoexamenComponent,
        FormulamedicamentoComponent,
        CamasComponent,
        SearchComponent,
        TipocitaComponent,
        OdontologiaComponent,
        EodontologiaComponent,
        Aiepi2mComponent,
        ConcentinfComponent,
        EvolucionmedComponent,
        ExternaComponent,
        IngresourgenciaComponent,
        NpsiquiatricaComponent,
        OrdenesurgComponent,
        RecetarioComponent,
        SignosvitalesComponent,
        OrdenesmedicasComponent,
        EscalaabComponent,
        EpicrisisComponent,
        UodontologiaComponent,
        OdontoComponent,
        PromocionprevencionComponent
  	],
  	imports: [
      	BrowserModule,
  	    BrowserAnimationsModule,
  	    ReactiveFormsModule,
  	    HttpClientModule,
  	    SlimLoadingBarModule,
  	    routing,
        SortablejsModule.forRoot({ animation: 150 })
  	],
  	providers: [
    		Globals,
    		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      	{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
  	bootstrap: [AppComponent]
})
export class AppModule { }
