var medallas = [
    {
        nombre: "El diego",
        descripcion: "Obtuviste un 10 en una materia.",
        rutaImagen: "https://firebasestorage.googleapis.com/v0/b/micarrera-4c1fc.appspot.com/o/medallas%2FelDiego.png?alt=media&token=78513978-8a32-4daa-bb53-6bd7a8374116",
        id: "medallaDiego"
    },
    {
        nombre: "El primer paso",
        descripcion: "Un pequeño paso para la carrera... un gran paso para el estudiante. Aprobaste tu primera materia.",
        rutaImagen: "https://firebasestorage.googleapis.com/v0/b/micarrera-4c1fc.appspot.com/o/medallas%2FprimerPaso.png?alt=media&token=81558b2a-f89a-43d8-85a8-501280e6d3b2",
        id: "medallaPrimerPaso"
    },
    {
        nombre: "Primer cuarto",
        descripcion: "Ya aprobaste el 25% de las materias. ¡Seguí así!",
        rutaImagen: "https://firebasestorage.googleapis.com/v0/b/micarrera-4c1fc.appspot.com/o/medallas%2F25.png?alt=media&token=696a7ea8-a29c-45b1-8685-63019a716ed1",
        id: "medallaPrimerCuarto"
    },
    {
        nombre: "El vaso medio lleno",
        descripcion: "Ya hiciste la mitad de la carrera. ¡Vamos por más!",
        rutaImagen: "https://firebasestorage.googleapis.com/v0/b/micarrera-4c1fc.appspot.com/o/medallas%2F50.png?alt=media&token=3f8fb096-9b69-4d9c-b84f-8b87e7c0bb1e",
        id: "medallaMitad"
    },
    {
        nombre: "Cada vez más cerca",
        descripcion: "Ya aprobaste el 75% de las materias. ¡Un esfuerzo más!",
        rutaImagen: "https://firebasestorage.googleapis.com/v0/b/micarrera-4c1fc.appspot.com/o/medallas%2F75.png?alt=media&token=64d69ad5-2ab6-495c-ab8c-188f6521b36b",
        id: "medalla75"
    },
    {
        nombre: "La gloria máxima",
        descripcion: "¡Lo lograste! Te graduaste.",
        rutaImagen: "https://firebasestorage.googleapis.com/v0/b/micarrera-4c1fc.appspot.com/o/medallas%2Fgraduado.png?alt=media&token=08860a0e-c739-4b08-aa74-ea9fcf077b15",
        id: "medallaGraduado"
    },
    {
        nombre: "Colaborador/a",
        descripcion: "¡Gracias por tu ayuda! Tu aporte fue importante para la app :)",
        rutaImagen: "https://firebasestorage.googleapis.com/v0/b/micarrera-4c1fc.appspot.com/o/medallas%2Fcolaborador.png?alt=media&token=59271b55-187a-4a47-a14b-bb251b10edaa",
        id: "medallaColaborador"
    }

];

function mostrarMedallas() {
    var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

    refUsuario.get()
        .then(function (doc) {
            var medallasUsuario = doc.data().medallas;
            for (var i = 0; i < medallasUsuario.length; i++) {
                $$('#medalleroUsuario').append('<div class="col-33 text-align-center"><a href="#" class="link popover-open"data-popover="#' + medallasUsuario[i].id + '"><div class="medallaContenedor text-align-center"><div class="medallaTitulo text-align-center">' + medallasUsuario[i].nombre + '</div><img src="' + medallasUsuario[i].rutaImagen + '"></div></a></div>');
                $$('#contenedorPopovers').append('<div id="' + medallasUsuario[i].id + '" class="popover"><div class="popover-inner"><div class="block"><p>' + medallasUsuario[i].nombre + '</p><p>' + medallasUsuario[i].descripcion + '</p></div></div></div>');
            }
            $$('#preloaderMisMedallas').addClass('oculto');
            $$('#medalleroUsuario').removeClass('oculto');
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function verificarMedalla(idMedalla,numeroMedalla) {
    var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

    refUsuario.get()
        .then(function (doc) {
            var medallasUsuario = doc.data().medallas;
            var yaTieneLaMedalla = false;
            if (medallasUsuario.length != 0) {
                for (var i = 0; i < medallasUsuario.length; i++) {
                    if (medallasUsuario[i].id == idMedalla) {
                        yaTieneLaMedalla = true;
                        break;
                    }
                }
            }
            if (!yaTieneLaMedalla) {
                //Ahora actualizo el array de medallas del usuario
                console.log("Ganaste medalla "+idMedalla);
                refUsuario.update({
                    "medallas": firebase.firestore.FieldValue.arrayUnion(medallas[numeroMedalla])
                })


                    .then(function () {

                        console.log("Medalla agregada correctamente.");
                        cordova.plugins.notification.local.schedule({
                            title: '¡Ganaste una medalla!',
                            text: 'La medalla que ganaste es: "'+medallas[numeroMedalla].nombre+'".',
                            foreground: true,
                            vibrate: true,
                            smallIcon: "../img/smallIcon.png",
                            trigger: { in: 1, unit: 'second' },
                            icon:medallas[numeroMedalla].rutaImagen
                          });
                      
                        
                        cordova.plugins.notification.local.on('click', function (notification) {
                          mainView.router.navigate('/misMedallas/');
                      }, this);

                    })
                    .catch(function (error) {

                        console.log("Error: " + error);

                    });
            }

        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function verificarMedallaUsuario(usuarioElegido,idMedalla,numeroMedalla) {
    var refUsuario = baseDeDatos.collection("Usuarios").doc(usuarioElegido);

    refUsuario.get()
        .then(function (doc) {
            var medallasUsuario = doc.data().medallas;
            var yaTieneLaMedalla = false;
            if (medallasUsuario.length != 0) {
                for (var i = 0; i < medallasUsuario.length; i++) {
                    if (medallasUsuario[i].id == idMedalla) {
                        yaTieneLaMedalla = true;
                        break;
                    }
                }
            }
            if (!yaTieneLaMedalla) {
                //Ahora actualizo el array de medallas del usuario
                console.log("Ganaste medalla "+idMedalla);
                refUsuario.update({
                    "medallas": firebase.firestore.FieldValue.arrayUnion(medallas[numeroMedalla])
                })


                    .then(function () {

                        console.log("Medalla agregada correctamente.");
                        cordova.plugins.notification.local.schedule({
                            title: '¡Ganaste una medalla!',
                            text: 'La medalla que ganaste es: "'+medallas[numeroMedalla].nombre+'".',
                            foreground: true,
                            vibrate: true,
                            smallIcon: "../img/smallIcon.png",
                            trigger: { in: 1, unit: 'second' },
                            icon:medallas[numeroMedalla].rutaImagen
                          });
                      
                        
                        cordova.plugins.notification.local.on('click', function (notification) {
                          mainView.router.navigate('/misMedallas/');
                      }, this);

                    })
                    .catch(function (error) {

                        console.log("Error: " + error);

                    });
            }

        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}