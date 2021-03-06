var socket = io();
var categories = [];
var umidade = [];
socket.on('dados', function(dados){
	$("#planta > div").text(dados);
});

var opções = {
	showScale: true,
	datasetStroke : false,
	scaleLabel: "<%=value%>%",
	scaleBeginAtZero: true
}

socket.on('releGetConfig', function(data){
	if(data.status){
		$("[name='releStade']").bootstrapSwitch('state', true);
		$("#portaRele").val(data.portaRele);
		$("#porcetRele").val(data.porcetRele);
	}else{
		$("[name='releStade']").bootstrapSwitch('state', false);
	}
});

socket.on('dadosGrafico', function(data){

	var obj = jQuery.parseJSON(data);
	categories = [];
		umidade = [];
	for (var i = 0; i < obj.length; i++) {
		categories.push(obj[i].dia);
		umidade.push(obj[i].umidade);
		console.log(umidade);
	};

	$(function () {
    $('#grafico').highcharts({
        title: {
            text: '',
            x: -20 //center
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: 'Umidade (%)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '%'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Umidade',
            data: umidade
        }]
    });
});
});


$(document).ready(function(){
	$('#tab a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	});

	$("#setDados").submit(function(){
		var hora = $("#selectHora").val();
		var minutos = $("#inputMinutos").val();
		var maxDados = parseFloat($("#inputMaxDados").val());
		socket.emit('setTime', {'hora': hora, 'minuto': minutos, 'maxDados': maxDados});

		return false;
	});

	$("[name='releStade']").bootstrapSwitch('state', false);
	$('input[name="releStade"]').on('switchChange.bootstrapSwitch', function(event, state) {
		$("#rele > form").slideToggle("slow");
		if(state){
			$("#formRele").submit(function(){
				var portaRele = $("#portaRele").val();
				var porcetRele = $("#porcetRele").val();
				console.log(porcetRele);
				socket.emit('releConfig', {'status': true, 'portaRele': portaRele, 'porcetRele': porcetRele});
				return false;
			});
		}else{
			socket.emit('releConfig', {'status': false});
		}
	});
});

