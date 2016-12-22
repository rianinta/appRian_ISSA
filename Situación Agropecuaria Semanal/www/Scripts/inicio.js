var splTimerChequearConexion // Timer para comprobar la conexión a internet en el Splash Screen

var myOptions;
var map;
var geoXml;

var controller;

$(function(){
	/////////////////////////////////////////////
	//Splash
	//$("#contenido").hide()
	//MostrarSplash()
	$("#splashScreen").hide()
	/////////////////////////////////////////////

	InicializarMapa()
	InicializarMenu()

	$("#cmdNuevaConsulta").click(function(){
		cmdNuevaConsulta_click()
	});

	$('body').on('click', '#pbxSeleccionVariable .cmdVerde', function() {
	    cmdVariable_click($(this).data("idvar"))
	});



	

	$("#cmdSalir").click(function(){
		cmdSalir_click()
	})

	$("#cmdConfirmarSalir").click(function(){
		navigator.app.exitApp();
	});

	

	$('body').on('click', '#pbxSeleccionVariable .lnkVolverSeleccion', function() {
	    alert("Volviendo!")
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
        mapTypeControl: false,
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Eventos Menú

function cmdNuevaConsulta_click(){
	controller.close()

	var htmlDivPbx
	htmlDivPbx = '<div id="pbxSeleccionVariable" class="portBox"><p class="H1_pb" id="TituloSeleccionVariable">Nuevo mapa</p><p class="H2_pb">¿Qué información desea consultar?</p><button class="cmdVerde" data-idvar="1">Trigo</button><button class="cmdVerde" data-idvar="2">Maíz</button><button class="cmdVerde" data-idvar="24">Maíz tardío</button><button class="cmdVerde" data-idvar="3">Girasol</button><button class="cmdVerde" data-idvar="4">Soja</button><button class="cmdVerde" data-idvar="23">Soja 2º</button><button class="cmdVerde" data-idvar="5">Algodón</button><button class="cmdVerde" data-idvar="11">Oferta forrajera bovinos</button><button class="cmdVerde" data-idvar="12">Estado rodeos bovinos</button><button class="cmdVerde" data-idvar="15">Oferta forrajera ovinos/caprinos</button><button class="cmdVerde" data-idvar="16">Estado rodeos ovinos/caprinos</button><button class="cmdVerde" data-idvar="13">Tabaco</button><button class="cmdVerde" data-idvar="14">Caña de azucar</button><button class="cmdVerde" data-idvar="19">Vid</button><button class="cmdVerde" data-idvar="17">Arroz</button><button class="cmdVerde" data-idvar="18">Maní</button><button class="cmdVerde" data-idvar="8">Pepita y Carozo</button><button class="cmdVerde" data-idvar="7">Cítricos</button><button class="cmdVerde" data-idvar="9">Olivos</button><button class="cmdVerde" data-idvar="6">Porotos</button><button class="cmdVerde" data-idvar="10">Forestales</button><button class="cmdVerde" data-idvar="21">Cebada</button><button class="cmdVerde" data-idvar="22">Sorgo</button></div><a href="#" id="lnkPbSeleccionVariable" data-display="pbxSeleccionVariable" data-closeBGclick="false" class="button" style="display: none;">#</a>'

	$("#divPbxSeleccionVariable").html(htmlDivPbx)
	$("#lnkPbSeleccionVariable").click()

	$("#divPbxSeleccionVariable .lnkVolverSeleccion").hide()
}

function cmdSalir_click(){
	//El PortBox se dispara solo, aca cierro el menú lateral
	controller.close()
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Eventos selección consulta
function cmdVariable_click(pIdVar){
	//alert("Elegiste " + pIdVar)
	$("#divPbxSeleccionVariable .close-portBox").click();
	$("#lnkPbxCargando").click();

	$("#pbxCargando .lnkVolverSeleccion").hide()
	$("#pbxCargando .close-portBox").hide()
}
















//alert("Ahi voy - ISSA")
//var ahora = new Date();
//geoXml.parse("http://riancarga.inta.gob.ar/WsEAR/ArmarKML.aspx?rnd=" + ahora.getTime() + "&IdProvincia=22&IdCampania=6&IdCultivo=6");
//geoXml.parse("http://riancarga.inta.gob.ar/WsApps/ISSA/ArmarMapa.aspx?rnd=" + ahora.getTime());

/*$("#cmdLlamarWs").click(function(){
		var ahora = new Date();
    	//geoXml.parse("armarMapa.aspx?rnd=" + ahora.getTime() + "&IdRegion=99&IdPrograma=64");
    	geoXml.parse("http://riancarga.inta.gob.ar/WsEAR/ArmarKML.aspx?rnd=" + ahora.getTime() + "&IdProvincia=22&IdCampania=6&IdCultivo=6");
    	controller.close()
	});

$("#AbrirPrimerModal").click(function(){
		controller.close()
	});

	*/