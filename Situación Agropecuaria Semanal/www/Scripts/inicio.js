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
var CantMasDatos = 0
var DepartamentoClickeado

$(function(){
	/////////////////////////////////////////////
	//Splash
	//$("#contenido").hide()
	//MostrarSplash()
	$("#splashScreen").hide()
	/////////////////////////////////////////////

	/////////////////////////////////////////////
	//Inicializar
	InicializarMapa()
	InicializarMenu()

	//Fastclick
	FastClick.attach(document.body);

	/////////////////////////////////////////////
	//Eventos 
	$("#cmdNuevaConsulta").click(function(){
		cmdNuevaConsulta_click()
	});

	$("#cboVariable").change(function(){
		cboVariable_change($(this).val())
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

	$('body').on('click','.lnkMasInfo', function (event) {
        event.preventDefault();
        lnkMasInfoDepto_click($(this).data('iddepto'))
    });

	$("#VerComentarioGeneral").click(function(){
		VerComentarioGeneral_click()
	});

	$("#VerComentarioEspecifico").click(function(){
		VerAdversidadGeneral_click()	
	});

	$("#VerPrecipitaciones").click(function(){
		VerPrecipitaciones_click()	
	});

	$("#VerInforme").click(function(){
		VerInforme_click()
	});

	$('body').on('click','.close-portBox', function (event) {
        event.preventDefault();
        CierraPortbox($(this).parent().attr('id'))
    });    

	/*$("#cmdGuardarMapa").click(function(){
		cmdGuardarMapa_click()
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
        zoomControl: true,
	    zoomControlOptions: {
	        position: google.maps.ControlPosition.LEFT_BOTTOM
	    },
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), myOptions);

    geoXml = new geoXML3.parser({
        map: map,
        singleInfoWindow: true,
        mapTypeControl: false,
        zoom: false,
        afterParse: useTheData,
        failedParse: errorParser
    });

   
}

function DevuelveColorDeptoSegunDato(unDato){
	return "#color" + unDato
}

function useTheData(doc) {
    $("#pbxCargando .close-portBox").click();
    //$("#cmdGuardarMapa").show()
}

function errorParser() {
    alert("Error parser mapa")
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

    //$("#cmdGuardarMapa").hide()
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
		$("#divPbxSeleccionConsulta .close-portBox").click();

		//Cambio el texto
		$("#txtCargando").text("Cargando mapa...")
		$("#lnkPbCargando").click();

		$("#pbxCargando .close-portBox").hide();

		LimpiarMapa()

		var ahora = new Date();

		if(document.getElementById("chkLeerLocal").checked == true){
			$.ajax({
			    type: "POST",
			    url: "http://riancarga.inta.gob.ar/WsApps/ISSA/ISSA.aspx/TraeDatosMapa",
		        data: '{pAnio: "' + SemanaConsultada.substr(6,4) + '", pMes: "' + SemanaConsultada.substr(3,2) + '", pDia: "' + SemanaConsultada.substr(0,2) + '", pVariable: "' + VariableSeleccionada + '"}',
			    cache: false,
			    contentType: "application/json; charset=utf-8",
			    dataType: "json",
			    success: PintoUnMapa,
			    error: function (XMLHttpRequest, textStatus, errorThrown) {
			    	alert("Error en la llamada")
			    }
			});
		}else{
			geoXml.parse("http://riancarga.inta.gob.ar/WsApps/ISSA/ArmarMapa.aspx?rnd=" + ahora.getTime() + "&Dia=" + SemanaConsultada.substr(0,2)  + "&Mes=" + SemanaConsultada.substr(3,2)  + "&Anio=" + SemanaConsultada.substr(6,4) + "&Variable=" + VariableSeleccionada);
		}

		$("#divTituloMapa").html('<p>' + TextoVariableSeleccionada + '</p><p>Semana del ' + SemanaConsultada + ' al ' + SumarFecha(SemanaConsultada, 6) + '</p>')
	}
}

function PintoUnMapa(response){
	$.get("Archivos/MapaBase.xml", function( data ) {
    	var datos = jQuery.parseJSON(response.d);

		for (var x = 0; x < datos.Registros.length - 1; x++) {
			var xmlIndiceDepto = data.evaluate('count(kml/Document/Folder[2]/Placemark[@id="' + datos.Registros[x].IdDepto + '"]/preceding-sibling::*)', data, null, XPathResult.STRING_TYPE, null);
	        var numIndiceDepto = Number(xmlIndiceDepto.stringValue)

	        numIndiceDepto = numIndiceDepto * 2 + 1

	        xmlUnEstilo = data.firstChild.childNodes[1].childNodes[23].childNodes[numIndiceDepto].childNodes[3]
	        xmlUnEstilo.innerHTML = DevuelveColorDeptoSegunDato(datos.Registros[x].Dato)
        }

        geoXml.parseKmlString(new XMLSerializer().serializeToString(data))
	});
}

function SumarFecha(pFecha, diasSumo){
	var returnDate = new Date(
		parseInt(pFecha.substr(6,4)),
		parseInt(pFecha.substr(3,2)) - 1,
		parseInt(pFecha.substr(0,2)) + diasSumo
		);

	return AgregoCerosFecha(returnDate.getDate()) + "/" + AgregoCerosFecha(returnDate.getMonth() + 1) + "/" + returnDate.getFullYear()
}

function AgregoCerosFecha(pNumero){
	var strNum = String(pNumero)

	if(strNum.length == 1){
		strNum = "0" + strNum
	}

	return strNum
}

function LimpiarMapa() {
    if (geoXml.docs.length > 0) {
        for (var k = 0; k < geoXml.docs.length - 1; k++) {
            geoXml.docs.shift();
        }

        //Cierra cualquier infowindow abierto en el mapa
	    if (geoXml.docs[0].gpolygons[0]) {
	        geoXml.docs[0].gpolygons[0].infoWindow.close();
	    }
	    for (var i = geoXml.docs[0].gpolygons.length; i > 0; i--) {
	        geoXml.docs[0].gpolygons[i - 1].setMap(null);
	        geoXml.docs[0].gpolygons.pop();
	    }
	    for (var k = geoXml.docs[0].gpolylines.length; k > 0; k--) {
	        geoXml.docs[0].gpolylines[k - 1].setMap(null);
	        geoXml.docs[0].gpolylines.pop();
	    }
    }
}

function lnkMasInfoDepto_click(pIdDepto){
	//Cambio el texto
	$("#txtCargando").text("Buscando datos....")
	$("#lnkPbCargando").click();

	DepartamentoClickeado = pIdDepto

	//Busco las semanas
	$.ajax({
	    type: "POST",
	    url: "http://riancarga.inta.gob.ar/WsApps/ISSA/ISSA.aspx/TraeTiposMasDatosPorDepto",
	    data: '{pIdDepto: "' + pIdDepto + '", pFecha: "' + SemanaConsultada + '"}',
	    cache: false,
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    success: MuestroMenuMasDatosInfo,
	    error: function (XMLHttpRequest, textStatus, errorThrown) {
	     	alert("Error en la llamada")
	    }
	});
}

function MuestroMenuMasDatosInfo(response){
	var datos = jQuery.parseJSON(response.d);

	var vTieneComentario = 0
	var vTieneAdversidad = 0
	var vTienePrecipitaciones = 0
	var vTieneInforme = 0
	var vNombreDeptoCliqueado = ""

	CantMasDatos = 0

	$.each(datos, function(index, Valores) {
		vNombreDeptoCliqueado = Valores.NombreDepto

        if(Valores.TieneComentario == "1"){
        	$("#VerComentarioGeneral").show()
        	CantMasDatos = CantMasDatos + 1
        	vTieneComentario = 1
        }else{
        	$("#VerComentarioGeneral").hide()
        }

        if(Valores.TieneAdversidad == "1"){
        	$("#VerComentarioEspecifico").show()
        	CantMasDatos = CantMasDatos + 1
        	vTieneAdversidad = 1
        }else{
        	$("#VerComentarioEspecifico").hide()
        }

        if(Valores.TieneLluvias == "1"){
        	$("#VerPrecipitaciones").show()
        	CantMasDatos = CantMasDatos + 1
        	vTienePrecipitaciones = 1
        }else{
        	$("#VerPrecipitaciones").hide()
        }

        if(Valores.TieneInforme == "1"){
        	$("#VerInforme").show()
        	CantMasDatos = CantMasDatos + 1
        	vTieneInforme = 1
        }else{
        	$("#VerInforme").hide()
        }
    });

	if(CantMasDatos > 1){
		//Tiene más de un dato para mostrar, le abro el menú
		$("#txtNombreDeptoMasDatos").text(vNombreDeptoCliqueado)
		$("#txtFechaMasDatos").text("Semana del " + SemanaConsultada + " al " + SumarFecha(SemanaConsultada, 6))		

		$("#pbxCargando .close-portBox").click();
    	$("#lnkPbMenuMasDatosDepto").click();	
	} else {
		//Solo tiene un dato para mostrar, se lo presento directamente
		if(vTieneComentario == 1){
			BuscoComentarioDepto()
		}else{
			if(vTieneAdversidad == 1){
				BuscoAdversidadDepto()
			}else{
				if(vTienePrecipitaciones == 1){
					BuscoPrecipitacionesDepto()
				}else{
					BuscoInformeDepto()
				}
			}
		}
	}
}

function BuscoComentarioDepto(){
	$("#txtCargando").text("Buscando comentario...")

	$.ajax({
        type: "POST",
        url: "http://riancarga.inta.gob.ar/WsApps/ISSA/ISSA.aspx/TraeComentarioDepartamento",
        data: '{pIdDepto: "' + DepartamentoClickeado + '", pFecha: "' + SemanaConsultada + '"}',
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: MuestroComentario,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
	     	alert("Error en la llamada")
	    }
    });
}

function VerComentarioGeneral_click(){
	$("#pbxMenuMasDatosDepto .close-portBox").click();
	$("#txtCargando").text("Buscando comentario...")
	$("#lnkPbCargando").click()

	BuscoComentarioDepto()
}

function MuestroComentario(response){
	ArmoDivPbMasDatos()

	var strHtml = '<div id="" class="H1_pb">Comentario general</div>'
	strHtml = strHtml + '<p>' + response.d + '</p>'

	$("#pbxCargando .close-portBox").click();
	$("#pbxUnMasDatos").html(strHtml)
	$("#lnkPbUnMasDatos").click();
}

function BuscoAdversidadDepto(){
	$("#txtCargando").text("Buscando comentario...")

	$.ajax({
        type: "POST",
        url: "http://riancarga.inta.gob.ar/WsApps/ISSA/ISSA.aspx/TraeAdversidadDepartamento",
        data: '{pIdDepto: "' + DepartamentoClickeado + '", pFecha: "' + SemanaConsultada + '"}',
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: MuestroAdversidad,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
	     	alert("Error en la llamada")
	    }
    });
}

function VerAdversidadGeneral_click(){
	$("#pbxMenuMasDatosDepto .close-portBox").click();
	$("#txtCargando").text("Buscando comentario...")
	$("#lnkPbCargando").click()

	BuscoAdversidadDepto()
}

function MuestroAdversidad(response){
	ArmoDivPbMasDatos()

	var strHtml = '<div id="" class="H1_pb">Comentario específico</div>'
	strHtml = strHtml + '<p>' + response.d + '</p>'

	$("#pbxCargando .close-portBox").click();
	$("#pbxUnMasDatos").html(strHtml)
	$("#lnkPbUnMasDatos").click();
}

function VerPrecipitaciones_click(){
	$("#pbxMenuMasDatosDepto .close-portBox").click();
	$("#txtCargando").text("Buscando precipitaciones...")
	$("#lnkPbCargando").click()

	BuscoPrecipitacionesDepto()
}

function BuscoPrecipitacionesDepto(){
	$("#txtCargando").text("Buscando precipitaciones...")

	$.ajax({
        type: "POST",
        url: "http://riancarga.inta.gob.ar/WsApps/ISSA/ISSA.aspx/TraePrecipitacionesDepartamento",
        data: '{pIdDepto: "' + DepartamentoClickeado + '", pFecha: "' + SemanaConsultada + '"}',
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: MuestroPrecipitaciones,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
	     	alert("Error en la llamada")
	    }
    });
}

function MuestroPrecipitaciones(response){
	ArmoDivPbMasDatos()

	var datos = jQuery.parseJSON(response.d);

	var strHtml = '<div id="" class="H1_pb">Precipitaciones</div>'
	strHtml = strHtml + '<table id="tblPrecipitacionesMasInfo"><tr><td style="border-left: 1px solid #085980; border-top: 1px solid #085980; border-bottom: 1px solid #085980;">&nbsp;</td><td colspan="3" class="textoCentrado">Acumulados</td></tr>'
	strHtml = strHtml + '<tr><td style="border-left: 1px solid #085980;">&nbsp;</td><td class="textoCentrado">Semanal</td><td class="textoCentrado">Mensual</td><td class="textoCentrado">Anual</td></tr>'

	for(var x = 0; x < datos.Registros.length; x++) {
		strHtml = strHtml + '<tr><td>' + datos.Registros[x].Medidor + '</td><td>' + datos.Registros[x].Semanal + ' mm</td><td>' + datos.Registros[x].Mensual + ' mm</td><td>' + datos.Registros[x].Anual + ' mm</td></tr>'
    }

    $("#pbxCargando .close-portBox").click();
	$("#pbxUnMasDatos").html(strHtml)
	$("#lnkPbUnMasDatos").click();
}

function VerInforme_click(){
	$("#pbxMenuMasDatosDepto .close-portBox").click();
	$("#txtCargando").text("Buscando informe...")
	$("#lnkPbCargando").click()

	BuscoInformeDepto()
}

function BuscoInformeDepto(){
	$("#txtCargando").text("Buscando informe...")

	$.ajax({
        type: "POST",
        url: "http://riancarga.inta.gob.ar/WsApps/ISSA/ISSA.aspx/TraeInformeDepartamento",
        data: '{pIdDepto: "' + DepartamentoClickeado + '", pFecha: "' + SemanaConsultada + '"}',
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: MuestroInforme,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
	     	alert("Error en la llamada")
	    }
    });
}

function MuestroInforme(response){
	ArmoDivPbMasDatos()

	var strHtml = '<div id="" class="H1_pb">Informe adjunto</div><div style="text-align:center;"><img class="imgInforme" src="'

	var datos = jQuery.parseJSON(response.d);

	//alert(datos.Informe.Nombre)
	//alert(datos.Informe.Ubicacion)

	var extension = datos.Informe.Ubicacion.substring(datos.Informe.Ubicacion.lastIndexOf("."))

	switch (extension.toLowerCase()) {
	    case ".jpg":
	        strHtml = strHtml + 'Imagenes/Archivos/imagen.png" />'
	        break;
	    case ".jpeg":
	        strHtml = strHtml + 'Imagenes/Archivos/imagen.png" />'
	        break;
	    case ".gif":
	        strHtml = strHtml + 'Imagenes/Archivos/imagen.png" />'
	        break;
	    case ".png":
	        strHtml = strHtml + 'Imagenes/Archivos/imagen.png" />'
	        break;
	    case ".doc":
	        strHtml = strHtml + 'Imagenes/Archivos/word.png" />'
	        break;
	    case ".docx":
	        strHtml = strHtml + 'Imagenes/Archivos/word.png" />'
	        break;
	    case  ".pdf":
	        strHtml = strHtml + 'Imagenes/Archivos/pdf.png" />'
	        break;
	    case  ".txt":
	        strHtml = strHtml + 'Imagenes/Archivos/texto.png" />'
	        break;
	    case  ".xls":
	        strHtml = strHtml + 'Imagenes/Archivos/excel.png" />'
	        break;
	    case  ".xlsx":
	        strHtml = strHtml + 'Imagenes/Archivos/excel.png" />'
	        break;
	    case  ".zip":
	        strHtml = strHtml + 'Imagenes/Archivos/comprimido.png" />'
	        break;
	    case  ".rar":
	        strHtml = strHtml + 'Imagenes/Archivos/comprimido.png" />'
	        break;
	    default:
	    	strHtml = strHtml + 'Imagenes/Archivos/desconocido.png" />'
	    	break;
	}

	strHtml = strHtml + "</div><p class='NombreArchivoInforme textoCentrado'>" + datos.Informe.Nombre + "</p>"
	strHtml = strHtml + "<a class='lnkDescargarInforme textoCentrado' href='http://riancarga.inta.gob.ar/situacionagropecuaria/informes/" + datos.Informe.Ubicacion + "'>Descargar&nbsp;<img align='absmiddle' src='Imagenes/iconoContinuarMenu.png' /></a>"

	$("#pbxCargando .close-portBox").click();
	$("#pbxUnMasDatos").html(strHtml)
	$("#lnkPbUnMasDatos").click();
}

function ArmoDivPbMasDatos(){
	var strHtmlDiv = '<div id="pbxUnMasDatos" class="portBox"></div><a href="#" id="lnkPbUnMasDatos" data-display="pbxUnMasDatos" data-closeBGclick="false" class="button" style="display: none;">Un Mas Datos</a>'

	$("#divUnMasDatosDepto").html(strHtmlDiv)
}

function CierraPortbox(pNombrePortbox){
	if(pNombrePortbox == "pbxUnMasDatos" && CantMasDatos > 1){
		//Si tiene más de un dato abro el menú de mas datos
		$("#lnkPbMenuMasDatosDepto").click()
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Guardar y cargar mapas

/*function cmdGuardarMapa_click(){
	//Veremos...
	var fileTransfer = new FileTransfer();
	var ahora = new Date();

    var uri = encodeURI("http://rian.inta.gob.ar/Imagenes/LogoRIAN.jpg");
    var fileURL =  "///storage/emulated/0/Download/LogoRIAN.jpg";

    fileTransfer.download(
    	uri, fileURL, function(entry) {
        	alert("Descargó el logo RIAN!: " + entry.toURL());
        },
            
        function(error) {
        	alert("download error source " + error.source);
            alert("download error target " + error.target);
            alert("download error code" + error.code);
        },
            
        false, {
        	headers: {
            	"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );
}*/

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
