// global variables
let leftMenu = $("#leftMenu");
let rightMenu = $("#rightMenu");
let toggleBtn = $("#toggleBtn");
let categories = $("#categories li");

// aside interaction
toggleBtn.click(()=>{
    let leftMenuWidth = leftMenu.outerWidth();
    if(toggleBtn.attr("class") == "open")
    {
        leftMenu.animate({left:"0px"} , 600);
        rightMenu.animate({left:`${leftMenuWidth}`} , 600 , ()=>{
            for(let i=1 ; i<=categories.length ; i++)
            {
                $(`.item${i}`).animate({"top":"25px" } , i*100+600)
            }
           
            $(".asideFooter").animate({"opacity":"1"} , 600);
                
        });
        toggleBtn.removeClass("open").addClass("close");
    }
    else
    {
        leftMenu.animate({left:`-${leftMenuWidth}`} , 600);
        rightMenu.animate({left:"0"} , 600) 
        $(".asideFooter").css("opacity" , "0");
            for(let i=1 ; i<=categories.length ; i++)
            {
                $(`.item${i}`).animate({"top":"700px" } , 800)
            }
            
        
        toggleBtn.removeClass("close").addClass("open");
    }
});

/*-----------------------------------------------------(API)-----------------------------------------------------*/

// dealing with api variables
let allMovies = [];
let category = "now_playing";
let imgPath="https://image.tmdb.org/t/p/w500/";
let apiKey = "8613e4e1776af4e8633cc311d67b3e09";

// get movies from API
async function getMovies(categoryItem)
{
    let moviesResponse = await fetch(`https://api.themoviedb.org/3/movie/${categoryItem}?api_key=${apiKey}&language=en-US&page=1`);
    moviesResponse = await moviesResponse.json();
    allMovies = moviesResponse.results;
    displayMovies(allMovies);
}

getMovies(category)

// display movies got from API
function displayMovies(moviesDisplayed)
{
    let cartoona = "";
    for(let i=0 ; i<moviesDisplayed.length ; i++)
    {
        cartoona += `<div class="col-md-4">
                        <div class="myCard position-relative overflow-hidden my-3">
                            <img class="img-fluid" src="${imgPath+moviesDisplayed[i].poster_path}" alt="">
                            <div class="overlay w-100 h-100 position-absolute text-center p-2">
                                <h2>${moviesDisplayed[i].original_title}</h2>
                                <p>${moviesDisplayed[i].overview}</p>
                                <p>${moviesDisplayed[i].vote_average}</p>
                                <p>${moviesDisplayed[i].release_date}</p>
                            </div>
                        </div>
                        
                    </div>`
    }
    

    $("#displayMovies").html(cartoona);
}

// choose categories from aside
categories.click((e)=>{
    if(e.target.attributes.category != undefined)
    {
        category = e.target.attributes.category.value;
        getMovies(category);
    }
})

/*-----------------------------------------------------(Searching Methods)-----------------------------------------------------*/

// search for movie on page
$("#searchPage").keyup((e)=>{ 
    let searchedMovies = []
    for(let i=0 ; i<allMovies.length ; i++)
    {
        if(allMovies[i].original_title.toLowerCase().includes(e.target.value.toLowerCase()))
        {
            searchedMovies.push(allMovies[i]);
        }
    }
    
    displayMovies(searchedMovies)
});

// search for movie on API
let searchedAPI = [];
$("#searchAPI").keyup((e)=>{
    searchWord(e.target.value);
})

async function searchWord(word)
{
    if(word == "")
    {
        displayMovies(allMovies);
        return;
    }
    let searchResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${word}`);
    searchResponse = await searchResponse.json();
    searchedAPI = searchResponse.results;
    displayMovies(searchedAPI);
}

$(".item6").click(()=>{
    let contactOffset = $("#contact")[0].offsetTop;
    $("html,body").animate({scrollTop:`${contactOffset}px`} , 1000)
})

/*-----------------------------------------------------(Form Regex)-----------------------------------------------------*/

$("#submitBtn").attr("disabled" , true);
$(".inputs input").val("");
let nameRegex = /^\S+$/
let emailRegex = /^[a-zA-Z]{1,}@[a-z]{3,10}\.(com|net|org)$/
let phoneRegex = /^01[0125][0-9]{8}$/
let ageRegex = /^(\d{2}|100)$/
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

// check for regex
$(".inputs input").keyup((e)=>{

    if(e.target.id != "rePassword")
    {
        let regex = eval(`${e.target.id}Regex`);
        if(regex.test(e.target.value) != true)
        {
            $(`#${e.target.id}Error`).removeClass("d-none");
            $(`#${e.target.id}`).removeClass("is-valid")
        }
        else
        {
            $(`#${e.target.id}Error`).addClass("d-none");
            $(`#${e.target.id}`).addClass("is-valid");
        }
    }
    allValid()
    
})

// compare two passwords
$("#rePassword,#password").blur((e)=>{ 

    if(e.target.value!="")
    {
        if($("#password").val() == $("#rePassword").val())
        {
            $("#rePasswordError").addClass("d-none");
            $("#rePassword").addClass("is-valid");
        }
        else
        {
            $("#rePasswordError").removeClass("d-none");
            $("#rePassword").removeClass("is-valid");
        }
    }
    
    allValid()
    

});

// check for validity
function allValid()
{
    for(let i=0 ; i<$(".inputs input").length ; i++)
    {
        // console.log(!$(".inputs").find("input")[i].className.includes("is-valid"))
        if(!$(".inputs").find("input")[i].className.includes("is-valid"))
        {
            $("#submitBtn").attr("disabled" , true);
            return;
        }
    }
    $("#submitBtn").attr("disabled" , false);
}

$("#submitBtn").click(()=>{
    $(".inputs input").val("");
    $("#submitBtn").attr("disabled" , true);
    $(".inputs input").removeClass("is-valid")
})

// enable ToolTip
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})