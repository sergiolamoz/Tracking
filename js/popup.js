$(document).ready(function () {

	var names = [
		"Гримм", "Стрела", "Радиоволна", "Слепая зона", "Люк Кейдж", "Стрелок", "Люцифер",
	];	
	
	var listns = document.getElementById('list'); 
	var listlf = document.getElementById('list_lost'); 
	var listbb = document.getElementById('list_baibako'); 
	
	var newOLns = document.createElement('ol');
	newOLns.setAttribute("ID", "resultListns");
	listns.appendChild(newOLns);
	
	var newOLlf = document.createElement('ol');
	newOLlf.setAttribute("ID", "resultListlf");
	listlf.appendChild(newOLlf);
	
	var newOLbb = document.createElement('ol');
	newOLbb.setAttribute("ID", "resultListbb");
	listbb.appendChild(newOLbb);
	
	//newstudio
	var ns = new XMLHttpRequest();
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
	var lf = new XMLHttpRequest();
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
							var lfE = lfSeries.substring(3);  // episode number
							var lfNameOfS = elements[0].children[i-5].innerText; // name of series 							
							
							if(lfE.indexOf("сезон")+1) //if it's full season 
							{
								newLi.innerHTML = "<a href='#'>" +lfNameOfS+ " (Сезон "+lfS+")" + "</a>";
							}
							else //if it's not a full season
								newLi.innerHTML = "<a href='#'>" +lfNameOfS+ " (Сезон "+lfS+", Серия " +lfE+ ")" + "</a>";
								
							newOLlf.appendChild(newLi);	
						}
					}				

				var dateWithTime = elements[0].children[6].innerText.trim(); // date of last series
				var date = dateWithTime.substring(0, dateWithTime.indexOf(' ')); // date of last series
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
	
	//baibako
	var options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timezone: 'UTC'
	};
	
	var ruDate = new Date().toLocaleDateString("ru", options);
	var bbDate = ruDate.substring(0, ruDate.indexOf('г.'));

	var bb = new XMLHttpRequest();
	bb.open("GET", "http://baibako.tv/browse.php", true);
	bb.send(null);
	bb.onreadystatechange = function() {
		if (bb.readyState == 4) 
		{
			if (bb.responseText) 
			{
				var doc = document.implementation.createHTMLDocument("http://baibako.tv/browse.php");
				doc.documentElement.innerHTML = bb.responseText;

				var elements = doc.querySelectorAll('#highlighted');//all elements

				for(var i = 0; i < elements[0].childElementCount; i++)
				 for(var j = 0; j < names.length; j++){							
						if((elements[0].children[i].children[1].innerText.indexOf(bbDate)+1) && (elements[0].children[i].children[1].innerText.indexOf(names[j])+1) &&
							(elements[0].children[i].children[1].innerText.indexOf("WEB-DLRip x264")+1))
						{
							var newLi = document.createElement('li');
							var bbSeries = elements[0].children[i].children[1].innerText.trim();// full series and episode number and date
							var bbNameOfS = bbSeries.substring(0, bbSeries.indexOf('/'));  // name of series 
							var bbNameAndSeriesNumber = bbSeries.match(/s.([0-9]+)e.([0-9]+)/ig); // find the type construct like this -  s01e01 
							var bbS = bbNameAndSeriesNumber[0].substring(1, 3); // series number
							var bbE = bbNameAndSeriesNumber[0].substring(4); // episode number		
							
							newLi.innerHTML = "<a href='#'>" +bbNameOfS+ " (Сезон "+bbS+", Серия " +bbE+ ")" + "</a>";
							newOLbb.appendChild(newLi);	
						}
					}			
				
				var fullStringBB = doc.querySelector('small').innerHTML; 	
				var date = formatDateBB(fullStringBB); // date of last series	
				var content = '<b>Date of last series :</b> ' + date + '<br>';
				
			  	$('#wrapper_baibako').html(content);
			}
			else //if we have some connection error
			{
				var content = '<b>Connection Error</b> <br>';				
				$('#wrapper_baibako').html(content);
			}
		}
	}
});

/***
Format the date output for lostfilm
***/
function formatDate(date) {

  var dd = date.getDate(); 
  if (dd < 10) dd = '0' + dd;

  var mm = date.getMonth() + 1; 
  if (mm < 10) mm = '0' + mm;

  var yy = date.getFullYear(); 

  return dd + '.' + mm + '.' + yy;
}

/***
Format the date output for baibako
***/
function formatDateBB(date) {

	var begin = date.indexOf(' ');
	var end = date.lastIndexOf(' ');
	var relust = date.substring(begin, end-1).trim();

  return relust;
}