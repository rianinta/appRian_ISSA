function EstamosEnLinea(){
	//alert("Luquitas")
	$.ajax({
        type: "POST",
        url: "http://riancarga.inta.gob.ar/WsApps/ChequearConexion.aspx/EstamosEnLinea",
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 15000,
        success: CargarContenido,
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
			console.log("Error en la conexión")
        }
    });
}