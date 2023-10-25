/*Check if the value is empty*/
function Check_empty(Value) {
	if (Value.trim().length == 0) {
		return false;
	}
	return true;
}
/* Check the length of the string*/
function Check_length(Value) {
	return Value.length;
}

jQuery.sap.declare("BOE.Formatter");

BOE.Formatter = {
	formatDate: function (value) { // value is the date
		var month, day, year;
		if (typeof value === 'undefined' || value === null || value == "00000000" || value == "") {
			return "";
		} else {
			if (value instanceof Date) {
				month = ("0" + (value.getMonth() + 1)).slice(-2);
				day = ("0" + value.getDate()).slice(-2);
				year = value.getFullYear();
			} else {
				year = value.substring(0, 4);
				month = value.substring(4, 6);
				day = value.substring(6, 8);
			}
			return day + "/" + month + "/" + year; // return the formatted date
		}
	},
	formatDecimal: function (value, scale, precision) {
		var val = value;
		if (value) {
			var integer = parseInt(precision, 10) - parseInt(scale, 10);
			val = val.split(".");
			val[0] = val[0].slice(0, integer);
			if (val.length > 1) {
				val[1] = val[1].slice(0, scale);
			}
			val = val.join(".");
		}
		return val;
	},
	formatDateandTime: function (value) { // value is the date 
		var year, month, day;
		if (typeof value === 'undefined' || value === null || value == "00000000" || value == "") {
			return "";
		} else {

			if (value instanceof Date) {
				month = ("0" + (value.getMonth() + 1)).slice(-2);
				day = ("0" + value.getDate()).slice(-2);
				year = value.getFullYear();
			} else {
				year = value.substring(0, 4);
				month = value.substring(5, 7);
				day = value.substring(8, 10);
			}
			return day + "/" + month + "/" + year; // return the formatted date
		}
	},
	formatAmount: function (value) { // value is the number
		if (typeof value === 'undefined' || value === null || value === "") {} else {
			//alert(parseInt(value.trim()));
			return parseFloat(value.trim());
			//	return	parseInt(value.trim()) ).toFixed(2);
		}
	},
	formatCheckedString: function (value) {
		if (value === "X") {
			return "Yes";
		} else {
			return "No";
		}
	},
	formatToSapDate: function (value) { // value is the date  
		if (typeof value === 'undefined' || value === null || value == "00000000" || value == "") {
			return "";
		} else {
			var splitval = value.split("/");
		}
		var year = splitval[2];
		var month = splitval[1];
		var day = splitval[0];
		return year + month + day; // return the formatted date
	},
	TrimValue: function (value) { // value is the date 
		if (typeof value === 'undefined' || value === null || value === "") {} else {
			//alert(parseInt(value.trim()));
			return (value.trim());
		}
	},

	formatDate_Hyphen: function (value) { // value is the date
		var year, month, day;
		if (typeof value === 'undefined' || value === null || value == "00000000" || value == "") {
			return "";
		} else {
			if (value instanceof Date) {
				month = ("0" + (value.getMonth() + 1)).slice(-2);
				day = ("0" + value.getDate()).slice(-2);
				year = value.getFullYear();
			} else {
				var splitval = value.split("-");
				year = splitval[0];
				month = splitval[1];
				day = splitval[2].substring(0, 2);
			}
		}
		return day + "/" + month + "/" + year; // return the formatted date
	},

	FormatDocTypes: function (value) { // value is the date 
		var Desc = "";
		if (value == "T") {
			Desc = "Transfer Bond";
		} else if (value == "Y") {
			Desc = "Into Bond";
		} else if (value == "CLIN") {
			Desc = "";
		}
		return (Desc);
	},
	formatCheckBox: function (value) {
		if (value === "X") {
			return true;
		} else {
			return false;
		}
	},
	formatLicenseDate: function (value) {
		if (value) {
			var year = value.substring(0, 4);
			var month = value.substring(5, 7);
			var day = value.substring(8, 10);
			return day + "/" + month + "/" + year; // return the formatted date
		}
	}
}