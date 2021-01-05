function mostrarPlaceholderEnReporteDeError(tipoDeErrorSeleccionado) {
    switch (tipoDeErrorSeleccionado) {
        case "Le faltan materias a mi carrera":
            $$('#errorMasInfo').attr("placeholder", "Contanos que carrera estás haciendo, en que universidad y que materia/s falta/n.");
            break;
        case "Algunas correlatividades están mal en mi carrera":
            $$('#errorMasInfo').attr("placeholder", "Contanos que carrera estás haciendo, en que universidad y que correlatividad/es está/n mal.");
            break;
        case "Perdí mi progreso":
            $$('#errorMasInfo').attr("placeholder", "Contanos como sucedió el error.");
            break;
        case "No puedo agregar una materia":
            $$('#errorMasInfo').attr("placeholder", "Contanos que carrera estás haciendo, en que universidad y que materia no podés agregar.");
            break;
        case "No puedo modificar una materia":
            $$('#errorMasInfo').attr("placeholder", "Contanos que carrera estás haciendo, en que universidad y que materia no podés modificar.");
            break;
        default:
            $$('#errorMasInfo').attr("placeholder", "¿Que error tuviste? Contanos en detalle.");

    }
}

function enviarMail(asunto,mensaje){
    cordova.plugins.email.open({
        to: 'micarreraapp@sangenelo.com',
        subject: asunto,
        body: mensaje
      });
}