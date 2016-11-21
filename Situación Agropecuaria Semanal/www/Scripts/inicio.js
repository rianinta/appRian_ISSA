var splTimerChequearConexion // Timer para comprobar la conexión a internet en el Splash Screen

$(function(){
	$("#contenido").hide()

	//////////////////////////////////////////////////////////////////////////////////////////////////
	//Comprobando conexión
	splTimerChequearConexion = setInterval(CambiarTextoSplashChequeandoConexion, 300);

	$.ajax({
        type: "POST",
        url: "http://riancarga.inta.gob.ar/WsApps/ChequearConexion.aspx/EstamosEnLinea",
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 4000,
        success: ConexionOkSplash,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
			if (XMLHttpRequest.readyState == 4) {
            	// HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
                console.log("Error 4")
            }
            else if (XMLHttpRequest.readyState == 0) {
            	// Network error (i.e. connection refused, access denied due to CORS, etc.)
                console.log("Error 0")
            }
            else {
            	//something weird is happening
                console.log("Error SWIH")
            }
            clearInterval(splTimerChequearConexion)
			$("#TextoSplash").html("ERROR: Comprobar conexión")
        }
    });

	/*if(navigator.onLine == true){
		alert("Hay conexión")
	}else{
		alert("NO hay conexión")
	}*/

});

/////////////////////////////////////////////////////////////////////////////////
/*function checkNetConnection(){
    var xhr = new XMLHttpRequest();
    var file = "https://www.kirupa.com/blank.png";
    var randomNum = Math.round(Math.random() * 10000);
 
    xhr.open('HEAD', file + "?rand=" + randomNum, true);
    xhr.send();
     
    xhr.addEventListener("readystatechange", processRequest, false);
 
    function processRequest(e) {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 304) {
          alert("connection exists!");
        } else {
          alert("connection doesn't exist!");
        }
      }
    }
}*/

/*$.ajax({
    url: "http://rian.inta.gob.ar/index.html",
    timeout: 10000,
    error: function(jqXHR) { 
        if(jqXHR.status==0) {
            alert(" fail to connect, please check your connection settings");
        }
    },
    success: function() {
        alert(" your connection is alright!");
    }
});*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Splash Screen

function CambiarTextoSplashChequeandoConexion(){
	switch($("#TextoSplash").text()) {
	    case "Comprobando conexión a internet":
	        $("#TextoSplash").text("Comprobando conexión a internet.")
	        break;
	    case "Comprobando conexión a internet.":
	        $("#TextoSplash").text("Comprobando conexión a internet..")
	        break;
	    case "Comprobando conexión a internet..":
	        $("#TextoSplash").text("Comprobando conexión a internet...")
	        break;
	    case "Comprobando conexión a internet...":
	        $("#TextoSplash").text("Comprobando conexión a internet")
	        break;
	} 
}

function ConexionOkSplash(){
	clearInterval(splTimerChequearConexion)
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
			splTimerDesaparecerSplash = setInterval(DesaparecerSplash, 2000);

			function DesaparecerSplash(){
				clearInterval(splTimerDesaparecerSplash)

				$("#splashScreen").fadeOut(800, function() {
    				$("#contenido").show()
  				});
			}
		}
	}
}