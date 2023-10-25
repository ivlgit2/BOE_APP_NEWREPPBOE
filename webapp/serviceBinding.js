function initModel() {
	var sUrl = "/abap/sap/opu/odata/BRI/SB_BEFILEGEN/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}