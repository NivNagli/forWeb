/* This script will take care of producing a table for us based on the data sent to it in arguments. */

const buildTableView = (thAndtdClasses, theadTextsArray, tbodyTextsArrays, mainHeaderText) => {
    /* Explanation for arguments : 
    thAndtdClasses: This classes will be written to the table headers object and their name depends on the css file.

    theadTextsArray: This array will contain the titles of each column.

    tbodyTextsArrays: is an array of arrays where in each internal array the members are arranged according to their position in the row,
    For example, the first array is of the first row and the item in index 0 will have the first word in this row.
    
    mainHeaderText: The main header text for the table

    example be awere for the arguments per location in the function: 
    buildTableView(['nick', 'dataCell'], ['mode', ''], [['Lifetime', 2850], ['This Week', 350], ['solo' , 50],['duos' , 50], ['Trios' , 50] ], 'Kills');
    */

    const leaderboard = buildLeaderboardDiv();
    leaderboard.appendChild(buildHeader(mainHeaderText));
    const table = document.createElement('table');
    table.classList.add('compare-result-table');
    table.appendChild(buildTableThead(theadTextsArray, thAndtdClasses));
    table.appendChild(buildTableTbody(tbodyTextsArrays, thAndtdClasses));
    leaderboard.appendChild(table);
    return leaderboard;
};

const buildLeaderboardDiv = () => {
    const leaderboard = document.createElement('div');
    leaderboard.classList.add('leaderboard');
    return leaderboard;
};

const buildHeader = (headerText) => {
    const header = document.createElement('header');
    const h1 = document.createElement('h1');
    header.classList.add('compare-result-header')
    h1.classList.add('comapre-result-h1');
    h1.innerText = headerText;
    header.appendChild(h1);
    return header;
}; 

const buildTableThead = (theadTextsArray, thAndtdClasses) => {
    const headersGroup = document.createElement('thead');
    headersGroup.classList.add('compare-result-thead');
    const headersRow = document.createElement('tr');
    headersRow.classList.add('compare-result-tr');
    theadTextsArray.forEach((header, index) => {
        let tableCell = document.createElement('th');
        tableCell.classList.add('compare-result-th');
        tableCell.classList.add(thAndtdClasses[index]);
        tableCell.innerText = header;
        headersRow.appendChild(tableCell);
    });
    headersGroup.appendChild(headersRow);
    return headersGroup;
};

const buildTableTbody = (tbodyTextsArrays, thAndtdClasses) => {
    const bodyGroup = document.createElement('tbody');
    bodyGroup.classList.add('comapre-result-tbody');
    tbodyTextsArrays.forEach((textArray, index) => {
        let row = document.createElement('tr');
        row.classList.add('comapre-result-tr');
        row.classList.add(('place' + (index + 1).toString()));
        textArray.forEach((text, index) => {
            let rowCell = document.createElement('td');
            rowCell.classList.add('comapre-result-td');
            rowCell.classList.add(thAndtdClasses[index]);
            rowCell.innerText = text;
            row.appendChild(rowCell);
        });
        bodyGroup.appendChild(row);
    });
    return bodyGroup;
};
