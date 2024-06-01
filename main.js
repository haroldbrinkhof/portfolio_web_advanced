const API_URL = 'https://api.thecatapi.com/v1/images/search'
const PRE_SHIFTED = 'olyhb5MEgiyTvONH;yd5MEN|LFhz]|WDWey:|7uyp{xpXmK]g47y9]qieWPgGr}3ttkDf';
let currentCat;

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
	return source.split('')
		.map((_, position) =>{
			const charCode = source.charCodeAt(position);
			return String.fromCharCode(charCode + addition);})
		.reduce((acc, value) => acc + value);

}

const retrieveCatURL = async () => {

	console.log('retrieving cat');
	// consulted 
	const response = await fetch(API_URL, requestOptions);
	/* consulted 
	 	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
		https://developer.mozilla.org/en-US/docs/Web/API/Response
		https://developer.mozilla.org/en-US/docs/Web/API/Response/url
	*/
//	const catImage = await response.blob();
//	return URL.createObjectURL(catImage);
	const body = await response.json();
	console.log(body);
	currentCat = body[0];
	return currentCat;
	
}

const displayCat = (catData) => {
	console.log('displaying cat ', catData);
	const mugshotImgEl = document.getElementById('mugshot');
	if(mugshotImgEl.style.display === 'block'){
		console.log('adding effects');
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
	console.log("building cats collection");
	const keptCatsContainer = document.getElementById('keptCats');
	keptCatsContainer.innerHTML = ''

	const catCollection = getCatsFromStorage();
	for(const cat of catCollection){
		const catPicture = document.createElement('img');
		catPicture.src = cat.url;
		keptCatsContainer.append(catPicture);
	}
	updateCatCounter(catCollection.length);
}

const rejectCat = () => { 
	console.log('rejecting');
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







// Self executing function to display the initial cat
// adding event handlers to buttons
(() => {
	console.log('fetching the initial cat!');
	retrieveCatURL().then(displayCat);
	document.getElementById('keep').addEventListener('click', keepCat);
	document.getElementById('reject').addEventListener('click', rejectCat);
	showCatsInCollection();
})();


