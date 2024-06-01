const API_URL = 'https://api.thecatapi.com/v1/images/search'
const API_KEY = ''

const headers = new Headers({
  "Content-Type": "application/json",
  "x-api-key": 'live_2JBdfvQsLKE8va2JBKyICewZyTATbv7y4rvmxumUjHZd14v6ZnfbTMdDoz0qqhAc'
});
const requestOptions = {
  method: 'GET',
  headers: headers,
  redirect: 'follow'
};

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
	return body[0];
	
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

const rejectCat = () => { 
	console.log('rejecting');
	retrieveCatURL().then(displayCat);
}
const keepCat = () => console.log('keeping');
 
// Self executing function to display the initial cat
// adding event handlers to buttons
(() => {
	console.log('fetching the initial cat!');
	retrieveCatURL().then(displayCat);
	document.getElementById('keep').addEventListener('click', keepCat);
	document.getElementById('reject').addEventListener('click', rejectCat);
})();
