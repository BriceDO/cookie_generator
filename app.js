const affichage = document.querySelector('.affichage');
const btns = document.querySelectorAll('button');
const inputs = document.querySelectorAll('input');
const infoTxt = document.querySelector('.info-txt');
let dejaFait = false;

const today = new Date();
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

let day = ('0' + nextWeek).slice(9,11);
let month = ('0' + (today.getMonth() + 1)).slice(-2);
let year = today.getFullYear();

document.querySelector('input[type=date]').value = `${year}-${month}-${day}`;

btns.forEach(btn => {
    btn.addEventListener('click', btnAction);
})

function btnAction(e) {

    let nvObj = {};

    // Pour chaque input, on récupère son attribut
    inputs.forEach(input => {
        let attrName = input.getAttribute('name');
        // Est-ce que AttrName est strictement différent de "cookieExpire" ?
        // Si oui, on prend la valeur de son input. Sinon, si ça tombe sur 'cookieExpire', on récupère aussi sa valeur mais sous forme de date.
        let attrValeur  = attrName !== "cookieExpire" ? input.value : input.valueAsDate;
        nvObj[attrName] = attrValeur;
    })

    let description = e.target.getAttribute('data-cookie');

    // Si je clique sur le bouton créer
    if (description === "creer") {
        // Alors on va appeler creerCookie avec son nom, sa valeur et la date d'expiration
        creerCookie(nvObj.cookieName, nvObj.cookieValue, nvObj.cookieExpire);
    // Sinon, on clique sur afficher et on affiche la liste des cookies
    } else if (description === "toutAfficher") {
        listeCookie()
    }
}

function creerCookie(name, value, exp){

    infoTxt.innerText = '';
    affichage.innerHTML = "";
    affichage.childNodes.forEach(child => {
        child.remove;
    })

    // Si le cookie a un même nom
    // Pour chaque cookie créé avec .split, on va les afficher
    let cookies = document.cookie.split(';');
    cookies.forEach(cookie => {

        // Permet d'enlever les espaces blancs avant et après un élèment
        cookie = cookie.trim();
        
        // Nous donne un tableau avec le premier élèment qui sera le nom du cookie puis sa valeur
        let formatCookie = cookie.split('=');

        // Si le cookie qu'on a formaté [0] (premier el du tableau) est strictement égale au nom d'un cookie
        // On passe déj à fait à true
        if(formatCookie[0] === encodeURIComponent(name)) {
            dejaFait = true;
        }
    })

    // Et si déjàFait est true, message d'erreur, on sort de la fonction
    if (dejaFait) {
        infoTxt.innerText = "Un cookie possède déjà ce nom !"
        dejaFait = false;
        return
    }

    // Si le cookie n'a pas de nom
    if (name.length === 0) {
        infoTxt.innerText = 'Impossible de définir un cookie sans nom.'
        return
    }

    // On encode le nom pour eviter d'avoir des blancs, espaces et symboles
    // On transforme la date en chaîne de caractères
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${exp.toUTCString()}`;

    // On affiche un message quand cookie créé
    let info = document.createElement('li');
    info.innerText = `Cookie ${name} créé.`;
    affichage.appendChild(info);
    setTimeout(() => {
        info.remove()
    }, 1500)
}

function listeCookie() {

    let cookies = document.cookie.split(';');
    // Si il n'y a pas de cookie à afficher
    if(cookies.join() == "") {
        infoTxt.innerText = 'Pas de cookies à afficher';
    }

    cookies.forEach(cookie => {
        cookie = cookie.trim();
        let formatCookie = cookie.split('=');

        // Pour chaque cookie, on créé un li
        let item = document.createElement('li');

        infoTxt.innerText = 'Cliquez sur un cookie dans la liste pour le supprimer';
        // Avec son nom et sa valeur
        item.innerText = `Nom : ${decodeURIComponent(formatCookie[0])},
                          Valeur : ${decodeURIComponent(formatCookie[1])}`;

        affichage.appendChild(item);

        // Supression cookie
        item.addEventListener('click', () => {
            
            document.cookie = `${formatCookie[0]}=; expires=${new Date(0)}`;
            item.innerText = `Cookie ${formatCookie[0]} supprimé`;
            setTimeout(() => {
                item.remove();
            }, 1000);
        })

    })
}