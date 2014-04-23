$(document).ready(function() {
	
	$("body").css("display", "none");

    $("body").fadeIn(2000);
    
	$("#transition").on('submit', function(event){
		event.preventDefault();
		//linkLocation = this.href;
		var data = $("#transition :input").serializeArray();
		var pass = data[0].value;
		if(pass == "")
			toastr.error("", "Must enter heat map key!");
		else if(pass == "scarlet"){
			toastr.success("redirecting...", "Correct Key!");
			linkLocation = "suiteindex.html";
			setCookie("accesskey", pass, 7);
			$("body").fadeOut(1000, redirectPage);	
		} else {
			toastr.error("", "Incorrect Key");
		}	
	});
		
	function redirectPage() {
		//history.pushState({}, "",linkLocation);

		window.location = linkLocation;
	}
	
	function setCookie(cname,cvalue,exdays)
	{
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}
});


//
