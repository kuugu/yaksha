async function getDataFromJson(file_name: string) {
  try {
    const response = await fetch(file_name)

    if (!response.ok) {
      throw new Error(`${response.status}`)
    }

    const json = await response.json(); 

    return json; 
  } catch (error) {
    console.log(error)

    return null; 
  }
}

const SEARCH_DISPLAY_LIMIT = 20; 

let table_data = getDataFromJson('table_data.json');

const xbutton = document.getElementById('xbutton'); 
const search_bar = document.getElementById('search_bar'); 

// clear results 
xbutton!.addEventListener("click", () => {
  (<HTMLInputElement>search_bar).value = ""; 
  document.getElementById('search_output')!.replaceChildren(); 

}); 

let search_output_child: any[] = []; 
let search_output_displayed_cnt: number = 0; 

function populate_search(data: any[]) {
  // search 
  search_bar!.addEventListener('input', () => {
    const search_text = (<HTMLInputElement>search_bar).value.toLowerCase(); 

    if (search_text.length >= 2) {
      document.getElementById('search_output')!.replaceChildren(); 
      search_output_child = []; 
      search_output_displayed_cnt = 0; 

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
          let search_result = document.createElement('div');
          search_result.className = 'search_result';

          // thumbnail
          let thumbnail = document.createElement('div');
          thumbnail.className = 'search_thumbnail';
 
          let img = document.createElement('img');
          // img.class = 'fit-picture';
          img.src = 'public/thumbnails/' + data[i]['prathifileid'] + '.png';
          // img.alt = 'thumbnail for' + data[i]['prasanga'];
         thumbnail.appendChild(img);

          search_result.appendChild(thumbnail);

          let search_elem = document.createElement('div'); 
          search_elem.className = 'search_elem';  

          // prasanga 
          let prasanga = document.createElement('div'); 
          prasanga.className = 'search_prasanga';
          if (data[i]['prathi_fileid'] != '') {
            let tag_a = document.createElement('a');
            tag_a.href = data[i]['prathilink'];
            tag_a.textContent = data[i]['prasanga'];
            prasanga.appendChild(tag_a); 
          } else {
            prasanga.textContent = data[i]['prasanga']; 
          }
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

          search_output_child.push(search_result);
          search_output_child.push(document.createElement('hr'));
        }
      }
      let temp_next_cnt = Math.min(SEARCH_DISPLAY_LIMIT, search_output_child.length); 
      for (let i=0; i<temp_next_cnt; i++) {
        document.getElementById('search_output')!.appendChild(search_output_child[i]); 
      } search_output_displayed_cnt += temp_next_cnt; 
    } else {
      document.getElementById('search_output')!.replaceChildren(); 
      search_output_child = []; 
      search_output_displayed_cnt = 0; 
    }
  })
}

function add_search_results(_: any[]) {
  document.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      let temp_next_cnt: number = Math.min(search_output_child.length, search_output_displayed_cnt + 20); 
      for (let i=search_output_displayed_cnt; i<temp_next_cnt; i++) {
        document.getElementById('search_output')!.appendChild(search_output_child[i]); 
      }
      search_output_displayed_cnt = temp_next_cnt; 
    }
  })
}

Promise.resolve(table_data).then(populate_search); 
Promise.resolve(table_data).then(add_search_results); 
