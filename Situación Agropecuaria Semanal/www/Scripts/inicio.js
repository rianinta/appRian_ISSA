var splTimerChequearConexion // Timer para comprobar la conexión a internet en el Splash Screen

$(function(){
	//$("#contenido").hide()
	//MostrarSplash()

	$("#splashScreen").hide()
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Splash Screen

function MostrarSplash(){
	$("#TextoSplash").html("&nbsp;")

	var splTimerTituloSistema
	var textoTituloSistema = "Informe Semanal de Situación Agropecuaria"

	splTimerTituloSistema = setInterval(EscribirNombreSistema, 50);

	var xLetra = 0

	function EscribirNombreSistema(){
		if($("#TextoSplash").html() == "&nbsp;"){
			$("#TextoSplash").html(textoTituloSistema.substr(xLetra,1))
		}else{
			$("#TextoSplash").html($("#TextoSplash").html() + textoTituloSistema.substr(xLetra,1))
		}		

		xLetra = xLetra + 1

		if(xLetra == textoTituloSistema.length){
			clearInterval(splTimerTituloSistema)

			var splTimerDesaparecerSplash
			splTimerDesaparecerSplash = setInterval(DesaparecerSplash, 2500);

			function DesaparecerSplash(){
				clearInterval(splTimerDesaparecerSplash)

				$("#splashScreen").fadeOut(800, function() {
    				$("#contenido").show()
  				});
			}
		}
	}
}