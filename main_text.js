function confirmParams(){
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
    const url = 'https://icanhazdadjoke.com/slack';
    const response = await fetch(url);
    const data = await response.json();
    const joketext = data.attachments[0].text;
    const jokeloc = data.attachments[0].footer;

    //console.log(joketext);
    return [joketext, jokeloc];
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

async function displayJokeData(opt = "else") {
    let jokeinfo = ['',''];
    if (opt == "chuck") {
        jokeinfo = await getChuckData();
        if(jokeinfo[1] == '' || jokeinfo[1] == null)
        jokeinfo[1] = 'imgs/chuck-norris.png'
        jokeinfo.push("Chuck Norris");
    }
    else if (opt == "dad") {
        jokeinfo = await getDadData();
        jokeinfo[1] = 'imgs/Dad-jokes-edit.jpg'
        jokeinfo.push("Dad");
    }
    else if (opt = "dark"){
        jokeinfo = await getDarkHumorData();
        jokeinfo[1] = 'imgs/dh_icon.png'
        jokeinfo.push("Dark Humor");
    }
    else {
        jokeinfo = ["No Joke loaded at this time.  Try an option again", "nothing"];
    }

    console.log(jokeinfo);
    document.getElementById('joke-text').textContent = jokeinfo[0];
    document.getElementById('appico').src = jokeinfo[1];
    document.getElementById('joke-type').textContent = jokeinfo[2];
    $('.preload').fadeOut(1,function(){
        $("#quote").fadeIn(1000);
    })
}



//TODO: Setup hide instruct-holder, show preload gif,
/*followed by hiding preload gif, and then loading joke. */

$(document).ready(() => {
    let getparam = "none";

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