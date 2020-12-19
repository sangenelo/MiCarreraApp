function validarInicioSesion() {
    var email = $$('#emailIngresado').val();
    var password = $$('#passwordIngresado').val();

    const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var testeoMail = mailRegex.test(String(email).toLowerCase());

    if (!testeoMail) {
        $$('#loginEmailContainer').addClass('item-input-with-error-message item-input-invalid');
    }else{
        iniciarSesion(email,password);
    }
};


function validarRegistro() {
    var email = $$('#emailIngresadoRegistro').val();
    var password = $$('#passwordIngresadoRegistro').val();
    var password2 = $$('#passwordIngresadoRegistro2').val();
    var nombre = $$('#nombreIngresadoRegistro').val();
    var apellido = $$('#apellidoIngresadoRegistro').val();
    var huboError=false;

    const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var testeoMail = mailRegex.test(String(email).toLowerCase());

    const nombreRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const apellidoRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    var testeoNombre = nombreRegex.test(String(nombre).toLowerCase());
    var testeoApellido = apellidoRegex.test(String(apellido).toLowerCase());

    if (!testeoMail) {
        $$('#registroEmailContainer').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#registroEmailContainer').removeClass('item-input-with-error-message item-input-invalid');
    }

    if(password!=password2){
        $$('#registroPasswordContainer2').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#registroPasswordContainer2').removeClass('item-input-with-error-message item-input-invalid');
    }

    if(password.length<6){
        $$('#registroPasswordContainer').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#registroPasswordContainer').removeClass('item-input-with-error-message item-input-invalid');
    }
    
    if (!testeoNombre) {
        $$('#registroNombreContainer').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#registroNombreContainer').removeClass('item-input-with-error-message item-input-invalid');
    }
    if (!testeoApellido) {
        $$('#registroApellidoContainer').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#registroApellidoContainer').removeClass('item-input-with-error-message item-input-invalid');
    }

    if(!huboError){
        crearUsuario(email,password,nombre,apellido);
    }


};

function crearUsuario(email, password,nombre,apellido) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            console.log("Mail registrado.");
            crearUsuarioEnBaseDeDatos(email,nombre,apellido);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });
}

function iniciarSesion(email,password){
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
        usuario=email;
        mainView.router.navigate('/home/');
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        $$('#mensajeDeErrorLogin').text(errorMessage);
    });
}

function crearUsuarioEnBaseDeDatos(email,nombre,apellido){
    baseDeDatos = firebase.firestore();
    coleccionUsuarios = baseDeDatos.collection('Usuarios');
    datos = {
        nombre: nombre,
        apellido: apellido,
      }

    coleccionUsuarios.doc(email).set(datos)
        .then(function () {
            console.log("Usuario creado en BD.");
            usuario=email;
            mainView.router.navigate('/primerInicio/'+nombre+'/');
         })

        .catch(function (e) {
          console.log('Algo falló');
        });
}