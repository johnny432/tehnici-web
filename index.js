const express = require("express");
const fs = require('fs');
const path = require('path');

const sharp = require('sharp');
const sass = require('sass');
const ejs = require('ejs');

const { Client } = require("pg");
const AccesBD = require("./module_proprii/accesbd.js");

const formidable = require("formidable");
const { Utilizator } = require("./module_proprii/utilizator.js")
const session = require('express-session');
const Drepturi = require("./module_proprii/drepturi.js");

var client = new Client({
    database: "pg_admin2024",
    user: "ionut",
    password: "1234",
    host: "localhost",
    port: 5432
});
client.connect();

client.query("select * from unnest( enum range(null::CATEG_JUCARII))", function (err, rez) {
    console.log(rez);
})



obGlobal = {
    obErori: null,
    obImagini: null,
    folderCss: path.join(__dirname, "resurse/CSS"),
    folderScss: path.join(__dirname, "resurse/SCSS"),
    folderBackup: path.join(__dirname, "backup")

}


const app = express();
app.use(session({ // aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
}));

console.log("Folder proiect", __dirname);
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd());

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname + "/resurse"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/poze_uploadate", express.static(__dirname + "/"));


vect_foldere = ["temp", "temp1", "backup", "poze_uploadate"]

for (let folder of vect_foldere) {
    let caleFolder = path.join(__dirname, folder)
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder)
    }
}
app.get("/cerere", function (req, res) {
    res.send("<b>Hello</b> <span style='color=red>world</span");
})
app.get("/data", function (req, res, next) {
    res.write("data:");
    next();
})
app.get("/data", function (req, res) {
    res.write("" + new Date());
    res.end();
})







app.get(["/", "/home", "/index"], function (req, res) {
    res.render("pagini/index", {
        ip: req.ip, imagini: obGlobal.obImagini.imagini
    });

})

app.get("/produse", function (req, res) {
    console.log(req.query);
    var conditieQuery = "";
    if (req.query.tip) {
        conditieQuery = `where CATEGORIE='${req.query.tip}'`;
    }

    // Execută ambele interogări într-un singur apel și tratează rezultatele
    client.query(`
        SELECT unnest(enum_range(NULL::PRODUS)) as tip_produs;
        SELECT unnest(enum_range(NULL::CATEG_JUCARII)) as categorie;
        SELECT * FROM JUCARIE ${conditieQuery};
    `, function (err, results) {
        if (err) {
            console.log(err);
            afisareEroare(res, 2);
        } else {
            const [rezOptiuniProdus, rezOptiuniCategorie, rezProduse] = results;
            res.render("pagini/produse", {
                produse: rezProduse.rows,
                optiuniProdus: rezOptiuniProdus.rows,
                optiuniCategorie: rezOptiuniCategorie.rows
            });
        }
    });
});

app.get("/produse-aleatoare", function (req, res) {
    client.query('SELECT * FROM JUCARIE ORDER BY RANDOM() LIMIT 5', function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Eroare la interogarea bazei de date.");
        } else {
            res.json(result.rows);
        }
    });
});



app.get("/produs/:id", function (req, res) {
    client.query(`select * from JUCARIE where id=${req.params.id}`, function (err, rez) {
        if (err) {
            console.log(err);
            afisareEroare(res, 2);
        }
        else {
            res.render("pagini/produs", { prod: rez.rows[0] })
        }

    })
})

// ------------------------- Utilizatori ----------------------

app.post("/inregistrare", function (req, res) {
    var username;
    var poza;
    var formular = new formidable.IncomingForm()
    formular.parse(req, function (err, campuriText, campuriFisier) {//4
        console.log("Inregistrare:", campuriText);


        console.log(campuriFisier);
        console.log(poza, username);
        var eroare = "";


        // TO DO var utilizNou = creare utilizator
        var utilizNou = new Utilizator();
        try {
            utilizNou.setareNume = campuriText.nume[0];
            utilizNou.setareUsername = campuriText.username[0];
            utilizNou.email = campuriText.email[0]
            utilizNou.prenume = campuriText.prenume[0]

            utilizNou.parola = campuriText.parola[0];
            utilizNou.culoare_chat = campuriText.culoare_chat[0];
            utilizNou.poza = poza[0];
            Utilizator.getUtilizDupaUsername(campuriText.username[0], {}, function (u, parametru, eroareUser) {
                if (eroareUser == -1) {//nu exista username-ul in BD
                    //TO DO salveaza utilizator
                    utilizNou.salvareUtilizator()
                }
                else {
                    eroare += "Mai exista username-ul";
                }


                if (!eroare) {
                    res.render("pagini/inregistrare", { raspuns: "Inregistrare cu succes!" })

                }
                else
                    res.render("pagini/inregistrare", { err: "Eroare: " + eroare });
            })



        }
        catch (e) {
            console.log(e);
            eroare += "Eroare site; reveniti mai tarziu";
            console.log(eroare);
            res.render("pagini/inregistrare", { err: "Eroare: " + eroare })
        }


    });

    app.post("/profil", function (req, res) {
        console.log("profil");
        if (!req.session.utilizator) {
            afisareEroare(res, 403)
            return;
        }
        var formular = new formidable.IncomingForm();

        formular.parse(req, function (err, campuriText, campuriFile) {

            var parolaCriptata = Utilizator.criptareParola(campuriText.parola[0]);

            AccesBD.getInstanta().updateParametrizat(
                {
                    tabel: "utilizatori",
                    campuri: ["nume", "prenume", "email", "culoare_chat"],
                    valori: [
                        `${campuriText.nume[0]}`,
                        `${campuriText.prenume[0]}`,
                        `${campuriText.email[0]}`,
                        `${campuriText.culoare_chat[0]}`],
                    conditiiAnd: [
                        `parola='${parolaCriptata}'`,
                        `username='${campuriText.username[0]}'`
                    ]
                },
                function (err, rez) {
                    if (err) {
                        console.log(err);
                        afisareEroare(res, 2);
                        return;
                    }
                    console.log(rez.rowCount);
                    if (rez.rowCount == 0) {
                        res.render("pagini/profil", { mesaj: "Update-ul nu s-a realizat. Verificati parola introdusa." });
                        return;
                    }
                    else {
                        //actualizare sesiune
                        console.log("ceva");
                        req.session.utilizator.nume = campuriText.nume[0];
                        req.session.utilizator.prenume = campuriText.prenume[0];
                        req.session.utilizator.email = campuriText.email[0];
                        req.session.utilizator.culoare_chat = campuriText.culoare_chat[0];
                        res.locals.utilizator = req.session.utilizator;
                    }


                    res.render("pagini/profil", { mesaj: "Update-ul s-a realizat cu succes." });

                });


        });
    });
    formular.on("field", function (nume, val) {  // 1

        console.log(`--- ${nume}=${val}`);

        if (nume == "username")
            username = val;
    })
    formular.on("fileBegin", function (nume, fisier) { //2
        console.log("fileBegin");

        console.log(nume, fisier);
        //TO DO adaugam folderul poze_uploadate ca static si sa fie creat de aplicatie
        //TO DO in folderul poze_uploadate facem folder cu numele utilizatorului (variabila folderUser)
        var folderUser = path.join(__dirname, "poze_uploadate", username);
        if (!fs.existsSync(folderUser))
            fs.mkdirSync(folderUser)

        fisier.filepath = path.join(folderUser, fisier.originalFilename)
        poza = fisier.originalFilename;
        //fisier.filepath=folderUser+"/"+fisier.originalFilename
        console.log("fileBegin:", poza)
        console.log("fileBegin, fisier:", fisier)


    })
    formular.on("file", function (nume, fisier) {//3
        console.log("file");
        console.log(nume, fisier);
    });
});


app.post("/login", function (req, res) {
    /*TO DO parametriCallback: cu proprietatile: request(req), response(res) si parola
        testam daca parola trimisa e cea din baza de date
        testam daca a confirmat mailul
    */
    var username;
    console.log("ceva");
    var formular = new formidable.IncomingForm()


    formular.parse(req, function (err, campuriText, campuriFisier) {
        var parametriCallback = {
            req: req,
            res: res,
            parola: campuriText.parola[0]
        }
        Utilizator.getUtilizDupaUsername(campuriText.username[0], parametriCallback, function (u, obparam, eroare) {
            let parolaCriptare = Utilizator.criptareParola(obparam.parola)

            if (u.parola == parolaCriptare && u.confirmat_mail) {
                u.poza = u.poza ? path.join("poze_uploadate", u.username, u.poza) : "";
                obparam.req.session.utilizator = u;
                obparam.req.session.mesajLogin = "Bravo! Te-ai logat!";
                obparam.res.redirect("/index");

            }
            else {
                console.log("Eroare logare")
                obparam.req.session.mesajLogin = "Date logare incorecte sau nu a fost confirmat mailul!";
                obparam.res.redirect("/index");
            }
        })
    });
});


app.get("/logout", function (req, res) {
    req.session.destroy();
    res.locals.utilizator = null;
    res.render("pagini/logout");
});


//http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}
app.get("/cod/:username/:token", function (req, res) {
    /*TO DO parametriCallback: cu proprietatile: request (req) si token (luat din parametrii cererii)
        setat parametriCerere pentru a verifica daca tokenul corespunde userului
    */
    console.log(req.params);

    try {
        var parametriCallback = {
            req: req,
            token: req.params.token
        }
        Utilizator.getUtilizDupaUsername(req.params.username, parametriCallback, function (u, obparam) {
            let parametriCerere = {
                tabel: "utilizatori",
                campuri: {
                    confirmat_mail: true
                },
                conditiiAnd: [
                    `username='${u.username}'`,
                    `cod='${obparam.token}'`
                ]
            };
            AccesBD.getInstanta().update(
                parametriCerere,
                function (err, rezUpdate) {
                    if (err || rezUpdate.rowCount == 0) {
                        console.log("Cod:", err);
                        afisareEroare(res, 3);
                    }
                    else {
                        res.render("pagini/confirmare.ejs");
                    }
                })
        })
    }
    catch (e) {
        console.log(e);
        afisareEroare(res, 2);
    }
})



app.get("/useri", function (req, res) {
    //  TO DO
    // * in if testam daca utilizatorul din sesiune are dreptul sa vizualizeze utilizatori
    // * completam obiectComanda cu parametrii comenzii select pentru a prelua toti utilizatorii
    if (req.Utilizator.areDreptul(Drepturi.vizualizareUtilizatori)) {

        var obiectComanda = {
            tabel: "utilizatori",
            campuri: ["*"],
            conditiiAnd: []
        };
        AccesBD.getInstanta().select(obiectComanda, function (err, rezQuery) {
            console.leg(err);
            res.render("pagini/useri", { useri: rezQuery.rows })
        });

    }
    else {
        afisareEroare(res, 403);
    }

});




app.post("/sterge_utiliz", function (req, res) {
    // / *DO
    //  in if testam daca utilizatorul din sesiune are dreptul sa stearga utilizatori
    // *completam obiectComanda cu parametrii comenzii select pentru a prelua toti utilizatorii
    // /*

    if (req?.Utilizator?.areDreptul(Drepturi.stergereUtilizatori)) {
        var formular = new formidable.IncomingForm();
        formular.parse(req, function (err, campuriText, campuriFile) {
            var obiectComanda = {
                tabel: "utilizatori",
                conditiiAnd: [`id='${campuriText.id_utiliz[0]}'`]
            }
            AccesBD.getInstanta().delete(obiectComanda, function (err, rezQuery) {
                console.log(err);
                res.redirect("/useri");
            });
        });
    }

    else {
        afisareEroare(res, 403);
    }

})

app.get("/suma/:a/:b", function (req, res) {
    var suma = parseInt(req.params.a) + parseInt(req.params.b)
    res.send("" + suma);
});


app.get("/", function (req, res) {

    // res.sendFile(__dirname + "/index.html")
    res.render("pagini/index");
})

app.get("/about", function (req, res) {

    // res.sendFile(__dirname + "/index.html")
    res.render("pagini/about");
})




app.get("/favicon.ico", function (req, res) {
    res.sendFile(path.join(__dirname, "resurse/favicon/favicon.ico"));
});



function initErori() {
    var continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("utf-8");
    obGlobal.obErori = JSON.parse(continut);
    for (let eroare of obGlobal.obErori.info_erori) {
        eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    console.log(obGlobal.obErori);
    obGlobal.obErori.eroare_default.imagine = path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine)

}
initErori();
app.get("/*.ejs", function (req, res) {
    return afisareEroare(res, 400);
});

app.get(new RegExp("^\/[\/a-z0-9A-Z]*\/$"), function (req, res) {
    return afisareEroare(res, 403);
});
app.get("/*", function (req, res) {
    try {
        console.log(req.url);


        res.render("pagini" + req.url, function (err, rezHtml) {
            if (err) {
                console.error("Rendering error:", err);

                if (err.message.startsWith("Failed to lookup view")) {
                    return afisareEroare(res, 404);
                } else {

                    return afisareEroare(res);
                }
            }

            else {
                res.send(rezHtml + "");
            }


            console.log("Rendered page:", rezHtml);
            res.send(rezHtml);
        });
    } catch (err1) {
        console.error("Error:", err1);
        return afisareEroare(res);
    }
});


function afisareEroare(res, _identificator, _titlu, _text, _imagine) {
    let eroare = obGlobal.obErori.info_erori.find(elem => elem.identificator == _identificator);

    if (!eroare) {
        let eroare_default = obGlobal.obErori.eroare_default;
        return res.render("pagini/eroare", {
            titlu: _titlu || eroare_default.titlu,
            imagine: _imagine || eroare_default.imagine,
            text: _text || eroare_default.text,
        });
    } else {
        if (eroare.status) {
            res.status(eroare.identificator);
        }
        return res.render("pagini/eroare", {
            titlu: _titlu || eroare.titlu,
            text: _text || eroare.text,
            imagine: _imagine || eroare.imagine,
        });
    }
}

function initImagini() {
    var continut = fs.readFileSync(path.join(__dirname, "resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini = JSON.parse(continut);
    let vImagini = obGlobal.obImagini.imagini;

    let caleAbs = path.join(__dirname, obGlobal.obImagini.cale_galerie);
    let caleAbsMediu = path.join(__dirname, obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini) {
        [numeFis, ext] = imag.fisier.split(".");
        let caleFisAbs = path.join(caleAbs, imag.fisier);
        let caleFisMediuAbs = path.join(caleAbsMediu, numeFis + ".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);

        imag.fisier_mediu = path.join("/", obGlobal.obImagini.cale_galerie, "mediu", numeFis + ".webp")
        imag.fisier = path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier)

    }
}
initImagini();


function compileazaScss(caleScss, caleCss) {
    console.log("cale:", caleCss);
    if (!caleCss) {

        let numeFisExt = path.basename(caleScss);
        let numeFis = numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss = numeFis + ".css";
    }

    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss)
    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss)


    let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup, { recursive: true })
    }

    // la acest punct avem cai absolute in caleScss si  caleCss
    //TO DO
    let numeFisCss = path.basename(caleCss);
    if (fs.existsSync(caleCss)) {
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css", numeFisCss))// +(new Date()).getTime()
    }
    rez = sass.compile(caleScss, { "sourceMap": true });
    fs.writeFileSync(caleCss, rez.css)
    //console.log("Compilare SCSS",rez);
}
//compileazaScss("a.scss");
vFisiere = fs.readdirSync(obGlobal.folderScss);
for (let numeFis of vFisiere) {
    if (path.extname(numeFis) == ".scss") {
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function (eveniment, numeFis) {
    console.log(eveniment, numeFis);
    if (eveniment == "change" || eveniment == "rename") {
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)) {
            compileazaScss(caleCompleta);
        }
    }
})




app.listen(8080);
console.log("Serverul a pornit");