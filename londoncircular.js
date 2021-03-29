var map;
		var properties = [];
		var textareaText = "";
		var properties = JSON.parse(window.sessionStorage.getItem('properties')) || [];
		var textarea = document.getElementById("wpforms-474-field_5");


		function initMap() {
				
			map = new google.maps.Map(document.getElementById('map'), {
				zoom: 12,
				center: {lat: 51.507351, lng: -0.127758}
			});

			map.data.addListener('click', function(event) {
				var name = event.feature.getProperty('Name');
				var houses = event.feature.getProperty('houses');
				var price = event.feature.getProperty('price');
				
				if(event.feature.getProperty('isColorful') == undefined){
					event.feature.setProperty('isColorful', true);
					var dodajRed = name + ' - ' + houses + ' houses' + '\n';
					textareaText += dodajRed;
					document.getElementById("wpforms-474-field_5").value = textareaText;
					addProperty(name,houses,price);
				} else {
					event.feature.setProperty('isColorful', undefined);
					var obrisiRed = name + ' - ' +houses + ' houses' +'\n';
					textareaText = textareaText.replace(obrisiRed, '');
					document.getElementById("wpforms-474-field_5").value = textareaText;
					deleteInContentWindow(name, houses, price);
				}
			});

			map.data.addListener('mouseover', function(event) {
				map.data.revertStyle();
				map.data.overrideStyle(event.feature, {strokeWeight: 5});
			});

			map.data.addListener('mouseout', function(event) {
				map.data.revertStyle();
			});

			showTableContent();
		}

		function deleteInContentWindow(name, houses, price) {
			properties = properties.filter(function( obj ) {
				return obj.name !== name;
				
			});
			// Uklanjamo selektovanu oblast iz session storeage-a.
			selectedAreas = JSON.parse(window.sessionStorage.getItem("properties"));
			selectedAreas = selectedAreas.filter(function (area) {
				return area.name !== name;
			});
			// Vraćamo u session storage. 
			// Mora da se odradj JSON.stringify inače će u session storage-u završiti kao
			// [Object object] što je bezveze.
			window.sessionStorage.setItem("properties", JSON.stringify(selectedAreas));
			// Prikazujemo tabelu ponovo
			showTableContent();
		}
		
		function addProperty(name,houses,price) {
			var myArea = {"name": name,	"houses": houses, "price": price};
			properties.push(myArea);
			// Dodajemo selektovanu oblast u session storage
			selectedAreas = JSON.parse(window.sessionStorage.getItem("properties")) || [];
			selectedAreas.push(myArea);
			window.sessionStorage.setItem("properties", JSON.stringify(selectedAreas));
			// Prikazujemo tabelu ponovo
			showTableContent();
		}
	
		function openCity(evt, cityName) {
			var i, tabcontent, tablinks;
			tabcontent = document.getElementsByClassName("tabcontent");
			for (i = 0; i < tabcontent.length; i++) {
				tabcontent[i].style.display = "none";
			}
			tablinks = document.getElementsByClassName("tablinks");
			for (i = 0; i < tablinks.length; i++) {
				tablinks[i].className = tablinks[i].className.replace(" active", "");
			}
			document.getElementById(cityName).style.display = "block";
			evt.currentTarget.className += " active";
			
			// Stavljamo izabran plan u storiđ sesiju.
			window.sessionStorage.setItem("plan", cityName);
			// Prikazujemo tabelu ponovo
			showTableContent();
		}

		function sumOperations() {
			var sumHouses = 0;
			var priceSolus = 60;
			var priceSharePlan = 35;

			var dataTable = document.getElementById("myTable");
			var cellsHouses = document.querySelectorAll("td:nth-of-type(2)");
			var cellsPrice = document.querySelectorAll("td:nth-of-type(3)");

			for (var i = 0; i < cellsHouses.length; i++){
				sumHouses += parseFloat(cellsHouses[i].firstChild.data);
			}
			
			var newRow = document.createElement("tr");
			newRow.id = 'sumRow';
				
			var firstCell = document.createElement("td");
			var strongTextNode = document.createElement("strong");
			var firstCellText = document.createTextNode("Summary:");
			strongTextNode.appendChild(firstCellText);
			firstCell.appendChild(strongTextNode);
			newRow.appendChild(firstCell);
		   
			var secondCell = document.createElement("td");
			secondCell.setAttribute("colspan", "2");
			var strongSumNode = document.createElement("strong");
			var secondCellText = document.createTextNode(sumHouses);
			strongSumNode.appendChild(secondCellText);
			secondCell.appendChild(strongSumNode);
			newRow.appendChild(secondCell);
		   
			dataTable.appendChild(newRow);
			
			var priceSolusHtml = "<div class='afterTabsContent'><p>Total houses: " + sumHouses + "</p>";
			priceSolusHtml+="<p>Price from: £60 per thousand</p>";
			priceSolusHtml+="<p id='userTotalPriceSolus' class='b'>Your total price (for solus) from: " + "£" + parseFloat(sumHouses/1000 * priceSolus).toFixed(2) + " + VAT </p></div>";
			priceSolusHtml+="</div>";
			document.getElementById("forSolus").innerHTML = priceSolusHtml;
			
			var priceSharePlanHtml = "<div class='afterTabsContent'><p>Total houses: " + sumHouses + "</p>";
			priceSharePlanHtml+="<p>Price from: £35 per thousand</p>";
			priceSharePlanHtml+="<p id='userTotalPriceShare' class='b'>Your total price (for share plan) from: " + "£" +parseFloat(sumHouses/1000 * priceSharePlan).toFixed(2) + " + VAT </p></div>";
			priceSharePlanHtml+="</div>";
			document.getElementById("forSharePlan").innerHTML = priceSharePlanHtml;

		}
		
		
		function showTableContent(){
			var html = "";
			if ( properties.length > 0) {
				html = "<table id='myTable'><tr><th>Area</th><th colspan='2'>Total houses</th></tr>";
				for (var i = 0; i < properties.length; i++) {
					html += "<tr>";
					html += "<td>" + properties[i].name + "</td>";
					html += "<td>" + properties[i].houses + "</td>";
					html += "<td style='text-align:center; width: 10%; border-left: none;'> " + 
						'<svg onclick="removeArea(\'' + properties[i].name  + '\')" version="1.1" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-167.43 -202.33)"><path transform="matrix(1.1002 0 0 1.0536 -16.642 -21.702)" d="m349.08 307.54c0 52.418-40.693 94.912-90.89 94.912s-90.89-42.494-90.89-94.912 40.693-94.912 90.89-94.912 90.89 42.494 90.89 94.912z" fill="#eaa"/><path transform="matrix(.92055 0 0 .88687 130.82 174.18)" d="m243.71 144.5c0 54.64-42.674 98.934-95.314 98.934-52.641 0-95.314-44.294-95.314-98.934s42.674-98.934 95.314-98.934c52.641 0 95.314 44.294 95.314 98.934z" fill="none" stroke="#fff" stroke-width="5"/><g fill="none" stroke="#fff" stroke-width="21"><path transform="translate(167.43 202.33)" d="m150 50-100 100"/><path transform="translate(167.43 202.33)" d="m50 50 100 100"/></g></g></svg>'						  
						+ " </td>";
					html += "</tr>";
				}
				html+="</table><div id='customText'></div>";
				document.getElementById("main-content").innerHTML = html;
				document.getElementById("tabContainer").style.display = "block";
				sumOperations();

				// Scroll to bottom of the table
				tableContent = document.getElementById("main-content");
				tableContent.scrollTo(0, tableContent.scrollHeight);
			} else {
				html = "<div><p style=\"color: rgb(247, 54, 54);\">No areas selected.</p></div>";
				document.getElementById("main-content").innerHTML = html;
				document.getElementById("tabContainer").style.display = "none"; 
			}
			populateTextArea();
		}

		function populateTextArea()  {
			console.log(document.getElementById('userTotalPriceSolus'));
			if (properties.length > 0) {
				textareaText = "";
				for (var i = 0; i < properties.length; i++) {
					name = properties[i].name;
					houses = properties[i].houses;
					var dodajRed = name + ' - ' + houses + ' houses' + '\n';
					textareaText += dodajRed;
				}
				document.getElementById("wpforms-474-field_5").value = textareaText + "----------------------------\n";

				if (window.sessionStorage.getItem('plan') == "forSolus") {
					totalPriceSolus = document.getElementById('userTotalPriceSolus').textContent;
					document.getElementById("wpforms-474-field_5").value += totalPriceSolus;
				}

				if (window.sessionStorage.getItem('plan') == "forSharePlan")  {
					totalPriceShare = document.getElementById('userTotalPriceShare').textContent;
					document.getElementById("wpforms-474-field_5").value += totalPriceShare;
				}
			
			} else {
				document.getElementById("wpforms-474-field_5").value = "";
			}
		}

		
		
		function empty() {
			//empty your array
			properties = [];
			showTableContent();
		}
	
		function removeArea(areaName) {
			//	Prvo uklanjamo area iz properties-a
			properties = properties.filter( function( area ) {
				return area.name !== areaName;
			});

			// Uklanjamo selektovanu oblast iz session storeage-a.
			selectedAreas = JSON.parse(window.sessionStorage.getItem("properties"));
			selectedAreas = selectedAreas.filter(function (area) {
				return area.name !== areaName;
			});

			// Vraćamo u session storage. 
			window.sessionStorage.setItem("properties", JSON.stringify(selectedAreas));
			
			// Kliknemo na mapu propertija koji je uklonjen da se vidi da je uklonjen 
			// Pošto mapa može da ima 2 ili 1 slovo kao ID, prvo pokušamo da 
			// dobavimo mapu sa 2 slova, ako je nema, onda je sa jednim slovom.
			mapNameTwoLetters = areaName.substring(0,2).toLowerCase();
			mapNameOneLetter = areaName.substring(0,1).toLowerCase();
			if (document.getElementById(mapNameTwoLetters) != null) {
				document.getElementById(mapNameTwoLetters).click()
			} else {
				document.getElementById(mapNameOneLetter).click()
			}

			// Prikazujemo tabelu ponovo
			showTableContent();
		}

		// Add active class to the current button (highlight it)
		var header = document.getElementById("buttons");
		var btns = header.getElementsByClassName("btn");
		
		// If there is selected plan in storage, click 'em.
		if (window.sessionStorage.getItem('plan') == "forSharePlan") {
			document.getElementById("forSharePlanTab").click();
		} else {
			document.getElementById("forSolusTab").click();
		}
		
		for (var i = 0; i < btns.length; i++) {
			btns[i].addEventListener("click", function() {
				var current = document.getElementsByClassName("active");
				current[0].className = current[0].className.replace(" active", "");
				this.className += " active";
				// Ovo mora da se ponovi da bi se podesile acive clase i na tabove.
				if (window.sessionStorage.getItem('plan') == "forSharePlan") {
					document.getElementById("forSharePlanTab").click();
				} else {
					document.getElementById("forSolusTab").click();
				}
			});
		}