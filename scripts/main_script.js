'use strict'

import {deck} from './cards.js';
import {State, Card, MyError} from './classesJS.js';


let testHandOutBut = document.getElementById('test_hand_out'),
choiceHandOutBtn = document.getElementById('choice_hand_out'),
choiceQuantityOfPlayers = document.getElementById('choice_quantity_of_players'),
choiceFromListBut = document.getElementById('choice_card_from_list'),
backBut = document.getElementById('back'),
handOuts = document.getElementById('hand_out').querySelectorAll('div'),
handOutsRandom = document.getElementById('hand_out_random').querySelectorAll('div'),
yourCards = document.getElementById('your_cards').querySelectorAll('div'),
yourCardsRandom = document.getElementById('your_cards_random').querySelectorAll('div'),
choiceBlock = document.getElementById('choice_block'),
quantityBlock = document.getElementById('quantity_block'),
textOfQuantityOfPlayers = document.getElementById('text_of_quantity_of_players'),
tableOfFreeBlock = document.getElementById('table_of_free_block'),
listBlock = document.getElementById('block_with_list_of_cards'),
allCards = listBlock.querySelectorAll('img'),
tableOfRandomBlock = document.getElementById('table_of_random_block'),
deckForDistribution = document.getElementById('deck_for_distribution');

backBut.addEventListener('click', goBack);
choiceHandOutBtn.addEventListener('click', goToQuantityOfPlayers);
choiceQuantityOfPlayers.addEventListener('click', goToTable);
choiceFromListBut.addEventListener('click', goToTableFromListBlock);
testHandOutBut.addEventListener('click', goToQuantityOfPlayers);
deckForDistribution.addEventListener('click', distributeCards);
let history = [];

history.push(new State(choiceBlock));

/*
	Adding an event to each card in the deal
*/
for(let i = 0; i < handOuts.length; i++) {
	handOuts[i].addEventListener('click', () => {
		if(isPropertyFromLastHistory('mode', 'choice')) {
			lockCardsInList();
			hideAndShow(tableOfFreeBlock, listBlock, false);
			recordStateWithChangedPropertyes({classOfOpenWindow: listBlock, activeReplce: `hand_out_card_${i + 1}`});
			adjustmentCardsInList();
		}
	});
}
/*
	Adding an event to each card in the hand
*/
for(let i = 0; i < yourCards.length; i++) {
	yourCards[i].addEventListener('click', () => {
		lockCardsInList();
		if(isPropertyFromLastHistory('mode', 'choice')) {
			hideAndShow(tableOfFreeBlock, listBlock, false);
			recordStateWithChangedPropertyes({classOfOpenWindow: listBlock, activeReplce: `your_card_${i + 1}`});
			adjustmentCardsInList();
		}
	});
}
/*
	Mark the selected map. Only one selected card
*/
for(let i = 0; i < allCards.length; i++) {
	allCards[i].addEventListener('click', () => {
		for(let j = 0; j < allCards.length; j++) {
			if(allCards[j].className === 'chosed')
				allCards[j].className = '';
		}
		allCards[i].className = allCards[i].className === 'on_table' ? 'on_table' : 'chosed';
	});
}

function isPropertyFromLastHistory(property, value) {
	return value === checkPropertyFromLastRecord(property);
}
export function checkPropertyFromLastRecord(property) {
	return history[history.length - 1][property];
}
function hideAndShow(hidingBlock, showingBlock, onFlex = true) {		
	//flex or block, depending on what property was originally
	hidingBlock.style.display = 'none';
	showingBlock.style.display = onFlex ? 'flex' : 'block';
}
function goToQuantityOfPlayers() {
	hideAndShow(choiceBlock, quantityBlock, false);
	let mode = this.id === 'choice_hand_out' ? 'choice' : 'test';
	backBut.style.visibility = 'visible';
	history.push(new State(quantityBlock, mode));
}
function goToTable() {
	try{
		if(!textOfQuantityOfPlayers.value)
			throw new MyError('Вы должны ввести колличество игроков');
		if(+textOfQuantityOfPlayers.value < 1 || +textOfQuantityOfPlayers.value > 8)
			throw new MyError('Кол-во игроков должно быть от 1-го до 8-ми');
		let quantityOfPlayers = +textOfQuantityOfPlayers.value;
		if(isPropertyFromLastHistory('mode', 'choice')) {
			addEnemiesToTable(quantityOfPlayers, document.getElementById('other_gamers'));
			hideAndShow(quantityBlock, tableOfFreeBlock);
			history.push(new State(tableOfFreeBlock, checkPropertyFromLastRecord('mode'), quantityOfPlayers));
			adjustmentCardsOnTable();
		} else {
			addEnemiesToTable(quantityOfPlayers, document.getElementById('other_gamers_random'));
			hideAndShow(quantityBlock, tableOfRandomBlock);
			history.push(new State(tableOfRandomBlock, checkPropertyFromLastRecord('mode'), quantityOfPlayers));
			adjustmentCardsOnTable();
		}
	} catch(e) {
		if(e.name === 'MyError')
			alert(e.message);
		else
			throw e;
	}
}
function addEnemiesToTable(quantityOfPlayers, node) {
	clearTableFromEnemies(node);
	for(let i = 0; i < quantityOfPlayers - 1; i++) {
		let cardOfEnemies = document.createElement('img');
		cardOfEnemies.className = 'cards_of_other_gamers';
		cardOfEnemies.src = 'images/two-cards.jpg';
		node.append(cardOfEnemies);
	}
}
function clearTableFromEnemies(node) {
	let imagesOfEnemies = node.querySelectorAll('img')
	for(let item of imagesOfEnemies) {
		node.removeChild(item);
	}
}

function goToTableFromListBlock() {
	hideAndShow(listBlock, tableOfFreeBlock);
	let [searchedCard, indexOfSearchedCard] = findCardAndItIndexFromListWithMark();
	let resultState;
	if(searchedCard != undefined) {
		let placeForInsert = insertAnImage(searchedCard.src, checkPropertyFromLastRecord('activeReplce'));
		let handOutOrHand = placeForInsert.id.startsWith('hand_out_card') ? 'handOut' : 'hand';
		let cardPlaceForChange  = copyCardObject(checkPropertyFromLastRecord(handOutOrHand));
		//It is necessary to change the object and subsequent recording, but the object in the last story will remain untouched
		cardPlaceForChange[getLastSymbol(placeForInsert.id)] = deck[indexOfSearchedCard];// add the desired card to your hand
		resultState = handOutOrHand === 'handOut' 
		? recordStateWithChangedPropertyes({classOfOpenWindow: tableOfFreeBlock, handOut: cardPlaceForChange})
		: recordStateWithChangedPropertyes({classOfOpenWindow: tableOfFreeBlock, hand: cardPlaceForChange});
	} else {
		recordStateWithChangedPropertyes({classOfOpenWindow: tableOfFreeBlock});
	}
	adjustmentCardsOnTable();
}
function copyCardObject(object) {
	let newObject = {};
	for(let item in object) {
		let cardIndex = object[item].indexForSearch;
		newObject[item] = deck[cardIndex];
	}
	return newObject;
}
function insertAnImage(src, id) {
	let placeForInsert = document.getElementById(id);
	clearPlaceForCard(placeForInsert);
	let newNode = document.createElement('img');
	newNode.src = src;
	newNode.style.width = placeForInsert.id.startsWith('hand_out_card') ? '105px' : '160px';
	placeForInsert.append(newNode);
	return placeForInsert;
}
function clearPlaceForCard(node) {
	let elementsInNode = node.querySelectorAll('img');
	for(let item of elementsInNode) {
		node.removeChild(item);
	}
}

function getLastSymbol(str) {
	return str[str.length - 1];
}

function findCardAndItIndexFromListWithMark() {
	let searchedCard, indexOfSearchedCard;
	for(let i = 0; i < allCards.length; i++) {
		if(allCards[i].className === 'chosed'){
			searchedCard = allCards[i];
			indexOfSearchedCard = i;
		}
	}
	return [searchedCard, indexOfSearchedCard];
}

function goBack() {
	let lastStep = history[history.length - 2].classOfOpenWindow;
	let actualBlock = history.pop().classOfOpenWindow;
	let flex = lastStep.id === 'quantity_block' || lastStep.id === 'block_with_list_of_cards' ? false : true;
		hideAndShow(actualBlock, lastStep, flex);		// delete the last step and roll back to the penultimate
	if(lastStep === choiceBlock)
		backBut.style.visibility = 'hidden';
	adjustmentCardsOnTable();
	throwOffAllChosedClasses();
	adjustmentCardsInList();
}

function recordStateWithChangedPropertyes(objOfConfiguration) {
	let lastHistoryRecord = history[history.length - 1];
	let newHistoryRecord = new State();
	for(let property in lastHistoryRecord) {
		let valueOfProperty = property in objOfConfiguration ? objOfConfiguration[property] : lastHistoryRecord[property];
		newHistoryRecord[property] = valueOfProperty;
	}
	history.push(newHistoryRecord);
}

function lockCardsInList() {
	let lastHistoryRecord = history[history.length - 1];
	for(let i = 0; i < allCards.length; i++) {
		if(allCards[i].className === 'on_table' && 
		(!cardContainsInObject(i, lastHistoryRecord.hand) || !cardContainsInObject(i, lastHistoryRecord.handOut))) {
			allCards[i].className = '';
		}

		if(cardContainsInObject(i, lastHistoryRecord.hand) || cardContainsInObject(i, lastHistoryRecord.handOut)) {
			allCards[i].className = 'on_table';
		}
	}
}
function cardContainsInObject(indexOfCard, object) {
	for(let item in object) {
		if(object[item].indexForSearch === indexOfCard)
			return true;
	}
	return false;
}

function adjustmentCardsOnTableForRendering() {
	let lastHistoryRecord = history[history.length - 1];
	markCardsFromHandOrHandOut(lastHistoryRecord, 'hand');
	markCardsFromHandOrHandOut(lastHistoryRecord, 'handOut');
}
function markCardsFromHandOrHandOut(object, property) {
	let id = property === 'hand' ? `your_card_` : `hand_out_card_`;
	for(let card in object[property]) {
		let cardElement = object.mode === 'choice' ? document.getElementById(id + `${+card}`) : document.getElementById(id + `${+card}_random`);
		if(!cardElement.className.includes('busy')) 
			cardElement.className += ' busy';
	}
}
function throwOffAllChosedClasses() {
	for(let i = 0; i < allCards.length; i++) {
		allCards[i].className = allCards[i].className === 'chosed' ? '' : allCards[i].className;
	}
}
function adjustmentCardsInList() {
	let lastHistoryRecord = history[history.length - 1];
	for(let i = 0; i < allCards.length; i++) {
		if(allCards[i].className === 'on_table' 
		   && !cardContainsInObject(i, lastHistoryRecord.handOut) 
		   && !cardContainsInObject(i, lastHistoryRecord.hand)) {
			allCards[i].className = '';
		}
		if(allCards[i].className !== 'on_table' 
		   && (cardContainsInObject(i, lastHistoryRecord.handOut) 
		   || cardContainsInObject(i, lastHistoryRecord.hand))) {
			allCards[i].className = 'on_table';
		}
	}
}
function adjustmentCardsOnTable() {
	adjustmentCardsOnTableForRendering();
	if(checkPropertyFromLastRecord('mode') === 'choice'){
		adjustmentCards(handOuts, 'handOut');
		adjustmentCards(yourCards, 'hand');
	} else {
		adjustmentCards(handOutsRandom, 'handOut');
		adjustmentCards(yourCardsRandom, 'hand');
	}
}
function adjustmentCards(blockOfCardPlaces, handOrHandOut) {
	let lastHistoryRecord = history[history.length - 1][handOrHandOut];
	for(let i = 0; i < blockOfCardPlaces.length; i++) {
		if(blockOfCardPlaces[i].className.includes('busy') && !( `${i + 1}` in lastHistoryRecord)) {
			clearHTMLBlockInsides(blockOfCardPlaces[i]);
			blockOfCardPlaces[i].className = blockOfCardPlaces[i].className.slice(0, blockOfCardPlaces[i].className.length - 5);
		}
		if(!blockOfCardPlaces[i].className.includes('busy') && ( `${i + 1}` in lastHistoryRecord) && checkPropertyFromLastRecord('mode') !== 'test') {
			blockOfCardPlaces[i].className += ' busy';
			let indexOfCard = lastHistoryRecord[i + 1].indexForSearch;
			let id = checkPropertyFromLastRecord('activeReplce');
			insertAnImage(allCards[indexOfCard].src, id);
		}
		if(blockOfCardPlaces[i].className.includes('busy') && ( `${i + 1}` in lastHistoryRecord) 
		&& blockOfCardPlaces[i].childNodes[0].src != allCards[lastHistoryRecord[i + 1].indexForSearch].src) {
			blockOfCardPlaces[i].childNodes[0].src = allCards[lastHistoryRecord[i + 1].indexForSearch].src;
		}
	}
}
function clearHTMLBlockInsides(block) {
	let childs = block.childNodes;
	for(let item of childs) {
		block.removeChild(item);
	}
}

function distributeCards() {
	let distributionCount = checkPropertyFromLastRecord('distributionCount');
	if(distributionCount === 0)
		drawHand();
	if(distributionCount === 1)
		drawTwoOnTable();
	if(distributionCount === 2)
		drawOneOnTable(3);
	if(distributionCount === 3)
		drawOneOnTable(4);
	if(distributionCount === 4)
		drawOneOnTable(5);
}
function drawHand() {
	let [firstCard, secondCard] = randomCardsFromDeck();
	let firstCardSrc = allCards[firstCard.indexForSearch].src, secondCardSrc = allCards[secondCard.indexForSearch].src;
	insertAnImage(firstCardSrc, 'your_card_1_random');
	//document.getElementById('your_card_1_random').style.border = 'none';
	insertAnImage(secondCardSrc, 'your_card_2_random');
	document.getElementById('your_card_1_random').className += ' busy';
	document.getElementById('your_card_2_random').className += ' busy';
	//document.getElementById('your_card_2_random').style.border = 'none';
	recordStateWithChangedPropertyes({hand: {1: firstCard, 2: secondCard}, distributionCount: 1});
}
function drawTwoOnTable() {
	let [firstCard, secondCard] = randomCardsFromDeck();
	let firstCardSrc = allCards[firstCard.indexForSearch].src, secondCardSrc = allCards[secondCard.indexForSearch].src;
	insertAnImage(firstCardSrc, 'hand_out_card_1_random');
	insertAnImage(secondCardSrc, 'hand_out_card_2_random');
	document.getElementById('hand_out_card_1_random').className += ' busy';
	document.getElementById('hand_out_card_2_random').className += ' busy';
	recordStateWithChangedPropertyes({handOut: {1: firstCard, 2: secondCard}, distributionCount: 2});
}
function drawOneOnTable(index) {
	let card = randomCardFromDeck();
	let cardSrc = allCards[card.indexForSearch].src;
	insertAnImage(cardSrc, `hand_out_card_${index}_random`);
	document.getElementById(`hand_out_card_${index}_random`).className += ' busy';
	let newHandOut = {};
	for(let item in checkPropertyFromLastRecord('handOut'))
		newHandOut[item] = deck[checkPropertyFromLastRecord('handOut')[item].indexForSearch];
	newHandOut[index] = card;
	recordStateWithChangedPropertyes({handOut: newHandOut, distributionCount: index});
}
function randomCardFromDeck() {
	let card = null;
	let random = 0;
	while(card=== null) {
		random = Math.floor(Math.random() * 52 + 1);
		if(random > 52 || random < 0)
			continue;
		if(!cardInTable(deck[random]))
			card = deck[random];
	}
	return card;
}
function randomCardsFromDeck() {
	let cardOne = null;
	let cardTwo = null;
	let randomOne = 0, randomTwo = 0;
	while(cardOne === null) {
		randomOne = Math.floor(Math.random() * 52 + 1);
		if(randomOne > 52 || randomOne < 0)
			continue;
		if(!cardInTable(deck[randomOne]))
			cardOne = deck[randomOne];
	}
	while(cardTwo === null) {
		randomTwo = Math.floor(Math.random() * 52 + 1);
		if(randomTwo > 52 || randomTwo < 0 && randomOne != randomTwo)
			continue;
		if(!cardInTable(deck[randomTwo]))
			cardTwo = deck[randomTwo];
	}
	return [cardOne, cardTwo];
}
function cardInTable(card) {
	let hand = checkPropertyFromLastRecord('hand');
	let handOut = checkPropertyFromLastRecord('handOut');

	let listOfCards = [];

	for(let item in hand) {
		listOfCards.push(deck[hand[item].indexForSearch]);
	}
	for(let item in handOut) {
		listOfCards.push(deck[handOut[item].indexForSearch]);
	}
	for(let item of listOfCards) {
		if(card.indexForSearch === item.indexForSearch)
			return true;
	}
	return false;
}






