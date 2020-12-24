function actualizarDatosPerfil(nombre, apellido) {
  $$('#miPerfilActualizarDatos').addClass('disabled');
  $$('#miPerfilActualizarDatos').text('Actualizando datos');

  baseDeDatos = firebase.firestore();
  var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
  referenciaUsuario.update
    ({
      nombre: nombre,
      apellido: apellido
    })
    .then(function () {

      var toastConfirmacionUsuarioActualizado = app.toast.create({
        icon: '<i class="f7-icons">checkmark_alt</i>',
        text: 'Usuario actualizado correctamente.',
        position: 'center',
        closeTimeout: 2000,
      });
      toastConfirmacionUsuarioActualizado.open();
      $$('#miPerfilActualizarDatos').text('Actualizar datos');

    })
    .catch(function (error) {

      console.log("Error: " + error);

    });
}

function borrarUsuario() {
  baseDeDatos.collection("Usuarios").doc(usuario).delete().then(function () {
    console.log("Usuario eliminado de BD");
    var user = firebase.auth().currentUser;

    user.delete().then(function () {
      console.log("Usuario eliminado de Autenticación");
      var toastConfirmacionUsuarioEliminado = app.toast.create({
        icon: '<i class="f7-icons">checkmark_alt</i>',
        text: 'Usuario eliminado correctamente.',
        position: 'center',
        closeTimeout: 2000,
      });
      toastConfirmacionUsuarioEliminado.open();
      mainView.router.navigate('/index/');
    }).catch(function (error) {
      // An error happened.
    });
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });
}

function funcionGaleria() {
  navigator.camera.getPicture(onSuccessCamera, onErrorCamera,
    {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}

function funcionCamara() {
  console.log('Soy la camara');
  navigator.camera.getPicture(onSuccessCamera, onErrorCamera,
    {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      cameraDirection: Camera.Direction.FRONT,
      targetWidth: 300,
      targetHeight: 300
    });
}

function onSuccessCamera(imageURI) {
  $$('.fotoPerfil').css('background-image', 'url("' + imageURI + '")');

  var storageRef = firebase.storage().ref();
  var getFileBlob = function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener('load', function () {
      cb(xhr.response);
    });
    xhr.send();
  };

  var blobToFile = function (blob, name) {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    return blob;
  };

  var getFileObject = function (filePathOrUrl, cb) {
    getFileBlob(filePathOrUrl, function (blob) {
      cb(blobToFile(blob, 'test.jpg'));
    });
  };

  getFileObject(imageURI, function (fileObject) {
    var nombreFoto = "fotoPerfil" + usuario;
    var uploadTask = storageRef.child('fotosDePerfil/' + nombreFoto + '.jpg').put(fileObject);

    uploadTask.on('state_changed', function (snapshot) {
      console.log(snapshot);
    }, function (error) {
      console.log(error);
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL);
        fotoPerfil = downloadURL;
        actualizarFotoPerfil();
      });
    });
  });

}

function actualizarFotoPerfil() {


  baseDeDatos.collection("Usuarios").doc(usuario).update
    ({
      fotoPerfil: fotoPerfil
    })
    .then(function () {

      console.log("Se actualizó la imagen de perfil");

    })
    .catch(function (error) {

      console.log("Error: " + error);

    });
}


function onErrorCamera(message) {
  alert('Failed because: ' + message);
}

function listarCarreras() {
  $$('#misCarrerasListaCarreras').empty();
  baseDeDatos = firebase.firestore();
  var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

  refUsuario.get()
    .then(function (doc) {
      for (var i = 0; i < doc.data().carreras.length; i++) {
        $$('#misCarrerasListaCarreras').append('<li><a href="#" id="' + doc.data().carreras[i].idCarrera + '" class="item-link item-content carreraEnListadoCarreras" onclick="confirmarEliminacionCarrera(&quot;' + doc.data().carreras[i].idCarrera + '&quot;)"><div class="item-inner"><div class="item-title">' + doc.data().carreras[i].nombre + '<div class="item-footer">' + doc.data().carreras[i].universidad + '</div></div><div class="item-after"><i class="far fa-trash-alt"></i></div></div></a></li>');
      }
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
}

function confirmarEliminacionCarrera(idCarrera) {
  app.dialog.confirm('La carrera y todo su progreso se eliminarán.', '¿Estás segurx?', function () {
    borrarCarrera(idCarrera);
  });
}

function borrarCarrera(idCarrera) {
  baseDeDatos = firebase.firestore();
  var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
  referenciaUsuario.get()
    .then(function (doc) {
      //Itero entre las carreras hasta encontrar la carreras seleccionada
      for (var i = 0; i < doc.data().carreras.length; i++) {
        if (doc.data().carreras[i].idCarrera == idCarrera) {
          var indice = i;
        }
      }
      var carreraABorrar = doc.data().carreras[indice];

      //Borro la carrera del array carreras
      referenciaUsuario.update({
        "carreras": firebase.firestore.FieldValue.arrayRemove(carreraABorrar)
      })


        .then(function () {

          console.log("Carrera eliminada correctamente.");
          var toastConfirmacionCarreraEliminada = app.toast.create({
            icon: '<i class="f7-icons">checkmark_alt</i>',
            text: 'Carrera eliminada correctamente.',
            position: 'center',
            closeTimeout: 2000,
          });
          toastConfirmacionCarreraEliminada.open();
          listarCarreras();
        })
        .catch(function (error) {

          console.log("Error: " + error);

        });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

}