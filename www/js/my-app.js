
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
      path: '/index/',
      url: 'index.html'
    },
    {
      path: '/registrarse/',
      url: 'registrarse.html'
    },
    {
      path: '/primerInicio/:nombre/',
      url: 'primerInicio.html'
    },
    {
      path: '/recuperarPassword/',
      url: 'recuperarPassword.html'
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
      path: '/agregarMateria/:materia/',
      url: 'agregarMateria.html'
    },
    {
      path: '/materiaPendiente/:idMateria/:nombreMateria/:correlativas/',
      url: 'materiaPendiente.html'
    },
    {
      path: '/materiaAprobada/:idMateria/:nombreMateria/:nota/:fecha/',
      url: 'materiaAprobada.html'
    },
    {
      path: '/miPerfil/',
      url: 'miPerfil.html'
    },
    {
      path: '/misCarreras/',
      url: 'misCarreras.html'
    },
    {
      path: '/agregarCarrera/',
      url: 'agregarCarrera.html'
    },
    {
      path: '/estadisticas/',
      url: 'estadisticas.html'
    },
    {
      path: '/acercaDe/',
      url: 'acercaDe.html'
    },
    {
      path: '/misMedallas/',
      url: 'misMedallas.html'
    }


  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');

//VARIABLES GLOBALES
var baseDeDatos;
var usuario;
var nombre;
var apellido;
var fotoPerfil;
var carreraSeleccionada;
var rol;

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
  var panel = app.panel.get('.panel-left');
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Usuario logueado");
      $$('.appbar').removeClass('oculto');
      usuario = user.email;
      mainView.router.navigate('/home/');
      panel.enableSwipe();
      // User is signed in.
    } else {
      // No user is signed in.
      console.log("Usuario NO logueado");
      $$('.appbar').addClass('oculto');
      panel.disableSwipe();
      $$('#pantallaLogin').removeClass('oculto');
      $$('#preloaderLogin').addClass('oculto');

    }
  });

  $$('#cerrarSesion').on('click', function () {
    firebase.auth().signOut().then(function () {
      console.log("Se cerró sesión");
      mainView.router.navigate('/index/');
    }).catch(function (error) {
      // An error happened.
    });
  })

})


$$(document).on('page:init', '.page[data-name="registrarse"]', function (e) {
  /*
    $$('.botonAtras').removeClass('oculto');
    $$('.menuIconContenedor').addClass('oculto');
  */
  $$('#botonRegistro').on('click', function () {
    validarRegistro();
  })
})
/*
$$(document).on('page:beforeout', '.page[data-name="registrarse"]', function (e) {

  $$('.botonAtras').addClass('oculto');
  $$('.menuIconContenedor').removeClass('oculto');
})
*/

$$(document).on('page:init', '.page[data-name="primerInicio"]', function (e) {
  var nombre = app.view.main.router.currentRoute.params.nombre;
  $$('#tituloPrimerInicio').text('Bienvenidx ' + nombre + ' :)');
  cargarCarreras();
  $$('#botonPrimerInicio').on('click', function () {
    validarCarreraSeleccionada();
  })
})

$$(document).on('page:beforein', '.page[data-name="home"]', function (e) {
  $$('.botonAtras').addClass('oculto');
  $$('.menuIconContenedor').removeClass('oculto');
});

$$(document).on('page:reinit', '.page[data-name="home"]', function (e) {
  cargarPorcentajeCarrera(carreraSeleccionada);
});




$$(document).on('page:init', '.page[data-name="home"]', function (e) {
  var cantidadDeClicksEnSombrero = 0;
  console.log(usuario);
  //Como para cargar el id de carrera debo consultar la BD, espero a que la promesa esté resuelta para cargar el procentaje.
  var resultado = cargarCarrerasDelUsuario()
    .then(function (carreraObtenida) {
      console.log(carreraObtenida);
      if (carreraObtenida == null) {
        console.log("No hay carrera cargada.");
        mainView.router.navigate('/primerInicio/' + nombre + '/');
      } else {
        cargarPorcentajeCarrera(carreraObtenida);
        carreraSeleccionada = carreraObtenida;
        $$('.fotoPerfil').css('background-image', 'url("' + fotoPerfil + '")');
        console.log(rol);
        if (rol == 'admin') {
          $$('#adminLinkPanel').removeClass('oculto');
        }
      }

    })
    .catch(function (error) {

      console.log("Error: " + error);

    });

  $$('#botonHomeListadoMaterias').on('click', function () {
    mainView.router.navigate('/listadoMaterias/');
  })

  $$('#iconoGraduado').on('click', function () {
    setTimeout(function () { cantidadDeClicksEnSombrero = 0 }, 5000);
    cantidadDeClicksEnSombrero++;
    if (cantidadDeClicksEnSombrero == 5) {
      var toastSorpresa = app.toast.create({
        icon: '<i style:"font-size:18px;" class="far fa-smile-wink"></i>',
        text: '¡Paciencia! Seguí estudiando y vas a llegar :)',
        position: 'center',
        closeTimeout: 2000,
      });
      toastSorpresa.open();

    }
  })



})

$$(document).on('page:reinit', '.page[data-name="home"]', function (e) {
  cargarPorcentajeCarrera(carreraSeleccionada);
  console.log("pasé por el reinit");
});

$$(document).on('page:init', '.page[data-name="cargarMaterias"]', function (e) {
  cargarListaCorrelatividades("UJ8sQSdxEZRGbuCWH1oM");
  $$('#adminSubirMateria').on('click', function () {
    adminSubirMateria();
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

var materiaPasadaPorRuta;

$$(document).on('page:init', '.page[data-name="agregarMateria"]', function (e) {
  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');
  materiaPasadaPorRuta = app.view.main.router.currentRoute.params.materia;
  cargarMateriasPendientesEnAgregarMateria(materiaPasadaPorRuta);
  var calendarDefault = app.calendar.create({
    inputEl: '#demo-calendar-default',
    dateFormat: 'mm/dd/yyyy'
  });
  $$('#agregarMateriaAprobada').on('click', function () {
    validarMateriaAprobada();
  })
})



$$(document).on('page:beforeout', '.page[data-name="agregarMateria"]', function (e) {
  $$('.botonAtras').addClass('oculto');
  $$('.menuIconContenedor').removeClass('oculto');
})

$$(document).on('page:beforein', '.page[data-name="materiaPendiente"]', function (e) {
  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');
  var idMateriaRuta = '';
})

$$(document).on('page:init', '.page[data-name="materiaPendiente"]', function (e) {
  var materiasCorrelativasRestantes = app.view.main.router.currentRoute.params.correlativas;
  var nombreMateria = app.view.main.router.currentRoute.params.nombreMateria;
  idMateriaRuta = app.view.main.router.currentRoute.params.idMateria;
  mostrarDatosMateriaPendiente(nombreMateria, materiasCorrelativasRestantes);

  $$('body').on('click', '#irAAgregarMateria', function () {
    mainView.router.navigate('/agregarMateria/' + idMateriaRuta + '/');
  });
})

$$(document).on('page:beforein', '.page[data-name="materiaAprobada"]', function (e) {
  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');
  var idMateriaAprobadaRuta = '';
  var nombreMateriaAprobada = '';
  var fechaMateriaAprobada = '';
  var notaMateriaAprobada = '';
})

$$(document).on('page:init', '.page[data-name="materiaAprobada"]', function (e) {
  idMateriaAprobadaRuta = app.view.main.router.currentRoute.params.idMateria;
  nombreMateriaAprobada = app.view.main.router.currentRoute.params.nombreMateria;
  fechaMateriaAprobada = app.view.main.router.currentRoute.params.fecha;
  notaMateriaAprobada = app.view.main.router.currentRoute.params.nota;

  var calendarDefault = app.calendar.create({
    inputEl: '#materiaAprobadaFecha',
    dateFormat: 'mm/dd/yyyy',
    value: [fechaMateriaAprobada]
  });


  $$('#materiaAprobadaNombreMateria').text(nombreMateriaAprobada);
  $$('#materiaAprobadaNota').val(notaMateriaAprobada);
  $$('#materiaAprobadaIdMateria').val(idMateriaAprobadaRuta);

  $$('#actualizarMateriaAprobada').on('click', function () {
    validarActualizacionMateriaAprobada();
  })

  $$('#quitarMateriaAprobada').on('click', function () {
    app.dialog.confirm('La materia pasará a Materias Pendientes', '¿Estás segurx?', function () {
      moverMateriaDeAprobadasAPendientes();
    });
  });
})

$$(document).on('page:beforein', '.page[data-name="miPerfil"]', function (e) {
  $$('.botonAtras').addClass('oculto');
  $$('.menuIconContenedor').removeClass('oculto');
});

$$(document).on('page:init', '.page[data-name="miPerfil"]', function (e) {
  $$('#miPerfilEmailInput').val(usuario);
  $$('#miPerfilNombreInput').val(nombre);
  $$('#miPerfilApellidoInput').val(apellido);
  $$('.fotoPerfil').css('background-image', 'url("' + fotoPerfil + '")');
  $$('#miPerfilNombreInput').keyup(function () {
    $$('#miPerfilActualizarDatos').removeClass('disabled');
  });
  $$('#miPerfilApellidoInput').keyup(function () {
    $$('#miPerfilActualizarDatos').removeClass('disabled');
  });
  $$('#miPerfilActualizarDatos').on('click', function () {
    validarNombreYApelldioMiPerfil();
  });
  $$('#eliminarUsuario').on('click', function () {
    app.dialog.confirm('El usuario y todos sus datos serán eliminados por completo', '¿Estás segurx?', function () {
      borrarUsuario();
    });
  });

  var actionSheetCamaraMiPerfil = app.actions.create({
    buttons: [
      {
        text: 'Tomar foto',
        onClick: function () { funcionCamara(); }
      },
      {
        text: 'Elegir de la galería',
        onClick: function () { funcionGaleria(); }
      }
    ]
  })

  $$('#botonSubirFotoPerfil').on('click', function () {
    actionSheetCamaraMiPerfil.open();
  });

});

$$(document).on('page:beforein', '.page[data-name="misCarreras"]', function (e) {
  $$('.botonAtras').addClass('oculto');
  $$('.menuIconContenedor').removeClass('oculto');
});

$$(document).on('page:init', '.page[data-name="misCarreras"]', function (e) {
  listarCarreras();

});

$$(document).on('page:beforein', '.page[data-name="agregarCarrera"]', function (e) {
  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');
});

$$(document).on('page:init', '.page[data-name="agregarCarrera"]', function (e) {
  cargarCarreras();
  $$('#botonPrimerInicio').on('click', function () {
    guardarCarrera();
  });
});

$$(document).on('page:init', '.page[data-name="estadisticas"]', function (e) {
  cargarCarrerasEnEstadisticas();
  var carreraElegidaEnEstadisticas = carreraSeleccionada;
  console.log("Carrera elegida en estadisticas: " + carreraElegidaEnEstadisticas);
  //Detecto cambio en el <select> de Carreras
  $$('body').on('change', '#selectorCarreraEstadisticas', function () {
    carreraElegidaEnEstadisticas = $$('#selectorCarreraEstadisticas option:checked').val();
    mostrarGrafico(carreraElegidaEnEstadisticas);
  });

  //Charts
  mostrarGrafico(carreraElegidaEnEstadisticas);


});

$$(document).on('page:init', '.page[data-name="recuperarPassword"]', function (e) {
  $$('#botonRecuperarEmail').on('click', function () {
    validarMailRecuperarPassword();
  })
});

$$(document).on('page:init', '.page[data-name="misMedallas"]', function (e) {
  mostrarMedallas();
})

