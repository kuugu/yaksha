async function getDataFromJson(file_name) {

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

let table_data = getDataFromJson('table_data.json');
let table_header = getDataFromJson('table_header.json'); 

const search_bar = document.getElementById('search_bar'); 
const xbutton = document.getElementById('xbutton'); 

Promise.all([table_header, table_data]).then(
    values => {
        let header = values[0]; 
        let data = values[1]; 

        // clear results 
        xbutton.addEventListener("click", () => {
            search_bar.value = ""; 
            document.getElementById('search_output').replaceChildren(); 

        })
        

        // search 
        search_bar.addEventListener('input', () => {
            const search_text = search_bar.value.toLowerCase(); 
            
            if (search_text.length >= 2) {
                document.getElementById('search_output').replaceChildren(); 

                for (let i=0; i<data.length; i++) {
                    if (data[i]['contributor'].includes(search_text) 
                        || data[i]['dateadded'].includes(search_text)
                        || data[i]['kavi'].includes(search_text)
                        || data[i]['prasanga'].includes(search_text)
                        || data[i]['publisher'].includes(search_text)
                        || data[i]['contributor_en'].includes(search_text)
                        || data[i]['kavi_en'].includes(search_text)
                        || data[i]['prasanga_en'].includes(search_text)
                        || data[i]['publisher_en'].includes(search_text) 
                    ) {
                        let search_elem = document.createElement('div'); 
                        search_elem.className = 'search_elem';  

                        // construct the search output 

                        // prasanga 
                        let prasanga = document.createElement('div'); 
                        prasanga.className = 'search_prasanga'; 
                        prasanga.textContent += data[i]['prasanga']; 
                        search_elem.appendChild(prasanga); 

                        // kavi 
                        let kavi = document.createElement('div'); 
                        kavi.className = 'search_kavi'; 
                        kavi.textContent = 'ಕವಿ: ';
                        kavi.textContent += data[i]['kavi']; 
                        search_elem.appendChild(kavi); 

                        // prathi & koshalink  
                        let links = document.createElement('div');  
                        links.id = 'remove_later'; 

                        links.textContent = 'ಪ್ರತಿ: '; 
                        if (data[i]['prathi_fileid'] != '') {
                            let tag_a = document.createElement('a'); 
                            tag_a.href = data[i]['prathilink']; 
                            tag_a.textContent = data[i]['prathi_dwnldstatus'];
                            links.appendChild(tag_a); 
                        } else {
                            links.textContent += data[i]['prathi_dwnldstatus']; 
                        }

                        links.innerHTML += '  ';
                        links.innerHTML += 'ಯಕ್ಷವಾಹಿನಿ ಕೋಶ: '; 
                        if (data[i]['kosha_fileid'] != '') {
                            let tag_a = document.createElement('a'); 
                            tag_a.href = data[i]['koshalink']; 
                            tag_a.textContent = data[i]['kosha_dwnldstatus'];
                            links.appendChild(tag_a); 
                        } else {
                            links.innerHTML += data[i]['kosha_dwnldstatus']; 
                        }
                        search_elem.appendChild(links); 

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

                        document.getElementById('search_output').appendChild(search_elem); 
                    }   
                }
            }
        })
    }
)