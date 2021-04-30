/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 */
async function searchShows(q) {
	const response = await axios.get("http://api.tvmaze.com/search/shows", { params: {q} });
	return response.data;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
function populateShows(shows) {
	const $showsList = $("#shows-list");
	$showsList.empty();
	
	for (let show of shows) {
		const showImg = show.show.image ? show.show.image.medium : "https://tinyurl.com/tv-missing";

		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.show.id}">
				 <div class="card" data-show-id="${show.show.id}">
					 <img class="card-img-top" src="${showImg}">
					 <div class="card-body">
						 <h5 class="card-title">${show.show.name}</h5>
						 <p class="card-text">${show.show.summary}</p>
						 <button class="btn btn-primary get-episodes">Episodes</button>
					 </div>
				 </div>
			 </div>
			`);
		$showsList.append($item);
	}
}

// Handle click for getting episodes of show
$("#shows-list").on("click", ".get-episodes", async function handleGetEpisodes(e){
	const $id = $(e.target).closest(".card").data("show-id");
	populateEpisodes(await getEpisodes($id));
})

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

// Given a show ID, return list of episodes:
async function getEpisodes(id) {
	const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
	return response.data;
}

/** Populate episodes list:
 *     - given list of episodes, add espiodes to DOM
 */
function populateEpisodes(episodes){
	const $episodesList = $("#episodes-list");
	$episodesList.empty();

	for (let episode of episodes) {
		let $newLi = $(`<li>${episode.name} (season ${episode.season}, episode ${episode.number})</li>`);

		$episodesList.append($newLi);
	}

	$("#episodes-area").show();
}