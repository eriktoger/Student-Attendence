// Javascript till hemsida
/*
Läser in frånvaro i förmatet 
2018-01-23	Engelska 5	1-Okänd orsak	 	08:20	09:40	1:20
 	Samhällskunskap 1b	1-Okänd orsak	 	10:00	11:20	1:20
 	Moderna språk 1 (Franska)	1-Okänd orsak	 	11:30	12:20	0:50
 	Matematik 1b	1-Okänd orsak	 	13:30	14:50	1:20
2018-01-25	Naturkunskap 1b	1-Okänd orsak	 	08:20	09:40	1:20
 	Psykologi 1	1-Okänd orsak	 	10:00	11:20	1:20
 	Matematik 1b	1-Okänd orsak	 	12:00	13:20	1:20
 	Idrott och hälsa 1	1-Okänd orsak	 	13:40	14:40	1:00

	Och sedan tar den ut den ogiltiga frånvaron och konvertar datumet (2018-01-25) till vecka och veckordag.
	All frånvaro för samma dag läggs såklart i hop.
	Frånvaron läggs i en tabell längst ned på sidan.

*/

// nu ska mest koden snyggas till
//sedan är det layout som gäller
// ta 2-3 elever och kontrollera att det stämmer. alternativt skapa ett test för 
// lägga upp den på ett webhotell? reklam?

//$("#tabell").hide(); // gömmer tabellen (den tas fram sen om den inte är tom) annars detta
// https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
 // det  är något galet här
//alert(x.innerHTML); // foundit ! https://stackoverflow.com/questions/2632137/why-is-document-getelementbyid-returning-null
//
window.onload = function () {
    var tabellRef =document.getElementById("tabell");
	tabellRef.style.display="none"; // gömmer tabellen
	var bottenRef =document.getElementById("botten");
	bottenRef.style.display="none"; // gömmer botten
	document.getElementById("franvaro").onclick = function () {
        tom();
    }
	
}

// Returns the ISO week of the date.
// from https://weeknumber.net/how-to/javascript
Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
   date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
 
 return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}




function tom(){
var tabellRef =document.getElementById("tabell");
tabellRef.style.display="none";
var bottenRef =document.getElementById("botten");
bottenRef.style.display="none"; // gömmer botten

var textMassa=document.getElementById("ruta").value;
var lines = textMassa.split("\n");
var antalLines=lines.length;
//var unikaDatum=[];
//var franvaro=[];
//alert(lines.length);


// just nu tar den fram rätt timmar för varje unika datum
// men den tar omvandlar inte detta datum till vecka veckodag
// och inte heller lägger in denna vecka och veckaodag (med tillhörande timmar) i en tabell.
// tabellens veckodagar är fasta. vecka skrivs in i första raden. om ny vecka hittas så skrivs denna in i rad+1
//borde jag ha en map för mina datum?
var datumMap= new Map(); // här i läggs alla datum som keys och frånvaron som value
var sant=false; // tills vi kommer till första datumet så ska inget läsas in
var tempValue =0; // frånvaron börjar på noll

for(i=0;i<lines.length;i++){ // för varje rad i texten
	var rad=lines[i]; // aktuell rad
	var radLangd= rad.length; // kollar så att raden inte är tom
	

	
	if (radLangd>10){ // kollar om raden är tom, 
		var tempKey=rad.substring(0,10);
		var timmar = rad.substring(radLangd-5,radLangd-3); //vad händer om raden är tom?
		//alert(timmar);
		var minuter =rad.substring(radLangd-2,radLangd);
		//alert(minuter);
		if(rad.includes("1-Okänd") | rad.includes("2-Försenad") |rad.includes("3-Avvek")){ // rensar bort allt som inte är ogiltig frånvaro. Kan tyvärr inte används för hela, för tänk om första delen är gilig frånvaro men andra passet ogiltig.
			tempValue+=parseInt(timmar)+parseInt(minuter)/60.0; // den ska uppdateras varje gång men den nollställs sedan när ett nytt datum kommer.
		}
		
		// här borde vara en var gilitg= true om ogiltig orsak, försenad hittades
	// python-koden ser ut så här : if M[i+j].count('1-Okänd') == 1 or M[i+j].count('2-Försenad')==1 or M[i+j].count('3-Avvek') == 1:
		
		if(rad[0]==2){ // om raden börjar med en tvåa så innebär det att det är ett nytt datum samt om det är ogiltig frånvaro, det gör att namnet inte räknas
			if(sant & (oldValue>0)){ // betyder att vi är på nytt datum och det finns ogiltig frånvaro att rapportera
				
				datumMap.set(oldKey,oldValue); // och då ska det gamla tempKey användas men med den accumulerade tempValue
				
				if(rad.includes("1-Okänd") | rad.includes("2-Försenad") |rad.includes("3-Avvek")){ // kollar om datumet är giltig eller ogiltig frånvaro
					tempValue=parseInt(timmar)+parseInt(minuter)/60.0; // ska ju inte nollställas, utan ändras till värdet det får av nuvarande line.
				}
				else{
					tempValue=0; // datumet inte är ogiltig frånvaro så ska tempValue vara noll
				}
				
				
				tabellRef.style.display="inline-block"; // nu har ett datum lagts in och då ska tabllen visas.
				var bottenRef =document.getElementById("botten");
				bottenRef.style.display="block"; // gömmer botten
	
			}
			var oldKey=tempKey; 
			sant=true; // nu har vi passerat första datumet. Detta är en spärr så att inte första datumet läggs in innan alla frånvaro har hitats
			
			//unikaDatum.push(parseInt(timmar)+parseInt(minuter)/60.0);
			 // för när tempValue ha lästs in så ska den tömmas
			//datumMap.set(rad.substring(0,10),(parseInt(timmar)+parseInt(minuter)/60.0)); // skapar ett datum med tillhörande frånvaro
		}	 // borde vi ha els här som lägger på istället för att pusha ett nytt? känns som en bättre lösning än den jag har.
		
		
		var oldValue= tempValue;
	}
 // Nu ska all ogiltig frånvar för varje datum adderas.
}// end if length > 10

if(sant){ // om en 2a är hittad
	datumMap.set(oldKey,oldValue); // i slutet ska detta göras annars missas sista 2an
}
// om sista raden inte innehåller en tvåa (och har en längd) så ska ett sista datum läggas in

 /*for(j=0;j<unikaDatum.length;j++){

		alert(unikaDatum[j]);
	}
	*/
	
/*
*konvertera datumMap.key till datum


*/	
	
	
// här ska en tabell skapas. Eller skapas den i 	
var tableRef = document.getElementById("tabell").getElementsByTagName('tbody')[0]; // hittar min table som senare kommer att utökas
var rowsRef = tableRef.getElementsByTagName('tr'); //används för att ta bort rader om man gör en ny sökning
	
var iterKey = datumMap.keys();
var iterValue = datumMap.values();
	//alert(datumMap.size)
var oldWeek=0;

// tar bort den gamla sökningen
	if (tableRef.rows.length>0){
		while (tableRef.rows.length>0){
			tableRef.removeChild(rowsRef[0]); 
		}
	}

	for(j=0;j<datumMap.size;j++){
		var key = String(iterKey.next().value);
		var value =Math.round(iterValue.next().value*10)/10; //anvrundar till en decimal
		
		var year= key.substring(0,4);
		var month = key.substring(5,7);
		var date = key.substring(8,10);
		//alert(key);
		var veckodag= new Date(year,month-1,date);
		if(oldWeek!=veckodag.getWeek()){
			var row = tableRef.insertRow(-1);
			var cell1 = row.insertCell(0); // vecka
			var cell2 = row.insertCell(1); // måndag
			var cell3 = row.insertCell(2); // tisdag
			var cell4 = row.insertCell(3); // onsdag
			var cell5 = row.insertCell(4); // torsdag
			var cell6 = row.insertCell(5); // fredag
			var cell7 = row.insertCell(6); // lördag
			var cell8 = row.insertCell(7); // söndag
			
			cell1.innerHTML = veckodag.getWeek(); //veckan fylls i
			oldWeek=veckodag.getWeek();
		}
		
		// if-satser så att frånvaron hamnar på rätt ställe
		if(veckodag.getDay()==0){ //söndag fylls i
			cell8.innerHTML=value;
		}
		if(veckodag.getDay()==1){ //måndag fylls i
			cell2.innerHTML=value;
		}
		if(veckodag.getDay()==2){ //tisdag fylls i
			cell3.innerHTML=value;
		}
		if(veckodag.getDay()==3){ // onsdag fylls i
			cell4.innerHTML=value;
		}
		if(veckodag.getDay()==4){  // torsdag fylls i
			cell5.innerHTML=value;
		}
		if(veckodag.getDay()==5){ // fredag fylls i
			cell6.innerHTML=value;
		}
		if(veckodag.getDay()==6){ // söndag fylls i
			cell7.innerHTML=value;
		}
		
		
	}
	//alert("hej");
	//window.location.hash = '#tabell';
	document.getElementById('tabell').scrollIntoView();

}