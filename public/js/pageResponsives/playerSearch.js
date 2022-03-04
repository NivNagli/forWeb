const playersFormButton = document.querySelector('.button');
onClickSearchEvent(playersFormButton, 0);  // This method come from the pagebuilder.js file.



/* Old appraoch leaving for reference, i took this protocol which i also common in the 'compare' action and make method for him */
// playersFormButton.addEventListener('click', function (e) {
//     const usernameInputs = document.querySelectorAll('.username-input');
//     const radioInputs = document.querySelectorAll('input[type="radio"');
//     console.log(usernameInputs);
//     console.log(radioInputs);
//     const usernames = [];
//     const platforms = [];
//     if(!usernameInputs.length) {
//         document.querySelector('.players-data__container').action = document.querySelector('.players-data__container').action + '/' + 'bad-input';
//         return;
//         // return;
//     }
//     /* Extract the info from the inputs components */
//     for(let i = 0 ; i < usernameInputs.length; i++) {
//         usernames.push(usernameInputs[i].value);
//         console.log(usernameInputs[i].value);
//     }
//     for(let j = 0 ; j < radioInputs.length; j++) {
//         if(radioInputs[j].checked) {
//             console.log(radioInputs[j].value);
//             platforms.push(radioInputs[j].value);
//         }
//     }
//     /* Need to convert a new url path to make sure we have diffrents url's to each search action */
//     let newParam = buildResultPath(usernames, platforms);
//     console.log(newParam);
//     document.querySelector('.players-data__container').action = document.querySelector('.players-data__container').action + '/' + newParam;
//     console.log(document.querySelector('.players-data__container').action);
// });


// const buildResultPath = (usernameArray, platformArray) => {
//     let resultPath = '';
//     const innerTokenizer = '-';
//     const outerTokenizer = '--';
//     for(let i = 0 ; i < usernameArray.length ; i++) {
//         if(usernameArray[i]) {
//             resultPath += usernameArray[i];
//         }
//         resultPath += innerTokenizer;
//         if(platformArray[i]) {
//             resultPath += platformArray[i];
//         }
//         if((i + 1) != usernameArray.length) {
//             resultPath += outerTokenizer;
//         }
//     }
//     return resultPath;
// };


