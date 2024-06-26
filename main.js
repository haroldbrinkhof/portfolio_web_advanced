const API_URL = 'https://api.thecatapi.com/v1/images/search'
const PRE_SHIFTED = 'olyhb5MEgiyTvONH;yd5MEN|LFhz]|WDWey:|7uyp{xpXmK]g47y9]qieWPgGr}3ttkDf';
let currentCat;

// below 2 constructs shamelessly stolen and adapted from http://thecatapi.com/
const headers = new Headers({
  "Content-Type": "application/json",
  "x-api-key": `${shift_characters(PRE_SHIFTED, -3)}`
});
const requestOptions = {
  method: 'GET',
  headers: headers,
  redirect: 'follow'
};

function shift_characters(source, addition = 3){
	// consulted https://www.rapidtables.com/code/text/ascii-table.html
	return source.split('')
		.map((_, position) =>{
			const charCode = source.charCodeAt(position);
			return String.fromCharCode(charCode + addition);})
		.reduce((acc, value) => acc + value);

}

const retrieveCatURL = async () => {

	const response = await fetch(API_URL, requestOptions);
	/* consulted 
	 	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
		https://developer.mozilla.org/en-US/docs/Web/API/Response
		https://developer.mozilla.org/en-US/docs/Web/API/Response/url
	*/
	const body = await response.json();
	currentCat = body[0];
	return currentCat;
	
}

const displayCat = (catData) => {
	const mugshotImgEl = document.getElementById('mugshot');
	if(mugshotImgEl.style.display === 'block'){
		// not first showing fade out current img
		mugshotImgEl.style.transform = 'scale(0.1)';
		mugshotImgEl.style.animation = 'scaleOutKeyframes 2s ease-in 0s 1';
		
		window.setTimeout(() => {

			// consulted https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
			const newImgEl = mugshotImgEl.cloneNode(true);
			mugshotImgEl.parentNode.replaceChild(newImgEl, mugshotImgEl);
			newImgEl.src = catData.url;
			newImgEl.style.transform = 'scale(1)';
			newImgEl.style.animation = 'scaleInKeyframes 2s ease-in 0s 1';
			newImgEl.style.display = 'block'
		}, 1500);

	} else {
		// first showing;
		mugshotImgEl.src = catData.url;
		mugshotImgEl.style.display = 'block';
	}
}

const updateCatCounter = (numberOfCats) => {
	const catCounterEl = document.getElementById('catCounter');
	catCounterEl.innerText = `You have ${numberOfCats} cats in your collection.`;
}

const getCatsFromStorage = () => localStorage.getItem('catCollection') ? JSON.parse(localStorage.getItem('catCollection')) : [];


const showCatsInCollection = () => {
	const keptCatsContainer = document.getElementById('keptCats');
	keptCatsContainer.innerHTML = ''

	const catCollection = getCatsFromStorage();
	for(const cat of catCollection){
		const catPicture = document.createElement('img');
		catPicture.src = cat.url;
		catPicture.addEventListener('click', showStoredCat, true);
		keptCatsContainer.append(catPicture);
	}
	updateCatCounter(catCollection.length);
}

const rejectCat = () => { 
	retrieveCatURL().then(displayCat);
}

const keepCat = () => {
	// add cat to the collection
	// consulted https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
	const catCollection = getCatsFromStorage();
	localStorage.setItem('catCollection', JSON.stringify([currentCat, ...catCollection]));
	retrieveCatURL().then(displayCat);
	showCatsInCollection();
}


const showStoredCat = (event) => {
	
	const showCaseEl = document.getElementById('showCase');
	showCaseEl.lastElementChild.src = event.srcElement.src;
	showCaseEl.style.display = 'block';
}

const hideStoredCatShowWindow = () => {
	const showCaseEl = document.getElementById('showCase');
	showCaseEl.style.display = 'none';
}



// Self executing function to display the initial cat
// adding event handlers to buttons
(() => {
	
	retrieveCatURL().then(displayCat);
	document.getElementById('keep').addEventListener('click', keepCat);
	document.getElementById('reject').addEventListener('click', rejectCat);
	document.getElementById('closeShowCase').addEventListener('click', hideStoredCatShowWindow);
	showCatsInCollection();
})();


