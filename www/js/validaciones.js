
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
