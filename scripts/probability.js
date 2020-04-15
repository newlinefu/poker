'use strict'

import {deck} from './cards.js';
import {State, Card, MyError} from './classesJS.js';
import {checkPropertyFromLastRecord} from './main_script.js';

document.getElementById('count_probability').addEventListener('click', () => {
	document.getElementById('one_pair').value = probabitityOfPair();
	document.getElementById('three').value = probabilityOfSet();
	document.getElementById('four').value = probabilityOfFour();
	document.getElementById('two_pais').value = probabilityOfTwoPairs();
	document.getElementById('flush').value = probabilityOfFlush();
	document.getElementById('straight').value = probabilityOfStraight();
	document.getElementById('full_house').value = probabilityOfFullHouse();
});
document.getElementById('count_probability_random').addEventListener('click', () => {
	document.getElementById('one_pair_random').value = probabitityOfPair();
	document.getElementById('three_random').value = probabilityOfSet();
	document.getElementById('four_random').value = probabilityOfFour();
	document.getElementById('two_pais_random').value = probabilityOfTwoPairs();
	document.getElementById('flush_random').value = probabilityOfFlush();
	document.getElementById('straight_random').value = probabilityOfStraight();
	document.getElementById('full_house_random').value = probabilityOfFullHouse();
});

function factorial(t, f = 0) {
	let result = 1;
	for(let i = f + 1; i <= t; i++) {
		result *= i;
	}
	return result;
}
function combinationOptimize(k, n) {
	return factorial(n, n - k) / factorial(k); 
}
function combination(k, n) {
	return factorial(n) / (factorial(n - k) * factorial(k));
}
function returnListOfCardsOnTable() {
	let hand = checkPropertyFromLastRecord('hand');
	let handOut = checkPropertyFromLastRecord('handOut');

	let listOfCards = [];

	for(let item in hand) {
		listOfCards.push(deck[hand[item].indexForSearch]);
	}
	for(let item in handOut) {
		listOfCards.push(deck[handOut[item].indexForSearch]);
	}
	return listOfCards;
}
function returnObjectOfCardsOnTableAndInHand() {
	let hand = checkPropertyFromLastRecord('hand');
	let handOut = checkPropertyFromLastRecord('handOut');

	let objOfCards = {hand: [], handOut: []};

	for(let item in hand) {
		objOfCards.hand.push(deck[hand[item].indexForSearch]);
	}
	for(let item in handOut) {
		objOfCards.handOut.push(deck[handOut[item].indexForSearch]);
	}
	return objOfCards;
}
function returnQuantityOfCardWithSameValue(card, listOfCardsOnTable) {
	const indexOfCard = card.indexForSearch;
	const cardValue = card.value;
	return listOfCardsOnTable.reduce((acc, cardOfList) => {
		if(cardOfList.value === cardValue && indexOfCard !== cardOfList.indexForSearch)
			return acc + 1;
		else
			return acc;
	}, 0);
}
function arrayEquals(array1, array2) {
	if(array1.length === array2.length)
		return ''.includes.call(array1, array2);
	else
		return false;
}
function elementContainsInTwoDimentionalArray(containedElement, mainArray) {
	for(let item of mainArray) {
		if(arrayEquals(item, containedElement))
			return true;
	}
	return false;
}


function probabitityOfPair() {
	const quantityOfPlayers = checkPropertyFromLastRecord('quantityOfPlayers');
	const listOfCardsOnTable = returnListOfCardsOnTable();
	const availableCards = 52 - (quantityOfPlayers - 1) * 2 - listOfCardsOnTable.length;
	const freePlaces = 7 - listOfCardsOnTable.length;
	let probability = 0;

	if(listOfCardsOnTable.length === 0)
		probability = 100*(39 * combination(5, availableCards - 4) / combination(7, availableCards));
	let checkedIndexes = [];
	for(let item of listOfCardsOnTable) {
		if(!checkedIndexes.includes(item.value)){
			checkedIndexes.push(item.value);
			probability += pairToThisCard(item);
		}
	}
	return probability >= 100 ? 100 + ' %' : probability.toFixed(2) + ' %';

	function pairToThisCard(card) {
		let probability = 100;

		if(freePlaces < 1 - returnQuantityOfCardWithSameValue(card, listOfCardsOnTable))
			return 0;
		if(haveAPair(card))
			return probability;
		else {
			return (combination(1, 3) * combination(freePlaces - 1, availableCards - 3) / combination(freePlaces, availableCards)) * 100;
		}
	}
	function haveAPair(card) {
		return returnQuantityOfCardWithSameValue(card, listOfCardsOnTable) >= 1;
	}
}



function probabilityOfSet() {
	const quantityOfPlayers = checkPropertyFromLastRecord('quantityOfPlayers');
	const listOfCardsOnTable = returnListOfCardsOnTable();
	const availableCards = 52 - (quantityOfPlayers - 1) * 2 - listOfCardsOnTable.length;
	const freePlaces = 7 - listOfCardsOnTable.length;
	let probability = 0;

	if(listOfCardsOnTable.length === 0)
		probability = 100*(52 * combination(4, availableCards - 4) / combination(7, availableCards));
	let checkedIndexes = [];
	for(let item of listOfCardsOnTable) {
		if(!checkedIndexes.includes(item.value)){
			checkedIndexes.push(item.value);
			probability += setToThisCard(item);
		}
	}
	return probability > 100 ? 100 + ' %' : probability.toFixed(2) + ' %';


	function haveASet(card) {
		return returnQuantityOfCardWithSameValue(card, listOfCardsOnTable) >= 2;
	}
	
	function setToThisCard(card) {
		let probability = 100;
		const quantityOfCardsOfThisValue = returnQuantityOfCardWithSameValue(card, listOfCardsOnTable) + 1;

		if(freePlaces < 2 - returnQuantityOfCardWithSameValue(card, listOfCardsOnTable))
			return 0;
		if(haveASet(card))
			return probability;
		else {
			return (combination(3 - quantityOfCardsOfThisValue, 4 - quantityOfCardsOfThisValue) * 
				    combination(freePlaces - (3 - quantityOfCardsOfThisValue), availableCards - (4 - quantityOfCardsOfThisValue)) / 
				    combination(freePlaces, availableCards)) * 100;
		}
	}
}



function probabilityOfFour() {
	const quantityOfPlayers = checkPropertyFromLastRecord('quantityOfPlayers');
	const listOfCardsOnTable = returnListOfCardsOnTable();
	const availableCards = 52 - (quantityOfPlayers - 1) * 2 - listOfCardsOnTable.length;
	const freePlaces = 7 - listOfCardsOnTable.length;
	let probability = 0;

	if(listOfCardsOnTable.length === 0)
		probability = 100*(13 * combination(4, availableCards - 4) / combination(7, availableCards));
	let checkedIndexes = [];
	for(let item of listOfCardsOnTable) {
		if(!checkedIndexes.includes(item.value)){
			checkedIndexes.push(item.value);
			probability += fourToThisCard(item);
		}
	}
	return probability > 100 ? 100 + ' %' : probability.toFixed(4) + ' %';


	function haveAFour(card) {
		return returnQuantityOfCardWithSameValue(card, listOfCardsOnTable) === 4;
	}
	
	function fourToThisCard(card) {
		let probability = 100;
		const quantityOfCardsOfThisValue = returnQuantityOfCardWithSameValue(card, listOfCardsOnTable) + 1;

		if(freePlaces < 3 - returnQuantityOfCardWithSameValue(card, listOfCardsOnTable))
			return 0;
		if(haveAFour(card))
			return probability;
		else {
			return (combination(4 - quantityOfCardsOfThisValue, 4 - quantityOfCardsOfThisValue) * 
				    combination(freePlaces - (4 - quantityOfCardsOfThisValue), availableCards - (4 - quantityOfCardsOfThisValue)) / 
				    combination(freePlaces, availableCards)) * 100;
		}
	}
}



function probabilityOfTwoPairs() {
	const quantityOfPlayers = checkPropertyFromLastRecord('quantityOfPlayers');
	const listOfCardsOnTable = returnListOfCardsOnTable();
	const availableCards = 52 - (quantityOfPlayers - 1) * 2 - listOfCardsOnTable.length;
	const freePlaces = 7 - listOfCardsOnTable.length;
	let probability = 0;

	if(listOfCardsOnTable.length === 0)
		return (100 * probabilityOfTwoPairsOnEmptyTable()).toFixed(3) + ' %';
	if(haveATwoPairs()){
		return 100 + ' %';
	}
	let checkedIndexes = [];
	for(let item of listOfCardsOnTable) {
		if(!checkedIndexes.includes(item.value)){
			checkedIndexes.push(item.value);
			probability += twoPairsToThisCard(item);
		}
	}
	return probability >= 100 ? 100 + ' %' : probability.toFixed(2) + ' %';


	function twoPairsToThisCard(card) {
		const probabilityOfPairToThisCard = pairToThisCard(card);
		return 100 * probabilityOfPairToThisCard * probabilityOfPair();
	} 
	function probabilityOfPair() {
		const allValues = returnListOfAllValues();
		return (13 - allValues.length)*6 * combination(freePlaces - 2, availableCards - 4) / combination(freePlaces, availableCards);
	}
	function pairToThisCard(card) {
		let probability = 1;
		if(haveAPair(card)) {
			return probability;
		}
		else {
			return (combination(1, 3) * combination(freePlaces - 1, availableCards - 3) / combination(freePlaces, availableCards));
		}
	}
	function haveAPair(card) {
		return returnQuantityOfCardWithSameValue(card, listOfCardsOnTable) >= 1;
	}
	function probabilityOfTwoPairsOnEmptyTable() {
		return 39 * 36 * combination(3, availableCards - 8)/ combination(7, availableCards);
	}
	function haveATwoPairs() {
		return returnListOfAllValues().length >= 2;
	}
	function returnListOfAllValues() {
		let valuesOfPairs = [];
		for(let item of listOfCardsOnTable) {
			if(haveAPair(item) && !valuesOfPairs.includes(item.value)) {
				valuesOfPairs.push(item.value);
			}
		}
		return valuesOfPairs; 
	}
}

function probabilityOfFlush() {
	const quantityOfPlayers = checkPropertyFromLastRecord('quantityOfPlayers');
	const listOfCardsOnTable = returnListOfCardsOnTable();
	const availableCards = 52 - (quantityOfPlayers - 1) * 2 - listOfCardsOnTable.length;
	const freePlaces = 7 - listOfCardsOnTable.length;
	let probability = 0;

	if(listOfCardsOnTable.length === 0)
		return (100 * probabilityOnEmptyTable()).toFixed(4) + ' %';
	let checkedSuits = [];
	for(let item of listOfCardsOnTable) {
		if(!checkedSuits.includes(item.suit)){
			checkedSuits.push(item.suit);
			probability += flushToThisCard(item);
		}
	}
	return probability > 100 ? 100 + ' %' : probability.toFixed(4) + ' %';

	function probabilityOnEmptyTable() {
		return 4 * combination(5, 13) * combination(2, availableCards - 7) / combination(7, availableCards);
	}
	function returnQuantityOfSuitOfThisCard(card) {
		let count = 0;
		for(let item of listOfCardsOnTable) {
			if(item.suit === card.suit)
				count++;
		}
		return count;
	}
	function flushToThisCard(card) {
		const quantityOfCardOfThisSuit = returnQuantityOfSuitOfThisCard(card, listOfCardsOnTable);
		if(freePlaces < 5 - quantityOfCardOfThisSuit)
			return 0;
		if(quantityOfCardOfThisSuit >= 5)
			return 100;
		return 100 * combination(5 - quantityOfCardOfThisSuit, 13 - quantityOfCardOfThisSuit) *
			   combination(freePlaces - (5 - quantityOfCardOfThisSuit), availableCards - (13 - quantityOfCardOfThisSuit - 1)) /
			   combination(freePlaces, availableCards);
	}
}



function probabilityOfStraight() {
	const quantityOfPlayers = checkPropertyFromLastRecord('quantityOfPlayers');
	const listOfCardsOnTable = returnListOfCardsOnTable();
	const availableCards = 52 - (quantityOfPlayers - 1) * 2 - listOfCardsOnTable.length;
	const freePlaces = 7 - listOfCardsOnTable.length;
	let probability = 0;

	if(listOfCardsOnTable.length === 0)
		return (100 * probabilityOnEmptyTable()).toFixed(4) + ' %';
	else {
		let prob = mainProbability();
		prob();
		return prob.finalProbability >= 100 ? 100 + ' %' :(100 * prob.finalProbability).toFixed(3) + ' %';
	}


	function mainProbability() {

		probabilityToEachCard.finalProbability = 0;

		function probabilityToEachCard() {
			let probToSingleCard = probabilityToOneCardRoot();
			for(let item of listOfCardsOnTable) {
				probabilityToEachCard.finalProbability += probToSingleCard(item);
			}
		}
		return probabilityToEachCard;
	}

	function probabilityToOneCardRoot() {
		let journalOfRequnces = [];
		return (card) => {
			if(card.value === 14) {
				let [cardRequenceOne, cardRequenceTwo] = returnListOfStraightRequence(card);

				let crossedCardsOne = returnListOfCrossedCards(card, cardRequenceOne);
				let crossedCardsTwo = returnListOfCrossedCards(card, cardRequenceTwo);

				let crossesOne = commonRequncesOfSomeOfCrossedCards(journalOfRequnces, ...crossedCardsOne);
				let crossesTwo = commonRequncesOfSomeOfCrossedCards(journalOfRequnces, ...crossedCardsTwo);

				for(let item of crossesOne)
					journalOfRequnces.push(item);
				for(let item of crossesTwo)
					journalOfRequnces.push(item);

				let objCountOne = returnObjectOfCounts(crossesOne);
				let objCountTwo = returnObjectOfCounts(crossesTwo);

				let countOne = toCountAllProb(objCountOne, crossesOne.length, freePlaces, availableCards);
				let countTwo = toCountAllProb(objCountOne, crossesOne.length, freePlaces, availableCards);
				return countOne + countTwo;

			} else {
				const cardRequence = returnListOfStraightRequence(card);
				let crossedCards = returnListOfCrossedCards(card, cardRequence); 
				let crosses = commonRequncesOfSomeOfCrossedCards(journalOfRequnces, ...crossedCards);
				for(let item of crosses)
					journalOfRequnces.push(item);
				let objCount = returnObjectOfCounts(crosses);
				return toCountAllProb(objCount, crosses.length, freePlaces, availableCards);
			}
		}
	}
	function toCountProb(n, count, freePlaces, availableCards) {
		return ((5 - n)**4) * count * 
		combination(freePlaces - (5 - n), availableCards - (5 - n)) / 
		combination(freePlaces, availableCards);
	}
	function toCountAllProb(objCount, crossedLength, freePlaces, availableCards) {
		let prob = 0;
		let min = 1000;
		for(let item in objCount) {
			min = +item < min ? +item : min;
			if(+item == 5)
				return 100
			prob += toCountProb(+item, objCount[item], freePlaces, availableCards);
		}
		if(min > freePlaces)
			prob = 0;
		return prob;
	}
	function returnObjectOfCounts(crosses) {
		let objOfCounts = {};
		for(let item of crosses) {
			let count = returnCountOfTableCards(item);
			if(!(count in objOfCounts))
				objOfCounts[count] = 1;
			else
				objOfCounts[count]++;
		}
		return objOfCounts;
	}
	function returnCountOfTableCards(array) {
		let count = 0;
		for(let item of array) {
			if(onTable(item))
				count++;
		}
		return count;
	}
	function onTable(valueOfCard) {
		for(let item of listOfCardsOnTable) {
			if(item.value === valueOfCard){
				return true;
			}
		}
		return false;
	}
	function returnListOfCrossedCards(card, cardRequence) {
		let crossedCards = [card];
		for(let item of listOfCardsOnTable) {
			if(cardRequence.includes(item.value) && item.indexForSearch != card.indexForSearch) {
				crossedCards.push(item);
			}
		}
		return crossedCards
	}

	function sieveCrosses(crosses, journalOfRequnces) {
		for(let i = 0; i < crosses.length; i++) {
			if(elementContainsInTwoDimentionalArray(crosses[i], journalOfRequnces))
				crosses.splice(i, 1);
		}
		return crosses;
	}

	function changeJournal(journalOfRequnces, crosses) {
		for(let item of crosses)
			journalOfRequnces.push(item);
		return journalOfRequnces;
	}
	function probabilityOnEmptyTable() {
		let vatiationOfStraights = (5**4) * 10;
		return vatiationOfStraights * combination(2, availableCards - 5) / combination(7, availableCards);
	}
	function returnListOfStraightRequence(card) {
		const cardValue = card.value;
		if(cardValue === 14) 
			return [[10, 11, 12, 13, 14], [14, 2, 3, 4, 5]];
		const bottomLine = cardValue - 4 < 2 ? 2 : cardValue - 4;
		const topline = cardValue + 4 > 14 ? 14 : cardValue + 4;
		const requence = [];
		for(let i = bottomLine; i <= topline; i++)
			requence.push(i);
		return requence;
	}
	function inRequence(requenceCard, containedCard) {
		let requence = returnListOfStraightRequence(requenceCard);
		if(requenceCard.value === 14)
			return requence[0].includes(containedCard.value) || requence[1].includes(containedCard.value);
		else
			return requence.includes(containedCard.value);
	}

	function commonRequence(cardOne, cardTwo, journal) {
		let listOfRequnces = [];
		if(cardOne.value === 14 || cardTwo.value === 14) {

			let ace = cardOne.value === 14 ? cardOne : cardTwo;
			let notAce = cardOne.value === 14 ? cardTwo : cardOne;
			let aceRequence = returnListOfStraightRequence(ace);
			let notAceRequence = returnListOfStraightRequence(notAce);

			if(''.includes.call(notAceRequence, aceRequence[0]) && !elementContainsInTwoDimentionalArray(aceRequence[0], journal))
				listOfRequnces.push(aceRequence[0]);
			if(''.includes.call(notAceRequence, aceRequence[1]) && !elementContainsInTwoDimentionalArray(aceRequence[1], journal))
				listOfRequnces.push(aceRequence[1]);
		} else {
			let cardOneRequence = returnListOfStraightRequence(cardOne);
			let cardTwoRequence = returnListOfStraightRequence(cardTwo);
			for(let i = 0; i < cardOneRequence.length - 4; i++) {
				if(''.includes.call(cardTwoRequence, cardOneRequence.slice(i, i + 5)) && !elementContainsInTwoDimentionalArray(cardOneRequence.slice(i, i + 5), journal))
					listOfRequnces.push(cardOneRequence.slice(i, i + 5));
			}
		}
		return listOfRequnces;
	}
	function crossOfRequences(card, listOfRequnces, journal) {
		let cardRequence = returnListOfStraightRequence(card);
		let resultRequnce = [];

		for(let i = 0; i < listOfRequnces.length; i++) {
			if(''.includes.call(cardRequence, listOfRequnces[i]) && !elementContainsInTwoDimentionalArray(listOfRequnces[i], journal))
				resultRequnce.push(listOfRequnces[i]);
		}
		return resultRequnce;
	}
	function commonRequncesOfSomeOfCrossedCards(journal, ...cards) {
		if(cards.length === 1)
			return commonRequence(cards[0], cards[0], journal);
		else {
			let requences = commonRequence(cards[0], cards[1], journal);
			for(let i = 2; i < cards.length; i++) {
				if(crossOfRequences(cards[i], requences, journal).length === 0)
					requences.push(...commonRequence(cards[0], cards[i], journal))
				else
					requences = crossOfRequences(cards[i], requences, journal);
			}
			return requences;
		}
	}
}




function probabilityOfFullHouse() {
	const quantityOfPlayers = checkPropertyFromLastRecord('quantityOfPlayers');
	const listOfCardsOnTable = returnListOfCardsOnTable();
	const availableCards = 52 - (quantityOfPlayers - 1) * 2 - listOfCardsOnTable.length;
	const freePlaces = 7 - listOfCardsOnTable.length;

	return mainProbability();

	function mainProbability() {
		if(listOfCardsOnTable.length === 0)
			return (100 * 39 * 48 * combination(2, availableCards - 5) / combination(7, availableCards)).toFixed(2) + ' %';		
		let prob = 0;
		for(let item of listOfCardsOnTable) {
			prob += mainProbabilityForCard(item);
		}
		return prob > 100 ? 100 + ' %' : (100 * prob).toFixed(4) + ' %';
	}
	function mainProbabilityForCard(card) {
		return pairPlusThree(card) + threePlusTwo(card);
	}
	function pairPlusThree(card) {
		let prob = probabilityOfPair(card);
		let probOfSet = 0
		let checkedIndexes = [];
		for(let item of listOfCardsOnTable) {
			if(!checkedIndexes.includes(item.value) && item.value != card.value) {
				checkedIndexes.push(item.value);
				probOfSet += setToThisCard(item);
			}
		}
		if(listOfCardsOnTable.length - 1 === 0)
			probOfSet = 48 * combination(3, availableCards - 3) / combination(6, availableCards);
		return +(prob * probOfSet).toFixed(4) > 1 ? 1 : +(prob * probOfSet).toFixed(4);
	}
	function threePlusTwo(card) {
		let prob = probabilityOfThree(card);
		let probOfPair = 0;
		let checkedIndexes = [];
		for(let item of listOfCardsOnTable) {
			if(!checkedIndexes.includes(item.value) && item.value != card.value) {
				checkedIndexes.push(item.value);
				probOfPair += pairToThisCardAfter(item);
			}
		}
		if(listOfCardsOnTable.length - 1 === 0)
			probOfPair = 36 * combination(5, availableCards - 4) / combination(7, availableCards);
		return +(prob * probOfPair).toFixed(4) > 1 ? 1 : +(prob * probOfPair).toFixed(4);
	}
	function probabilityOfPair(card, after = false) {
		let probability = 0;
		let checkedIndexes = [];
		for(let item of listOfCardsOnTable) {
			if(!checkedIndexes.includes(item.value)){
				checkedIndexes.push(item.value);
				if(after)
					probability += pairToThisCardAfter(item);
				else
					probability += pairToThisCard(item);
			}
		}
		return probability >= 1 ? 1 : +probability.toFixed(2);
	}

	function pairToThisCard(card) {
		let probability = 1;

		if(freePlaces < 1 - returnQuantityOfCardWithSameValue(card, listOfCardsOnTable))
			return 0;
		if(haveAPair(card))
			return probability;
		else
			return combination(1, 3) * combination(freePlaces - 1, availableCards - 3) / combination(freePlaces, availableCards);
	}
	function pairToThisCardAfter(card) {
		let probability = 1;

		if(freePlaces < 1 - returnQuantityOfCardWithSameValue(card, listOfCardsOnTable))
			return 0;
		if(haveAPair(card))
			return probability;
		else
			return combination(1, 3) * combination(freePlaces - 4, availableCards - 3) / combination(freePlaces, availableCards);
	}

	function haveAPair(card) {
		return returnQuantityOfCardWithSameValue(card, listOfCardsOnTable) >= 1;
	}

	function probabilityOfThree(card, after = false){
		let checkedIndexes = [];
		let probability = 0;
		for(let item of listOfCardsOnTable) {
			if(!checkedIndexes.includes(item.value)){
				checkedIndexes.push(item.value);
				probability += setToThisCard(item);
			}
		}
		return probability > 1 ? 1 : +probability.toFixed(2);
	}

	function haveASet(card) {
		return returnQuantityOfCardWithSameValue(card, listOfCardsOnTable) >= 2;
	}
	
	function setToThisCard(card) {
		let probability = 1;
		const quantityOfCardsOfThisValue = returnQuantityOfCardWithSameValue(card, listOfCardsOnTable) + 1;

		if(freePlaces < 2 - returnQuantityOfCardWithSameValue(card, listOfCardsOnTable))
			return 0;
		if(haveASet(card))
			return probability;
		else {
			return combination(3 - quantityOfCardsOfThisValue, 4 - quantityOfCardsOfThisValue) * 
				    combination(freePlaces - (3 - quantityOfCardsOfThisValue), availableCards - (4 - quantityOfCardsOfThisValue)) / 
				    combination(freePlaces, availableCards);
		}
	}
}
