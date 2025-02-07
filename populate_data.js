async function getDataFromJson() {

    try {
        const response = await fetch('table.json')

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

let table_data = getDataFromJson(); 

table_data.then(
    (value) => {
        const doc = document.getElementById("table")
        let header = document.createElement('tr') 

        Object.keys(value[0]).forEach(element => {
            let th = document.createElement('th') 
            th.textContent = element; 
            header.appendChild(th); 
        }) 

        document.getElementById("table").appendChild(header); 

        value.forEach(element => {
            let tr = document.createElement('tr'); 

            for (let elem in element) {
                let td = document.createElement('td')
                td.textContent = element[elem]; 
                tr.appendChild(td);
            }

            document.getElementById("table").appendChild(tr) 
        });
    }
)
