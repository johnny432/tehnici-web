// Verificarea temei salvate în localStorage și aplicarea acesteia
if (localStorage.getItem("tema") === "day") {
    document.body.classList.remove("dark");
    document.body.classList.remove("sakura");
    document.body.classList.add("day");
} else if (localStorage.getItem("tema") === "dark") {
    document.body.classList.remove("day");
    document.body.classList.remove("sakura");
    document.body.classList.add("dark");

}
else if (localStorage.getItem("tema") === "sakura") {
    document.body.classList.remove("day");
    document.body.classList.remove("dark");
    document.body.classList.add("sakura");

}
function checkRadioButton(radioID) {
    document.getElementById(radioID).checked = false;
}

window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("schimba_tema").onclick = function () {
        if (document.body.classList.contains("dark") && !document.body.classList.contains("sakura")) {
            document.body.classList.remove("dark");
            document.body.classList.add("day");
            localStorage.setItem("tema", "day");
            checkRadioButton("radio_sakura");
        } else if (document.body.classList.contains("day") && !document.body.classList.contains("sakura")) {
            document.body.classList.remove("day");
            document.body.classList.add("dark");
            localStorage.setItem("tema", "dark");
            checkRadioButton("radio_sakura");
        } else if (document.body.classList.contains("sakura") && document.body.classList.contains("day")) {
            document.body.classList.remove("sakura");
            document.body.classList.remove("day");
            document.body.classList.add("dark");
            localStorage.setItem("tema", "dark");
            checkRadioButton("radio_sakura");
        } else if (document.body.classList.contains("sakura") && document.body.classList.contains("dark")) {
            document.body.classList.remove("sakura");
            document.body.classList.remove("dark");
            document.body.classList.add("day");
            localStorage.setItem("tema", "day");
            checkRadioButton("radio_sakura");
        }
    }
});



window.addEventListener("DOMContentLoaded", function () {


    document.getElementById("radio_sakura").onclick = function () {
        if (document.body.classList.contains("sakura") && !document.body.classList.contains("day") && !document.body.classList.contains("dark")) {
            document.body.classList.add("day");
            localStorage.setItem("tema", "sakura");

        }
        if (document.body.classList.contains("dark") && !document.body.classList.contains("sakura")) {
            // document.body.classList.remove("dark");
            document.body.classList.add("sakura");
            localStorage.setItem("tema", "sakura");
        } else if (document.body.classList.contains("day") && !document.body.classList.contains("sakura")) {
            document.body.classList.add("sakura");
            localStorage.setItem("tema", "sakura");
        }
    }
});


