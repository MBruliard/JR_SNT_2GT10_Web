changer le systeme pour supprimer la varibale "globale" (qui n'en ai pas une). 
    On genere une operation, avec solution incluse et on autorise la lecture avec hide/show. Puis
    en cas de replay -> on relance une écriture complete


$(document).ready(function() {

    var Operation1 = create_operation();
    $("#display-operation").text(Operation1[0]);
    MathJax.typeset();

    $("#display-corr").hide(true);

    $("#correction1").click(function (){
        $("#display-corr").show();
        $("#display-corr-content").empty();
        $("#display-corr-content").append(Operation1[0]);
        $.each(Operation1[1], function(item, value) {
            $("#display-corr-content").append(value);
        });
        MathJax.typeset();

        $("#test").text(create_numerator());    
    });

    $("#play1").click(function () {
        var Operation1 = create_operation();
        $("#display-corr").hide();

        $("#display-corr-content").empty();
        $("#display-operation").text(Operation1[0]);
        
        MathJax.typeset();

    });


});

function create_numerator() {
    return Math.floor((Math.random() * 10));
}

function create_denominator() {
    return Math.floor((Math.random() * 10)+ 1);
}

function choose_operator() {
    choice = Math.floor((Math.random() * 3));

    switch(choice) {
        case 0:
         return "+";
         break;
        case 1 :
         return "-";
         break;
        default:
         return "\\times";
         break;
    }
}

function pgcd(a, b) {
    while (a!=b) {
        if (a>b){ 
            a-=b ;
        }
        else {
            b-=a;
        }
    }
    return a;
}

function create_operation () {
    /*
        Crée une operation de fractions simple

        @return array de 2 elements:
            * array[0] texte latex de l'operation
            * array[1] resultat de l'operation sous la forme d'un tableau (une case du tableau = une ligne)
    */

    let num1 = create_numerator();
    let num2 = create_numerator();
    let den1 = create_denominator();
    let den2 = create_denominator();
    let op = choose_operator();


    let results = new Array();
    if (op == "\\times") {
        /* on multiplie les denominateurs et les numerateurs entre eux */
        let tnum = num1 * num2;
        let tden = den1 * den2;

        results[0] = "$$ \\dfrac{" + num1.toString() + "\\times" + num2 + "}{" + den1 + "\\times" + den2 + "}$$";
        results[1] = "$$\\dfrac{"+ tnum + "}{" + tden + "}$$";

        /* on cherche le PGCD de tnum et tden */ 
        let gcd = pgcd(tnum, tden);
        if (gcd != 1) {
            tnum = Math.floor(tnum / gcd);
            tden = Math.floor(tden / gcd);
            results[2] = "$$ \\dfrac{" + tnum + "\\times " + gcd +"}{" + tden + "\\times " + gcd +"} $$";
            results[3] = "$$ \\dfrac{" + tnum + "}{" + tden + "}$$";
        }
    }
    else {
        //alert(false);
    }

    return ["$$ \\frac{" + num1 +"}{" + den1 + "}" + op + "\\frac{"+ num2 + "}{" + den2 + "} $$", results ];
}

