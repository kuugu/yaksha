files = [
    {"file_name": "97. ಅತಿಕಾಯ ಕಾಳಗ - ಹಟ್ಟಿಯ೦ಗಡಿ ರಾಮಭಟ್ಟ.pdf", "english_name": "Atikaya Kalaga"}, 
    {"file_name": "68. ಅಂಧಕಾಸುರ ವಧೆ-ಅಗರಿ ಶ್ರೀನಿವಾಸ ಭಾಗವತ.pdf", "english_name": "Andhakasura Vadhe"}
]

alert('change now')

files.forEach(element => {
    const new_node = document.createElement('li') 
    new_node.textContent = element['english_name'] + " : " 
    const link = document.createElement('a'); 
    link.textContent = element['file_name'] 
    link.href = "./files/" + element['file_name']
    new_node.appendChild(link)
    document.getElementById('file_list').appendChild(new_node)
});
