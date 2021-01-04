/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const numberMap = {First:1, Second:2, Third:3, Fourth:4, Fifth:5, Sixth:6, Seventh:7, Eigth:8, Ninth:9, Tenth:10, Eleventh:11, Twelfth:12, thirteenth:13, Fourteenth:14, Fifteenth:15, Sixteenth:16, Eighteenth:17}; 
function getKeyFromVal(object,value) {
  return Object.keys(object).find(key => object[key] === value)
}



async function searchShows(q) {
  let showsArray = [];
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const response = await axios.get(
    "https://api.tvmaze.com/search/shows?",
    {
      params: {
        q,
      }
    });
  for (let show in response.data) {
    showsArray.push(response.data[show]);
  }
  return showsArray;
}


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 *     - check was added to see if image exists
 *     - if not, we creat image object and add to data array
 *     -   with default image link
 * 
 *  - Added in some HTML coding to collapse the summary into the card
 *     - This is toggled (opened/closed) by clicking the link-button
 *     - This made the page look much cleaner and easier to navigate
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  for (let i = 0; i < shows.length; i++) {
    console.log(shows[i].show.id);
    if (shows[i].show.image === null) {
      Object.assign(shows[i].show, {
        image: {
          original: "https://tinyurl.com/tv-missing"
        }
      });
    }
    let $item = $(
      `<div class="col-6 col-md-6 col-lg-3 mb-2 Show" data-show-id="${shows[i].show.id}" data-name="${shows[i].show.name}">
        <img class="card-img-top" src="${shows[i].show.image.original}" alt="Card image cap">
        <div class="card" data-show-id="${shows[i].show.id}">
          <h5 class="card-title">
            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample${i}" aria-expanded="false" aria-controls="multiCollapseExample${i}">
              <b>${shows[i].show.name}</b> <br> (click for summary)
            </button>
          </h5>
          <div class="collapse multi-collapse" id="multiCollapseExample${i}">
            <div class="card-body">
             <p>${shows[i].show.summary}</p>
            </div>
          </div>
          <div class="btn-container d-flex justify-content-center">
            <button type="button" class="btn btn-link" id="episode-btn" data-id="${shows[i].show.id}"> Episodes </button>
            <button type="button" class="btn btn-link" id="cast-btn" data-id="${shows[i].show.id}"> Cast </button>
          </div>
        </div>
      </div>
      `);
    $showsList.append($item);
  }
}
/** Populate episodes list:
 *     - given list of episodes, adds them to DOM
 *     - check was added to see if there is episode data
 *     - if not, give alert at spot where episodes normally would be
 */
function populateEpisodes(episodes, $name) {
  $(".section-2").hide();
  const $episodeList = $("#episodes-list");
  $episodeList.empty();
  if (episodes.length === 0) {
    $("#section-1-h2").addClass("alert");
    $("#section-1-h2").addClass("alert-danger");
    $("#section-1-h2").text("No Episodes Found");
  }
  else {
    $("#section-1-h2").removeClass("alert");
    $("#section-1-h2").removeClass("alert-danger");
    $("#section-1-h2").text("Episodes");
    for (let i = 0; i < episodes.length; i++) {
      console.log(episodes[i].name);
      let $item = $(
        `<li id="${i}" data-show-id="${episodes[i].id}">
        <b>Episode Name:</b> ${episodes[i].name} -
        <b>Season:</b> ${episodes[i].season} -
        <b>Episode:</b> ${episodes[i].number} 
      </li>
      `);
      $episodeList.append($item);
    }
  }

  $(".list-title").text(`${$name}`);
  $(".section-1").show();
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $(".section-1").hide();
  $(".section-2").hide();
  const $showsList = $("#shows-list");
  $showsList.empty();
  const $castScroll= $(".carousel-inner");
  $castScroll.empty();


  let shows = await searchShows(query);

  populateShows(shows);
  
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  let epArray = [];
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  const response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  for (let ep in response.data) {
    epArray.push(response.data[ep]);
  }
  return epArray;
}

async function getCast(id) {
  let castArray = [];

  const response = await axios.get(`https://api.tvmaze.com/shows/${id}/cast`);
  for (let mem in response.data) {
    castArray.push(response.data[mem]);
  }
  return castArray;
}

function isActive(i) {
  if (i === 0) {
    return "active";
  }
  else {
    return "";
  }
}

function populateCast(members, $name) {
  $(".section-1").hide();
  const $castScroll= $(".carousel-inner");
  $castScroll.empty();
  if (members.length === 0) {
    $("#section-2-h2").addClass("alert");
    $("#section-2-h2").addClass("alert-danger");
    $("#section-2-h2").text("No Cast Found");
  }
  else {
    $("#section-2-h2").removeClass("alert");
    $("#section-2-h2").removeClass("alert-danger");
    $("#section-2-h2").text("Cast");
    for (let i = 0; i < members.length; i++) {
      console.log(members[i].character.name);
      let active = isActive(i);
      let key = getKeyFromVal(numberMap,i+1);
      if (members[i].person.image === null) {
        Object.assign(members[i].person, {
          image: {
            original: "https://tinyurl.com/tv-missing"
          }
        });
      }
      let $item = $(`
        <div class="carousel-item ${active}">
        <img src="${members[i].person.image.original}" class="d-block w-100 img-fluid" alt="...">
          <div class="carousel-caption d-none d-md-block">
            <h3 id="ch-name">${members[i].character.name}</h5>
            <h5 id="act-name">${members[i].person.name}</p>
          </div>
        </div>
      `);
      $castScroll.append($item);
    }
    $(".list-title").text(`${$name}`);
    $(".section-2").show();
  }
}

/**
 *  this is the function that waits for DOM to have been updated with shows
 *    - when we click the episodes-btn (which looks like link)
 *    - we run getEpisodes using the id of the closest "show" (.Show)
 *    - then run populateEpisodes to update DOM with episodes
 *    - added in some scripting to automatically scroll to episodes
 *    - along with a button to get back to the shows if need be later
 */

$("#shows-list").on("click", "#episode-btn", async function handleEpisodeClick(evt) {
  let $id = $(evt.target).closest(".Show").data("show-id");
  let $name = $(evt.target).closest(".Show").attr("data-name");
  let eps = await getEpisodes($id);
  populateEpisodes(eps, $name);
  document.querySelector(".list-title").scrollIntoView();
  let distance = $('.list-title').offset().top;

  $(window).scroll(function () {
    if ($(this).scrollTop() >= distance) {
      // Your div has reached the top
      $('.list-title').css("font-size", "60px");
      //$('.list-title').css("text-fill-color", "orange");
      $('.list-title').css("background-color", "black");
      $('.list-title').css("text-fill-color", "white");
    }
    else {
      $('.list-title').css("font-size", "");
      $('.list-title').css("background-color", "white");
      $('.list-title').css("text-fill-color", "black");
    }
  });
});
$("#shows-list").on("click", "#cast-btn", async function handleCastClick(evt) {
  let $id = $(evt.target).closest(".Show").data("show-id");
  let $name = $(evt.target).closest(".Show").attr("data-name");
  let cast = await getCast($id);
  populateCast(cast, $name);
  document.querySelector("#section-2-h2").scrollIntoView();
  let distance = $('#section-2-h2').offset().top;

  $(window).scroll(function () {
    if ($(this).scrollTop() >= distance) {
      // Your div has reached the top
      $('.list-title').css("font-size", "60px");
      //$('.list-title').css("text-fill-color", "orange");
      $('.list-title').css("background-color", "black");
      $('.list-title').css("text-fill-color", "white");
    }
    else {
      $('.list-title').css("font-size", "");
      $('.list-title').css("background-color", "white");
      $('.list-title').css("text-fill-color", "black");
    }
  });
});

$("#back-btn-1").on("click", function () {
  document.querySelector(".title").scrollIntoView();
});
$("#back-btn-2").on("click", function () {
  document.querySelector(".title").scrollIntoView();
});

