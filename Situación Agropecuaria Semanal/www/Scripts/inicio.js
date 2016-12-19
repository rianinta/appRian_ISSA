var splTimerChequearConexion // Timer para comprobar la conexión a internet en el Splash Screen

var myOptions;
var map;
var geoXml;

var controller;

$(function(){
	//$("#contenido").hide()
	//MostrarSplash()

	$("#splashScreen").hide()
	InicializarMapa()
	InicializarMenu()

	$("#cmdLlamarWs").click(function(){
		var ahora = new Date();
    	//geoXml.parse("armarMapa.aspx?rnd=" + ahora.getTime() + "&IdRegion=99&IdPrograma=64");
    	geoXml.parse("http://riancarga.inta.gob.ar/WsEAR/ArmarKML.aspx?rnd=" + ahora.getTime() + "&IdProvincia=22&IdCampania=6&IdCultivo=6");
    	controller.close()
	});

	$("#agregarTexto").click(function(){
		//$("#contenidoPortbox").text($("#contenidoPortbox").text() + "/" + "Lucas Lucas Lucas Lucas Ramos Ramos Ramos Ramos")
		$(".close-portBox").click();
		$("#lnkAbrirCargando").click();

		$("#pbxCargando .close-portBox").hide()
	});

	$("#AbrirPrimerModal").click(function(){
		controller.close()
	});
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

function InicializarMapa(){
	myOptions = {
        center: new google.maps.LatLng(-40, -64),
        streetViewControl: false,
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), myOptions);

    geoXml = new geoXML3.parser({
        map: map,
        singleInfoWindow: true,
        zoom: false,
        afterParse: useTheData
    });
}

function useTheData(doc) {
    console.log("Hola mapa!")
}

function InicializarMenu(){
	controller = new slidebars()

	controller.init();

	$('.js-toggle-right-slidebar').on('click', function(event) {
        event.stopPropagation();
        controller.toggle('slidebar-2');
    });

    $(controller.events).on('opened', function () {
        $('[canvas="container"]').addClass('js-close-any-slidebar');
    });

    $(controller.events).on('closed', function () {
        $('[canvas="container"]').removeClass('js-close-any-slidebar');
    });

    $('body').on('click','.js-close-any-slidebar', function (event) {
        event.stopPropagation();
        controller.close();
    });

    $('#CerrarMenu').on('click', function (event) {
        controller.close();
    });
}