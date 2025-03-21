class pointbuy {
	constructor(value, cost) {
		this.value = value;
		this.cost = cost;
	}

	toString() {
		return this.value;
	}
}

class attibuteHolder {
	constructor(name, value) {
		this.name = name;
		this.value = value;
	}
}

class pointbuyholder {
	constructor(name) {
		this.name = name;
		this.maxPoints = 27;
		this.defaultValue = 8;

		this.pointBuyList =
			[
				new pointbuy(8, 0),
				new pointbuy(9, 1),
				new pointbuy(10, 2),
				new pointbuy(11, 3),
				new pointbuy(12, 4),
				new pointbuy(13, 5),
				new pointbuy(14, 7),
				new pointbuy(15, 9),
			];

		this.attibuteHolders =
			[
			new attibuteHolder("Str", this.defaultValue),
			new attibuteHolder("Dex", this.defaultValue),
			new attibuteHolder("Con", this.defaultValue),
			new attibuteHolder("Wis", this.defaultValue),
			new attibuteHolder("Int", this.defaultValue),
			new attibuteHolder("Cha", this.defaultValue),
			];

		this.updateLeftOverPoints(); // this.maxPoints - this.getSpentPoints();
	}

	allowedSelection(attribute) {
		var selectedAttributeValue = this.attibuteHolders.find(x => x.name == attribute);
		var selectedCost = this.pointBuyList.find((x) => x.value == selectedAttributeValue.value).cost;
		var leftOver = this.leftOverPoints + selectedCost;
		var returnValue = this.pointBuyList.filter((x) => x.cost <= leftOver);;
		return returnValue;
	}

	updateValue(attribute, newValue) {
		var selectedAttributeValue = this.attibuteHolders.find(x => x.name == attribute);
		selectedAttributeValue.value = this.pointBuyList.find(x => x.toString() == newValue).value;
		this.updateLeftOverPoints();
	}

	getSpentPoints() {
		var spentPoints = 0;

		for (var i = 0; i < this.attibuteHolders.length; i++) {
			var a = this.attibuteHolders[i];
			var d = this.pointBuyList.find((x) => x.value == a.value);
			spentPoints += d.cost;
		}

		return spentPoints;
	}

	updateMaxPoints(newMaxPoints) {
		this.maxPoints = newMaxPoints;
		this.resetValues();
		this.updateLeftOverPoints();
	}

	updateLeftOverPoints() {
		this.leftOverPoints = this.maxPoints - this.getSpentPoints();
	}

	resetValues() {
		for (var i = 0; i < this.attibuteHolders.length; i++) {
			this.attibuteHolders[i].value = this.defaultValue;
		}
	}
}

pointBuyHolder = new pointbuyholder("dnd5e pointbuy");
var pointHolders =[pointBuyHolder]

function initTable() {
	var table = document.getElementById("attributes")
	for (var i = 0; i < pointBuyHolder.attibuteHolders.length; i++) {
		var holder = pointBuyHolder.attibuteHolders[i];
		var row = table.insertRow(i + 1);
		var selectElement = document.createElement("select");
		selectElement.name = holder.name;
		selectElement.id = holder.name;
		selectElement.addEventListener(
			'change',
			function () { updateSelection(this.id); },
			false);

		var abilityName = row.insertCell(0);
		abilityName.innerHTML = holder.name;
		var abilityScore = row.insertCell(1);
		abilityScore.appendChild(selectElement);
	}

	refreshAllOptionsValues();
}

function updateSelection(nam) {
	var selectedElement = document.getElementById(nam);
	pointBuyHolder.updateValue(nam, selectedElement.value);
	refreshAllOptionsValues();
}

function updateOptions(selectElement, pointBuyList) {
	optionsAmount = selectElement.options.length;
	var skipIndex = 0;
	if (selectElement.options.length > 0) {
		skipIndex = selectElement.options.length;
	}

	if (skipIndex < pointBuyList.length) {
		for (let i = skipIndex; i < pointBuyList.length; i++) {
			var optionValue = pointBuyList[i];
			var optionToAdd = document.createElement("option");
			optionToAdd.text = optionValue;
			selectElement.add(optionToAdd);
		}
	}
	else {
		for (let i = skipIndex; i >= pointBuyList.length; i--) {
			selectElement.options.remove(i);
		}
	}
}

function maxPointChanged() {
	var maxPointsElement = document.getElementById("maxPoint")
	pointBuyHolder.updateMaxPoints(maxPointsElement.value);
	refreshAllOptionsValues();
	resetOptions();
}

function refreshAllOptionsValues() {
	for (var i = 0; i < pointBuyHolder.attibuteHolders.length; i++) {
		var attibuteHolder = pointBuyHolder.attibuteHolders[i];
		var id = attibuteHolder.name;
		var selectElement = document.getElementById(id);
		updateOptions(selectElement, pointBuyHolder.allowedSelection(id));
	}

	var maxPointsElement = document.getElementById("maxPoint")
	maxPointsElement.value = pointBuyHolder.maxPoints;
	var leftoverPointsScoreElement = document.getElementById("leftOver")
	leftoverPointsScoreElement.innerHTML = pointBuyHolder.leftOverPoints;
}

function resetOptions() {
	for (var i = 0; i < pointBuyHolder.attibuteHolders.length; i++) {
		var attibuteHolder = pointBuyHolder.attibuteHolders[i];
		var id = attibuteHolder.name;
		var selectElement = document.getElementById(id);

		for (var j = 0; j < selectElement.options.length; j++) {
			if (selectElement.options[j].text == attibuteHolder.value) {
				selectElement.options[j].selected = true;
			}
		}
	}
}