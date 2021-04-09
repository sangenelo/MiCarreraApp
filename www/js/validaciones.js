
function validarMateriaAprobada() {
    var idMateria = $$('#agregarMateriaListaMaterias').val();
    var fechaAprobacion = $$('#demo-calendar-default').val();
    var nota = $$('#agregarMateriaNota').val();
    var huboError=false;

    if (idMateria.length<1) {
        $$('#agregarMateriaSeleccionarMateriaContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#agregarMateriaSeleccionarMateriaContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
    if(fechaAprobacion.length<1){
        $$('#agregarMateriaSeleccionarFechaContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#agregarMateriaSeleccionarFechaContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
    if(nota<4 || nota >10){
        $$('#agregarMateriaNotaContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#agregarMateriaNotaContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
   
    if(!huboError){
        agregarMateriaAListaDeAprobadas();
    }


};

function validarFinalDesAprobado() {
    var idMateria = $$('#agregarFinalDesaprobadoListaMaterias').val();
    var nota = $$('#agregarFinalNota').val();
    var huboError=false;

    if (idMateria.length<1) {
        $$('#agregarFinalSeleccionarMateriaContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#agregarFinalSeleccionarMateriaContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
    if(nota<0 || nota >3 || nota.length!=1){
        $$('#agregarFinalNotaContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#agregarFinalNotaContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
   
    if(!huboError){
        agregarFinalDesaprobado();
    }


};

function validarMateriaConCreditos() {
    var nombreMateria = $$('#agregarMateriaConCreditosNombreMateria').val();
    var fechaAprobacion = $$('#agregarMateriaConCreditosFechaAprobacion').val();
    var tipoDeCalificacion = $$("#agregarMateriaConCreditosCalificacion").val();
    var nota = $$('#agregarMateriaConCreditosNota').val();
    var creditos=$$("#agregarMateriaConCreditosCreditos").val();
    const nombreMateriaRegex = /^([a-zA-Z0-9\u00f1\u00d1\u00E0-\u00FC ]+)$/;
    var testeoNombreMateria = nombreMateriaRegex.test(nombreMateria);
    var huboError=false;

    if (!testeoNombreMateria || nombreMateria.length<1) {
        $$('#agregarMateriaConCreditosNombreMateriaContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#agregarMateriaConCreditosNombreMateriaContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
    if(fechaAprobacion.length<1){
        $$('#agregarMateriaConCreditosFechaAprobacionContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#agregarMateriaConCreditosFechaAprobacionContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }

    if(tipoDeCalificacion=="nota"){
        if(nota<4 || nota >10){
            $$('#agregarMateriaConCreditosNotaContenedor').addClass('item-input-with-error-message item-input-invalid');
            huboError=true;
        }else{
            $$('#agregarMateriaConCreditosNotaContenedor').removeClass('item-input-with-error-message item-input-invalid');
        }
    }
    
    
    if(creditos<1 || creditos >100){
        $$('#agregarMateriaConCreditosCreditosContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#agregarMateriaConCreditosCreditosContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
   
    if(!huboError){
        agregarMateriaAListaDeMateriasConCreditos();
    }


};

function validarActualizacionMateriaAprobada(){
    var idMateria = $$('#materiaAprobadaIdMateria').val();
    var fechaAprobacion = $$('#materiaAprobadaFecha').val();
    var nota = $$('#materiaAprobadaNota').val();
    var huboError=false;

    if (idMateria.length<1) {
        $$('#agregarMateriaSeleccionarMateriaContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#agregarMateriaSeleccionarMateriaContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
    if(fechaAprobacion.length<1){
        $$('#agregarMateriaSeleccionarFechaContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#agregarMateriaSeleccionarFechaContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
    if(nota<4 || nota >10){
        $$('#agregarMateriaNotaContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#agregarMateriaNotaContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
   
    if(!huboError){
        actualizarMateriaAprobada();
        //console.log(idMateria+" "+fechaAprobacion+" "+nota);
    }

}

function validarActualizacionMateriaConCreditos(){
    var idMateria = $$('#materiaConCreditosIdMateria').val();
    var fechaAprobacion = $$('#materiaConCreditosFecha').val();
    var nota = $$('#materiaConCreditosNota').val();
    var creditos = $$('#materiaConCreditosCreditos').val();
    var huboError=false;

    if (idMateria.length<1) {
        huboError=true;
    }
    
    if(fechaAprobacion.length<1){
        $$('#agregarMateriaConCreditosSeleccionarFechaContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#agregarMateriaConCreditosSeleccionarFechaContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
    if(nota<4 || nota >10){
        $$('#materiaConCreditosNotaContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#materiaConCreditosNotaContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    if(creditos<1 || creditos >100){
        $$('#materiaConCreditosCreditoContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#materiaConCreditosCreditoContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
   
    if(!huboError){
        actualizarMateriaConCreditos();
    }

}

function validarActualizacionMateriaDesaprobada(){
    var idMateria = $$('#materiaDesaprobadaIdMateria').val();
    var nota = $$('#materiaDesaprobadaNota').val();
    var huboError=false;

    if(nota<0 || nota >3 || nota.length!=1){
        $$('#materiaDesaprobadaNotaContenedor').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#materiaDesaprobadaNotaContenedor').removeClass('item-input-with-error-message item-input-invalid');
    }
    
   
    if(!huboError){
        actualizarMateriaDesaprobada();
    }

}

function validarNombreYApelldioMiPerfil(){
    var nombre = $$('#miPerfilNombreInput').val();
    var apellido = $$('#miPerfilApellidoInput').val();

    const nombreRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const apellidoRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    var testeoNombre = nombreRegex.test(String(nombre).toLowerCase());
    var testeoApellido = apellidoRegex.test(String(apellido).toLowerCase());
    var huboError=false;

    if (!testeoNombre) {
        $$('#miPerfilNombre').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#miPerfilNombre').removeClass('item-input-with-error-message item-input-invalid');
    }
    if (!testeoApellido) {
        $$('#miPerfilApellido').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#miPerfilApellido').removeClass('item-input-with-error-message item-input-invalid');
    }

    if(!huboError){
        actualizarDatosPerfil(nombre,apellido);
    }
}

function validarCarreraSeleccionada(modo){
    var carreraElegida = $$('#listaCarreras option:checked').val();
    var idUniversidad = $$('#listaUniversidades option:checked').val();
    if(idUniversidad=="noUniversidad"){
        var toastUniversidadNone = app.toast.create({
            icon: '<i class="f7-icons">exclamationmark_triangle</i>',
            text: 'Tenés que seleccionar una Universidad.',
            position: 'center',
            closeTimeout: 2000,
        });
        toastUniversidadNone.open();
    }else{
        if(carreraElegida=="noCarrera"){
            var toastCarreraNone = app.toast.create({
                icon: '<i class="f7-icons">exclamationmark_triangle</i>',
                text: 'Tenés que seleccionar una carrera.',
                position: 'center',
                closeTimeout: 2000,
            });
            toastCarreraNone.open();
        }else{
            if(modo=='admin'){
                console.log(carreraElegida);
                mainView.router.navigate('/cargarMaterias/'+carreraElegida+'/');
            }else{
                guardarCarrera();
            }
            
        }
    }
    
}

function validarMailRecuperarPassword(){
    var email = $$('#recuperarPasswordEmailInput').val();
    var email2 = $$('#recuperarPasswordEmailInput2').val();
    var huboError = false;

    const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var testeoMail = mailRegex.test(String(email).toLowerCase());

    if (!testeoMail) {
        $$('#recuperarPasswordEmailContainer').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#recuperarPasswordEmailContainer').removeClass('item-input-with-error-message item-input-invalid');
    }
    if(email != email2){
        $$('#recuperarPasswordEmailContainer2').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#recuperarPasswordEmailContainer2').removeClass('item-input-with-error-message item-input-invalid');
    }
    if(!huboError){
        recuperarPassword();
    }
}

function validarError(){
    var tipoDeError = $$('#errorTipo').val();
    var masInfo = $$('#errorMasInfo').val();
    var huboError = false;

    if(tipoDeError=="no"){
        $$('#errorTipoContainer').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#errorTipoContainer').removeClass('item-input-with-error-message item-input-invalid');
    }
    if(masInfo.length<20){
        $$('#errorMasInfoContainer').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#errorMasInfoContainer').removeClass('item-input-with-error-message item-input-invalid');
    }
    var asunto="Error: "+tipoDeError;
    if(!huboError){
        enviarMail(asunto,masInfo);
    }
}

function validarSolicitudCarrera(){
    var universidad = $$('#solicitarCarreraUniversidad').val();
    var carrera = $$('#solicitarCarreraCarrera').val();
    var huboError = false;

    if(universidad.length==0){
        $$('#solicitarCarreraUniversidadContainer').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#solicitarCarreraUniversidadContainer').removeClass('item-input-with-error-message item-input-invalid');
    }
    if(carrera.length==0){
        $$('#solicitarCarreraCarreraContainer').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#solicitarCarreraCarreraContainer').removeClass('item-input-with-error-message item-input-invalid');
    }
    var asunto="Solicitud de carrera";
    var mensaje="Por favor agregar la carrera: "+carrera+" de la universidad: "+universidad+". Usuario: "+usuario+".";
    if(!huboError){
        enviarMail(asunto,mensaje);
    }
}

function validarSolicitudColaborador(){
    var nombre = $$('#colaboradorNombre').val();
    var masInfo = $$('#colaboradorMasInfo').val();
    var huboError = false;

    if(nombre.length==0){
        $$('#colaboradorNombreContainer').addClass('item-input-with-error-message item-input-invalid');
        huboError=true;
    }else{
        $$('#colaboradorNombreContainer').removeClass('item-input-with-error-message item-input-invalid');
    }
  
    var asunto="Solicitud para ser colaborador/a";
    var mensaje="Hola! Me gustaría convertirme en colaborador/a. Mi nombre es "+nombre+". "+masInfo+". Mail: "+usuario;
    if(!huboError){
        enviarMail(asunto,mensaje);
    }
}
