
createCompareSearchPage({
    mainContainerClassName: '.players-pick',
    onSelectMethod: (e) => {
        document.querySelector(".players-data__input").innerHTML = ''; // clear the previous container in case we have one.
        // console.log(e.target.options[e.target.selectedIndex].value);
        // console.log("0" === e.target.options[e.target.selectedIndex].value);
        let numberOfUsers = getPlayerNum(e.target.id);
        if (!numberOfUsers) {  // if the user didnt select any number of users from the players select
            return;
        }
        buildUserForms(numberOfUsers);
    }
});

const buildUserForms = (formNum) => {
    for (let i = 0; i < formNum; i++) {
        let div = document.createElement('div');
        div.innerHTML = dataFormBuilder(i);
        div.classList.add('player-data__container');
        // console.log(div);
        document.querySelector(".players-data__input").appendChild(div);
    }
};


const dataFormBuilder = (i) => {  // in order to make each form diffrent we will use a 'outside' variable that will help us.
    return `    <div class="player-data__info"> 
                    <div class='platform-pick'>
                        <div class="radio-group">
                        <input type="radio" id='battle${i.toString()}' name="selector${i.toString()}" value='battle'><label for='battle${i.toString()}'>Battle.net</label><input type="radio"  id='psn${i.toString()}' name="selector${i.toString()}" value='psn'><label for='psn${i.toString()}'>Playstation</label><input type="radio"  id='xbl${i.toString()}' name="selector${i.toString()}" value='xbox'><label for='xbl${i.toString()}'>Xbox</label>
                        </div>
                        <div class="username">
                        <input  class="input is-rounded username-input" type="text" placeholder="Platform Username" name="username"> 
                        </div>
                    </div>
                </div>`;
}

const getPlayerNum = (targetVal) => {
    /* Help function the will help us to determinate how many players the user chose to search */
    if(targetVal === 'two-players') return 2;
    if(targetVal === 'three-players') return 3;
    if(targetVal === 'four-players') return 4;
    return 0;
};
