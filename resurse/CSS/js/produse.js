window.addEventListener("load", function () {


    function loadProducts() {
        fetch('/produse-aleatoare')
            .then(response => response.json())
            .then(products => {
                const carousel = document.getElementById('productCarousel');
                carousel.innerHTML = ''; // Golește conținutul curent
                products.forEach(product => {
                    const item = document.createElement('div');
                    item.className = 'carousel-item';
                    item.innerHTML = `
                        <img src="${product.imagine}" alt="${product.nume}">
                        <p>${product.nume}</p>
                    `;
                    carousel.appendChild(item);
                });
            })
            .catch(error => {
                console.error('Eroare la încărcarea produselor:', error);
            });
    }

    // Încarcă produse inițial și setează intervalul pentru reîncărcare
    loadProducts();
    setInterval(loadProducts, 15000); // 15000 ms = 15 secunde

    var produseinit = document.getElementsByClassName("produs");
    let O_pret = {};
    let prod1 = 0;
    for (let produs of produseinit) {
        prod1 += 1;
        let valPret = parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML);
        let valCategorie = produs.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
        if (!(valCategorie in O_pret) || valPret < O_pret[valCategorie].pret) {
            O_pret[valCategorie] = { pret: valPret, produs: produs };
        }

    }
    for (let categorie in O_pret) {
        let produsMinim = O_pret[categorie].produs;
        produsMinim.style.backgroundColor = " #27849e";
        let mesaj = document.createElement("div");
        mesaj.innerHTML = "Cel mai ieftin produs din categorie!";
        mesaj.style.color = "#f7d630";
        mesaj.style.padding = "5px";

        produsMinim.appendChild(mesaj);
    }

    function sorteaza(semn, optiune) {
        var produse = document.getElementsByClassName("produs");
        let v_produse = Array.from(produse)
        v_produse.sort(function (a, b) {


            if (optiune.includes("pret")) {
                let pret_a = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML)
                let pret_b = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML)
                if (pret_a == pret_b && optiune.includes("nume")) {
                    let nume_a = a.getElementsByClassName("val-nume")[0].innerHTML
                    let nume_b = b.getElementsByClassName("val-nume")[0].innerHTML
                    return semn * nume_a.localeCompare(nume_b);
                }

                return semn * (pret_a - pret_b);
            }
            else if (optiune.includes("nume")) {
                let nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
                let nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
                if (nume_a === nume_b && optiune.includes("varsta")) {
                    let varsta_a = parseInt(a.getElementsByClassName("val-varsta")[0].innerHTML)
                    let varsta_b = parseInt(b.getElementsByClassName("val-varsta")[0].innerHTML)
                    return semn * (varsta_a - varsta_b);
                }
                return semn * nume_a.localeCompare(nume_b);
            }
            else if (optiune.includes("varsta")) {
                let varsta_a = parseFloat(a.getElementsByClassName("val-varsta")[0].innerHTML)
                let varsta_b = parseFloat(b.getElementsByClassName("val-varsta")[0].innerHTML)
                if (varsta_a === varsta_b && optiune.includes("preT")) {
                    let pret_a = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML)
                    let pret_b = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML)
                    return semn * (pret_a - pret_b);
                }
                else if (varsta_a === varsta_b && optiune.includes("numE")) {
                    let nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
                    let nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
                    return semn * nume_a.localeCompare(nume_b);
                }
                return semn * (varsta_a - varsta_b);

            }



        })
        console.log(v_produse)
        for (let prod of v_produse) {
            prod.parentNode.appendChild(prod)
        }

    }

    document.getElementById("sortCrescNume").onchange = function () {
        let Optiune_selectata = this.options[this.selectedIndex].value;
        sorteaza(1, Optiune_selectata)
    }
    document.getElementById("sortDescNume").onchange = function () {
        let Optiune_selectata = this.options[this.selectedIndex].value;
        sorteaza(-1, Optiune_selectata);
    }



    document.getElementById("text1").textContent = prod1;




    document.getElementById("inp-pret").onchange = function () {
        document.getElementById("infoRange").innerHTML = `(${this.value})`
        var produse = document.getElementsByClassName("produs");
        var inpPret = parseInt(document.getElementById("inp-pret").value)
        var prod = 0;
        var Valmin = 9999;
        var Valmax = 0;
        const Range = document.getElementById("inp-pret");
        for (let produs of produse) {

            var valPret = parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML);
            var cond3 = inpPret < valPret;

            if (valPret < Valmin) {
                Valmin = valPret;
            }
            if (valPret > Valmax) {
                Valmax = valPret;
            }
            if (cond3) {
                produs.style.display = "flex";
                prod += 1;
            } else {
                produs.style.display = "none";
            }
        }
        Range.min = Valmin;
        Range.max = Valmax;
        document.getElementById("text1").textContent = prod;


        let element = document.getElementById("text");
        if (element) {
            if (prod === 0) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        }

        document.getElementById("resetare").onclick = function () {
            document.getElementById("inp-pret").value = Valmin;
            document.getElementById("infoRange").innerHTML = Valmin;
            let prod1 = 0;
            for (let prod of produse) {
                prod.style.display = "flex";
                prod1 += 1;
            }
            document.getElementById("text1").textContent = prod1;
        }

    }
    document.getElementById("inp-nume").onchange = function () {
        var inpNume = document.getElementById("inp-nume").value.trim().toLowerCase()
        var produse = document.getElementsByClassName("produs")
        var prod = 0;

        for (let produs of produse) {
            let valNume = produs.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let cond1 = valNume.includes(inpNume.toLowerCase());
            if (cond1) {
                produs.style.display = "flex";
                prod += 1;
            } else {
                produs.style.display = "none";
            }

        }
        document.getElementById("text1").textContent = prod;
        let element = document.getElementById("text");
        if (element) {
            if (prod === 0) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        }

        document.getElementById("resetare").onclick = function () {
            document.getElementById("inp-nume").value = "";
            let prod1 = 0;
            for (let prod of produse) {
                prod.style.display = "flex";
                prod1 += 1;
            }
            document.getElementById("text1").textContent = prod1;
        }
    }


    document.getElementById("inp-categorie").onchange = function () {
        var inpCateg = document.getElementById("inp-categorie").value.trim().toLowerCase()
        var produse = document.getElementsByClassName("produs")
        var prod = 0;
        let O_pret = {};
        for (let produs of produse) {

            let valCategorie = produs.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
            let valPret = parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML);

            let cond4 = (inpCateg == "toate" || inpCateg == valCategorie);
            if (cond4) {
                produs.style.display = "flex";
                prod += 1;
            } else {
                produs.style.display = "none";
            }

            if (!(valCategorie in O_pret) || valPret < O_pret[valCategorie].pret) {
                O_pret[valCategorie] = { pret: valPret, produs: produs };
            }

        }
        for (let categorie in O_pret) {
            let produsMinim = O_pret[categorie].produs;
            produsMinim.style.backgroundColor = " #27849e";



        }

        document.getElementById("text1").textContent = prod;
        let element = document.getElementById("text");
        if (element) {
            if (prod === 0) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        }
        document.getElementById("resetare").onclick = function () {
            document.getElementById("inp-categorie").value = "toate";
            let prod1 = 0;
            for (let prod of produse) {
                prod.style.display = "flex";
                prod1 += 1;
            }
            document.getElementById("text1").textContent = prod1;
        }


    }






    document.getElementById("inp-produs").onchange = function () {
        var inpProd = document.getElementById("inp-produs").value.trim().toLowerCase()
        var produse = document.getElementsByClassName("produs")
        var prod = 0;
        let O_pret = {};
        for (let produs of produse) {

            let valProdus = produs.getElementsByClassName("val-produs")[0].innerHTML.trim().toLowerCase();
            let valPret = parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML);

            let cond5 = (inpProd == "toate" || inpProd == valProdus);
            if (cond5) {
                produs.style.display = "flex";
                prod += 1;
            } else {
                produs.style.display = "none";
            }

            if (!(valProdus in O_pret) || valPret < O_pret[valProdus].pret) {
                O_pret[valProdus] = { pret: valPret, produs: produs };
            }

        }
        for (let prods in O_pret) {
            let produsMinim = O_pret[prods].produs;
            produsMinim.style.backgroundColor = " #27849e";



        }

        document.getElementById("text1").textContent = prod;
        let element = document.getElementById("text");
        if (element) {
            if (prod === 0) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        }
        document.getElementById("resetare").onclick = function () {
            document.getElementById("inp-produs").value = "toate";
            let prod1 = 0;
            for (let prod of produse) {
                prod.style.display = "flex";
                prod1 += 1;
            }
            document.getElementById("text1").textContent = prod1;
        }


    }

    var inpRadioElements = document.getElementsByClassName("inp_radio");
    for (var i = 0; i < inpRadioElements.length; i++) {
        inpRadioElements[i].onchange = function () {
            var vRadio = document.getElementsByName("gr_rad");

            for (let r of vRadio) {
                if (r.checked) {
                    inpVarsta = r.value;
                    break;
                }
            }

            if (inpVarsta != "toate") {
                let aux = inpVarsta.split(":");
                minVarsta = parseInt(aux[0]);
                maxVarsta = parseInt(aux[1]);
            }

            var prod = 0;
            var produse = document.getElementsByClassName("produs");

            for (let produs of produse) {
                let valVarsta = parseInt(produs.getElementsByClassName("val-varsta")[0].innerHTML);
                let cond2 = (inpVarsta == "toate" || (minVarsta <= valVarsta && valVarsta < maxVarsta));
                if (cond2) {
                    produs.style.display = "flex";
                    prod += 1;
                } else {
                    produs.style.display = "none";
                }
            }
            document.getElementById("text1").textContent = prod;
            let element = document.getElementById("text");
            if (element) {
                if (prod === 0) {
                    element.style.display = 'block';
                } else {
                    element.style.display = 'none';
                }
            }

            document.getElementById("resetare").onclick = function () {
                document.getElementById("i_rad5").checked = true;
                let prod1 = 0;
                for (let prod of produse) {
                    prod.style.display = "flex";
                    prod1 += 1;
                }
                document.getElementById("text1").textContent = prod1;
            }

        };
    }


    // console.log(document.getElementById("filtare").addEventListener("click",function(){})
    document.getElementById("filtrare").onclick = function () {

        var vRadio = document.getElementsByName("gr_rad")

        for (let r of vRadio) {
            if (r.checked) {
                inpVarsta = r.value;
                break
            }
        }

        if (inpVarsta != "toate") {
            let aux = inpVarsta.split(":")
            minVarsta = parseInt(aux[0])
            maxVarsta = parseInt(aux[1])
        }

        document.getElementById("resetare").onclick = function () {

            document.getElementById("inp-nume").value = "";

            document.getElementById("inp-pret").value = document.getElementById("inp-pret").min;
            document.getElementById("inp-categorie").value = "toate";
            document.getElementById("i_rad5").checked = true;
            let produse = document.getElementsByClassName("produs");
            let prod1 = 0;
            document.getElementById("infoRange").innerHTML = "(0)";
            for (let prod of produse) {
                prod.style.display = "flex";
                prod1 += 1;
            }
            document.getElementById("text1").textContent = prod1;

        }




        // var VARSTA = parseInt(document.getElementById("i_rad1").value)

        var inpNume = document.getElementById("inp-nume").value.trim().toLowerCase()
        var inpPret = parseInt(document.getElementById("inp-pret").value)
        var inpCateg = document.getElementById("inp-categorie").value.trim().toLowerCase()
        var produse = document.getElementsByClassName("produs")
        var prod = 0;
        var O_pret = {};
        for (let produs of produse) {
            let valNume = produs.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let cond1 = valNume.includes(inpNume.toLowerCase());

            let valVarsta = parseInt(produs.getElementsByClassName("val-varsta")[0].innerHTML);
            let cond2 = (inpVarsta == "toate" || (minVarsta <= valVarsta && valVarsta < maxVarsta));

            let valPret = parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML);
            let cond3 = inpPret < valPret;

            let valCategorie = produs.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
            let cond4 = (inpCateg == "toate" || inpCateg == valCategorie);

            let valProdus = produs.getElementsByClassName("val-produs")[0].innerHTML.trim().toLowerCase();

            let cond5 = (inpProd == "toate" || inpProd == valProdus);

            if (cond1 && cond2 && cond3 && cond4 && cond5) {
                produs.style.display = "flex";
                prod += 1;
            } else {
                produs.style.display = "none";
            }

            if (!(valCategorie in O_pret) || valPret < O_pret[valCategorie].pret) {
                O_pret[valCategorie] = { pret: valPret, produs: produs };
            }

        }
        for (let categorie in O_pret) {
            let produsMinim = O_pret[categorie].produs;
            produsMinim.style.backgroundColor = " #27849e";


        }

        document.getElementById("text1").textContent = prod;

        let element = document.getElementById("text");
        if (element) {
            if (prod === 0) {
                element.style.display = 'block';

            } else {
                element.style.display = 'none';
            }
        }
    }
    window.onkeydown = function (e) {
        if (e.key == "c" && e.altKey) {
            var suma = 0;
            var produse = document.getElementsByClassName("produs");
            for (let produs of produse) {
                var stil = getComputedStyle(produs)
                if (stil.display != "none") {
                    suma += parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML)
                }
            }
            if (!document.getElementById("par_suma")) {
                let p = document.createElement("p")
                p.innerHTML = suma;
                p.id = "par_suma";
                container = document.getElementById("produse")
                container.insertBefore(p, container.children[0])
                setTimeout(function () {
                    var pgf = document.getElementById("par_suma")
                    if (pgf)
                        pgf.remove()
                }, 2000)
            }

        }
    }



})

