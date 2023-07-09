/* Base URL of the web-service for the current user and access token */
const backend = "http://localhost:3000";//"https://cawrest.osc-fr1.scalingo.io"; //"https://cawrest.ensimag.fr" // replace by the backend to use
const token = "eyJhbGciOiJIUzI1NiJ9.c29ub3Rh.Wae9bbdrKL2RYSaDKj-St6JUvsdduTOww6b07cYyN0s";//"eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoic29ub3RhIiwiZGVsZWciOiJub3QtZGVmaW5lZCJ9.iW4fXsiE67dW2UhCS6z7DIZDsOo0gZ8eN0mM0AfN_SU";
const wsBase = `${backend}/bmt/sonota/`;

/* Shows the identity of the current user */
function setIdentity() {
	//TODO 1
	const who = "/whoami"
	const url = new URL(backend+who);
	// On récupère le login depuis le serveur avec une requête get
	fetch(url, {
		method:'GET',
		headers:{'x-access-token':token} //permet au serveur de nous identifier
	})                     
	.then(res=>res.json()) 
	.then(json=>{
		// Afficher le login sur la page html          
		const user = json.data; // un seul élément dans data: le login
		document.querySelector("h1 .identity").textContent = user;
	})
		
        //    .catch(error==>{
			
			//    })  

}

/* Sets the height of <div id="#contents"> to benefit from all the remaining place on the page */
function setContentHeight() {
	let availableHeight = window.innerHeight
	availableHeight -= document.getElementById("contents").offsetTop
	availableHeight -= 2 * document.querySelector('h1').offsetTop
	availableHeight -= 4 * 1
	document.getElementById("contents").style.height = availableHeight + "px"
}


/* Selects a new object type : either "bookmarks" or "tags" */
function selectObjectType(type) {
	// TODO
	console.log("type " + type);
	// On récupère le type actuellement affiché
	const menu = document.querySelectorAll("#menu li");
	let current;
	let other;
	for(let i=0; i<menu.length; i++){
		// if(element.className == "selected"){
		// 	current = element;
		// }
		// else{
		// 	other = element;
		console.log(menu[i]);
		if(menu[i].classList[1] == "selected"){
			current = menu[i];
		}
		else{
			other = menu[i];
		}
	}
	if(!current || (type != current.classList[0])){
		console.log("do");
		if(current){
			current.classList.remove("selected");
		}
		other.classList.add("selected");
		const tags = document.querySelector("#add .tag");
		let bookmarks = document.querySelector("#add .bookmark");
		// const tagsInputs = document.querySelector("#add .tag");
		switch(type){
			case "bookmarks":
				listBookmarks();
				if(!bookmarks){
					bookmarksInputs(); // Créé les input dans un div "bookmark" dans add
				}
				tags.classList.remove("selected");
				tags.setAttribute("visibility", "none");
				bookmarks = document.querySelector("#add .bookmark"); // On refait un query ici car initialement bookmarks peut etre null
				bookmarks.classList.add("selected");
				bookmarks.setAttribute("visibility", "content");

				break;
			case "tags":
				listTags();
				tags.classList.add("selected");
				tags.setAttribute("visibility", "content");
				if(bookmarks){
					console.log("bookmark inputs hidden");
					bookmarks.setAttribute("visibility", "none");
					bookmarks.classList.remove("selected");
				}
				break;
		}
	}
	// else{
	// 	console.log("do nothing");
	// }
}
	

/* Loads the list of all bookmarks and displays them */
function listBookmarks() {
	console.log("listBookmarks called")
	//TODO
	const items = document.getElementById("items");
	items.textContent = ""; //vider l'éventuel contenu
	let bookmarksUrl = "bookmarks";
	const url = new URL(wsBase+bookmarksUrl);
	fetch(url, {
		method:'GET',
		headers:{'x-access-token':token} //permet au serveur de nous identifier
	})                     
	.then(res=>res.json()) 
	.then(json=>{
		// console.log(json);
		let bookmarks = json.data;    
		for(let i=0; i<bookmarks.length; i++){
			createBookmarkHTML(bookmarks[i]); // Création du code pour chaque objet de la liste de tags
		}
		
	})
}

/* Loads the list of all tags and displays them */
function listTags() {
	console.log("listTags called")
	const items = document.getElementById("items");
	items.textContent = ""; //vider l'éventuel contenu
	const textBox = document.querySelector("#add .tag input[name='name']");
	textBox.value = ""; //vider le contenu de la zone de texte
	const tagsUrl = "tags";
	const url = new URL(wsBase+tagsUrl);
	fetch(url, {
		method:'GET',
		headers:{'x-access-token':token} //permet au serveur de nous identifier
	})                     
	.then(res=>res.json()) 
	.then(json=>{
		// console.log(json);
		let tags = json.data;    
		for(let i=0; i<tags.length; i++){
			createTagHTML(tags[i]); // Création du code pour chaque objet de la liste de tags
		}
		
	})
		
        //    .catch(error==>{
			
			//    })  

}
/* Creates the HTML code for a tag @param: obj */
function createTagHTML(obj){
	const modele = document.querySelector(".tag");
	let newTag = modele.cloneNode(true); // copie du modèle
	const title = newTag.querySelector("h2");
	title.textContent = obj.name; // copie du nom du tag dans le titre
	newTag.setAttribute("num", obj.id); // ajout attribut num qui vaut l'id du tag
	// newTag.appendChild(title);
	newTag.classList.remove("model");
	newTag.classList.add("item");
	const items = document.getElementById("items");
	items.appendChild(newTag); 
}

/* Creates the HTML code for a bookmark @param: obj */
function createBookmarkHTML(obj){
	console.log("create bookmark");
	const modele = document.querySelector(".bookmark");
	let newBookmarks = modele.cloneNode(true);
	const title = newBookmarks.querySelector("h2");
	title.textContent = obj.title;
	const link = newBookmarks.querySelector("a");
	link.setAttribute("href", obj.link);
	const description = newBookmarks.querySelector(".description");
	description.textContent = obj.description;  
	newBookmarks.setAttribute("num", obj.id); // ajout attribut num qui vaut l'id du bookmark
	newBookmarks.classList.remove("model");
	newBookmarks.classList.add("item");
	let tags = newBookmarks.querySelector(".tags");
	// Création du code pour les differents tags du bookmark
	console.log(obj.tags);
	for(let i=0; i<obj.tags.length; i++){
		let li = document.createElement("li");
		li.textContent = obj.tags[i].name;
		tags.append(li);
	}
	const items = document.getElementById("items");
	items.appendChild(newBookmarks); 
}

/* Adds a new tag */
function addTag() {
	//TODO
	const tag = document.querySelector(".tag input[name='name']");
	if(tag.value.length == 0){
		alert("Tag vide!");
	}
	else{
		let dataValue = JSON.stringify({name: tag.value});//"{" + "\"name\"" + ":"+ "\"" + tag.value + "\""+"}";
		const bodyVal =  new URLSearchParams({data: dataValue});
		// console.log(bodyVal);
		const tags = "tags";
		const url = new URL(wsBase+tags);
		// console.log(url);
		fetch(url, {
			method:'POST',
			headers:{'x-access-token':token, "Content-Type": "application/x-www-form-urlencoded" 
			}, 
			body: bodyVal
		})                     
		.then(listTags) 
		
			
			//    .catch(error==>{
				
				//    })  
		}

}

function addBookmark() {
	console.log("add bookmark called");
	const titre = document.querySelector(".bookmark input[name='title']");
	const lien = document.querySelector(".bookmark input[name='link']");
	const desc = document.querySelector(".bookmark input[name='description']");
	const tagsText = document.querySelector(".bookmark input[name='tags']");


	if(titre.value.length == 0 || lien.value.length == 0){
		alert("Ce champ ne peut être vide!");
	}
	else{
		// Construction du bookmark en JSON
		// On parse la liste de tags (si non vide)
		let tagsArray = [];
		if(tagsText){
			const words = tagsText.value.split(','); // On reconnait les tags comme mots séparés par des virgules
			tagsArray = words.map(word => word.trim()); // On supprime tout espace eventuel
		}
		let dataValue = JSON.stringify({title: titre, link: lien, description: desc, tags: tagsArray});//"{" + "\"name\"" + ":"+ "\"" + tag.value + "\""+"}";
		const bodyVal =  new URLSearchParams({data: dataValue});
		// console.log(bodyVal);
		const bookmarksUrl = "bookmarks";
		const url = new URL(wsBase+bookmarksUrl);
		// console.log(url);
		fetch(url, {
			method:'POST',
			headers:{'x-access-token':token, "Content-Type": "application/x-www-form-urlencoded" 
			}, 
			body: bodyVal
		})                     
		.then(listBookmarks) 
		
			
			//    .catch(error==>{
				
				//    })  
		}

}

/* Displays the textboxes and buttons to create a bookmark */
function bookmarksInputs() {
	console.log("bookmarks inputs called");
	const add = document.getElementById("add");
	const inputs = document.createElement("div");
	inputs.classList.add("bookmark");
	// Titre
	const title = document.createElement("input");
	title.setAttribute("name", "title");
	title.setAttribute("placeholder", "Title");
	title.setAttribute("type", "text");
	inputs.appendChild(title);
	// Lien
	const link = document.createElement("input");
	link.setAttribute("name", "link");
	link.setAttribute("placeholder", "Link");
	link.setAttribute("type", "text");
	inputs.appendChild(link);
	// Description
	const description = document.createElement("input");
	description.setAttribute("name", "description");
	description.setAttribute("placeholder", "Description");
	description.setAttribute("type", "text");
	inputs.appendChild(description);
	// Tags
	// Une première implémentation consiste à écrire la liste des tags séparés par des virgules ,
	const tags = document.createElement("input");
	tags.setAttribute("name", "tags");
	tags.setAttribute("placeholder", "Liste des tags séparés par des ,");
	tags.setAttribute("type", "text");
	inputs.appendChild(tags);
	// Bouton
	const bouton = document.createElement("input");
	bouton.setAttribute("name", "addBookmark");
	bouton.setAttribute("value", "Add Bookmark");
	bouton.setAttribute("type", "button");
	inputs.appendChild(bouton);
	bouton.addEventListener("click", addBookmark, false);
	add.appendChild(inputs);
}

/* Handles the click on a tag */
function clickTag(tag) {
	//TODO
	const title = tag.querySelector("h2");
	let tags = document.getElementById("items");
	// let children = tags.children;
	if(tag.classList[2] != "selected"){
		for(let i=0; i<tags.childElementCount; i++){
			if(tags.children[i].classList[2]=="selected"){ // On sait que selected est en 3ème position après tag et item
				tagUnselect(tags.children[i]);
				// console.log(tag);
				// console.log(tags.children[i]);
				// console.log(tag == tags.children[i]);
			}
		}
		console.log("test");
		tag.classList.add("selected");
		// title.hidden; // on cache le titre
		title.style.display = "none"; // on cache le titre
		// Création du champ de saisie
		let champ = document.createElement("input");
		champ.setAttribute("name", "champ");
		champ.setAttribute("type", "text");
		champ.setAttribute("value",title.textContent);
		tag.appendChild(champ);
		// Bouton modify name
		let modify = document.createElement("input");
		modify.setAttribute("name", "modifyTag");
		modify.setAttribute("value", "Modify");
		modify.setAttribute("type", "button");
		// modify.textContent = "Modify name";
		tag.appendChild(modify);
		// Bouton remove tag
		let remove = document.createElement("input");
		remove.setAttribute("name", "removeTag");
		remove.setAttribute("value", "Remove");
		remove.setAttribute("type", "button");
		// remove.textContent = "Remove tag";
		tag.appendChild(remove);
		// Action des boutons
		modify.addEventListener("click", modifyTag, false);
		remove.addEventListener("click", removeTag, false);

	}
	// else{
	// 	console.log("do nothing");
	// }
}
// Remove the html code for tag edition of the old selected tag
function tagUnselect(tag){
	console.log("tag unselectd!");
	tag.classList.remove("selected");
	const title = tag.querySelector("h2");
	title.style.display = "contents"; // on cache le titre
	// Suppression du champ de saisie + boutons
	for(let i=0; i<3; i++){
		tag.removeChild(tag.lastChild);
	}
	
}

/* Performs the modification of a tag */
function modifyTag() {
	//TODO 8
	// Choix du bon tag
	let tag;
	console.log("modify called");
	let tags = document.getElementById("items");
	for(let i=0; i<tags.childElementCount; i++){
		if(tags.children[i].classList[2]=="selected"){ // On sait que selected est en 3ème position après tag et item
			tag = tags.children[i]; // Le tag que l'on veut modifier
		}
	}
	let tagValue = tag.querySelector("input[name='champ']");
	console.log(tagValue);
	// Envoi de la requete
	let dataValue = JSON.stringify({name: tagValue.value});
	const bodyVal =  new URLSearchParams({data: dataValue});
	// console.log(bodyVal);
	const tagsNameUrl = "tags";
	const id = "/" + tag.getAttribute("num");
	const url = new URL(wsBase+tagsNameUrl+id);
	console.log(url);
	fetch(url, {
		method:'PUT',
		headers:{'x-access-token':token, "Content-Type": "application/x-www-form-urlencoded" 
		}, 
		body: bodyVal
	})                     
	.then(listTags) 
	
		
		//    .catch(error==>{
			
			//    })  
}

function modifyBookmark(){
	// TODO
	console.log("modify bookmarks called");
}


/* Removes a tag */
function removeTag() {
	//TODO 9
	console.log("remove tag called");
	// Choix du bon tag
	let tag;
	let tags = document.getElementById("items");
	for(let i=0; i<tags.childElementCount; i++){
		if(tags.children[i].classList[2]=="selected"){ // On sait que selected est en 3ème position après tag et item
			tag = tags.children[i]; // Le tag que l'on veut modifier
		}
	}
	
	// console.log(bodyVal);
	const tagsNameUrl = "tags";
	const id = "/" + tag.getAttribute("num");
	const url = new URL(wsBase+tagsNameUrl+id);
	console.log(url);
	fetch(url, {
		method:'DELETE',
		headers:{'x-access-token':token, "Content-Type": "application/x-www-form-urlencoded" 
		}, 
	})                     
	.then(listTags) 
	
		
		//    .catch(error==>{
			
			//    })  
}
/* This function removes the selected bookmark */
function removeBookmark() {
	console.log("remove bookmark called");
	// Choix du bon bookmark
	let bookmark;
	let bookmarks = document.getElementById("items");
	for(let i=0; i<bookmarks.childElementCount; i++){
		if(bookmarks.children[i].classList[2]=="selected"){ // On sait que selected est en 3ème position après bookmark et item
			bookmark = bookmarks.children[i]; // Le bookmark que l'on veut modifier
		}
	}
	
	// console.log(bodyVal);
	const bookmarksNameUrl = "bookmarks";
	const id = "/" + bookmark.getAttribute("num");
	const url = new URL(wsBase+bookmarksNameUrl+id);
	console.log(url);
	fetch(url, {
		method:'DELETE',
		headers:{'x-access-token':token, "Content-Type": "application/x-www-form-urlencoded" 
		}, 
	})                     
	.then(listBookmarks) 
	
		
		//    .catch(error==>{
			
			//    })  
}


function clickBookmark(bookmark){
	const title = bookmark.querySelector("h2");
	let bookmarks = document.getElementById("items");
	// let children = tags.children;
	if(bookmarks.classList[2] != "selected"){
		for(let i=0; i<bookmarks.childElementCount; i++){
			if(bookmarks.children[i].classList[2]=="selected"){ // On sait que selected est en 3ème position après tag et item
				tagUnselect(bookmarks.children[i]);
				// console.log(tag);
				// console.log(tags.children[i]);
				// console.log(tag == tags.children[i]);
			}
		}
		// console.log("test");
		bookmark.classList.add("selected");
		// title.hidden; // on cache le titre
		title.style.display = "none"; // on cache le titre
		// Création du champ de saisie
		let champ = document.createElement("input");
		champ.setAttribute("name", "champ");
		champ.setAttribute("type", "text");
		champ.setAttribute("value",title.textContent);
		bookmark.appendChild(champ);
		// Bouton modify name
		let modify = document.createElement("input");
		modify.setAttribute("name", "modifyBookmark");
		modify.setAttribute("value", "Modify");
		modify.setAttribute("type", "button");
		// modify.textContent = "Modify name";
		bookmark.appendChild(modify);
		// Bouton remove tag
		let remove = document.createElement("input");
		remove.setAttribute("name", "removeTag");
		remove.setAttribute("value", "Remove");
		remove.setAttribute("type", "button");
		// remove.textContent = "Remove tag";
		bookmark.appendChild(remove);
		// Action des boutons
		modify.addEventListener("click", modifyBookmark, false);
		remove.addEventListener("click", removeBookmark, false);

	}
}

/* On document loading */
function miseEnPlace() {

	/* Give access token for future ajax requests */
	// Put the name of the current user into <h1>
	setIdentity()
	// Adapt the height of <div id="contents"> to the navigator window
	setContentHeight()
	window.addEventListener("resize",setContentHeight)
	// Listen to the clicks on menu items
	for (let element of document.querySelectorAll('#menu li')){
		element.addEventListener('click',function() {
			const isTags = this.classList.contains('tags')
			selectObjectType(isTags ? "tags" : "bookmarks")
		},false)
	}
	// Initialize the object type to "tags"
	selectObjectType("tags")
	// Listen to clicks on the "add tag" button

	document.getElementById("addTag").addEventListener("click",addTag,false)
	document.getElementById("items").addEventListener("click",(e)=>{
			// Listen to clicks on the tag items
			const tag = e.target.closest(".tag.item")
			if (tag !== null) {clickTag(tag);return}
			// Questions 10 & 12 - Listen to clicks on bookmark items
			const bookmark = e.target.closest(".bookmark.item")
			if (bookmark !== null) {clickBookmark(bookmark)}
		}
		,false)
}
window.addEventListener('load',miseEnPlace,false)
