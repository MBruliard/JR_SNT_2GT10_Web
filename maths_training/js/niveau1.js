$(document).ready(function() {

    load_operation_with_correction()

    $("#correction1").click(function (){
        $("#display-corr").show();    
    });

    $("#play1").click(function () {
        load_operation_with_correction()
    });


});

function create_fraction(pos) {
    /**
     * Build a fraction with two integers
     * @arg pos boolean to decide if we force to have a positive fraction. 
     * @return res an array of two elements. The first one will be the numerator and the second the denominator
     */

    num = Math.floor((Math.random() * 10 ));
    den = Math.floor((Math.random() * 10 ) + 1);

    if (pos) {
        return [num, den];
    }
    
    if (Math.floor(Math.random() * 2) == 1) {
        return [-num, den];
    }
}

function simplify_fraction (ar) {
    /**
     * Simplify a given fraction to return her irreductible
     * @arg ar the array of two elements which represents the fraction
     * @return an new array with the irreductible fraction
     * @return value of pgcd
     */

    p = pgcd(ar[0], ar[1]);
    return [[Math.floor( ar[0] / p), Math.floor(ar[1] / p)], p];
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

function ppcm (a, b) {
    /**
     * Compute ppcm
     * @arg a the first integer
     * @arg b the second integer
     * @return value of ppcm(a, b)
     */

    return Math.floor(Math.abs(a * b / pgcd(a, b)));
}

function create_operation () {
    /*
        Build a simple operation between two fractions

        @return array de 2 elements:
            * array[0] texte latex de l'operation
            * array[1] resultat de l'operation sous la forme d'un tableau (une case du tableau = une ligne)
    */

    f1 = create_fraction(true);
    f1 = simplify_fraction(f1)[0];

    f2 = create_fraction(true);
    f2 = simplify_fraction(f2)[0];

    op = choose_operator();

    let results = new Array();

    tnum = 0;
    tden = 1;

    if (op == "\\times") {
        // on multiplie les denominateurs et les numerateurs entre eux 
        tnum = f1[0] * f2[0];
        tden = f1[1] * f1[1];

        results.push("\\dfrac{" + f1[0] + "\\times" + f2[0] + "}{" + f1[1] + "\\times" + f2[1] + "}");
        results.push("\\dfrac{"+ tnum + "}{" + tden + "}");
    }
    else {     
        
        // step 1: find a common denominator
        tden = ppcm(f1[1], f2[1]);

        m1 = Math.floor(tden / f1[1]);
        m2 = Math.floor(tden / f2[1]);

        results.push("\\dfrac{".concat(f1[0],"\\times",m1, "}{", f1[1], "\\times", m1, "}", op, "\\dfrac{", f2[0], "\\times", m2, "}{", f2[1], "\\times", m2, "}")); 

        tnum1 = m1 * f1[0];
        tnum2 = m2 * f2[0];

        results.push("\\dfrac{".concat(tnum1, "}{", tden, "}", op, "\\dfrac{", tnum2, "}{", tden, "}"));
        results.push("\\dfrac{".concat(tnum1, op, tnum2, "}{", tden, "}"));

        if (op == '-') {
            tnum = tnum1 - tnum2;
        }
        else {
            tnum = tnum1 + tnum2;
        }

        results.push("\\dfrac{".concat(tnum, "}{", tden, "}"));
    }

    //simplify fraction 

    [irr_frac, gcd] = simplify_fraction([tnum, tden]);
    if (gcd > 1) {
        results.push("\\dfrac{" + irr_frac[0] + "\\times " + gcd +"}{" + irr_frac[1] + "\\times " + gcd +"}");
        results.push("\\dfrac{" + irr_frac[0] + "}{" + irr_frac[1] + "}");
    }

    
    //ecriture du calcul : 
    writing = "" ; 
    if (f1[1] == 1) {
        writing = writing.concat(f1[0]) ;
    }
    else {
        writing = writing.concat("\\frac{", f1[0], "}{", f1[1], "}") ;
    }

    writing = writing + op;

    if (f2[1] == 1) {
        writing = writing + f2[0] ;
    }
    else {
        writing = writing + "\\frac{" + f2[0] +"}{" + f2[1] + "}";
    }
   
    return [writing, results ];
}



function load_operation_with_correction () {
    /*
     * affiche une nouvelle operation dans la fenetre    
    */

    let operation1 = create_operation();
    $("#display-operation").text("$$" + operation1[0] + "$$");
    MathJax.typeset();

    /* affichage de la correction */
    $("#display-corr").hide(true);
    $("#display-corr-content").empty();
    $("#display-corr-content").append("$$" + operation1[0] + "$$");
    $.each(operation1[1], function(item, value) {
        $("#display-corr-content").append("$$" + value + "$$");
    });
    MathJax.typeset();
}

