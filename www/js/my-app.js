
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
  view: {
    pushState: true,
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
      path: '/cargarMaterias/:carrera/',
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
      path: '/materiaPendiente/:idMateria/:nombreMateria/:correlativas/:correlativasRegulares/',
      url: 'materiaPendiente.html'
    },
    {
      path: '/materiaAprobada/:idMateria/:nombreMateria/:nota/:fecha/',
      url: 'materiaAprobada.html'
    },
    {
      path: '/materiaDesaprobada/:idMateria/:nombreMateria/:nota/',
      url: 'materiaDesaprobada.html'
    },
    {
      path: '/materiaRegular/:idMateria/:nombreMateria/',
      url: 'materiaRegular.html'
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
    },
    {
      path: '/adminHome/',
      url: 'adminHome.html'
    },
    {
      path: '/adminSeleccionarCarrera/',
      url: 'adminSeleccionarCarrera.html'
    },
    {
      path: '/adminCargarCarrera/',
      url: 'adminCargarCarrera.html'
    },
    {
      path: '/soporte/',
      url: 'soporte.html'
    },
    {
      path: '/reportarError/',
      url: 'reportarError.html'
    },
    {
      path: '/solicitarCarrera/',
      url: 'solicitarCarrera.html'
    },
    {
      path: '/serColaborador/',
      url: 'serColaborador.html'
    },
    {
      path: '/tutorial/',
      url: 'tutorial.html'
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

  $$('#botonRegistro').on('click', function () {
    validarRegistro();
  })
})


$$(document).on('page:init', '.page[data-name="primerInicio"]', function (e) {
  var nombre = app.view.main.router.currentRoute.params.nombre;
  $$('#tituloPrimerInicio').text('Bienvenidx ' + nombre + ' :)');
  cargarCarreras();
  $$('#botonPrimerInicio').on('click', function () {
    validarCarreraSeleccionada();
  })
});

$$(document).on('page:beforein', '.page[data-name="home"]', function (e) {
  $$('.botonAtras').addClass('oculto');
  $$('.menuIconContenedor').removeClass('oculto');
});

$$(document).on('page:reinit', '.page[data-name="home"]', function (e) {

  cargarPorcentajeCarrera(carreraSeleccionada);
  //En el select seteo la carrera actualmente seleccionada
  console.log("Se cambia el valor del Select.");
  $$('#selectorCarreraHome').val(carreraSeleccionada);
});




$$(document).on('page:init', '.page[data-name="home"]', function (e) {

  document.addEventListener("offline", onOffline, false);

  function onOffline() {
    var toastSinConexion = app.toast.create({
      icon: '<i style:"font-size:18px;" class="exclamationmark_triangle_fill"></i>',
      text: 'No tenés conexión a internet :( Para usar la app debés estar conectado.',
      position: 'center',
      closeTimeout: 4000,
    });
    toastSinConexion.open();
    setTimeout(function(){ 
      navigator.app.exitApp();
     }, 4000);
    
  }

  document.addEventListener("backbutton", onBackKeyDown, false);

  function onBackKeyDown() {
    var currentPage = app.views.main.router.url;
    console.log("Current page: " + currentPage);
    if (currentPage == "/home/" || currentPage == "/index/" || app.view.main.history.length == 1) {
      app.toast.create({
        text: 'Presioná SALIR para cerrar la app.',
        closeButton: true,
        closeButtonText: 'Salir',
        closeButtonColor: 'green',
        closeTimeout: 2000,
        on: {
          closeButtonClick: function () {
            navigator.app.exitApp();
            e.preventDefault();
          },
        }
      }).open();
    } else {
      mainView.router.back();
    }
    return true;
  };

  var cantidadDeClicksEnSombrero = 0;
  console.log(usuario);
  console.log("(init) La carrera seleccionada actualmente es: " + carreraSeleccionada);

  //Como para cargar el id de carrera debo consultar la BD, espero a que la promesa esté resuelta para cargar el procentaje.
  var resultado = cargarCarrerasDelUsuario()
    .then(function (carreraObtenida) {
      console.log("La carrera obtenida es: "+carreraObtenida);
      if (carreraObtenida == null) {
        console.log("No hay carrera cargada.");
        mainView.router.navigate('/primerInicio/' + nombre + '/');
      } else {
        verificarTutorial();
        cargarPorcentajeCarrera(carreraObtenida);
        carreraSeleccionada = carreraObtenida;
        $$('.fotoPerfil').css('background-image', 'url("' + fotoPerfil + '")');
        console.log(rol);
        if (rol == 'admin') {
          $$('#adminLinkPanel').removeClass('oculto');
        }
        //En el select seteo la carrera actualmente seleccionada
        $$('#selectorCarreraHome').val(carreraSeleccionada);
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
  var idCarrera = app.view.main.router.currentRoute.params.carrera;
  cargarListaCorrelatividades(idCarrera);
  $$('#adminSubirMateria').on('click', function () {
    adminSubirMateria(idCarrera);
  })
})

$$(document).on('page:init', '.page[data-name="listadoMaterias"]', function (e) {
  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');
  generarTabsListadoMaterias();
  //listarMaterias();
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
  cargarMateriasEnAgregarFinalDesaprobado(materiaPasadaPorRuta);
  cargarMateriasEnAgregarMateriaRegularizada(materiaPasadaPorRuta);
  var calendarDefault = app.calendar.create({
    inputEl: '#demo-calendar-default',
    dateFormat: 'mm/dd/yyyy'
  });
  $$('#agregarMateriaAprobada').on('click', function () {
    validarMateriaAprobada();
  });
  $$('#agregarFinalDesAprobado').on('click', function () {
    validarFinalDesAprobado();
  });
  $$('#agregarMateriaRegular').on('click', function () {
    agregarMateriaRegularizada();
  });
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
  var materiasCorrelativasRegularesRestantes = app.view.main.router.currentRoute.params.correlativasRegulares;
  var nombreMateria = app.view.main.router.currentRoute.params.nombreMateria;
  idMateriaRuta = app.view.main.router.currentRoute.params.idMateria;
  mostrarDatosMateriaPendiente(nombreMateria, materiasCorrelativasRestantes,materiasCorrelativasRegularesRestantes);

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
});


$$(document).on('page:beforein', '.page[data-name="materiaDesaprobada"]', function (e) {
  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');
  var idMateriaDesaprobadaRuta = '';
  var nombreMateriaDesaprobada = '';
  var notaMateriaDesaprobada = '';
})

$$(document).on('page:init', '.page[data-name="materiaDesaprobada"]', function (e) {
  idMateriaDesaprobadaRuta = app.view.main.router.currentRoute.params.idMateria;
  nombreMateriaDesaprobada = app.view.main.router.currentRoute.params.nombreMateria;
  notaMateriaDesaprobada = app.view.main.router.currentRoute.params.nota;

  $$('#materiaDesaprobadaNombreMateria').text(nombreMateriaDesaprobada);
  $$('#materiaDesaprobadaNota').val(notaMateriaDesaprobada);
  $$('#materiaDesaprobadaIdMateria').val(idMateriaDesaprobadaRuta);

  $$('#actualizarMateriaDesaprobada').on('click', function () {
    validarActualizacionMateriaDesaprobada();
  })

  $$('#quitarMateriaDesaprobada').on('click', function () {
    app.dialog.confirm('Este final será removido', '¿Estás segurx?', function () {
      quitarMateriaDesaprobada();
    });
  });
});


$$(document).on('page:beforein', '.page[data-name="materiaRegular"]', function (e) {
  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');
  var idMateriaRuta = '';
  var nombreMateriaRuta = '';
})

$$(document).on('page:init', '.page[data-name="materiaRegular"]', function (e) {
  nombreMateriaRuta = app.view.main.router.currentRoute.params.nombreMateria;
  idMateriaRuta = app.view.main.router.currentRoute.params.idMateria;

  $$('#materiaregularNombreMateria').text(nombreMateriaRuta);
  $$('#materiaRegularIdMateria').val(idMateriaRuta);
  
  $$('#irAAgregarMateriaDesdeRegular').on('click', function () {
    mainView.router.navigate('/agregarMateria/' + idMateriaRuta + '/');
  });

  $$('#quitarMateriaRegular').on('click', function () {
    app.dialog.confirm('La materia pasará a Materias Pendientes', '¿Estás segurx?', function () {
      moverMateriaDeRegularAPendientes();
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
        onClick: function () { app.popup.open(".popup-galeria"); }
      }
    ]
  });


  $$('#botonSubirFotoPerfil').on('click', function () {
    actionSheetCamaraMiPerfil.open();
  });


  $$("#subirImagenDeGaleria").on('click', function () {
    if ($$('#archivo').val().length) {
      $$("#subirImagenDeGaleria").text("Subiendo imagen");
      $$("#subirImagenDeGaleria").addClass("disabled");
      var archivo = document.getElementById("archivo").files[0];
      var storageRef = firebase.storage().ref();
      var nombreFoto = "fotoPerfil" + usuario;
      var uploadTask = storageRef.child('fotosDePerfil/' + nombreFoto + '.jpg').put(archivo);
      uploadTask.on('state_changed', function (snapshot) {
        //console.log(snapshot);
        $$("#imagenProgresoTexto").removeClass("oculto");
        $$("#imagenProgreso").removeClass("oculto");
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress.toFixed(2) + '% done');
        $$("#imagenProgresoTexto").text("Cargando imagen: " + progress.toFixed(2) + "%");
        app.progressbar.set("#imagenProgreso", progress.toFixed(2), 100);
      }, function (error) {
        console.log(error);
        var toastImagenError = app.toast.create({
          icon: '<i class="f7-icons">xmark_circle</i>',
          text: 'Hubo un error al subir la imagen.',
          position: 'center',
          closeTimeout: 2000,
        });
        toastImagenError.open();
      }, function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          var toastImagenOK = app.toast.create({
            icon: '<i class="f7-icons">checkmark_alt</i>',
            text: 'Imagen subida correctamente.',
            position: 'center',
            closeTimeout: 2000,
          });
          toastImagenOK.open();
          $$("#subirImagenDeGaleria").text("Subir imagen");
          $$("#subirImagenDeGaleria").removeClass("disabled");
          fotoPerfil = downloadURL;
          console.log("Foto perfil: " + fotoPerfil);
          $$(".fotoPerfil").css("background-image", "url(" + fotoPerfil + ")");
          actualizarFotoPerfil();
          app.popup.close(".popup-galeria");
          $$("#imagenProgresoTexto").addClass("oculto");
          $$("#imagenProgreso").addClass("oculto");
        });
      });
    } else {
      var toastImagenNoHayImagen = app.toast.create({
        icon: '<i class="f7-icons">xmark_circle</i>',
        text: 'No se seleccionó ninguna imagen.',
        position: 'center',
        closeTimeout: 2000,
      });
      toastImagenNoHayImagen.open();
    }


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
    compararProgreso(carreraElegidaEnEstadisticas);
  });

  //Charts
  mostrarGrafico(carreraElegidaEnEstadisticas);

  compararProgreso(carreraElegidaEnEstadisticas);


});

$$(document).on('page:init', '.page[data-name="recuperarPassword"]', function (e) {
  $$('#botonRecuperarEmail').on('click', function () {
    validarMailRecuperarPassword();
  })
});

$$(document).on('page:init', '.page[data-name="misMedallas"]', function (e) {
  mostrarMedallas();
});

$$(document).on('page:beforein', '.page[data-name="soporte"]', function (e) {
  $$('.botonAtras').addClass('oculto');
  $$('.menuIconContenedor').removeClass('oculto');
});

$$(document).on('page:init', '.page[data-name="soporte"]', function (e) {

});

$$(document).on('page:beforein', '.page[data-name="reportarError"]', function (e) {
  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');
});

$$(document).on('page:init', '.page[data-name="reportarError"]', function (e) {
  $$('body').on('change', '#errorTipo', function () {
    var tipoDeErrorSeleccionado = $$('#errorTipo option:checked').val();
    mostrarPlaceholderEnReporteDeError(tipoDeErrorSeleccionado);
  });
  $$('#botonEnviarReporteError').on('click', function () {
    validarError();
  });
});

$$(document).on('page:beforein', '.page[data-name="solicitarCarrera"]', function (e) {
  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');
});

$$(document).on('page:init', '.page[data-name="solicitarCarrera"]', function (e) {
  $$('#botonEnviarSolicitudCarrera').on('click', function () {
    validarSolicitudCarrera();
  });
});

$$(document).on('page:beforein', '.page[data-name="serColaborador"]', function (e) {
  $$('.botonAtras').removeClass('oculto');
  $$('.menuIconContenedor').addClass('oculto');
});

$$(document).on('page:init', '.page[data-name="serColaborador"]', function (e) {
  $$('#botonSerColaborador').on('click', function () {
    validarSolicitudColaborador();
  });
});

//ADMIN
$$(document).on('page:init', '.page[data-name="adminSeleccionarCarrera"]', function (e) {
  var nombre = app.view.main.router.currentRoute.params.nombre;
  cargarCarreras();
  $$('#botonAdminElegirCarrera').on('click', function () {
    validarCarreraSeleccionada('admin');
  })
});

$$(document).on('page:init', '.page[data-name="adminCargarCarrera"]', function (e) {
  cargarCarreras();
  $$('#botonCargarCarrera').on('click', function () {
    cargarCarrera();
  });
});

$$(document).on('page:init', '.page[data-name="adminHome"]', function (e) {
  $$('#adminCargarMedallaColaborador').on('click', function () {
    //verificarMedalla("medallaColaborador",6);
    verificarMedallaUsuario("rjfleita@hotmail.com", "medallaColaborador", 6);
  });

  $$('#repararUsuario').on('click', function () {
    //verificarMedalla("medallaColaborador",6);
    var usuarioAReparar = $$("#usuarioAReparar").val();
    repararUsuariosConMayuscula(usuarioAReparar);
  });

  $$('#borrarMateriaSeleccionada').on('click', function () {
    var materiaABorrar = $$("#materiaABorrar").val();
    borrarMateria(materiaABorrar);
  });

  

});

/* TUTORIAL */

$$(document).on('page:init', '.page[data-name="tutorial"]', function (e) {
  tutorialVisto();
  var panel = app.panel.get('.panel-left');
  panel.disableSwipe();
});

$$(document).on('page:beforeout', '.page[data-name="tutorial"]', function (e) {
  var panel = app.panel.get('.panel-left');
  panel.enableSwipe();
})

