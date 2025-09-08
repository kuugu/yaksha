const SEARCH_ITEMS_PER_PAGE = 20;

// load data from json 
async function get_data_from_json(file_name) {
  let json = null; 

  try {
    const response = await fetch(file_name);
    json = await response.json();
  } catch(error) {
    console.log(error);
  }
  return json;
}

// get the indices of data that contain the search text
function get_match_indices(data, search_text) {
  let output = [];
  for (let i=0; i<data.length; i++) {
    let search_match = false;

    let search_match_contributor = data[i]['contributor'].indexOf(search_text);  
    let search_match_kavi = data[i]['kavi'].indexOf(search_text); 
    let search_match_prasanga = data[i]['prasanga'].indexOf(search_text); 
    let search_match_publisher = data[i]['publisher'].indexOf(search_text); 
    let search_match_contributor_en = data[i]['contributor_en'].indexOf(search_text); 
    let search_match_kavi_en = data[i]['kavi_en'].indexOf(search_text); 
    let search_match_prasanga_en = data[i]['prasanga_en'].indexOf(search_text); 
    let search_match_publisher_en = data[i]['publisher_en'].indexOf(search_text); 

    search_match = ((search_match_contributor >= 0) 
      || (search_match_kavi >= 0)
      || (search_match_prasanga >= 0)
      || (search_match_publisher >= 0)
      || (search_match_contributor_en >= 0)
      || (search_match_kavi_en >= 0)
      || (search_match_prasanga_en >= 0)
      || (search_match_publisher_en >= 0)
    );

    if (search_match) {
      output.push(i);
    }
  }
  return output;
}

// add search results to DOM so that the browser renders them
function add_search_results_to_dom_object(search_output, search_state) {
  let low = search_state.to_be_rendered_from;
  let high = low + Math.min(20, 
    search_state.current_search_match_indices.length - low);
  let data = search_state.data;

  // NOTE(kuugu): j is the index of current_search_match_indices
  // i is the indirection again to the search_state.data array 
  for (let j=low; j<high; j++) {
    let i = search_state.current_search_match_indices[j];
    let search_result = document.createElement('div');
    search_result.className = 'search_result';

    // thumbnail
    let thumbnail = document.createElement('div');
    thumbnail.className = 'search_thumbnail';

    let tag_a = document.createElement('a');
    tag_a.classname = 'thumbnail_link';
    tag_a.href = data[i]['prathilink'];
    let img = document.createElement('img');
    img.className = 'thumbnail_img';
    img.src = 'thumbnails/' + data[i]['prathifileid'] + '.png';
    tag_a.appendChild(img);
    thumbnail.appendChild(tag_a)

    search_result.appendChild(thumbnail);

    let search_elem = document.createElement('div'); 
    search_elem.className = 'search_elem';  
    
    // id 
    let prasanga_id = document.createElement('div');
    prasanga_id.className = 'search_prasanga_id';
    prasanga_id.textContent = '#'+data[i]['id'];
    search_elem.appendChild(prasanga_id);

    // prasanga 
    let prasanga = document.createElement('div'); 
    prasanga.className = 'search_prasanga';
    prasanga.textContent = data[i]['prasanga'];
    search_elem.appendChild(prasanga); 

    // kavi 
    let kavi = document.createElement('div'); 
    kavi.className = 'search_kavi'; 
    kavi.textContent = 'ಕವಿ: ';
    kavi.textContent += data[i]['kavi']; 
    search_elem.appendChild(kavi); 

    // publisher 
    let publisher = document.createElement('div'); 
    publisher.textContent = 'ಪ್ರಕಾಶಕರು: ';
    publisher.textContent += data[i]['publisher']; 
    search_elem.appendChild(publisher); 

    // contributor 
    let contributor = document.createElement('div'); 
    contributor.textContent = 'ಕೊಡುಗೆದಾರ: ';
    contributor.textContent += data[i]['contributor']; 
    search_elem.appendChild(contributor); 

    search_result.appendChild(search_elem);

    search_output.appendChild(search_result);
    search_output.appendChild(document.createElement('hr'));
  }

  search_state.to_be_rendered_from += high;
}


function main(data) {
  // state variables
  let search_state = {
    data: data,
    current_search_match_indices: [],
    to_be_rendered_from: 0
  }

  const search_bar = document.getElementById("search_bar");
  search_bar.addEventListener("input", () => {
    const search_text = search_bar.value.trim().toLowerCase();

    if (search_text.length >= 2) {
      search_state.current_search_match_indices = [];
      search_state.to_be_rendered_from = 0;
      document.getElementById('search_output').replaceChildren();

      search_state.current_search_match_indices = 
        get_match_indices(search_state.data, search_text);

      add_search_results_to_dom_object(
        document.getElementById("search_output"), 
        search_state 
      );
    }
  })

  document.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // render a few more search results (if any)
      add_search_results_to_dom_object(
        document.getElementById("search_output"),
        search_state
      )
    }
  })

  // clear results
  const xbutton = document.getElementById("xbutton");
  xbutton.addEventListener("click", () => {
    search_state.current_search_match_indices = [];
    search_state.to_be_rendered_from = 0;
    document.getElementById("search_bar").value = "";
    document.getElementById('search_output').replaceChildren();
  });
}

// usage
let table_data = get_data_from_json("table_data.json");
Promise.resolve(table_data).then(main);
