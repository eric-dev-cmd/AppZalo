const http = `http://localhost:3018`;
//add contanct
function addContact() {
    socket.emit('add-new-contact', {contactId: 1})
}

(function($) {
    $(document).ready(function() {
        $("#searchPhone").on("keyup", function() {  	
            update(this.value);
        });
    });
})(jQuery);



function update(phone) {
	const url = http + `/users/searchPhone/${phone}`; 
    (function($) {
        $.get(url, function(data, status) {
            if (status === 'success') {
                render(data);	
                console.log(JSON.stringify(data));
            }
        })
    })(jQuery);  //url api
}

// thay đổi dữ liệu trong table của jsp
function render(data) {
	(function($) {
        $('#name-search').html('');		
        $('#phone-search').html('');
        $('#image-search').html('');												
        $.each(data, (i, data) => {											
            const {local, userName, avatar} = data;			
            $('<strong>' + userName + '</strong>').appendTo($('#name-search')),
            $('<strong>' + local.phone + '</strong>').appendTo($('#phone-search')),
            $('<img src="images/' + avatar + '">').appendTo($('#image-search'))	
        });
    })(jQuery);
}



