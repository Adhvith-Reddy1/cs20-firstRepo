// --------------------------------------------------------------
//                                                               
// Hiding input boxes based on choice of radio button
//                                                               
// -------------------------------------------------------------- 

//Hiding street and city elements of the form as by default, pickup is the selected radio button
let elements = document.getElementsByClassName("userInfo address");

for(i=0; i< elements.length; i++){
    elements[i].style.visibility = 'hidden';
}

console.log(menuItems[0].name);

let radioBtns = document.querySelectorAll("input[name='p_or_d']");

//hiding or making elements visible depending on choice of radio button
let findSelected = () => {
    let selected = document.querySelector("input[name='p_or_d']:checked").value;

    let elements = document.getElementsByClassName("userInfo address");

    //if pickup is selected, hide street and city 
    if (selected == "pickup"){
        for(i=0; i< elements.length; i++){
            elements[i].style.visibility = 'hidden';
        }
    //else if delivery is selected, make street and city visible
    } else {
        for(i=0; i< elements.length; i++){
            elements[i].style.visibility = 'visible';
        }
    }
}

//adding functionality to the pickup and delivery radio buttons
radioBtns.forEach(radioBtn =>  {
    radioBtn.addEventListener("change", findSelected);
});

// --------------------------------------------------------------
//                                                               
// Adding Functionality to the selector items and the cost totals
//                                                               
// -------------------------------------------------------------- 

//Storing the cost boxes of each item in an array
const itemTextBoxes = document.getElementsByName("cost");




//computing the subtotals for each item and overall bill totals
let computeSelected = () => {

    let subtotal = 0;
    let tax = 0;
    let billTotal = 0;
    
    //looping through each item and determining the subtotal based off quantity
    for(i=0; i < menuItems.length; i++) {
        let quantity = document.querySelector("select[name='quan" + i + "']").value;
        let total = parseFloat((quantity * menuItems[i].cost).toFixed(2));
        itemTextBoxes[i].value = total; //writing the subtotal to document
        subtotal = subtotal + total; //adding each item's cost to the bill subtotal
    }
    //calculating tax based off subtotal
    tax = (Number((subtotal * 0.0625)).toFixed(2));

    //writing subtotal, tax and bill total to document
    document.getElementById('subtotal').value = subtotal;
    document.getElementById('tax').value = tax;

    billTotal = (subtotal + tax * 1).toFixed(2);

    document.getElementById('total').value = billTotal;

}

    //storing the quantity of each item in an array
    let quanSelectors = document.getElementsByTagName("select");
    
    //adding interactiveness to each selector 
    for(i=0; i < quanSelectors.length; i++){
        quanSelectors[i].addEventListener("change", computeSelected);
    }   

// --------------------------------------------------------------
//                                                               
// Validating elements of the form and calculating order time
//                                                               
// -------------------------------------------------------------- 


    const submit = document.querySelector("input[value='Submit Order']");
    //when submit button is clicked, validate the form
    submit.addEventListener("click", validate);
    
    //validates all the elements of the form
    function validate(e) {
        e.preventDefault();
        //validating the first name field
        let fName = document.querySelector("input[name='fname']");        
        if (fName.value == '' || fName.value == null) {
            alert("Enter first name!");
            return;
        } 
        //validating the last name field
        let lName = document.querySelector("input[name='lname']");
        if (lName.value == '' || lName.value == null) {
            alert("Enter last name!");
            return;
        } 
        //validating the phone field
        let phone = document.querySelector("input[name='phone']");
        if ( phone.value.length != 7 && phone.value.length != 10){
            alert("Enter valid phone number!");
            return;
        }
        //validating the street and city fields if delivery radio button is chosen
        if(elements[0].style.visibility == 'visible'){
            //validating the street field
            let street = document.querySelector("input[name='street']");
            if (street.value == '' || street.value == null) {
                alert("Enter street name!");
                return;
            }
            //validating the city field
            let city = document.querySelector("input[name='city']");
            if (street.value == '' || street.value == null) {
                alert("Enter city!");
                return;
            }
        } 

        //making a counter to see how many items have been ordered
        let count = 0;
        //looping through selectors of each item to see if item has been ordered
        
        for (i=0; i < menuItems.length; i++) {
            let items = document.querySelector("select[name='quan" + i + "']");
            if (items.value > 0) {
                count += 1;
            }
        }
        if (count == 0){ //if count is 0, no items have been selected
            alert("Please select at least 1 item to order!");
            return; 
        }

        let processTime = order_time();

        alert("Thank you for your ordering from Jade Delight! \nYour order will be ready soon!");

        orderSummary();
    }

    function order_time() {

    let time = new Date();

    if(elements[0].style.visibility == 'visible'){
        time.setMinutes(time.getMinutes() + 45);
        return time;
    } else {
        time.setMinutes(time.getMinutes() + 15);
        return time;
    }  
}

// --------------------------------------------------------------
//                                                               
// Writing order summary/details on new page
//                                                               
// -------------------------------------------------------------- 

function orderSummary() {
    
    // create a new Window object
    let newWindow = window.open();

    //making string that holds text to build pop-up page
    s = "<body style='background-color: rgb(34, 143, 132); display: flex;flex-direction: column; align-items: center;'> <h1 style='text-align: center; color: rgb(12, 61, 12); '>Order Summary</h1> <div style='background-color: burlywood; margin-top: 2%; padding: 5% 5%; border: white double 2px;'>";
    s += "<table style='margin-right:auto; margin-left:auto;'> <tr><th>Item</th><th>Cost</th></tr>";

    //writing items selected and respective costs into order summary
    for(i=0;i < menuItems.length; i++) {
        quantity = document.querySelector("select[name='quan" + i + "']").value;

        if(quantity == 0){
            continue;
        } else{
            s += "<tr> <td style='padding: 0 30px;'>" + menuItems[i].name + "</td>";
            cost = (quantity * menuItems[i].cost).toFixed(2);
            s += "<td>$" + cost + "</td> </tr>";
        }
    }
    s += "</table> <br /> <br />";

    //storing values of subtotal, tax and bill total from form
    sub = document.getElementById("subtotal").value;
    tx = document.getElementById("tax").value;
    bill = document.getElementById("total").value;

    s += "<div style='text-align: center;'> Subtotal: $" + sub + "<br /><br />" + "Tax: $" + tx + "<br /><br />" + "Total: $" + bill + "<br /><br /> </div><br />";

    let time = order_time();
    let minutes = time.getMinutes();
    console.log(minutes);


    s += "<p style='text-align: center;'>Estimated ";
    if(elements[0].style.visibility == 'visible') 
        s += "delivery";
    else
        s += "pickup";
        
    s += " time:  " + time.getHours() + ":" + time.getMinutes() + "<p> </div></body>";

    //writing to the new tab/window
    newWindow.document.writeln(s);
}


