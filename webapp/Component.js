sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"EXIM_IMPNBOE/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("EXIM_IMPNBOE.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			// create the views based on the url/hash
			this.getRouter().initialize();
			
			this.goItems = new sap.ui.model.json.JSONModel([]);
			this.goBoeHeader = new sap.ui.model.json.JSONModel([]);
			this.goBoeShipping = new sap.ui.model.json.JSONModel([]);
			this.goBoeAllocation = new sap.ui.model.json.JSONModel([]);
			this.goBoeDutycomp = new sap.ui.model.json.JSONModel([]);
			this.goBoedetail = new sap.ui.model.json.JSONModel([]);
				this.goBEData = new sap.ui.model.json.JSONModel([]);
			window.FlagRefresh=false;
			window.FromDocNumber="";
			window.BOEType="";
			//jQuery.sap.require("Cutsom.Formatter");
		}
	});
});