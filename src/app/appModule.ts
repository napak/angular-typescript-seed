﻿/// <amd-dependency path="angular-translate" />
/// <amd-dependency path="angular-cookie" />
/// <amd-dependency path="angular-ui-router" />
/// <amd-dependency path="angular-animate" />

// importar dependencias
import angular = require("angular");
import routesModule = require("routesModule");
import localesModule = require("localesModule");
import themesModule = require("themesModule");

"use strict";

/** Interface de la clase principal de la aplicacion que sera exportada
 * La arquitectura de la aplicacion tiene como base la libreria angular y require. Esta interface encapsula un modulo de angular y la infraestructura para registrar los diferentes componentes.
 * La libreria require es usada para permitir cargar los componentes de forma dinamica segun se vayan utilizando, evitando una carga inicial de todo el contenido de la aplicacion.
 */
interface App
{
    // #region [Propiedades]

    /** Propiedad para obtener el modulo (de angular) principal usado por la aplicacion */
    getModule(): ng.IModule;

    // #endregion [Propiedades]


    // #region [Registro]

    /** variable con la funcion para registrar un viewmodel en angular. ::ng.IControllerProvider.register()
    * @see http://docs.angularjs.org/api/ng.$controller
    * @see http://docs.angularjs.org/api/ng.$controllerProvider
    * @param _name Nombre del view-model a registrar
    * @param _viewModel clase con el view-model a registrar
    * @remarks En angular por motivos historicos, se sigue manteniendo el controlador, pero hoy dia angular se integra mas con mvvm que con mvc.
    */
    registerViewModel(_name: string, _viewModel: Function): void;
    /** funcion para registrar una directiva. ::ng.ICompileProvider.directive()
     * @see http://docs.angularjs.org/api/ng.$compile
     * @see http://docs.angularjs.org/api/ng.$compileProvider
     * @param _name Nombre de la directiva a registrar
     * @param _directive clase con la directiva a registrar
     * @return El propio proveedor de compilacion usado para registrar la directiva para permitir encadenar sentencias (a modo de fluent api)
     */
    registerDirective(_name: string, _directive: Function): ng.ICompileProvider;
    /** funcion para registrar un filtro. ::ng.IFilterProvider.register()
     * @see http://docs.angularjs.org/api/ng.$filter
     * @see http://docs.angularjs.org/api/ng.$filterProvider
     * @param _name Nombre del filtro a registrar
     * @param _filter clase con el filtro a registrar
     * @return instancia del filtro registrado, o si un mapa de filtros ha sido suministrado, entonces un mapa de las intancias de los filtros registrados
     */
    registerFilter(_name: string, _filter: Function): ng.IServiceProvider;
    /** funcion para registrar un service factory. ::ng.IProvideService.factory()
     * @see http://docs.angularjs.org/api/AUTO.$provide
     * @param _name Nombre del service factory a registrar
     * @param _serviceFactory clase con el service factory a registrar (internamente esto es una abreviatura para $provide.provider(name, {$get: $getFn}).
     * @return instancia del service factory registrado 
     */
    registerFactory(_name: string, _serviceFactory: Function): ng.IServiceProvider;
    /** funcion para registrar un constructor de servicio que sera invocado con el operador new para crear la instancia del servicio. ::ng.IProvideService.service()
     * @see http://docs.angularjs.org/api/AUTO.$provide
     * @param _name Nombre del servicio a registrar
     * @param _service clase con el filtro a registrar
     * @return instancia del constructor de servicio registrado
     */
    registerService(_name: string, _service: Function): ng.IServiceProvider;
    
    // #endregion [Registro]
}

/** @Brief Implementacion de la clase principal de la aplicacion.
 * La arquitectura de la aplicacion tiene como base la libreria angular y require. Esta clase encapsula un modulo de angular y la infraestructura para registrar los diferentes componentes.
 * La libreria require es usada para permitir cargar los componentes de forma dinamica segun se vayan utilizando, evitando una carga inicial de todo el contenido de la aplicacion.
 */
class AppImpl implements App
{

    // #region [Variables miembro]

    /** Variable con el modulo de la aplicacion*/
    private m_module: ng.IModule;

    /** Objeto para la gestion de temas en la aplicacion */
    private m_themes: themesModule.Themes;
    /** Objeto para la gestion de rutas en la aplicacion */
    private m_routes: routesModule.Routes;
    /** Objeto para la gestion de idiomas en la aplicacion */
    private m_locales: localesModule.Locales;

    /** variable con la funcion para registrar un viewmodel en angular. ::ng.IControllerProvider.register()
    * @see http://docs.angularjs.org/api/ng.$controller
    * @see http://docs.angularjs.org/api/ng.$controllerProvider
    * @param _name Nombre del view-model a registrar
    * @param _viewModel clase con el view-model a registrar
    * @remarks En angular por motivos historicos, se sigue manteniendo el controlador, pero hoy dia angular se integra mas con mvvm que con mvc.
    */
    private m_registerViewModel: (_name: string, _viewModel: Function) => void;
    /** variable con la funcion para registrar una directiva. ::ng.ICompileProvider.directive()
    * @see http://docs.angularjs.org/api/ng.$compile
    * @see http://docs.angularjs.org/api/ng.$compileProvider
    * @param _name Nombre de la directiva a registrar
    * @param _directive clase con la directiva a registrar
    * @return El propio proveedor de compilacion usado para registrar la directiva para permitir encadenar sentencias (a modo de fluent api)
    */
    private m_registerDirective: (_name: string, _directive: Function) => ng.ICompileProvider;
    /** variable con la funcion para registrar un filtro. ::ng.IFilterProvider.register()
    * @see http://docs.angularjs.org/api/ng.$filter
    * @see http://docs.angularjs.org/api/ng.$filterProvider
    * @param _name Nombre del filtro a registrar
    * @param _filter clase con el filtro a registrar
    * @return instancia del filtro registrado, o si un mapa de filtros ha sido suministrado, entonces un mapa de las intancias de los filtros registrados
    */
    private m_registerFilter: (_name: string, _filter: Function) => ng.IServiceProvider;
    /** variable con la funcion para registrar un service factory. ::ng.IProvideService.factory()
    * @see http://docs.angularjs.org/api/AUTO.$provide
    * @param _name Nombre del service factory a registrar
    * @param _serviceFactory clase con el service factory a registrar (internamente esto es una abreviatura para $provide.provider(name, {$get: $getFn}).
    * @return instancia del service factory registrado 
    */
    private m_registerFactory: (_name: string, _serviceFactory: Function) => ng.IServiceProvider;
    /** variable con la funcion para registrar un constructor de servicio que sera invocado con el operador new para crear la instancia del servicio. ::ng.IProvideService.service()
    * @see http://docs.angularjs.org/api/AUTO.$provide
    * @param _name Nombre del servicio a registrar
    * @param _service clase con el filtro a registrar
    * @return instancia del constructor de servicio registrado
    */
    private m_registerService: (_name: string, _service: Function) => ng.IServiceProvider;

    // #endregion [Variables miembro]


    /** Constructor por defecto de la clase (Debera ser invocado despues de haberse inicializado el documento HTML)
     * @param _initialized Funcion que sera invocada cuando se haya inicializado la clase de la aplicacion principal 
     */
    constructor(_initialized: () => void)
    {
        // inicializar el tema primero, esto es requerido para incluir estilos y librerias requeridas por el tema a usar.
        // una vez se haya inicializado el tema, se podra inicializar el resto de los objetos e invocar la funcion indicando que ha sido inicializada la clase
        this.m_themes = new themesModule.Themes((_angularModules) =>
        {
            // array de modulos por defecto a establecer en el modulo de angular
            var modules: string[] = ["ngSanitize", "ngAnimate", "ui.router", "ngCookies", "pascalprecht.translate"];
            // crear el modulo con la aplicacion principal basada en angular, incluir modulos por defecto y los modulos del tema
            this.m_module = angular.module(APP_NAME, modules.concat(_angularModules));

            // inicializar objetos para la gestion de idiomas y rutas
            this.m_routes = new routesModule.Routes();
            this.m_locales = new localesModule.Locales(this.m_module);

            // inicializar la funcion de configuracion de angular
            this._angularConfig();

            // inicializar la funcion de ejecucion de angular
            //this._angularRun();

            // invocar callback de inicializacion
            _initialized();
        });
    }


    // #region [Propiedades]

    /** Propiedad para obtener el modulo (de angular) principal usado por la aplicacion */
    getModule(): ng.IModule
    {
        return this.m_module;
    }

    // #endregion [Propiedades]


    // #region [Registro]

    /** funcion para registrar un viewmodel en angular. ::ng.IControllerProvider.register()
    * @see http://docs.angularjs.org/api/ng.$controller
    * @see http://docs.angularjs.org/api/ng.$controllerProvider
    * @param _name Nombre del view-model a registrar
    * @param _viewModel clase con el viewmodel a registrar
    * @remarks En angular por motivos historicos, se sigue manteniendo el controlador, pero hoy dia angular se integra mas con mvvm que con mvc.
    */
    registerViewModel(_name: string, _viewModel: Function): void
    {
        this.m_registerViewModel(_name, _viewModel);
    }

    /** funcion para registrar una directiva. ::ng.ICompileProvider.directive()
    * @see http://docs.angularjs.org/api/ng.$compile
    * @see http://docs.angularjs.org/api/ng.$compileProvider
    * @param _name Nombre de la directiva a registrar
    * @param _directive clase con la directiva a registrar
    * @return El propio proveedor de compilacion usado para registrar la directiva para permitir encadenar sentencias (a modo de fluent api)
    */
    registerDirective(_name: string, _directive: Function): ng.ICompileProvider
    {
        return this.m_registerDirective(_name, _directive);
    }

    /** funcion para registrar un filtro. ::ng.IFilterProvider.register()
    * @see http://docs.angularjs.org/api/ng.$filter
    * @see http://docs.angularjs.org/api/ng.$filterProvider
    * @param _name Nombre del filtro a registrar
    * @param _filter clase con el filtro a registrar
    * @return instancia del filtro registrado, o si un mapa de filtros ha sido suministrado, entonces un mapa de las intancias de los filtros registrados
    */
    registerFilter(_name: string, _filter: Function): ng.IServiceProvider
    {
        return this.m_registerFilter(_name, _filter);
    }

    /** funcion para registrar un service factory. ::ng.IProvideService.factory()
    * @see http://docs.angularjs.org/api/AUTO.$provide
    * @param _name Nombre del service factory a registrar
    * @param _serviceFactory clase con el service factory a registrar (internamente esto es una abreviatura para $provide.provider(name, {$get: $getFn}).
    * @return instancia del service factory registrado 
    */
    registerFactory(_name: string, _serviceFactory: Function): ng.IServiceProvider
    {
        return this.m_registerFactory(_name, _serviceFactory);
    }

    /** funcion para registrar un constructor de servicio que sera invocado con el operador new para crear la instancia del servicio. ::ng.IProvideService.service()
    * @see http://docs.angularjs.org/api/AUTO.$provide
    * @param _name Nombre del servicio a registrar
    * @param _service clase con el filtro a registrar
    * @return instancia del constructor de servicio registrado
    */
    registerService(_name: string, _service: Function): ng.IServiceProvider
    {
        return this.m_registerService(_name, _service);
    }

    // #endregion [Registro]
    

    // #region [Funciones privadas]

    /** Funcion para inicializar la funcion de configuracion del modulo principal de angular.
    * (Sera invocada por angular para configurar los diferentes proveedores de servicios)
    */
    private _angularConfig()
    {        
        // crear el array con los proveedores que seran inyectados en la funcion de configuracion y crear la funcion de configuracion de angular
        // NOTA: la funcion debe contener los parametros a inyectar en el mismo orden
        var fn: any[] =
            ["$controllerProvider", "$compileProvider", "$filterProvider", "$provide", "$httpProvider", "$stateProvider", "$urlRouterProvider", "$translateProvider",
                ($controllerProvider: ng.IControllerProvider, $compileProvider: ng.ICompileProvider, $filterProvider: ng.IFilterProvider, $provide: ng.auto.IProvideService, $httpProvider: ng.IHttpProvider,
                    $stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, $translateProvider: ng.translate.ITranslateProvider) =>
                {
                    // limpiar url (para que trabaje correctamente en windows phone)
                    //$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);

                    // asignar funciones de registro de angular para permitir registrar los diferentes componentes en runtime
                    this.m_registerViewModel = $controllerProvider.register;
                    this.m_registerDirective = $compileProvider.directive;
                    this.m_registerFilter = $filterProvider.register;
                    this.m_registerFactory = $provide.factory;
                    this.m_registerService = $provide.service;

                    // configurar las rutas de la aplicacion (usar rutas con el tema actual)
                    this.m_routes.configure($stateProvider, $urlRouterProvider,
                        BASE_URL + "app/views/" + themesModule.enumThemes[themesModule.Themes.Theme] + "/",
                        BASE_URL + "app/viewmodels/" + themesModule.enumThemes[themesModule.Themes.Theme] + "/"); 

                    // configurar sistema de gestion de idiomas
                    this.m_locales.configure($translateProvider);
                }];

        // inicializar la funcion de configuracion de angular
        this.m_module.config(fn);
    }

    /** Funcion para inicializar la funcion de ejecucion del modulo principal de angular (funcion que sera invocada por angular al cargarse el ambito raiz)
     * @return array compuesto por la funcion de ejecucion que sera usada por angular, precedido por los parametros a injectar en la funcion, este array debera ser 
     * establecido en la funcion 'run' de angular.
     */
    private _angularRun()
    {
        // crear el array con los parametros que seran inyectados en la funcion de ejecucion y crear la funcion de ejecucion de angular 
        // NOTA: la funcion debe contener los parametros a inyectar en el mismo orden
        var fn: any[] =
            ["$rootScope", "$location", "authService",
                ($rootScope: ng.IRootScopeService, $location: ng.ILocationService, authService: any) => 
                {
                    // TODO: falta implementar
                    // añadir un evento de cambio de ruta
                    //$rootScope.$on("$routeChangeStart", function (event, next, current)
                    //{
                    //    if (next && next.$$route && next.$$route.secure)
                    //    {
                    //        if (!authService.user.isAuthenticated)
                    //        {
                    //            $rootScope.$evalAsync(function ()
                    //            {
                    //                authService.redirectToLogin();
                    //            });
                    //        }
                    //    }
                    //});

                }];

        this.m_module.run(fn);
    }

    // #endregion [Funciones privadas]
}

// crear la instancia de la aplicaicon principal a exportar
// HACK: para exportar la propia intancia en typescript 1.0, una forma es hacer un merge de la interface y la clase, de esta forma se puede exportar la instancia de la clase mediante la interface.
var App: App = new AppImpl(() =>
{
    // Ahora que esta inicializada la clase de la aplicacion principal, se inicializa la aplicacion mediante angular
    angular.bootstrap(document, [APP_NAME]);
});

export = App;