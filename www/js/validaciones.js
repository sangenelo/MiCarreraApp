
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