
$(window).on('load',()=> {
    fetchTableData();
});


function showAlert(type,alert,msg) {   // Function to show alerts
    const html = `<div id='alert' class='alert alert-${type} alert-dismissible fade show' 
    role='alert'><strong>${alert}  </strong>${msg}
    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
    <span aria-hidden='true'>&times;</span></button></div>`;
    $('#alertBox').append(html);

    setTimeout(function() {
        $(".alert").alert('close');
    }, 3000);
}

function validatePhone(phone) { // Function to validate phone number
    if(/^\d{10}$/.test(phone)){
        return true;
    } else {
        showAlert('warning','Alert ! ','Phone Number is Not Valid !!!');
        return false;
    }
}

function validateMail(email){  // function to validate E-mail
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    } else {
        showAlert('warning','Alert ! ','Email is Not Valid !!!');
        return false;  
    }
}


function capital_letter(str) // Function to make first word capital of name or sentence
{
    if (str) {
        str = str.split(" ");

        for (var i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
    
        return str.join(" ");
    } else {
        return str = ""
    }
}

function clearFields() {
    $('#name').val("");
    $('#phone').val("");
    $('#email').val("");
    $('#address').val("");
    $('#id').val("");
}

// Fetch Tabel Contect From MongoDb Database //////////////////////////////////
function fetchTableData() {
    fetch('/contact/fetch',{
        method : 'post',
        headers : {
            'Content-Type' : 'application/json'
        }
    })
        .then((response) => {
            return response.json();
        })
            .then((data)=>{
                if ($.fn.DataTable.isDataTable('#dataTable')) {
                    $('#dataTable').DataTable().destroy();
                }
                $('#tbody').empty();
                let i = 1;
                data.forEach(contact => {
            
                    $('#tbody').append(
                        `<tr>
                            <td>${i}</td>
                            <td>${contact.name}</td>
                            <td>${contact.phone}</td>
                            <td>${contact.email}</td>  
                            <td>
                            <div class="btn-group">
                                <button onclick="viewContact('${contact._id}')" type="button" class="btn btn-success"><i class="fa fa-eye"></i></button>
                                <button onclick="updateData('${contact._id}')" type="button" class="btn btn-warning"><i class="fa fa-pencil"></i></button>
                                <button onclick="deleteData('${contact._id}')" type="button" class="btn btn-danger"><i class="fa fa-trash"></i></button>
                            </div>
                          </td>
                        </tr>`
                    );
                    i  = i + 1;
                });      


                 $('#dataTable').dataTable({
                        "lengthMenu": [[3, 5, 10, -1], [3, 5, 10, "All"]],
                 });
            })
    .catch((err)=>{
        console.log(err);
    });
}

/// TO MAKE A POST REQUEST TO ADD CONTACT ///////////////////////////////////////////////////////////
$("#savebtn").click(()=>{
    const name = capital_letter($('#name').val().trim());
    const phone = $('#phone').val();
    const email = $('#email').val();
    const address = $('#address').val();
    const id = $('#id').val();

    if(!name || !phone || !email ||!address) {
        showAlert('danger','Attention','Fields Are Empty!!!');
        return;
    }
    if (validatePhone(phone) === true && validateMail(email) === true ) {

        if(id) {
            const ContactUpdate = {id,name,phone,email,address};
            fetch('contact/update',{
                method : 'post',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(ContactUpdate)
            })
            .then((response)=>{return response.json()})
            .then((data)=>{
                clearFields();
                fetchTableData();
                $('#title').html('Add Contact');
                showAlert(data.class,data.alert,data.msg);
            })
            .catch((err)=>console.log(err));
        }else {
            const ContactSave = {name,phone,email,address};
            fetch('/contact/add',{
                method : 'post',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(ContactSave)
            }).then((result) => {
                clearFields();
                return result.json();
            }).then((data)=>{
                showAlert(data.class,data.alert,data.msg);
                fetchTableData();
            })
            .catch((err) => {
                console.log(err);
            });
        }

    }
});

/// View Modal to view Data /////////////////////
function viewContact(id) {
    $('#viewModal').modal('show');

    data = {id};
    fetch('/contact/view',{
        method : 'post',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    })
    .then((response)=>{
        $('#viewModal').modal('show');
        $('#modal-body').empty();
        return response.json();
    })
    .then((contact)=>{
        $('#modal-body').append(`
        <ul class="list-group">
                <li class="list-group-item"><strong>Name : </strong>${contact.name}</li>
                <li class="list-group-item"><strong>Email : </strong>${contact.email}</li>
                <li class="list-group-item"><strong>Phone : </strong>${contact.phone}</li>
                <li class="list-group-item"><strong>Address : </strong>${contact.address}</li>
        </ul>
        `);
    })
    .catch((err)=>{
        console.log(err);
    });    
}

// Delete Data //////////////////////

function deleteData(id){
    $('#delModal').modal('show');
    $('#delmodal-body').empty();
    $('#delmodal-body').append(`
    <button type="button" class="btn btn-danger" onclick=deleteContact('${id}');>Yes</button>
    <button type="button" class="btn" data-dismiss="modal" aria-label="Close">No</button>
    `);
}

function deleteContact(id) {
    const data = {id};
    fetch('/contact/remove',{
        method : 'post',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    })
    .then((response)=> {
        $('#delModal').modal('hide');
        return response.json(); 
        
    })
    .then((data)=> {
        showAlert(data.type,data.alert,data.msg);
        fetchTableData();
    })
    .catch((err) =>  console.log(err));
}


//////////////// UPDATE DATA //////////////////////////

function updateData(id) {
    clearFields();
    $('#title').html('Edit Contact');
    const data = {id}
    fetch('contact/getdata',{
        method : 'post',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    })
    .then((response) => {return response.json()})
    .then((contact)=>{
        $('#name').val(contact.name);
        $('#phone').val(contact.phone);
        $('#email').val(contact.email);
        $('#address').val(contact.address);
        $('#id').val(id);
    })
    .catch((err) => console.log(err));    
}

