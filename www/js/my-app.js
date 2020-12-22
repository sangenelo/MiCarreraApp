
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    {
      path: '/registrarse/',
      url: 'registrarse.html'
    },
    {
      path: '/primerInicio/:nombre/',
      url: 'primerInicio.html'
    },
    {
      path: '/home/',
      url: 'home.html'
    },
    {
      path: '/cargarMaterias/',
      url: 'cargarMaterias.html'
    },
    {
      path: '/listadoMaterias/',
      url: 'listadoMaterias.html'
    },
    {
      path: '/agregarMateria/',
      url: 'agregarMateria.html'
    }
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');

//VARIABLES GLOBALES
var baseDeDatos;
var usuario;
var nombre;
var carreraSeleccionada;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");
});


$$(document).on('page:init', function (e) {

})

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  $$('#botonInicioSesion').on('click', function () {
    validarInicioSesion();
  })

})

$$(document).on('page:reinit', '.page[data-name="index"]', function (e) {
  $$('.botonAtras').addClass('oculto');
  $$('.menuIconContenedor').removeClass('oculto');
})


$$(document).on('page:init', '.page[data-name="registrarse"]', function (e) {

  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');

  $$('#botonRegistro').on('click', function () {
    validarRegistro();
  })
})

$$(document).on('page:init', '.page[data-name="primerInicio"]', function (e) {
  var nombre = app.view.main.router.currentRoute.params.nombre;
  $$('#tituloPrimerInicio').text('Bienvenidx ' + nombre + ' :)');
  cargarCarreras();
  $$('#botonPrimerInicio').on('click', function () {
    guardarCarrera();
  })
})

$$(document).on('page:init', '.page[data-name="home"]', function (e) {
  console.log(usuario);
  cargarCarrerasDelUsuario();
  $$('#botonHomeListadoMaterias').on('click', function () {
    mainView.router.navigate('/listadoMaterias/');
  })
})

$$(document).on('page:init', '.page[data-name="cargarMaterias"]', function (e) {
  cargarListaCorrelatividades("UJ8sQSdxEZRGbuCWH1oM");
  $$('#adminSubirMateria').on('click', function () {
    adminSubirMateria();
  })
  
  $$('#obtenerCorrelativas').on('click', function () {
    obtenerCorrelativas();
  })

})

$$(document).on('page:init', '.page[data-name="listadoMaterias"]', function (e) {
  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');
  listarMaterias();
})

$$(document).on('page:beforeout', '.page[data-name="listadoMaterias"]', function (e) {
  $$('.botonAtras').addClass('oculto');
  $$('.menuIconContenedor').removeClass('oculto');
})

$$(document).on('page:init', '.page[data-name="agregarMateria"]', function (e) {
  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');
  cargarMateriasPendientesEnAgregarMateria();
  var calendarDefault = app.calendar.create({
    inputEl: '#demo-calendar-default',
  });
  $$('#agregarMateriaAprobada').on('click', function () {
    validarMateriaAprobada();
  })
})

$$(document).on('page:beforeout', '.page[data-name="agregarMateria"]', function (e) {
  $$('.botonAtras').addClass('oculto');
  $$('.menuIconContenedor').removeClass('oculto');
})