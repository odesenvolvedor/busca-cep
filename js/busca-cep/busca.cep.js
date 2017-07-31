//Consulta Cep
$(document).ready(function () {
    var somenteNumeros = function (valor) {
        return valor.replace(/\D/g, '');
    };
    var trim = function (valor) {
        return valor.replace(" ", "");
    };

    var consultaCep1 = function (cep) {
        if (cep != '75000-000' && cep.length >= 9) {
            $.get("http://apps.widenet.com.br/busca-cep/api/cep.json", {code: cep}, function (result) {
                if (result.status != 1) {
                    console.log('Erro na Busca de CEP 1. Tentando em Outro Servidor');
                    $.getJSON("//viacep.com.br/ws/" + somenteNumeros(cep) + "/json/?callback=?", function (dados) {
                        if (!("erro" in dados)) {
                            $("input#cidade").val(dados.localidade);
                            $("input#bairro").val(dados.bairro);
                            $("input#logradouro").val(dados.logradouro);
                            $('#uf').val(dados.uf);
                            console.log('Achou o CEP na Busca 2.')
                        } else {
                            console.log('Erro Busca 2');
                        }
                    });
                } else {
                    $("input#cidade").val(result.city);
                    $("input#bairro").val(result.district);
                    $("input#logradouro").val(result.address);
                    $('#uf').val(result.state);
                }
            });
        }
    };


    $('#cep').on('keyup blur', function (e) {
        var valor = $(this).val();
        //Nova variável "cep" somente com dígitos.
        var cep = somenteNumeros(valor);

        //Verifica se campo cep possui valor informado.
        if (cep != "") {
            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;
            //Valida o formato do CEP.
            if (validacep.test(cep)) {
                consultaCep1(valor);
            }
        }
    });

});

function inputHandler(masks, max, event) {
    var c = event.target;
    var v = c.value.replace(/\D/g, '');
    var m = c.value.length > max ? 1 : 0;
    VMasker(c).unMask();
    VMasker(c).maskPattern(masks[m]);
    c.value = VMasker.toPattern(v, masks[m]);
}

//Cep
var cepMask = ['99999-999'];
var cep = document.querySelector('#cep');
if (cep != null) {
    VMasker(cep).maskPattern(cepMask[0]);
    cep.addEventListener('input', inputHandler.bind(undefined, cepMask, 14), false);
}