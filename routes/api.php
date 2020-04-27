<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
/******************Rutas Configuracion*******************************/
/******************rutas usuarios************************************/
Route::post('logins', 'API\UsersController@logins')->name('logins');
Route::put('users/logout', 'API\UsersController@logout')->name('logout');
Route::get('users', 'API\UsersController@getUsers')->name('users');
Route::post('users/create', 'API\UsersController@createUser')->name('createUser');
Route::post('user/photo', 'API\UsersController@photo')->name('photo');
Route::get('user/removephoto', 'API\UsersController@removePhoto')->name('removephoto');
Route::get('user/{user}', 'API\UsersController@getUser')->name('user');
Route::put('users/update/{user}', 'API\UsersController@updateUser')->name('updateUser');
Route::delete('users/delete/{user}', 'API\UsersController@deleteUser')->name('deleteUser');
Route::get('users/prestadores', 'API\UsersController@getPrestadores')->name('getprestadores');
Route::get('getprestadores', 'API\UsersController@ListPrestadores')->name('getsprestadores');
Route::get('user', 'API\UsersController@getUserIdent')->name('getUserIdent');
Route::post('user/firma', 'API\UsersController@firma')->name('firma');
Route::get('users/removfirmas', 'API\UsersController@removeFirmas')->name('removeFirmas');
/******************fin rutas usuarios********************************/

/************************Empresas*****************************************************/
Route::get('empresas', 'API\EmpresaController@getEmpresas')->name('empresas');
Route::get('getempresas', 'API\EmpresaController@ListEmpresas')->name('getempresas');
Route::post('empresa/logo', 'API\EmpresaController@logo')->name('logo');
Route::get('empresa/removelogo', 'API\EmpresaController@removeLogo')->name('removelogo');
Route::post('empresa/create', 'API\EmpresaController@createEmpresa')->name('createEmpresa');
Route::put('empresa/update/{empresa}', 'API\EmpresaController@updateEmpresa')->name('updateEmpresa');
Route::delete('empresa/delete/{empresa}', 'API\EmpresaController@deleteEmpresa')->name('deleteEmpresa');
Route::get('empresa/{empresa}', 'API\EmpresaController@getEmpresa')->name('empresa');
/*************************fin Empresas************************************************/

/************************Sedes*****************************************************/
Route::get('sedes', 'API\SedeController@getSedes')->name('sedes');
Route::get('getsedes', 'API\SedeController@ListSedes')->name('getsedes');
Route::post('sede/create', 'API\SedeController@createSede')->name('createSede');
Route::put('sede/update/{sede}', 'API\SedeController@updateSede')->name('updateSede');
Route::delete('sede/delete/{sede}', 'API\SedeController@deleteSede')->name('deleteSede');
Route::get('sede/{sede}', 'API\SedeController@getSede')->name('sede');
/*************************fin Sedes************************************************/

/************************Consultorios*****************************************************/
Route::get('consultorios', 'API\ConsultController@getConsultorios')->name('consultorios');
Route::post('consultorio/create', 'API\ConsultController@createConsultorio')->name('createConsultorio');
Route::put('consultorio/update/{consultorio}', 'API\ConsultController@updateConsultorio')->name('updateConsultorio');
Route::delete('consultorio/delete/{consultorio}', 'API\ConsultController@deleteConsultorio')->name('deleteConsultorio');
Route::get('consultorio/{consultorio}', 'API\ConsultController@getConsultorio')->name('consultorio');
Route::get('getconsultorios', 'API\ConsultController@ListConsultorios')->name('getconsultorios');
/*************************fin Consultorios************************************************/

/************************Camas*****************************************************/
Route::get('camas', 'API\CamaController@getCamas')->name('camas');
Route::post('cama/create', 'API\CamaController@createCama')->name('createCama');
Route::put('cama/update/{cama}', 'API\CamaController@updateCama')->name('updateCama');
Route::delete('cama/delete/{cama}', 'API\CamaController@deleteCama')->name('deleteCama');
Route::get('cama/{cama}', 'API\CamaController@getCama')->name('cama');
Route::get('getcamas', 'API\CamaController@ListCamas')->name('getcama');
/*************************fin Camas************************************************/

/************************Administradoras*****************************************************/
Route::get('administradoras', 'API\AdministradoraController@getAdministradoras')->name('administradoras');
Route::get('getadministradoras', 'API\AdministradoraController@ListAdministradoras')->name('getadministradoras');
Route::post('administradora/create', 'API\AdministradoraController@createAdministradora')->name('createAdministradora');
Route::put('administradora/update/{administradora}', 'API\AdministradoraController@updateAdministradora')->name('updateAdministradora');
Route::delete('administradora/delete/{administradora}', 'API\AdministradoraController@deleteAdministradora')->name('deleteAdministradora');
Route::get('administradora/{administradora}', 'API\AdministradoraController@getAdministradora')->name('administradora');
Route::get('administradoras/orderimport', 'API\AdministradoraController@getOrderI')->name('orderimport');
/*************************fin Administradoras************************************************/

/************************Contratos*****************************************************/
Route::get('contratos', 'API\ContratoController@getContratos')->name('contratos');
Route::get('getcontratos', 'API\ContratoController@ListContratos')->name('getcontratos');
Route::post('contrato/create', 'API\ContratoController@createContrato')->name('createContrato');
Route::put('contrato/update/{contrato}', 'API\ContratoController@updateContrato')->name('updateContrato');
Route::delete('contrato/delete/{contrato}', 'API\ContratoController@deleteContrato')->name('deleteContrato');
Route::get('contrato/{contrato}', 'API\ContratoController@getContrato')->name('contrato');
Route::get('getadmincontratos', 'API\ContratoController@getAdminContrato')->name('getadmincontratos');
/*************************fin Contratos************************************************/

/************************NoLaborales*****************************************************/
Route::get('nolaborales', 'API\NoLaboralesController@getNolaborales')->name('nolaborales');
Route::post('nolaboral/create', 'API\NoLaboralesController@createNolaboral')->name('createNolaboral');
Route::put('nolaboral/update/{nolaboral}', 'API\NoLaboralesController@updateNolaboral')->name('updateNolaboral');
Route::delete('nolaboral/delete/{nolaboral}', 'API\NoLaboralesController@deleteNolaboral')->name('deleteNolaboral');
Route::get('nolaboral/{nolaboral}', 'API\NoLaboralesController@getNolaboral')->name('nolaboral');
/*************************fin NoLaborales************************************************/

/************************Pacietes*****************************************************/
Route::get('pacientes', 'API\PacienteController@getPacientes')->name('pacientes');
Route::get('paciente/search', 'API\PacienteController@Search')->name('search');
Route::post('paciente/photos', 'API\PacienteController@photos')->name('logo');
Route::get('paciente/removephoto', 'API\PacienteController@removePhoto')->name('removelogo');
Route::post('paciente/create', 'API\PacienteController@createPaciente')->name('createPaciente');
Route::post('paciente/createc', 'API\PacienteController@createPacientec')->name('createPacientec');
Route::put('paciente/update/{paciente}', 'API\PacienteController@updatePaciente')->name('updatePaciente');
Route::delete('paciente/delete/{paciente}', 'API\PacienteController@deletePaciente')->name('deletePaciente');
Route::get('paciente/{paciente}', 'API\PacienteController@getPaciente')->name('paciente');
Route::get('getpacientes', 'API\PacienteController@ListPacientes')->name('getpacientes');
Route::get('pnotificacion/{paciente}', 'API\PacienteController@getPNotificacion')->name('pnotificacion');
Route::put('pnotificacion/update/{paciente}', 'API\PacienteController@updatePNotificacion')->name('pupdate');
Route::post('pacientes/importar', 'API\PacienteController@Importar')->name('importar');
Route::get('pacientes/removearchivo', 'API\PacienteController@removeArchivos')->name('removearchivo');
Route::post('pacientes/importararchivo', 'API\PacienteController@importarArchivos')->name('importararchivo');
Route::put('paciente/update/fecha/{paciente}', 'API\PacienteController@updatePacienteFecha')->name('updatePacienteFecha');
/*************************fin Paientes************************************************/

/************************Items*****************************************************/
Route::get('items', 'API\ItemController@getItems')->name('items');
Route::get('getitems', 'API\ItemController@ListItems')->name('getitems');
Route::post('item/create', 'API\ItemController@createItem')->name('createItem');
Route::get('item/{item}', 'API\ItemController@getItem')->name('item');
Route::put('item/update/{item}', 'API\ItemController@updateItem')->name('updateItem');
Route::delete('item/delete/{item}', 'API\ItemController@deleteItem')->name('deleteItem');
Route::get('items/search', 'API\ItemController@Search')->name('isearch');
Route::get('items/examenes', 'API\ItemController@getItemsLab')->name('getItemsLab');
Route::get('items/medicamentos', 'API\ItemController@getItemsMed')->name('getItemsMed');
Route::get('items/servicios', 'API\ItemController@getItemsServ')->name('getItemsServ');
/*************************fin Items************************************************/

/************************Grupos horarios*****************************************************/
Route::get('gruposh', 'API\GruposHController@getGruposH')->name('gruposh');
Route::post('grupoh/create', 'API\GruposHController@createGruposH')->name('createGruposH');
Route::put('grupoh/update/{grupoh}', 'API\GruposHController@updateGruposH')->name('updateGruposH');
Route::delete('grupoh/delete/{grupoh}', 'API\GruposHController@deleteGruposH')->name('deleteGruposH');
Route::get('grupoh/{grupoh}', 'API\GruposHController@getGrupoH')->name('grupoh');
Route::get('getgruposh', 'API\GruposHController@ListGruposH')->name('getgruposh');
/*************************Grupos Horarios fin************************************************/

/************************Rangos de Edades*****************************************************/
Route::get('rangosedades', 'API\RangosEController@getRangosE')->name('rangosedades');
Route::post('rangoe/create', 'API\RangosEController@createRangoE')->name('createRangoE');
Route::put('rangoe/update/{rangoe}', 'API\RangosEController@updateRangoE')->name('updateRangoE');
Route::delete('rangoe/delete/{rangoe}', 'API\RangosEController@deleteRangoE')->name('deleteRangoE');
Route::get('rangoe/{grupoh}', 'API\RangosEController@getRangoE')->name('rangoe');
Route::get('rangose', 'API\RangosEController@ListRangosE')->name('rangose');
/*************************Rango de Edades fin************************************************/

/************************tipo de cita*****************************************************/
Route::get('tiposcitas', 'API\TipoCitaController@getTiposCitas')->name('getTiposCitas');
Route::post('tipocita/create', 'API\TipoCitaController@createTipoCita')->name('createTipoCita');
Route::put('tipocita/update/{tipocita}', 'API\TipoCitaController@updateTipoCita')->name('updateTipoCita');
Route::delete('tipocita/delete/{tipocita}', 'API\TipoCitaController@deleteTipoCita')->name('deleteTipoCita');
Route::get('tipocita/{tipocita}', 'API\TipoCitaController@getTipoCita')->name('TipoCita');
Route::get('gettiposcitas', 'API\TipoCitaController@ListTipoCita')->name('getTipoCita');
/*************************Grupos Horarios fin************************************************/

/************************Historias*****************************************************/
Route::get('historias', 'API\HistoriaController@getHistorias')->name('getHistorias');
Route::put('historia/update/{hitoria}', 'API\HistoriaController@updateHistoria')->name('updateHistoria');
Route::get('historia/{hitoria}', 'API\HistoriaController@getHistoria')->name('historia');
Route::get('listhistorias', 'API\HistoriaController@ListHistorias')->name('listhistorias');
Route::get('listhistoriascita', 'API\HistoriaController@ListHistoriasCita')->name('listhistoriascita');

Route::post('historia/create/paciente', 'API\HistoriaController@createHistoriaPaciente')->name('createHistoriaPaciente');
Route::put('historia/paciente/update/{hitoria}', 'API\HistoriaController@updateHistoriaPaciente')->name('updateHistoriaPaciente');
Route::get('historias/paciente/{hitoria}', 'API\HistoriaController@getHistoriaPaciente')->name('getHistoriaPaciente');
Route::get('historias/historiapaciente', 'API\HistoriaController@getHistoriasPacientes')->name('getHistoriasPacientes');
Route::get('historias/historiapacepi', 'API\HistoriaController@getHistoriasPacientesEpi')->name('getHistoriasPacientesEpi');
Route::get('historias/pacidlab', 'API\HistoriaController@getHistPacientesIdLab')->name('getHistPacientesIdLab');
Route::get('historias/historialaboratorio', 'API\HistoriaController@getHistsLab')->name('getHistsLab');
Route::post('historia/create/lab', 'API\HistoriaController@createHistoriaLab')->name('createHistoriaLab');
Route::put('historia/update/lab/{hitoria}', 'API\HistoriaController@updateHistoriaLab')->name('updateHistoriaLab');
Route::delete('historia/delete/lab/{hitoria}', 'API\HistoriaController@delHistoriaLab')->name('delHistoriaLab');
Route::get('historias/lab/{historia}', 'API\HistoriaController@getLaboratorio')->name('getLaboratorio');
Route::get('historias/pacidmed', 'API\HistoriaController@getHistPacientesIdMed')->name('getHistPacientesIdMed');
Route::get('historias/historiamedicamento', 'API\HistoriaController@getHistsMed')->name('getHistsMed');
Route::post('historia/create/med', 'API\HistoriaController@createHistoriaMed')->name('createHistoriaMed');
Route::put('historia/update/med/{hitoria}', 'API\HistoriaController@updateHistoriaMed')->name('updateHistoriaMed');
Route::delete('historia/delete/med/{hitoria}', 'API\HistoriaController@delHistoriaMed')->name('delHistoriaMed');
Route::get('historias/med/{historia}', 'API\HistoriaController@getMedicamento')->name('getMedicamento');
Route::get('historia/signov/{historia}', 'API\HistoriaController@getHistoriaSignoV')->name('getHistoriaSignoV');
Route::get('historias/ids', 'API\HistoriaController@getHistoriaIds')->name('getHistoriaIds');
Route::get('historias/getdiente', 'API\HistoriaController@getDiente')->name('getDiente');
Route::get('historias/deldiagt', 'API\HistoriaController@delDiagt')->name('delDiagt');
Route::get('historias/evolucionar', 'API\HistoriaController@Evolucionar')->name('Evolucionar');
Route::get('historias/updateevolucionar', 'API\HistoriaController@UpdateEvolucionar')->name('UpdateEvolucionar');
/*************************Historias fin************************************************/

/************************Autorizacion*****************************************************/
Route::get('autorizaciones', 'API\AutorizacionController@getAutorizaciones')->name('autorizaciones');
Route::post('autorizacion/create', 'API\AutorizacionController@createAutorizacion')->name('createAutorizacion');
Route::post('autorizacion/creates', 'API\AutorizacionController@createAutorizacions')->name('createAutorizacions');
Route::get('autorizacion/{autorizacion}', 'API\AutorizacionController@getAutorizacion')->name('autorizacion');
Route::put('autorizacion/update/{autorizacion}', 'API\AutorizacionController@updateAutorizacion')->name('updateAutorizacion');
Route::delete('autorizacion/delete/{autorizacion}', 'API\AutorizacionController@deleteAutorizacion')->name('deleteAutorizacion');
/*************************fin Autorizacion************************************************/

/************************Citas*****************************************************/
Route::get('citas', 'API\CitaController@getCitas')->name('citas');
Route::get('citasstatus', 'API\CitaController@getCitasStatus')->name('citasstatus');
Route::get('citasprestador', 'API\CitaController@getCitasPrestador')->name('citasprestador');
Route::get('citasprestadorfecha', 'API\CitaController@getCitasPrestadorFecha')->name('citasprestadorfecha');
Route::get('delagenda', 'API\CitaController@delAgenda')->name('delagenda');
Route::post('cita/create', 'API\CitaController@createCita')->name('createCita');
Route::put('cita/update/{cita}', 'API\CitaController@updateCita')->name('updateCita');
Route::put('cita/updatet/{cita}', 'API\CitaController@updateCitat')->name('updateCitat');
Route::get('cita/{cita}', 'API\CitaController@getCita')->name('cita');
Route::put('cita/delete/{cita}', 'API\CitaController@deleteCita')->name('deleteCita');
Route::put('cita/update/agenda/{agenda}', 'API\CitaController@updateAgenda')->name('updateAgenda');
Route::put('cita/updateensala/{cita}', 'API\CitaController@updateCitaEstado')->name('updateCitaEstado');
Route::post('cita/trasladar', 'API\CitaController@trasladarCitas')->name('trasladarCitas');
Route::get('citas/search', 'API\CitaController@SearchCitas')->name('SearchCitas');
/*************************fin Citas************************************************/

/************************Codificadores***********************************************/
Route::get('identificadores', 'API\CodifController@getIdent')->name('identificadores');
Route::get('dptos', 'API\CodifController@getDptos')->name('dptos');
Route::get('municipios', 'API\CodifController@getMunicipios')->name('municipios');
Route::get('especialidades', 'API\CodifController@getEspecialidades')->name('especialidades');
Route::get('estadocivil', 'API\CodifController@getEstadoCivil')->name('estadocivil');
Route::get('gruposanguineo', 'API\CodifController@getGrupoSanguineo')->name('gruposanguineo');
Route::get('escolaridad', 'API\CodifController@getEscolaridad')->name('escolaridad');
Route::get('etnia', 'API\CodifController@getEtnia')->name('etnia');
Route::get('ocupacion', 'API\CodifController@getOcupacion')->name('ocupacion');
Route::get('discapacidad', 'API\CodifController@getDiscapacidad')->name('discapacidad');
Route::get('religion', 'API\CodifController@getReligion')->name('religion');
Route::get('afiliado', 'API\CodifController@getAfiliado')->name('afiliado');
Route::get('regimen', 'API\CodifController@getRegimen')->name('regimen');
Route::get('motivoconsulta', 'API\CodifController@getMotivoC')->name('motivoconsulta');
Route::get('ordenimport', 'API\CodifController@getOrdenI')->name('ordenimport');
Route::get('parentescos', 'API\CodifController@getParentescos')->name('parentescos');
Route::get('diagnosticos', 'API\CodifController@getDiagnosticos')->name('diagnosticos');
Route::get('getdiagnostico', 'API\CodifController@getDiagnostico')->name('getdiagnostico');
Route::get('getdiagodon', 'API\CodifController@getDiagodon')->name('getDiagodon');
Route::get('gettratodon', 'API\CodifController@getTratodon')->name('getTratodon');
Route::get('getodontdiag/{diag}', 'API\CodifController@getOdontDiag')->name('getOdontDiag');
Route::get('gettratdiag/{trat}', 'API\CodifController@getTratDiag')->name('getTratDiag');
Route::get('getodontdiagid', 'API\CodifController@getOdontDiagId')->name('getOdontDiagId');
Route::get('getdiagtrat', 'API\CodifController@getDiagTrat')->name('getDiagTrat');
/*************************fin codificadores*******************************************/

/************************Reportes*****************************************************/
Route::get('reportes/citas', 'API\ReportesController@getReporteCita')->name('getReporteCita');
Route::get('reportes/citas/table', 'API\ReportesController@getReporteCitaT')->name('getReporteCitaT');
/*************************fin Reportes************************************************/
