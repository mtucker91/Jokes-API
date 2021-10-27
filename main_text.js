/*function confirmParams(){
    let searchParams = new URLSearchParams(window.location.search)
    let retval = null
    if(searchParams.has('joke_type') == true){
        console.log('found param');
        let param = searchParams.get('joke_type')

        if (param == 'dad'){
            console.log("param = dad");
            //displayJokeData("dad");
            retval = "dad"
        }
        else if(param == 'chuck'){
            console.log("param = chuck");
            //displayJokeData("chuck");
            retval = "chuck"
        }
        else{
            console.log("param = none");
            //displayJokeData();
            retval = "none"
        }
    }
    else {
        console.log("never found param");
        //displayJokeData();
        retval = ""
    }

    return retval
} */
function setCookie(cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = "darkmode=" + cvalue + ";" + expires + ";path=/; samesite=Strict";
}

function getCookie() {
    let name = "darkmode=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function getChuckData() {
    const url = 'https://api.chucknorris.io/jokes/random';
    const response = await fetch(url);
    const data = await response.json();
    const joketext = data.value;
    const icon_url = data.icon_url;
    //console.log(joketext);

    return [joketext, icon_url];
}

async function getDadData() {
    //API docs
    //https://icanhazdadjoke.com/api
    const url = 'https://icanhazdadjoke.com/slack';
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    const joketext = data.attachments[0].text;
    const jokeloc = data.attachments[0].footer;

    let indexpoint = Array();
    indexpoint[0] = jokeloc.indexOf("/j/") + 3;
    indexpoint[1] = jokeloc.indexOf("|permalink");
    const jokeid = jokeloc.slice(indexpoint[0], indexpoint[1]);
    //console.log(indexpoint[0]);
    //console.log(indexpoint[1]);
    //console.log(jokeid);

    //console.log(joketext);
    return [joketext, jokeloc, jokeid];
}

async function getDarkHumorData() {
    const url = 'https://v2.jokeapi.dev/joke/Dark';
    const response = await fetch(url);
    const data = await response.json();

    //jokes can come in different formats
    //twopart type comes with a setup, and then the delivery as two separate fields
    //single type comes with just one variable of text to work with.
    //console.log(data);
    let joketext = '';
    if(data.type == "single"){
        joketext = data.joke
    }
    else if(data.type == "twopart"){
        let jokesetup = data.setup;
        let jokedelivery = "\n" + data.delivery;
        joketext = jokesetup.concat(jokedelivery);
    }
    else{
        joketext = 'there was an error with the Dark Humor API.  As it limits by 120 jokes per minute, please try back again later.';
    }

    //console.log(joketext);
    return [joketext];
}

/*
//Doesn't work due to browser CORS errors when testing
async function getEvilInsult() {
    const url = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    const joketext = data.insult;

    console.log(joketext);
    return [joketext];
}

*/

async function getYoMommaData() {
    const url = 'https://api.yomomma.info/';
    const response = await fetch(url);
    const data = await response.json();
    const joketext = data.joke;
    //console.log(joketext);
    return [joketext];
}

async function displayJokeData(opt = "else") {
    let jokeinfo = ['',''];
    if (opt == "chuck") {
        jokeinfo = await getChuckData();
        //if(jokeinfo[1] == '' || jokeinfo[1] == null)
        jokeinfo.push('imgs/chuck-norris.png');
        jokeinfo.push("Chuck Norris");
    }
    else if (opt == "dad") {
        jokeinfo = await getDadData();
        jokeinfo.push('imgs/Dad-jokes-edit.jpg');
        jokeinfo.push("Dad");
        //console.log(jokeinfo[jokeinfo.length - 1]);
    }
    else if (opt == "dark"){
        jokeinfo = await getDarkHumorData();
        jokeinfo.push('imgs/dh_icon.png');
        jokeinfo.push("Dark Humor");
    }
    /*else if (opt == "evil"){
        jokeinfo = await getEvilInsult();
        jokeinfo[1] = 'imgs/evil_icon.png';
        jokeinfo.push("Evil Insult");
    }*/
    else if (opt == "yomomma"){
        jokeinfo = await getYoMommaData();
        jokeinfo.push('imgs/evil_icon.png');
        jokeinfo.push("Yo Momma");
    }
    else {
        jokeinfo = ["No Joke loaded at this time.  Try an option again", "nothing"];
    }

    //console.log(jokeinfo);
    document.getElementById('joke-text').textContent = jokeinfo[0];
    document.getElementById('appico').src = jokeinfo[jokeinfo.length - 2];
    document.getElementById('joke-type').textContent = jokeinfo[jokeinfo.length - 1];
    $('.preload').fadeOut(1,function(){
        $("#quote").fadeIn(1000);
    })
}



//TODO: Setup hide instruct-holder, show preload gif,
/*followed by hiding preload gif, and then loading joke. */

$(document).ready(() => {
    let getparam = "none";

    let cookiechck = getCookie();
    //alert(cookiechck);
    if (cookiechck === "true"){
        predarkMode(true);
        //alert('truechck confirmed');
    }
    else{
        predarkMode(false);
    }

    $("#reload-joke-icon").click(() => {
        //hides the quote block so it can load the next one
        $("#quote").css('display','hidden');
        displayJokeData(getparam);
    });

    $("#chuck-link").click(() => {
        //hides the instructions from the home page
        $("#instruct-holder").hide();
        //let getparam = confirmParams();
        getparam = "chuck";
        displayJokeData(getparam);
    });

    $("#dad-link").click(() => {
        //hides the instructions from the home page
        $("#instruct-holder").hide();
        //let getparam = confirmParams();
        getparam = "dad";
        displayJokeData(getparam);
    });

    $("#dh-link").click(() => {
        //hides the instructions from the home page
        $("#instruct-holder").hide();
        //let getparam = confirmParams();
        getparam = "dark";
        displayJokeData(getparam);
    });
/*
    $("#ei-link").click(() => {
        //hides the instructions from the home page
        $("#instruct-holder").hide();
        //let getparam = confirmParams();
        getparam = "evil";
        displayJokeData(getparam);
    });
*/
    $("#yomomma-link").click(() => {
        //hides the instructions from the home page
        $("#instruct-holder").hide();
        //let getparam = confirmParams();
        getparam = "yomomma";
        displayJokeData(getparam);
    });

    $("#home-link").click(() => {
        //hides the quote block so it can load the next one
        $("#quote").hide();
        //shows the instructions from the home page
        $("#instruct-holder").show();
    });
});

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function darkMode() {
    const x = document.getElementById("dark-mode");
    const bod = document.getElementById("bod");
    if (x.checked === true && bod.className != "dark-mode") {
        bod.className += "dark-mode";
        setCookie(true, 30);
    } else {
        bod.className = "";
        setCookie(false, -30);
    }
}

function predarkMode(preset){
    const chckbx = document.getElementById("dark-mode");
    const bod = document.getElementById("bod");
    if (preset === true) {
        bod.className += "dark-mode";
        chckbx.checked = true;
    } else {
        bod.className = "";
        chckbx.checked = false;
    }
}