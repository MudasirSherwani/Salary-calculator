$('input:radio[name=statut]').is(':checked');
$('input:radio[name=nombreMois]').is(':checked');
var calculate = {
  smicmensuel: 1521.22, // http://www.net-iris.fr/indices-taux/paye/1-salaire-minimum-smic-horaire-smic-mensuel
  smichoraire: 10.03, // smic horaire brut de 2019
  smicpublication: 2019, // annéeencours
  hparm: 151.67, // heure/mois
  tax: $('input:radio[name=statut]:checked').val(),
  nbmois: $('input:radio[name=nombreMois]:checked').val(),
  tmptravail: 100,
  txsource: 100,
  init() {
    // launcher
    this.icheck();
    this.resultnet();
  },
  replaced(cinput) {
    cinput = cinput.replace(' ', '');
    cinput = cinput.replace(',', '.');
    // console.log('cin'+ cinput);
    cinput = parseFloat(cinput);
    if (isNaN(cinput)) {
      cinput = 0;
    }
    return cinput;
  },
  tx() {
    $('input:radio[name=statut]').bind('click', function () {
      calculate.tax = this.value;
      if (calculate.tax == 0.51) {
        var statut = 'Port -51%';
      } else if (calculate.tax == 0.15) {
        var statut = 'Public -15%';
      } else if (calculate.tax == 0.25) {
        var statut = 'Cadre -25%';
      } else if (calculate.tax == 0.45) {
        var statut = 'Indé -45%';
      } else {
        var statut = 'Non-cadre -22%';
      }
      $('li #statut').html(statut);

      const mensuelbrut = $('input#brut-mensuel').val();
      calculate.mnet(mensuelbrut);
    });
  },
  nbms() {
    $('input:radio[name=nombreMois]').bind('click', function () {
      calculate.nbmois = this.value;
      const mensuelbrut = $('input#brut-mensuel').val();
      calculate.mnet(mensuelbrut);
    });
  },
  tmptl() {
    const worktimeKeypressSlider = document.getElementById('worktimeKeypress');
    worktimeKeypressSlider.noUiSlider.on('update', (values, handle) => {
      const oldmensuelbrut = calculate.tmptravail;
      calculate.tmptravail = parseFloat(values[handle]);
      const mensuelbrut = $('input#brut-mensuel').val();
      calculate.mnet(mensuelbrut * (calculate.tmptravail / oldmensuelbrut));
    });
  },
  txsrc() {
    const sourceKeypressSlider = document.getElementById('sourceKeypress');
    sourceKeypressSlider.noUiSlider.on('update', (values, handle) => {
      /* var oldtmptravail = calculate.tmptravail;
            console.log("oldtmptravail"+oldtmptravail);
            var oldtxsource = calculate.txsource;
            console.log("oldtxsource"+oldtxsource); */
      calculate.txsource = parseFloat(values[handle]);
      const mensuelbrut = $('input#brut-mensuel').val();
      calculate.mnetsrc(mensuelbrut, calculate.txsource);
    });
  },
  /* effect : function(){
			var num = []
			num[0] = '3089O';
			num[1] = '387S93';
			num[2] = '3499E9';
			num[3] = '463098I';
			num[4] = '027d9q92';
			num[5] = '059842907';
			num[6] = '2579000978';
			console.log( num[i] );
	}, */
  mnet(val) {
    const _this = calculate;
    const mensuelbrut = val;
    const annuelBrut = mensuelbrut * _this.nbmois;
    const jourBrut = mensuelbrut / 20;
    const horaireBrut = mensuelbrut / (_this.hparm) * (100 / _this.tmptravail);
    const mensuelNet = mensuelbrut * (1 - _this.tax);
    const annuelNet = mensuelNet * _this.nbmois;
    const jourNet = mensuelNet / 20;
    const horaireNet = mensuelNet / (_this.hparm) * (100 / _this.tmptravail); // equivaut au 35 heure/semaine sur 1 mois

    $('#brut-horaire').val(Math.round(horaireBrut * 100) / 100);
    $('#brut-mensuel').val(Math.round(mensuelbrut));
    $('#brut-annuel').val(Math.round(annuelBrut));
    /* $('#brut-jour').val( Math.round( jourBrut ) ); */

    $('#net-horaire').val(Math.round(horaireNet * 100) / 100);
    $('#net-mensuel').val(Math.round(mensuelNet));
    $('#net-annuel').val(Math.round(annuelNet));
    /* $('#net-jour').val( jourNet ); */

    set_txsource(Math.round(mensuelNet)); // Calcul du taux de prélèvement neutre
  },
  mnetsrc(val, txsource) {
    const _this = calculate;

    const mensuelbrut = val;
    const annuelBrut = mensuelbrut * _this.nbmois;
    const jourBrut = mensuelbrut / 20;
    const horaireBrut = mensuelbrut / (_this.hparm) * (100 / _this.tmptravail);

    const mensuelNetSource = (mensuelbrut * (1 - _this.tax)) - (mensuelbrut * (1 - _this.tax) * (txsource / 100));
    const annuelNetSource = mensuelNetSource * _this.nbmois;
    const jourNetSource = mensuelNetSource / 20;
    const horaireNetSource = mensuelNetSource / (_this.hparm) * (100 / _this.tmptravail); // equivaut au 35 heure/semaine sur 1 mois

    $('#net-mensuel-source').val(Math.round(mensuelNetSource));
    $('#net-annuel-source').val(Math.round(annuelNetSource));
    /* $('#net-jour').val( jourNet ); */
  },
  resultnet() {
    const _this = calculate;

    $('#calculator input.input').keypress(function (event) {
      if (event.which == 8 || event.which == 0) {
        return true;
      }
      if (event.which < 44 || event.which == 45 || event.which == 47 || event.which > 57) {
        return false;
        // event.preventDefault();
      } // prevent if not number/dot

      if (event.which == 44 && $(this).val().indexOf(',') != -1) {
        return false;
        // event.preventDefault();
      } // prevent if already comma

      if (event.which == 46 && $(this).val().indexOf('.') != -1) {
        return false;
        // event.preventDefault();
      } // prevent if already dot

      // this part is when left part of number is deleted and leaves a . in the leftmost position. For example, 33.25, then 33 is deleted
      $('.filterme').keyup(function (eve) {
        if ($(this).val().indexOf('.') == 0) {
          $(this).val($(this).val().substring(1));
        }
      });
    });

    $('#calculator input.input').bind('change paste keyup', function () {
      if (this.value && (this.value.substr(-1, 1) != ',') && (this.value.substr(-1, 1) != '.')) {
			  // console.log($(this).attr('id'));

        switch ($(this).attr('id')) {
          case 'brut-horaire':
            var horaireBrut = _this.replaced(this.value);
			               var mensuelbrut = horaireBrut * (_this.hparm) * (_this.tmptravail / 100);
            break;
          case 'brut-mensuel':
            var mensuelbrut = _this.replaced(this.value);
            break;
          case 'brut-annuel':
            var annuelBrut = _this.replaced(this.value);
			               var mensuelbrut = annuelBrut / _this.nbmois;
            break;
          case 'net-horaire':
            var horaireNet = _this.replaced(this.value);
			               var mensuelbrut = (horaireNet * (_this.hparm)) / (1 - _this.tax) * (_this.tmptravail / 100);
            break;
          case 'net-mensuel':
            var mensuelNet = _this.replaced(this.value);
			               var mensuelbrut = mensuelNet / (1 - _this.tax);
            break;
          case 'net-annuel':
            var annuelNet = _this.replaced(this.value);
			               var mensuelbrut = annuelNet / ((1 - _this.tax) * _this.nbmois);
            break;
          default:
            console.log('error no case to switch');
        }
        calculate.mnet(mensuelbrut);
        // get_insee_salaire();
      }
    });

    // journalier
    /* $('input#brut-jour').blur(function() {
			if(this.value){
			  var jourBrut = _this.replaced(this.value);
			  var mensuelbrut = jourBrut * 20;
			  calculate.mnet(mensuelbrut);
			}
		}); */
  },
  icheck() {
	  $('input').iCheck({
	    checkboxClass: 'icheckbox_square-red',
	    radioClass: 'iradio_square-red',
	    increaseArea: '20%', // optional
	  });
  },
};

$(document).ready(() => {
  $('.calculator_option').hide();
});

/* $("#comparer_salaire").click(function() {
     $(".calculator_option").toggle();
}); */

$('#reset').click(() => {
  $("#salary input[name='brut']").val('');
  $("#salary input[name='net']").val('');
  $('#parameters .prelsource input').val('');
});

$(document).ready(() => {
  const worktimeKeypressSlider = document.getElementById('worktimeKeypress');
  const input = document.getElementById('input-with-worktime-keypress');

  noUiSlider.create(worktimeKeypressSlider, {
     	start: 100,
     	step: 10,
     	range: {
     		min: 10,
     		max: 100,
     	},
    format: wNumb({
      decimals: 0,
      postfix: ' %',
    }),
  });

  worktimeKeypressSlider.noUiSlider.on('update', (values, handle) => {
     	// input.value = values[handle];
    input.innerHTML = values[handle];
  });

  input.addEventListener('change', function () {
     	worktimeKeypressSlider.noUiSlider.set([null, this.value]);
  });

  // Listen to keydown events on the input field.
  input.addEventListener('keydown', function (e) {
     	// Convert the string to a number.
     	const value = Number(worktimeKeypressSlider.noUiSlider.get());
     	let sliderStep = worktimeKeypressSlider.noUiSlider.steps();

     	// Select the stepping for the first handle.
     	sliderStep = sliderStep[0];

     	// 13 is enter,
     	// 38 is key up,
     	// 40 is key down.
     	switch (e.which) {
     		case 13:
     			worktimeKeypressSlider.noUiSlider.set(this.value);
     			break;
     		case 38:
     			worktimeKeypressSlider.noUiSlider.set(value + sliderStep[1]);
     			break;
     		case 40:
     			worktimeKeypressSlider.noUiSlider.set(value - sliderStep[0]);
     			break;
     	}
  });
});

$(document).ready(() => {
  const sourceKeypressSlider = document.getElementById('sourceKeypress');
  const input = document.getElementById('input-with-source-keypress');

  noUiSlider.create(sourceKeypressSlider, {
     	start: 0,
     	step: 0.5,
     	range: {
     		min: 0,
     		max: 43,
     	},
    format: wNumb({
      decimals: 1,
      postfix: ' %',
    }),
  });

  sourceKeypressSlider.noUiSlider.on('update', (values, handle) => {
     	// input.value = values[handle];
    input.innerHTML = values[handle];
  });

  input.addEventListener('change', function () {
     	sourceKeypressSlider.noUiSlider.set([null, this.value]);
  });

  // Listen to keydown events on the input field.
  input.addEventListener('keydown', function (e) {
     	// Convert the string to a number.
     	const value = Number(sourceKeypressSlider.noUiSlider.get());
     	let sliderStep = sourceKeypressSlider.noUiSlider.steps();

     	// Select the stepping for the first handle.
     	sliderStep = sliderStep[0];

     	// 13 is enter,
     	// 38 is key up,
     	// 40 is key down.
     	switch (e.which) {
     		case 13:
     			sourceKeypressSlider.noUiSlider.set(this.value);
     			break;
     		case 38:
     			sourceKeypressSlider.noUiSlider.set(value + sliderStep[1]);
     			break;
     		case 40:
     			sourceKeypressSlider.noUiSlider.set(value - sliderStep[0]);
     			break;
     	}
  });
});
function set_txsource(val) {
  const sourceKeypressSlider = document.getElementById('sourceKeypress');
  const taux_neutre_calcul = get_tx_neutre_source(val);
  sourceKeypressSlider.noUiSlider.set(taux_neutre_calcul);
}

function get_tmptravail() {
  const format = wNumb({
    decimals: 0,
    postfix: ' %',
  });
  const slider = document.getElementById('worktimeKeypress');
  const value = slider.noUiSlider.get();

  return format.from(value);
  // return 100;
}

function get_txsource() {
  const format = wNumb({
    decimals: 1,
    postfix: ' %',
  });
  const slider = document.getElementById('sourceKeypress');
  const value = slider.noUiSlider.get();

  return format.from(value);
  // return 100;
}

function get_tx_neutre_source(val) {
  // https://www.cbanque.com/actu/67081/impot-a-la-source-quel-taux-imposition-pouvez-vous-choisir
  const revenus_net = [1404, 1457, 1551, 1656, 1769, 1864, 1988, 2578, 2797, 3067, 3452, 4029, 4830, 6043, 7780, 10562, 14795, 22620, 47717];
  const taux_neutre = [0, 0.5, 1.5, 2.5, 3.5, 4.5, 6, 7.5, 9, 10.5, 12, 14, 16, 18, 20, 24, 28, 33, 38, 43];
  let taux_calcul = 0;

  jQuery.each(revenus_net, (key, montant_revenus_net) => {
    if (val < montant_revenus_net) {
      taux_calcul = taux_neutre[key];
      return false; // break
    }
    // console.log("revenus_net : "+revenus_net.length);
    // console.log("key : "+key);
    if ((revenus_net.length - 1) == key) { // Quand le revenus net est supérieur au dernier revenu de la liste
      taux_calcul = taux_neutre[key + 1]; // Le taux est égale au dernier élément de la liste
      return false; // break
    }
    return true; // continue;
  });
  return taux_calcul;
}

$(document).ready(() => {
  calculate.init();
  calculate.tx();
  calculate.nbms();
  calculate.tmptl();
  calculate.txsrc();
});
