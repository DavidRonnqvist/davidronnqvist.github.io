class PointBuyOption {
	constructor(value, cost) {
		this.value = value;
		this.cost = cost;
	}

	toString() {
		return this.value;
	}
}

class AttibuteHolder {
	constructor(name, value) {
		this.name = name;
		this.value = value;
	}
}

class PointBuySystem {
	constructor(name, attributesList, pointBuyList, maxPoints, defaultValue) {
		this.name = name;
		this.maxPoints = maxPoints;
		this.defaultValue = defaultValue;

		this.pointBuyList = pointBuyList;

		this.attibuteHolders = [];

		for (var i = 0; i < attributesList.length;i++)
		{
			this.attibuteHolders[i] =new AttibuteHolder(attributesList[i], this.defaultValue);
		}
		
		this.UpdateLeftOverPoints();
	}

	toString() {
		return this.name;
	}

	GetAllowedSelection(attribute) {
		var selectedAttributeValue = this.attibuteHolders.find(x => x.name == attribute);
		var selectedCost = this.pointBuyList.find((x) => x.value == selectedAttributeValue.value).cost;
		var leftOver = this.leftOverPoints + selectedCost;
		var returnValue = this.pointBuyList.filter((x) => x.cost <= leftOver);;
		return returnValue;
	}

	UpdateValue(attribute, newValue) {
		var selectedAttributeValue = this.attibuteHolders.find(x => x.name == attribute);
		selectedAttributeValue.value = this.pointBuyList.find(x => x.toString() == newValue).value;
		this.UpdateLeftOverPoints();
	}

	GetSpentPoints() {
		var spentPoints = 0;

		for (var i = 0; i < this.attibuteHolders.length; i++) {
			var a = this.attibuteHolders[i];
			var d = this.pointBuyList.find((x) => x.value == a.value);
			spentPoints += d.cost;
		}

		return spentPoints;
	}

	UpdateMaxPoints(newMaxPoints) {
		this.maxPoints = newMaxPoints;
		this.UpdateLeftOverPoints();

		if (this.leftOverPoints < 0) {
			this.ResetValues();
		}
	}

	UpdateLeftOverPoints() {
		this.leftOverPoints = this.maxPoints - this.GetSpentPoints();
	}

	ResetValues() {
		for (var i = 0; i < this.attibuteHolders.length; i++) {
			this.attibuteHolders[i].value = this.defaultValue;
		}

		this.UpdateLeftOverPoints();
	}
}

var predefinedDndAttributes = [
	"Str",
	"Dex",
	"Con",
	"Wis",
	"Int",
	"Cha"];

var predefinedDndPointBuyList = [
	new PointBuyOption(8, 0),
	new PointBuyOption(9, 1),
	new PointBuyOption(10, 2),
	new PointBuyOption(11, 3),
	new PointBuyOption(12, 4),
	new PointBuyOption(13, 5),
	new PointBuyOption(14, 7),
	new PointBuyOption(15, 9)];

var homeBrewPointBuyList = [
	new PointBuyOption(3, -3),
	new PointBuyOption(4, -2),
	new PointBuyOption(5, -2),
	new PointBuyOption(6, -1),
	new PointBuyOption(7, -1),
	new PointBuyOption(8, 0),
	new PointBuyOption(9, 1),
	new PointBuyOption(10, 2),
	new PointBuyOption(11, 3),
	new PointBuyOption(12, 4),
	new PointBuyOption(13, 5),
	new PointBuyOption(14, 7),
	new PointBuyOption(15, 9),
	new PointBuyOption(16, 13),
	new PointBuyOption(17, 15),
	new PointBuyOption(18, 19)];

var pointHolders = [
	new PointBuySystem("dnd5e pointbuy", predefinedDndAttributes, predefinedDndPointBuyList, 27, 8),
	new PointBuySystem("homebrew pointbuy", predefinedDndAttributes, homeBrewPointBuyList, 30, 8)];

pointBuyHolder = pointHolders[0];

function initTable() {

	setupSystemSelector();

	var table = document.getElementById("attributes");
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

	refreshAvailiableOptions();
	resetOptions();
}

function setupSystemSelector() {
	
	var systemSelector = document.getElementById("systemSelector");
	systemSelector.addEventListener(
		'change',
		function () { updateSystemSelection(this.id); },
		false);

	refreshSystemOptionsValues();
}

function updateSystemSelection(nam) {
	var selectedElement = document.getElementById(nam);
	pointBuyHolder = pointHolders.find(x => x.toString() == selectedElement.value);
	clearAvailiableOptions();
	resetOptions();
}

function updateSelection(nam) {
	var selectedElement = document.getElementById(nam);
	pointBuyHolder.UpdateValue(nam, selectedElement.value);
	refreshAvailiableOptions();
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

function cleanAndUpdateOptions(selectElement, pointBuyList) {
	optionsAmount = selectElement.options.length;

	for (let i = selectElement.options.length -1; i >= 0; i--) {
		selectElement.options.remove(i);
	}

	for (let i = 0; i < pointBuyList.length; i++) {
		var optionValue = pointBuyList[i];
		var optionToAdd = document.createElement("option");
		optionToAdd.text = optionValue;
		selectElement.add(optionToAdd);
	}
}

function clearAssignedAttributes() {
	pointBuyHolder.ResetValues();
	refreshAvailiableOptions();
	resetOptions();
}

function maxPointChanged() {
	var maxPointsElement = document.getElementById("maxPoint")
	pointBuyHolder.UpdateMaxPoints(maxPointsElement.value);
	refreshAvailiableOptions();
	resetOptions();
}

function refreshAvailiableOptions() {
	for (var i = 0; i < pointBuyHolder.attibuteHolders.length; i++) {
		var attibuteHolder = pointBuyHolder.attibuteHolders[i];
		var id = attibuteHolder.name;
		var selectElement = document.getElementById(id);
		updateOptions(selectElement, pointBuyHolder.GetAllowedSelection(id));
	}

	var maxPointsElement = document.getElementById("maxPoint")
	maxPointsElement.value = pointBuyHolder.maxPoints;
	var leftoverPointsScoreElement = document.getElementById("leftOver")
	leftoverPointsScoreElement.innerHTML = pointBuyHolder.leftOverPoints;
}

function clearAvailiableOptions() {
	for (var i = 0; i < pointBuyHolder.attibuteHolders.length; i++) {
		var attibuteHolder = pointBuyHolder.attibuteHolders[i];
		var id = attibuteHolder.name;
		var selectElement = document.getElementById(id);
		cleanAndUpdateOptions(selectElement, pointBuyHolder.GetAllowedSelection(id));
	}

	var maxPointsElement = document.getElementById("maxPoint")
	maxPointsElement.value = pointBuyHolder.maxPoints;
	var leftoverPointsScoreElement = document.getElementById("leftOver")
	leftoverPointsScoreElement.innerHTML = pointBuyHolder.leftOverPoints;
}

function refreshSystemOptionsValues() {
	selectElement = document.getElementById("systemSelector");
	optionsAmount = selectElement.options.length;
	var skipIndex = 0;
	if (selectElement.options.length > 0) {
		skipIndex = selectElement.options.length;
	}

	if (skipIndex < pointHolders.length) {
		for (let i = skipIndex; i < pointHolders.length; i++) {
			var optionValue = pointHolders[i];
			var optionToAdd = document.createElement("option");
			optionToAdd.text = optionValue;
			selectElement.add(optionToAdd);
		}
	}
	else {
		for (let i = skipIndex; i >= pointHolders.length; i--) {
			selectElement.options.remove(i);
		}
	}
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