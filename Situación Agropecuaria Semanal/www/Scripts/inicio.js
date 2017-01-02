var splTimerChequearConexion // Timer para comprobar la conexión a internet en el Splash Screen

var myOptions;
var map;
var geoXml;

var controller;

var VariableSeleccionada
var TextoVariableSeleccionada = ""
var AñoSeleccionado
var MesSeleccionado
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

	$("#cboVariable").change(function(){
		cboVariable_change($(this).val())
		/*if($(this).val() == 0){
			alert("Cero")
			$('#lnkContinuarSeleccionVariable').bind('click', false);
			$('#lnkContinuarSeleccionVariable').css("opacity","0.3")
		}else{
			alert("Uno")
			$('#lnkContinuarSeleccionVariable').unbind('click', false);
			$('#lnkContinuarSeleccionVariable').css("opacity","1")
		}*/
	});

	$("#cboAño").change(function(){
		cboAño_change($(this).val());
	});

	$("#cboMes").change(function(){
		cboMes_change($(this).val());
	});

	$("#cboSemana").change(function(){
		cboSemana_change($(this).val());
	});

	$("#lnkConsultar").click(function(){
		lnkConsultar_click()
	});


	/*$('body').on('click', '#lnkConsultar', function() {
	    //lnkContinuarSeleccionVariable_click($("#cboVariable").val())
	    alert("Consulto")
	});*/

	/*$('body').on('click', '#pbxSeleccionVariable #lnkContinuarSeleccionAño', function() {
	    lnkContinuarSeleccionAño_click($("#cboVariable").val())
	});

	$('body').on('click', '#pbxSeleccionVariable .cmdVerde', function() {
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

	$("#lnkPbSeleccionConsulta").click()

	$("#TituloQueFechaDesea").hide();
	$("#cboAño").hide();
	$("#cboMes").hide();
	$("#cboSemana").hide();
	$("#divCargando").hide();
	$("#txtCargandoMapa").hide()
	$("#ControlesSeleccion").show()

	$('#lnkConsultar').bind('click', false);
	$('#lnkConsultar').css("opacity","0.3")

	$('#cboVariable>option:eq(0)').prop('selected', true);
	$("#divPbxSeleccionConsulta .close-portBox").show()
}

function cmdSalir_click(){
	//El PortBox se dispara solo, aca cierro el menú lateral
	controller.close()
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Eventos selección consulta

function cboVariable_change(pIdVar){
	$("#cboMes").hide();
	$("#cboSemana").hide();
	$("#divCargando").hide();

	$('#lnkConsultar').bind('click', false);
	$('#lnkConsultar').css("opacity","0.3")

	VariableSeleccionada = undefined
	AñoSeleccionado = undefined
	MesSeleccionado = undefined
	SemanaConsultada = undefined

	if(pIdVar != 0){
		//Seleccionó una variable
		$("#cboVariable").prop("disabled", true);
		$("#divCargando").show();

		VariableSeleccionada = pIdVar

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
		$("#TituloQueFechaDesea").hide();
		$("#cboAño").hide();

		VariableSeleccionada = undefined
	}
}

function CargoAños(response){
	$("#divCargando").hide();

	$('#cboAño').empty();
	$('#cboAño').append($('<option>', {
	    value: 0,
	    text: '-Seleccione un año-'
	}));

	var datos = jQuery.parseJSON(response.d);

	$.each(datos, function(index, Valores) {
        $('#cboAño').append($('<option>', {
		    value: Valores.Anio,
		    text: Valores.Anio
		}));
    });

	$("#cboVariable").prop("disabled", false);
	$("#TituloQueFechaDesea").show();
	$('#cboAño').show();
}

function cboAño_change(pAño){
	$("#cboMes").hide();
	$("#cboSemana").hide();

	$('#lnkConsultar').bind('click', false);
	$('#lnkConsultar').css("opacity","0.3")

	AñoSeleccionado = undefined
	MesSeleccionado = undefined
	SemanaConsultada = undefined

	if(pAño != 0){
		//Seleccionó un año
		$("#cboVariable").prop("disabled", true);
		$("#cboAño").prop("disabled", true);
		$("#divCargando").show();

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
	}else{
		$("#divCargando").hide();
	}
}

function CargoMeses(response){
	$("#divCargando").hide();

	$('#cboMes').empty();
	$('#cboMes').append($('<option>', {
	    value: 0,
	    text: '-Seleccione un mes-'
	}));

	var datos = jQuery.parseJSON(response.d);

	$.each(datos, function(index, Valores) {
        $('#cboMes').append($('<option>', {
		    value: Valores.Mes,
		    text: DevuelveMes(Valores.Mes)
		}));
    });

	$("#cboVariable").prop("disabled", false);
	$("#cboAño").prop("disabled", false);
	$("#cboMes").prop("disabled", false);
	$('#cboMes').show()
}

function cboMes_change(pMes){
	$("#cboSemana").hide();

	$('#lnkConsultar').bind('click', false);
	$('#lnkConsultar').css("opacity","0.3")

	MesSeleccionado = undefined
	SemanaConsultada = undefined

	if(pMes != 0){
		//Seleccionó un mes
		$("#cboVariable").prop("disabled", true);
		$("#cboAño").prop("disabled", true);
		$("#cboMes").prop("disabled", true);
		$("#divCargando").show();

		MesSeleccionado = pMes

		//Busco las semanas
		$.ajax({
	        type: "POST",
	        url: "http://riancarga.inta.gob.ar/WsApps/ISSA/ISSA.aspx/TraeSemanas",
	        data: '{pIdVariable: "' + VariableSeleccionada + '", pAnio: "' + AñoSeleccionado + '", pMes: "' + MesSeleccionado + '"}',
	        cache: false,
	        contentType: "application/json; charset=utf-8",
	        dataType: "json",
	        success: CargoSemanas,
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	        	alert("Error en la llamada")
	        }
	    });
	}else{
		$("#divCargando").hide();
	}
}

function CargoSemanas(response){
	//alert(response.d)

	$("#divCargando").hide();

	$('#cboSemana').empty();
	$('#cboSemana').append($('<option>', {
	    value: 0,
	    text: '-Seleccione una semana-'
	}));

	var datos = jQuery.parseJSON(response.d);

	$.each(datos, function(index, Valores) {
        $('#cboSemana').append($('<option>', {
		    value: Valores.Fecha,
		    text: Valores.Fecha
		}));
    });

	$("#cboVariable").prop("disabled", false);
	$("#cboAño").prop("disabled", false);
	$("#cboMes").prop("disabled", false);
	$("#cboSemana").prop("disabled", false);
	$('#cboSemana').show()
}

function cboSemana_change(pSemana){
	if(pSemana != 0){
		$('#lnkConsultar').bind('click', true);
		$('#lnkConsultar').css("opacity","1")

		SemanaConsultada = pSemana	
	}else{
		$('#lnkConsultar').bind('click', false);
		$('#lnkConsultar').css("opacity","0.3")

		SemanaConsultada = undefined
	}
}

function lnkConsultar_click(){
	if(VariableSeleccionada != undefined && AñoSeleccionado != undefined && MesSeleccionado != undefined && SemanaConsultada != undefined){
		//alert("Consulto")
		$("#divCargando").show();
		$("#txtCargandoMapa").show()

		$("#divPbxSeleccionConsulta .close-portBox").hide()
		$("#ControlesSeleccion").hide()
		$("#lnkConsultar").hide()
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funciones varias
function DevuelveMes(pNumMes){
	var NombreMes = ""

	switch(pNumMes) {
	    case "1":
	        NombreMes = "Enero"
	        break;
	    case "2":
	        NombreMes = "Febrero"
	        break;
	    case "3":
	        NombreMes = "Marzo"
	        break;
	    case "4":
	        NombreMes = "Abril"
	        break;
	    case "5":
	        NombreMes = "Mayo"
	        break;
	    case "6":
	        NombreMes = "Junio"
	        break;
	    case "7":
	        NombreMes = "Julio"
	        break;
	    case "8":
	        NombreMes = "Agosto"
	        break;
	    case "9":
	        NombreMes = "Septiembre"
	        break;
	    case "10":
	        NombreMes = "Octubre"
	        break;
	    case "11":
	        NombreMes = "Noviembre"
	        break;
	    case "12":
	        NombreMes = "Diciembre"
	        break;
	}

	return NombreMes
}





/*function lnkContinuarSeleccionAño_click(pAño){
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
}*/

function cmdSeleccionAño_volver_click(){
	AñoSeleccionado = 0
	$("#divPbxSeleccionAño .close-portBox").click();
	$("#lnkPbSeleccionVariable").click()
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
