$(document).ready(function () {
	
	var names = ["Люди", "Человек в высоком замке", "Викинги", "Черное зеркало"];	
	
	var listns = document.getElementById('list'); 
	var listlf = document.getElementById('list_lost'); 
	
	var newOLns = document.createElement('ol');
	newOLns.setAttribute("ID", "resultListns");
	listns.appendChild(newOLns);
	
	var newOLlf = document.createElement('ol');
	newOLlf.setAttribute("ID", "resultListlf");
	listlf.appendChild(newOLlf);
	
	//newstudio
	ns = new XMLHttpRequest();
	ns.open("GET", "http://newstudio.tv/", true);
	ns.send(null);
	ns.onreadystatechange = function() {
		if (ns.readyState == 4) 
		{
			if (ns.responseText) 
			{
				var doc = document.implementation.createHTMLDocument("http://newstudio.tv/");
				doc.documentElement.innerHTML = ns.responseText;

				var elements = doc.querySelectorAll('.date, .torrent'); //all elements
				var seriesToDay = $('div.date:eq(0)',doc).nextUntil($('div.date:eq(1)',doc)); 
			
				$.each(seriesToDay, function(){
					for(var i = 0; i < names.length; i++){			
						if($(this).is(':contains("'+names[i]+'")')){
							var newLi = document.createElement('li');
							var fullName = $(this).children('.tdesc').text().trim();							
							newLi.innerHTML = "<a href='#'>" + fullName.substring(0, fullName.indexOf('/')) + "</a>";
							newOLns.appendChild(newLi);						
						}	
					}	
				});
				
				var date = $('.date:first', ns.responseText).children('span').html();// date of last series
				var content = '<b>Date of last series :</b> ' + date + '<br>';
				
			  	$('#wrapper').html(content);
			}
			else //if we have some connection error
			{
				var content = '<b>Connection Error</b> <br>';				
				$('#wrapper').html(content);
			}
		}
	}
	
	//lostfilm
	var today = formatDate(new Date());
	lf = new XMLHttpRequest();
	lf.open("GET", "https://www.lostfilm.tv/browse.php", true);
	lf.send(null);
	lf.onreadystatechange = function() {
		if (lf.readyState == 4) 
		{
			if (lf.responseText) 
			{
				var doc = document.implementation.createHTMLDocument("https://www.lostfilm.tv/browse.php");
				doc.documentElement.innerHTML = lf.responseText;

				var elements = doc.querySelectorAll('.content_body'); //all elements
				for(var i = 0; i < elements[0].childElementCount; i++)
				 for(var j = 0; j < names.length; j++){							
						if((elements[0].children[i].innerText.indexOf(today)+1) && (elements[0].children[i-5].innerText == names[j]))
						{
							var newLi = document.createElement('li');
							var lfSeries = elements[0].children[i-6].innerText.trim(); // full series and episode number
							var lfS = lfSeries.substring(0, 2); // series number
							var lfE = lfSeries.substring(3); // episode number
							var lfNameOfS = elements[0].children[i-5].innerText; // name of series 							
							
							newLi.innerHTML = "<a href='#'>" +lfNameOfS+ " (Сезон "+lfS+", Серия " +lfE+ ")" + "</a>";
							newOLlf.appendChild(newLi);	
						}
					}				

				var date = elements[0].children[6].innerText.substring(0, 10); // date of last series
				var content = '<b>Date of last series :</b> ' + date + '<br>';
				
			  	$('#wrapper_lost').html(content);
			}
			else //if we have some connection error
			{
				var content = '<b>Connection Error</b> <br>';				
				$('#wrapper_lost').html(content);
			}
		}
	}
});

/***
Format the date output
***/
function formatDate(date) {

  var dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  var mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  var yy = date.getFullYear(); 

  return dd + '.' + mm + '.' + yy;
}