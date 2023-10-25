function initModel() {
	var sUrl = "/sap/opu/odata/bri/SB_BOE_VERSION/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}