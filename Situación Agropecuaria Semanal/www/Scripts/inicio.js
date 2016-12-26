var splTimerChequearConexion // Timer para comprobar la conexión a internet en el Splash Screen

var myOptions;
var map;
var geoXml;

var controller;

var VariableSeleccionada = 0
var TextoVariableSeleccionada = ""
var AñoSeleccionado = 0
var MesSeleccionado = 0
var SemanaConsultada
var htmlListadoAños = ""

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

	$('body').on('click', '#pbxSeleccionVariable #lnkContinuarSeleccionVariable', function() {
	    lnkContinuarSeleccionVariable_click($("#cboVariable").val())
	});

	$('body').on('click', '#pbxSeleccionVariable #lnkContinuarSeleccionAño', function() {
	    lnkContinuarSeleccionAño_click($("#cboVariable").val())
	});

	


	/*$('body').on('click', '#pbxSeleccionVariable .cmdVerde', function() {
	    cmdVariable_click($(this).data("idvar"))
	});

	$('body').on('click', '#divPbxSeleccionAño .cmdVerde', function() {
	    cmdSeleccionAño_click($(this).data("anio"))
	});

	$('body').on('click', '#divPbxSeleccionAño .lnkVolverSeleccion', function() {
	    cmdSeleccionAño_volver_click()
	});*/

	



	$("#cmdSalir").click(function(){
		cmdSalir_click()
	})

	$("#cmdConfirmarSalir").click(function(){
		navigator.app.exitApp();
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
	htmlDivPbx = '<div id="pbxSeleccionVariable" class="portBox"><p class="H1_pb" id="TituloSeleccionVariable">Nuevo mapa</p><p class="H2_pb">¿Qué información desea consultar?</p>'
	htmlDivPbx = htmlDivPbx + '<select id="cboVariable" class="cboApp"><option value="0">-Seleccione una opción-</option>'
	htmlDivPbx = htmlDivPbx + '<option value="1">Trigo</option>'
	htmlDivPbx = htmlDivPbx + '<option value="2">Maíz</option>'
	htmlDivPbx = htmlDivPbx + '<option value="24">Maíz tardío</option>'
	htmlDivPbx = htmlDivPbx + '<option value="3">Girasol</option>'
	htmlDivPbx = htmlDivPbx + '<option value="4">Soja</option>'
	htmlDivPbx = htmlDivPbx + '<option value="23">Soja 2º</option>'
	htmlDivPbx = htmlDivPbx + '<option value="5">Algodón</option>'
	htmlDivPbx = htmlDivPbx + '<option value="11">Oferta forrajera bovinos</option>'
	htmlDivPbx = htmlDivPbx + '<option value="12">Estado rodeos bovinos</option>'
	htmlDivPbx = htmlDivPbx + '<option value="15">Oferta forrajera ovinos/caprinos</option>'
	htmlDivPbx = htmlDivPbx + '<option value="16">Estado rodeos ovinos/caprinos</option>'
	htmlDivPbx = htmlDivPbx + '<option value="13">Tabaco</option>'
	htmlDivPbx = htmlDivPbx + '<option value="14">Caña de azucar</option>'
	htmlDivPbx = htmlDivPbx + '<option value="19">Vid</option>'
	htmlDivPbx = htmlDivPbx + '<option value="17">Arroz</option>'
	htmlDivPbx = htmlDivPbx + '<option value="18">Maní</option>'
	htmlDivPbx = htmlDivPbx + '<option value="8">Pepita y Carozo</option>'
	htmlDivPbx = htmlDivPbx + '<option value="7">Cítricos</option>'
	htmlDivPbx = htmlDivPbx + '<option value="9">Olivos</option>'
	htmlDivPbx = htmlDivPbx + '<option value="6">Porotos</option>'
	htmlDivPbx = htmlDivPbx + '<option value="10">Forestales</option>'
	htmlDivPbx = htmlDivPbx + '<option value="21">Cebada</option>'
	htmlDivPbx = htmlDivPbx + '<option value="22">Sorgo</option></select>'
	htmlDivPbx = htmlDivPbx + '<a href="#" id="lnkContinuarSeleccionVariable">Continuar<img class="imgIconos" src="Imagenes/iconoContinuarMenu.png" align="absmiddle" /></a>'
	htmlDivPbx = htmlDivPbx + '</div><a href="#" id="lnkPbSeleccionVariable" data-display="pbxSeleccionVariable" data-closeBGclick="false" class="button" style="display: none;">#</a>'

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
function lnkContinuarSeleccionVariable_click(pIdVar){
	if(pIdVar != 0){
		//Acomodo interfaz
		$("#divPbxSeleccionVariable .close-portBox").click();
		$("#lnkPbxCargando").click();

		$("#pbxCargando .lnkVolverSeleccion").hide()
		$("#pbxCargando .close-portBox").hide()

		VariableSeleccionada = pIdVar
		TextoVariableSeleccionada = $("#cboVariable option:selected").text();

		//Busco los años
		$.ajax({
	        type: "POST",
	        url: "http://riancarga.inta.gob.ar/WsApps/ISSA/ISSA.aspx/TraeAnios",
	        data: '{pIdVariable: "' + VariableSeleccionada + '"}',
	        cache: false,
	        contentType: "application/json; charset=utf-8",
	        dataType: "json",
	        success: CargoAños,
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	        	alert("Error en la llamada")
	        }
	    });
	}else{
		alert("Seleccione un elemento de la lista")
	}
}

function CargoAños(response){
	//Cierro el Portbox Cargando
	$("#pbxCargando .close-portBox").click()

	var datos = jQuery.parseJSON(response.d);
	htmlListadoAños = "<select id='cboAño' class='cboApp'><option value='0'>-Seleccione un año-</option>"

    $.each(datos, function(index, Valores) {
        //MuestroLalala = MuestroLalala + "(" + Valores.IdCultivo + ") " + Valores.Cultivo + "|"
        //htmlBotones = htmlBotones + '<button class="cmdVerde" data-anio="' + Valores.Anio + '">' + Valores.Anio + '</button>'
        htmlListadoAños = htmlListadoAños + '<option value="' + Valores.Anio + '">' + Valores.Anio + '</option>'       
    });

    htmlListadoAños = htmlListadoAños + '</select>'

    var htmlDivPbx
	//htmlDivPbx = '<div id="pbxSeleccionAño" class="portBox"><p class="H1_pb" id="TituloSeleccionVariable">Nuevo mapa</p><p class="H2_pb">Seleccione el año</p>' + htmlBotones + '</div><a href="#" id="lnkPbSeleccionAño" data-display="pbxSeleccionAño" data-closeBGclick="false" class="button" style="display: none;">#</a>'
	htmlDivPbx = '<div id="pbxSeleccionAño" class="portBox"><p class="H1_pb" id="TituloSeleccionVariable">Nuevo mapa</p><p class="H2_pb">Información elegida</p>' + TextoVariableSeleccionada + '<br/><br/>' 
	htmlDivPbx = htmlDivPbx + '<p class="H2_pb">¿Que fecha desea consultar?</p>' + htmlListadoAños
	htmlDivPbx = htmlDivPbx + '<a href="#" id="lnkContinuarSeleccionAño">Continuar<img class="imgIconos" src="Imagenes/iconoContinuarMenu.png" align="absmiddle" /></a></div>'
	htmlDivPbx = htmlDivPbx + '<a href="#" id="lnkPbSeleccionAño" data-display="pbxSeleccionAño" data-closeBGclick="false" class="button" style="display: none;">#</a>'

	$("#divPbxSeleccionAño").html(htmlDivPbx)
	$("#lnkPbSeleccionAño").click()	
}

function lnkContinuarSeleccionAño_click(pAño){
	//Acomodo interfaz
	$("#divPbxSeleccionAño .close-portBox").click();
	$("#lnkPbxCargando").click();

	$("#pbxCargando .lnkVolverSeleccion").hide()
	$("#pbxCargando .close-portBox").hide()

	AñoSeleccionado = pAño

	//Busco los meses
	$.ajax({
        type: "POST",
        url: "http://riancarga.inta.gob.ar/WsApps/ISSA/ISSA.aspx/TraeMeses",
        data: '{pIdVariable: "' + VariableSeleccionada + '", pAnio: "' + AñoSeleccionado + '"}',
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: CargoMeses,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	alert("Error en la llamada")
        }
    });
}

function cmdSeleccionAño_volver_click(){
	AñoSeleccionado = 0
	$("#divPbxSeleccionAño .close-portBox").click();
	$("#lnkPbSeleccionVariable").click()
}

function CargoMeses(response){
	//Cierro el Portbox Cargando
	$("#pbxCargando .close-portBox").click()

	alert(response.d + "asdasdasds")
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
