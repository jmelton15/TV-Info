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
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  for (let i =0;i<shows.length;i++) {
    console.log(shows[i].show.id);
    if (shows[i].show.image === null) {
      Object.assign(shows[i].show, {
        image: {
          original: "https://tinyurl.com/tv-missing"
        }
      });
    }
    let $item = $(
      `<div class="col-xs-6 col-md-6 col-lg-3 Show" data-show-id="${shows[i].show.id}" data-name="${shows[i].show.name}">
        <img class="card-img-top" src="${shows[i].show.image.original}" alt="Card image cap">
        <div class="card" data-show-id="${shows[i].show.id}">
          <h5 class="card-title">
            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#multiCollapseExample${i}" aria-expanded="false" aria-controls="collapseExample">
              <b>${shows[i].show.name}</b> <br> (click for summary)
            </button>
          </h5>
          <div class="collapse" id="multiCollapseExample${i}">
            <div class="card-body">
             <p>${shows[i].show.summary}</p>
            </div>
          </div>
          <div class="btn-container">
            <button type="button" class="btn btn-link" id="episode-btn" data-id="${shows[i].show.id}"> Episodes </button>
          </div>
        </div>
      </div>
      `);
  $showsList.append($item);
  }
}

function populateEpisodes(episodes,$name) {
  const $episodeList = $("#episodes-list");
  $episodeList.empty();
  if (episodes.length === 0) {
    $("#section-h2").addClass("alert");
    $("#section-h2").addClass("alert-danger");
    $("#section-h2").text("No Episodes Found");
  }
  else {
    $("#section-h2").removeClass("alert");
    $("#section-h2").removeClass("alert-danger");
    $("#section-h2").text("Episodes");
  for (let i =0;i<episodes.length;i++) {
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
  $("section").show();
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();
  
  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

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

$("#shows-list").on("click", "#episode-btn", async function handleEpisodeClick(evt) {
  let $id = $(evt.target).closest(".Show").data("show-id");
  let $name = $(evt.target).closest(".Show").attr("data-name");
  let eps = await getEpisodes($id);
  populateEpisodes(eps,$name);
});
