//this part simulates the REST endpoint result
let jsonData ='["Adam Ivan", "Marko Stjepan", "Stjepan Adam", "Robert Stjepan", "Fran Ivan", "Leopold Luka"]'; //the string that is formated as JSON
let jsonObject = JSON.parse(jsonData); //the JSON object parsed from JSON string
//end of REST endpoint result part

let allChilds = []; //array that holds all childs
let allParents = []; //array that holds all parents
let errors = false;

window.onload = onPageLoad(); //on window onload, the onPageLoad function is called

//method for adding all childs and parents to their arrays from JSON object
function setChildAndParentArray(json_object){
	for (i = 0; i < json_object.length; i++) {
		let currentData = json_object[i];
		let childAndParent = currentData.split(" ");
		allChilds.push(childAndParent[0]);
		allParents.push(childAndParent[1]);
	}
} //end setChildAndParentArray

//function that is called when page loads
function onPageLoad(){
	setChildAndParentArray(jsonObject);
	findError();
	if(errors == false){
	document.getElementById("familyTreeStructureDiv").innerHTML = getFamilyTreeStructure();
	}
} //end onPageLoad

//function for removing duplicate values in array, parameter array is array from which the duplicates will be removed, returns the array without duplicates
function removeArrayDuplicates(array){
	uniqueArray = array.filter(function(item, pos) {
    return array.indexOf(item) == pos;
	})
	return uniqueArray;
} //end removeArrayDuplicates

//function for making HTML unordered lists and list items, parameter array is array from which the list will be built, returns the HTML output
function setUnorderedList(array){
	let output = "<ul>";
	for(let i = 0; i < array.length; i++){
		//console.log(array[i]);
		//console.log(findAllParents(array[i]));
		let allPrts = findAllParents(array[i]).split(" ");
		output += "<li>" + array[i] + "</li>";
		let array2 = findChilds(array[i]);
		output += setUnorderedList(array2);
	}
	output += "</ul>";
	return output;
} //end setUnorderedList

//Function for determining if there is cyclic relationship error, param array is array of all parents from a child, param childName is child name
function checkForCyclicRelationshipsError(array, childName){
	let isError = false;
	for(let i = 0; i < array.length; i++){
		if(array[i] == childName){
			isError = true;
		}
	}
	return isError;
} //end checkForCyclicRelationshipsError

//function for finding cyclic relationships error
function findError(){
	try{
		for(let i = 0; i < allChilds.length; i++){
			let arr = findAllParents(allChilds[i]).split(".");
			let array = arr.filter(function(str) {
				return /\S/.test(str);
			});
			if(checkForCyclicRelationshipsError(findAllParents(allChilds[i]).split(" "), allChilds[i]) == true){
			
			}
		}
	} catch(err){
		if (err instanceof RangeError) {
		errors = true;
		document.getElementById("familyTreeStructureDiv").innerHTML = "<h2>ERROR: Cyclic relationship error!</h2>";
		}
	}
} //end findError

//function for finding the childs from parent, parentName parameter is parent's name
function findChilds(parentName){
	childs = [];
	for(let i = 0; i < jsonObject.length; i++){
		let childAndParent = jsonObject[i].split(" ");
		if(childAndParent[1] == parentName){
			childs.push(childAndParent[0]);
		}
	}
	if(childs.length == 0){
		return "";
	} else{
	return childs;
	}
} //end findChilds

//function for finding the parents from a child namd, parameter childName is child name
function findParents(childName){
	parents = [];
	for(let i = 0; i < jsonObject.length; i++){
		let childAndParent = jsonObject[i].split(" ");
		if(childAndParent[0] == childName){
			parents.push(childAndParent[1]);
		}
	}
	if(parents.length == 0){
		return "";
	} else{
	return parents;
	}
} //end findParents

//function for finding all parents of a child from the beginning, parameter childName is child name
function findAllParents(childName){
	_allParents = "";
	if(findParents(childName) == ""){
		return "";
	}
	_allParents += findParents(childName) + ".";
	_allParents += findAllParents(findParents(childName));
	return _allParents;
}// end findAllParents

//function for getting the family tree structure output, returns the HTML output
function getFamilyTreeStructure(){
	let htmlOutput = "";
	let oldestParents = [];
	for(let i = 0; i < allParents.length; i++){
		let isFound = false;
		for(let j = 0; j < allChilds.length; j++){ // j < is missed;
			if(allParents[i] == allChilds[j]){
				isFound = true;
				break; 
			}
		}
		if(isFound == false){
		oldestParents.push(allParents[i]);
		}
	}	
	oldestParents = removeArrayDuplicates(oldestParents);
	htmlOutput += setUnorderedList(oldestParents);
	return htmlOutput;
} //end getFamilyTreeStructure
