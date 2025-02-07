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

Promise.all([table_header, table_data]).then(
    values => {
        let header = values[0]; 
        let data = values[1]; 

        // update the table header 
        let header_tr = document.createElement('tr') 

        header.forEach(element => {
            let th = document.createElement('th') 
            th.textContent = element[0]; 
            header_tr.appendChild(th); 
        }) 

        document.getElementById("table").appendChild(header_tr); 

        // update the table data 
        data.forEach(element => {
            let tr = document.createElement('tr'); 

            for (let i=0; i<element.length; i++) {
                let td = document.createElement('td')

                if (header[i][1] === 'link') {
                    let a = document.createElement('a')
                    a.href = element[i]; 
                    a.textContent = element[i];
                    td.appendChild(a);  
                } else {
                    td.textContent = element[i]; 
                }
                
                tr.appendChild(td);
            }

            document.getElementById("table").appendChild(tr) 
        });
    }
)
