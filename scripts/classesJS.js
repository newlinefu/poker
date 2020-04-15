class State{
	constructor(classOfOpenWindow, mode, quantityOfPlayers, hand = {}, handOut = {}, activeReplce, distributionCount = 0) {
		this.classOfOpenWindow = classOfOpenWindow;
		this.quantityOfPlayers = quantityOfPlayers;
		this.mode = mode;
		this.hand = hand;
		this.handOut = handOut;
		this.activeReplce = activeReplce;
		this.distributionCount = distributionCount;
	}
}

class Card {
	constructor(suit, content, value, indexForSearch) {
		this.suit = suit;
		this.content = content;
		this.value = value;
		this.indexForSearch = indexForSearch;
	}
}

class MyError extends Error{
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}