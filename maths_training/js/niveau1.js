$(document).ready(function() {

    load_operation_with_correction()

    $("#correction1").click(function (){
        $("#display-corr").show();    
    });

    $("#play1").click(function () {
        load_operation_with_correction()
    });


});

function create_numerator() {
    /**
     * Choisit aléatoirement un numérateur entre 0 et 9 inclus
     */
    return Math.floor((Math.random() * 10));
}

function create_denominator() {
    /**
     * Choisit aléatoirement un dénominateur entre 1 et 9 inclus
     */

    return Math.floor((Math.random() * 10)+ 1);
}

function choose_operator() {
    /**
     * Choisit aléatoirement le type d'opération à effectuer entre '+', '-' et 'x'
     */

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
    /**
     * Calcul le PGCD de deux nombres donnés
     */
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

    /* Simplification: */
    num1 = Math.floor(num1 / pgcd(num1, den1));
    den1 = Math.floor(den1 / pgcd(num1, den1));

    num2 = Math.floor(num2 / pgcd(num2, den2));
    den2 = Math.floor(den2 / pgcd(num2, den2));

    let results = new Array();
    if (op == "\\times") {
        /* on multiplie les denominateurs et les numerateurs entre eux */
        let tnum = num1 * num2;
        let tden = den1 * den2;

        results[0] = "$$ \\dfrac{" + num1 + "\\times" + num2 + "}{" + den1 + "\\times" + den2 + "}$$";
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
        /* mise au même dénominateur */

    }

    /* ecriture du calcul : */
    writing = "$$" ; 
    if (den1 == 1) {
        writing = writing.concat(num1) ;
    }
    else {
        writing = writing.concat("\\frac{", num1, "}{", den1, "}") ;
    }

    writing = writing + op;

    if (den2 == 1) {
        writing = writing + num2 ;
    }
    else {
        writing = writing + "\\frac{" + num2 +"}{" + den2 + "}";
    }

    writing = writing + "$$";
   
    return [writing, results ];

}



function load_operation_with_correction () {
    /*
     * affiche une nouvelle operation dans la fenetre    
    */

    let operation1 = create_operation();
    $("#display-operation").text(operation1[0]);
    MathJax.typeset();

    /* affichage de la correction */
    $("#display-corr").hide(true);
    $("#display-corr-content").empty();
    $("#display-corr-content").append(operation1[0]);
    $.each(operation1[1], function(item, value) {
        $("#display-corr-content").append(value);
    });
    MathJax.typeset();
}

