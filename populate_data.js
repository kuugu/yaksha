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
const output = document.getElementById('output'); 

Promise.all([table_header, table_data]).then(
    values => {
        let header = values[0]; 
        let data = values[1]; 

        // search 
        search_bar.addEventListener('input', () => {
            const search_text = search_bar.value.toLowerCase(); 
            
            if (search_text.length >= 2) {
                search_output = [] 

                document.getElementById("table").replaceChildren(); 

                // update the table header 
                let header_tr = document.createElement('tr') 
                let th; 
                
                // prasanga 
                th = document.createElement('th'); 
                th.textContent = 'ಪ್ರಸಂಗ';
                header_tr.appendChild(th); 
                
                // kavi 
                th = document.createElement('th'); 
                th.textContent = 'ಕವಿ'; 
                header_tr.appendChild(th); 

                // prathilink 
                th = document.createElement('th'); 
                th.textContent = 'ಪ್ರತಿ'; 
                header_tr.appendChild(th); 

                // contributor 
                th = document.createElement('th'); 
                th.textContent = 'ಕೊಡುಗೆದಾರ'; 
                header_tr.appendChild(th); 
                
                // koshalink 
                th = document.createElement('th'); 
                th.textContent = 'ಕೋಶ'; 
                header_tr.appendChild(th); 

                document.getElementById("table").appendChild(header_tr); 

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

                    let tr = document.createElement('tr'); 
                    let td, tag_a; 
                    
                    // prasanga 
                    td = document.createElement('th'); 
                    td.textContent = data[i]['prasanga'];
                    tr.appendChild(td); 
                    
                    // kavi 
                    td = document.createElement('th'); 
                    td.textContent = data[i]['kavi'];
                    tr.appendChild(td); 

                    // prathilink 
                    td = document.createElement('th'); 
                    if (data[i]['prathi_fileid'] != '') {
                        tag_a = document.createElement('a'); 
                        tag_a.href = data[i]['prathilink']; 
                        tag_a.textContent = data[i]['prathi_dwnldstatus'];
                        td.appendChild(tag_a); 
                    } else {
                        td.textContent = data[i]['prathi_dwnldstatus']; 
                    }
                    tr.appendChild(td); 

                    // contributor 
                    td = document.createElement('th'); 
                    td.textContent = data[i]['contributor'];
                    tr.appendChild(td); 
                    
                    // koshalink 
                    td = document.createElement('th'); 
                    if (data[i]['kosha_fileid'] != '') {
                        tag_a = document.createElement('a'); 
                        tag_a.href = data[i]['koshalink']; 
                        tag_a.textContent = data[i]['kosha_dwnldstatus'];
                        td.appendChild(tag_a); 
                    } else {
                        td.textContent = data[i]['kosha_dwnldstatus']; 
                    }
                    tr.appendChild(td); 

                    document.getElementById("table").appendChild(tr) 

                    }   
                }
            }
        })

        // // update the table data 
        // data.forEach(element => {
        //     let tr = document.createElement('tr'); 

        //     for (let i=0; i<element.length; i++) {
        //         let td = document.createElement('td')

        //         if (header[i][1] === 'link') {
        //             let a = document.createElement('a')
        //             a.href = element[i]; 
        //             a.textContent = element[i];
        //             td.appendChild(a);  
        //         } else {
        //             td.textContent = element[i]; 
        //         }
                
        //         tr.appendChild(td);
        //     }

        //     document.getElementById("table").appendChild(tr) 
        // });
    }
)