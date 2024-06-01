const CATAAS = 'https://cataas.com/cat';

const retrieveCatURL = async () => {

	console.log('retrieving cat');
	// consulted 
	const response = await fetch(CATAAS);
	/* consulted 
	 	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
		https://developer.mozilla.org/en-US/docs/Web/API/Response
		https://developer.mozilla.org/en-US/docs/Web/API/Response/url
	*/
	const catImage = await response.blob();
	return URL.createObjectURL(catImage);
	
}

const displayCat = (url) => {
	console.log('displaying cat ', url);
	const mugshotImgEl = document.getElementById('mugshot');
	mugshotImgEl.src = url;
	mugshotImgEl.display = 'visible';
}
 
// Self executing function to display the initial cat
(() => {
	console.log('fetching the initial cat!');
	retrieveCatURL().then(displayCat);
})();
