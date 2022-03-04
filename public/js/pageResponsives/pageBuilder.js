/* 
    We will use 'createCompareSearchPage' in the main page of the website, this method recive the 2 arguments:
    'mainContainerClassName': this is the container name in the html that we want to display the forms inside him.
    'onSelectMethod': this is the method that we want to execute when the user click on the select container option.

    i make this method less re-usable because i embade a spesefic inner method called 'onClickSearchEvent',
    in but if i want i can take the code until the stage i use her and make him to work with difrrent inner method.
 */

const createCompareSearchPage = ({
    mainContainerClassName,
    onSelectMethod
}) => {
    selectContainer = document.querySelector(mainContainerClassName);
    if (!selectContainer) return; /* The case the user didnt select the players form yet */
    // console.log(selectContainer);
    selectContainer.addEventListener('change', onSelectMethod);
    const playersFormButton = document.querySelector('.button');
    onClickSearchEvent(playersFormButton, 3);
}

const onClickSearchEvent = (formButton, spareRadioInputsNum) => {
    /* I add the field spareRadioInputsNum because i'm using this method in the search-player option */
    formButton.addEventListener('click', function (e) {
        const usernameInputs = document.querySelectorAll('.username-input');
        const radioInputs = document.querySelectorAll('input[type="radio"');
        console.log(usernameInputs);
        console.log(radioInputs);
        const usernames = [];
        const platforms = [];
        if(!usernameInputs.length) {
            document.querySelector('.players-data__container').action = document.querySelector('.players-data__container').action + '/' + 'bad-input';
            return;
        }
        /* Extract the info from the inputs components */
        for(let i = 0 ; i < usernameInputs.length; i++) {
            usernames.push(usernameInputs[i].value);
            console.log(usernameInputs[i].value);
        }
        for(let j = spareRadioInputsNum ; j < radioInputs.length; j++) {
            if(radioInputs[j].checked) {
                console.log(radioInputs[j].value);
                platforms.push(radioInputs[j].value);
            }
        }
        /* Need to convert a new url path to make sure we have diffrents url's to each search action */
        let newParam = buildResultPath(usernames, platforms);
        document.querySelector('.players-data__container').action = document.querySelector('.players-data__container').action + '/' + newParam;
    });
}


const buildResultPath = (usernameArray, platformArray) => {
    /* Because i want every user will have diffrent result page i need to make for each result a diffrent url,
     * i will use this rules of toknizers to make a unique url for each result. 
     */ 
    let resultPath = '';
    const innerTokenizer = '-';  // the inner toknizer will be between user and his platform.
    const outerTokenizer = '--';  // the outer toknizer will be between diffrents users data.
    for(let i = 0 ; i < usernameArray.length ; i++) {
        if(usernameArray[i]) {
            resultPath += usernameArray[i];
        }
        resultPath += innerTokenizer;
        if(platformArray[i]) {
            resultPath += platformArray[i];
        }
        if((i + 1) != usernameArray.length) {
            resultPath += outerTokenizer;
        }
    }
    return resultPath;
};

/* ============================================================================================================================== */

const createCompareResultPage = ()=> {
    // Because the default is to compare base ranked games we will mark the 'rank' selector
    document.querySelector('#ranked-games').checked = true; 

    let statsArray; 
    /* Will save the retrieved information from the api in the 'statsArray' variable and this is how we will actually 
    reduce the use of the api because once the information is received in this variable we will not refer to the api anymore
    and we will use the information we got through this variable. 
    */

    displayRankedResults().then(res => {statsArray = res});
    
    
    document.querySelector('#ranked-games').addEventListener('click', function() {
        document.querySelector('.players-result__main-div').innerHTML = '';
        displayRankedResults(statsArray);
    });
    
    document.querySelector('#all-games').addEventListener('click', function() {
        console.log(statsArray);
        document.querySelector('.players-result__main-div').innerHTML = '';
        displayAllGamesResults(statsArray);
    });
};

/* ============================================================================================================================== */
