//practice_product.html
 function handleFormSubmit(event){
    event.preventDefault();

   var ind=event.target.ind.value;
   var des=event.target.des.value;
   var rs=event.target.rs.value;
   var qa=event.target.qa.value;

   var obj={
    ind:ind,
    des:des,
    rs:rs,
    qa:qa
   }

   axios.post("https://crudcrud.com/api/acfb666798c044a589b998b521d9c2cd/appointmentData",obj)
   .then((response)=>{
    showUserOnScreen(response.data);
    console.log(response);
   })
   .catch((error)=>{
    document.body.innerHTML=document.body.innerHTML+"<h4>Oops smething went wrong!!</h4>";
    console.log(error);
   })
   document.getElementById("ind").value="";
   document.getElementById("des").value="";
   document.getElementById("rs").value="";
   document.getElementById("qa").value="";


}

window.addEventListener("DOMContentLoaded", () => {
    axios.get("https://crudcrud.com/api/acfb666798c044a589b998b521d9c2cd/appointmentData")
    .then((response) => {
        for (var i = 0; i < response.data.length; i++) {
            showUserOnScreen(response.data[i]);
        }
       
        attachBuyEventListeners();
    })
    .catch((error) => {
        console.log(error);
    });
});

function attachBuyEventListeners() {
    var allBuyButtons = document.querySelectorAll('button[id^="buy"]');
    allBuyButtons.forEach((button) => {
        var id = button.id.slice(4); 
        var quantity = parseInt(button.id.slice(-1)); 
        addBuyEventListener(button, id, quantity);
    });
}



function addBuyEventListener(buyButton, id, quantityToDecrease) {
    buyButton.addEventListener('click', () => {
        buy(id, quantityToDecrease);
    });
} 

function updateQuantityInCrud(id,ind, des, rs, newQuantity) {
    console.log(`ind: ${ind}, des: ${des}, rs: ${rs}`);

   axios
        .put(`https://crudcrud.com/api/acfb666798c044a589b998b521d9c2cd/appointmentData/${id}`, {
            'ind': ind, 
            'des': des, 
            'rs': rs, 
            'qa': newQuantity
           
        })
        .then(res => { const userListItem = document.getElementById(id);
            if (userListItem) {
                userListItem.textContent = `${ind}-${des}-${rs}-${newQuantity}`;
            }

            showOutput(res);})
        .catch(err => console.error(err));
    console.log(`Updating quantity in CRUD: ${newQuantity}`);
}


function showUserOnScreen(obj) {
    var parentNode = document.getElementById("listofitems");
    var childnode = `<li id=${obj._id}>${obj.ind}-${obj.des}-${obj.rs}-${obj.qa}
    <button id="buy1${obj._id}">buy1</button>
    <button id="buy2${obj._id}">buy2</button>
    <button id="buy3${obj._id}">buy3</button>
    </li>`;
    parentNode.innerHTML = parentNode.innerHTML + childnode;

    // Add event listeners for each buy button
    var buy1Button = document.getElementById(`buy1${obj._id}`);
    var buy2Button = document.getElementById(`buy2${obj._id}`);
    var buy3Button = document.getElementById(`buy3${obj._id}`);

    addBuyEventListener(buy1Button, obj._id, 1);
    addBuyEventListener(buy2Button, obj._id, 2);
    addBuyEventListener(buy3Button, obj._id, 3);
}



function buy(id, quantityToDecrease) {
    
    axios
        .get(`https://crudcrud.com/api/acfb666798c044a589b998b521d9c2cd/appointmentData/${id}`) // Modify the URL here
        .then((response) => {
            const { qa, ind, des, rs } = response.data;
            console.log(response.data.qa);

            if (qa >= quantityToDecrease) {
                document.getElementById("qa").value = qa - quantityToDecrease;
                updateQuantityInCrud(id, ind, des, rs, qa - quantityToDecrease);
                console.log(ind, des, rs, qa - quantityToDecrease);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}


            


function showOutput(response) {
    if (response.status >= 200 && response.status < 300) {
        if (response.data) {
            const responseData = response.data;
            
          //  document.getElementById('qa').textContent = responseData.qa;
            
            // Assuming your response contains a field named 'quantity'
            const updatedQuantity = responseData.qa;

            // Update the HTML element with the new quantity value
            document.getElementById('qa').textContent = updatedQuantity;
        } else {
            console.log('Response Data is empty.');
        }
    } else {
        console.log('Request failed with status:', response.status);
    }
}

