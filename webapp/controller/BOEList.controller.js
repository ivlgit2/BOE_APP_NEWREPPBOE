sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/core/util/File",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/core/util/Export"
], function (Controller, History, MessageBox, File, ExportTypeCSV, Export) {
	"use strict";
	return Controller.extend("EXIM_IMPNBOE.controller.BOEList", {
		onInit: function (oEvent) {
			this.ServiceURL = "/sap/opu/odata/BRI/";
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
			var NNDOoModelData = new sap.ui.model.json.JSONModel();
			NNDOoModelData.setData(this.getOwnerComponent().getModel("NNDOlist").getData());
			this.getView().setModel(NNDOoModelData, "NNDOlist");
			//this.getView().setModel(this.getOwnerComponent().getModel("NNDOlist"));
			/*	var oModelData = new sap.ui.model.json.JSONModel();
				oModelData.setData(this.getOwnerComponent().getModel("CmnModel").getData());
				this.getView().setModel(oModelData, "CmnModel");
				var VaroModelData = new sap.ui.model.json.JSONModel();
				VaroModelData.setData(this.getOwnerComponent().getModel("BOEDOCList").getData());
				this.getView().setModel(VaroModelData, "BOEDOCList");*/
		},
	_handleRouteMatched: async function (oEvent) {
			this.OnChangeMode();
			var _self = this;
			var filter = new Array();
			var filterval1 = new sap.ui.model.Filter("modid", sap.ui.model.FilterOperator.Contains, "BOE");
			filter.push(filterval1);
			this.status_array = new Array();
			_self.getOwnerComponent().getModel("Config_Model").read("/xbrixi_docflowstat", {
				filters: filter,
				success: function (getData) {
					if (getData.results.length > 0) {
						for (var i = 0; i < getData.results.length; i++) {
							_self.getStatusCheck(getData.results[i].curstat)
								.then(_self.getStatusCheck(getData.results[i].nexstat))
								.then(_self.getStatusCheck(getData.results[i].prestat))
								.then(function () {
									var f = [];
									_self.ValarrayData = {
										results: []
									};
									_self.status_array.results = _self.status_array;
									_self.status_array.results.map(function (item) {
										var check = f.filter(function (s) {
											return s.status == item.status;
										})
										if (check.length == 0) {
											f.push(item);
										}
									})
									_self.ValarrayData.results = f;
									var oModelRefDocListData = new sap.ui.model.json.JSONModel([]);
									oModelRefDocListData.setData(_self.ValarrayData);
									_self.getView().setModel(oModelRefDocListData, "BOE_StatusModel");
								});
						}
					}
				},
				error: function () {
					console.log("Error");
				}
			});

			var startupParams = "";
			if (this.getOwnerComponent().getComponentData()) {
				startupParams = this.getOwnerComponent().getComponentData().startupParameters; // get Startup params from Owner Component
			}
			if ((startupParams != "" && startupParams.Ref_Number && startupParams.Ref_Number[0])) {
				this._OpenBusyDialog();
				var refNo = startupParams.Ref_Number[0];
				this.getOwnerComponent().getComponentData().startupParameters = "";
				this.DisplayView("Display", refNo);
			} else {
				if (window.FlagRefresh) {
					if (window.FromDocNumber) {
						this.SelectedSubCat = "";
						this.byId("idBOEType").setSelectedKey(window.BOEType);
						await this.OnChangeCategory();
						this.getView().byId("idNNDOnoFrom").setValue(window.FromDocNumber);
					}
					this.onSearch(oEvent);
					window.FlagRefresh = false;
					window.FromDocNumber = "";
					window.BOEType = "";
				}
			}
		},
		_OpenBusyDialog: function () {
			if (!this.bsdalog) {
				this.bsdalog = sap.ui.xmlfragment(this.getView().getId(), "EXIM_IMPNBOE.view.fragments.BusyDialoge", this);
				this.getView().addDependent(this.bsdalog);
			}
			this.bsdalog.open();
			/*	jQuery.sap.delayedCall(1000, this, function () {
					this.bsdalog.close();
				});*/
		},
		_CloseBusyDialog: function () {
			this.bsdalog.close();
		},
		OnDocNoSuggest: function () {
			if (this.SelectedMode == "D") {
				this._SearchHelpSelect(this.selBOEtype);
			}
			if (this.SelectedMode != "D") {
				this._SearchHelpSelect(this.SelectedSubCat);
			}
			var itemTemplate = new sap.ui.core.Item();
			if (this.SelectedMode == "D") {
				itemTemplate.bindProperty("text", "NNDOnosearchHelp>docno");
				this.getView().byId("idNNDOnoFrom").bindAggregation("suggestionItems", "NNDOnosearchHelp>/xBRIxi_iidbehdr", itemTemplate);
			} else {
				itemTemplate.bindProperty("text", "NNDOnosearchHelp>docnr");
				this.getView().byId("idNNDOnoFrom").bindAggregation("suggestionItems", "NNDOnosearchHelp>/xBRIxI_IIDCLDOCHDR", itemTemplate);
			}
		},
		OnCustBOENoSuggest: function () {
			if (this.SelectedMode == "D") {
				this._SearchHelpSelect(this.selBOEtype);
			}
			if (this.SelectedMode != "D") {
				this._SearchHelpSelect(this.SelectedSubCat);
			}
			var itemTemplate = new sap.ui.core.Item();
			if (this.SelectedMode == "D") {
				itemTemplate.bindProperty("text", "NNDOnosearchHelp>impdpsno");
				this.getView().byId("idCustBOEno").bindAggregation("suggestionItems", "NNDOnosearchHelp>/xBRIxi_iidbehdr", itemTemplate);
			} else {
				itemTemplate.bindProperty("text", "NNDOnosearchHelp>docnr");
				this.getView().byId("idCustBOEno").bindAggregation("suggestionItems", "NNDOnosearchHelp>/xBRIxI_IIDCLDOCHDR", itemTemplate);
			}
		},
		_SearchHelpSelect: function (type) {
			var ModelData;
			var oModelDataRefDocs = new sap.ui.model.json.JSONModel();
			var filters = new Array();
			var _self = this;
			if (type == "C") {
				var filterval = new sap.ui.model.Filter("Doccat", sap.ui.model.FilterOperator.Contains, 'CLIN');
				filters.push(filterval);
			} else if ((type == "Y") || (type == "T") || (type == "E") || (type == "W") || (type == "B")) {
				var filterval = new sap.ui.model.Filter("doctyp", sap.ui.model.FilterOperator.Contains, type);
				filters.push(filterval);
			}
			/*}else if(type=="Y"){
				//Search help F4 for into bond 
				var sUrlnndo = this.ServiceURL+"SHLP_SER_BOE_SRV/BoeSet?$filter=Doctyp eq 'Y'";
				var oModelDataNNDOno = new sap.ui.model.json.JSONModel();
				oModelDataNNDOno.loadData(sUrlnndo, null, false);
				ModelData = oModelDataNNDOno.getData().d;
			}*/
		},
		// OnChangeCategory: function (oEvent) {
		// 	this._OpenBusyDialog();
		// 	var getView = this.getView();
		// 	var BindData = "";
		// 	var YBOECategory = {
		// 		"results": [{
		// 			"key": "C",
		// 			"text": "Clearing Instrctions"
		// 		}, {
		// 			"key": "T",
		// 			"text": "Transfer Bond"
		// 		}]
		// 	};
		// 	var TGBOECategory = {
		// 		"results": [{
		// 			"key": "Y",
		// 			"text": "Into Bond"
		// 		}]
		// 	};
		// 	var WGBOECategory = {
		// 		"results": [{
		// 			"key": "C",
		// 			"text": "Clearing Instructions"
		// 		}]
		// 	};
		// 	getView.byId("IdSubCategory").setSelectedKey(null);
		// 	this.selBOEtype = this.byId("idBOEType").getSelectedKey();
		// 	this._fnInitialSettings(true, true, false, "BOE");
		// 	if (this.selBOEtype == "T" || this.selBOEtype == "G") {
		// 		BindData = TGBOECategory;
		// 	} else if (this.selBOEtype == "Y") {
		// 		BindData = YBOECategory;
		// 	} else if (this.selBOEtype == "W") {
		// 		BindData = WGBOECategory;
		// 	}
		// 	var ModelsubCat = getView.getModel("subcategory");
		// 	if (ModelsubCat) {
		// 		ModelsubCat.setData("");
		// 		ModelsubCat.refresh();
		// 	} else {
		// 		ModelsubCat = new sap.ui.model.json.JSONModel([]);
		// 		getView.setModel(ModelsubCat, "subcategory");
		// 	}
		// 	ModelsubCat.setData(BindData);
		// 	ModelsubCat.refresh();
		// 	getView.byId("IdSubCategory").setEnabled(true);
		// 	getView.byId("IdSubCategory").setValue("");
		// 	/*NNDO Search Help*/
		// 	var _self = this;
		// 	var filters = new Array();
		// 	var filterval = new sap.ui.model.Filter("doctyp", sap.ui.model.FilterOperator.Contains, this.selBOEtype);
		// 	filters.push(filterval);
		// 	var oModelData = new sap.ui.model.json.JSONModel();
		// 	var sorters = new Array();
		// 	var sortval = new sap.ui.model.Sorter("docno", true, false);
		// 	sorters.push(sortval);
		// 	this.getOwnerComponent().getModel("BOEDOCList").read("/xBRIxi_iidbehdr", {
		// 		urlParameters: {
		// 			$top: "5000"
		// 		},
		// 		filters: filters,
		// 		sorters: sorters,
		// 		success: function (getData) {
		// 			oModelData.setData(getData);
		// 			_self.getView().setModel(oModelData, "NNDOnosearchHelp");
		// 		},
		// 		error: function (error) {
		// 			MessageBox.error("Something Went Wrong . Please Try again Later");
		// 		}
		// 	});
		// 	/**/
		// 	/*	if (sap.ushell.Container) {
		// 			this.userId = sap.ushell.Container.getService("UserInfo").getId().toUpperCase();
		// 			this.getOwnerComponent().getModel("CmnModel").read("/vendor_email", {
		// 				urlParameters: {
		// 					$top: "500"
		// 				},
		// 				success: function (getData) {
		// 					if (getData.results.length > 0) {
		// 						_self.chaCodelogin = getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X")[0].lifnr;
		// 						_self.chaDesclogin = getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X")[0].name1;
		// 						_self.getView().byId("idNNDOreqVendorname").setValue(_self.chaCodelogin);
		// 						_self.getView().byId("idNNDOreqVendorname").setEnabled(false);
		// 					}
		// 				},
		// 				error: function (response) {}
		// 			});
		// 		}*/
		// 	this.LoginUser = false;
		// 	this.vendorDetails = {
		// 		results: []
		// 	};
		// 	var oModelDataCHA = new sap.ui.model.json.JSONModel([]);
		// 	if (sap.ushell.Container) {
		// 		this.userId = sap.ushell.Container.getService("UserInfo").getId().toUpperCase();

		// 		this.getOwnerComponent().getModel("CmnModel").read("/vendor_email", {
		// 			urlParameters: {
		// 				$top: "5000"
		// 			},
		// 			success: function (getData) {
		// 				console.log(getData);
		// 				if (getData.results.length > 0) {
		// 					if (getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X").length > 0) {
		// 						_self.LoginUser = true;
		// 						_self.chaCodelogin = getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X")[0].lifnr;
		// 						_self.chaDesclogin = getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X")[0].name1;
		// 						_self.getView().byId("Vendor").setValue(_self.chaCodelogin);
		// 						_self.getView().byId("Vendor").setValueHelpOnly(true);
		// 						_self.vendorDetails.results = getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X");
		// 						if (getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X").length == 1) {
		// 							_self.getView().byId("Vendor").setEnabled(false);
		// 						}
		// 					} else {
		// 						//	_self.vendorDetails.results = getData.results;
		// 						_self.LoginUser = false;
		// 						_self.vendorDetails.results = getData.results.filter(fil => fil.cha == "X");
		// 						_self.byId("Vendor").setValueHelpOnly(false);
		// 					}

		// 					/***Additional Code***/
		// 					var array = _self.vendorDetails.results;
		// 					var result = Array.from(new Set(array.map(s => s.lifnr))).map(id => {
		// 						return {
		// 							lifnr: id,
		// 							name1: array.find(s => s.lifnr == id).name1,
		// 							cha: array.find(s => s.lifnr == id).cha,
		// 							chacode: array.find(s => s.lifnr == id).chacode,
		// 							email_id: array.find(s => s.lifnr == id).email_id
		// 						}
		// 					});
		// 					/***Additional Code***/
		// 					_self.vendorDetails.results = result;
		// 					oModelDataCHA.setData(_self.vendorDetails);
		// 					_self.getView().setModel(oModelDataCHA, "VendorSerchData");
		// 					_self._CloseBusyDialog();
		// 				}
		// 			},
		// 			error: function (response) {
		// 				_self._CloseBusyDialog();
		// 				console.log(response);
		// 			}
		// 		});
		// 	} else {

		// 		this.getOwnerComponent().getModel("CmnModel").read("/vendor_email", {
		// 			urlParameters: {
		// 				$top: "5000"
		// 			},
		// 			success: function (getData) {
		// 				if (getData.results.length > 0) {
		// 					_self.LoginUser = false;
		// 					console.log(getData);
		// 					_self.vendorDetails.results = getData.results.filter(fil => fil.cha == "X");
		// 					/***Additional Code***/
		// 					var array = _self.vendorDetails.results;
		// 					var result = Array.from(new Set(array.map(s => s.lifnr))).map(id => {
		// 						return {
		// 							lifnr: id,
		// 							name1: array.find(s => s.lifnr == id).name1,
		// 							cha: array.find(s => s.lifnr == id).cha,
		// 							chacode: array.find(s => s.lifnr == id).chacode,
		// 							email_id: array.find(s => s.lifnr == id).email_id
		// 						}
		// 					});
		// 					/***Additional Code***/
		// 					_self.vendorDetails.results = result;

		// 					oModelDataCHA.setData(_self.vendorDetails);
		// 					_self.getView().setModel(oModelDataCHA, "VendorSerchData");
		// 					_self._CloseBusyDialog();
		// 				}
		// 			},
		// 			error: function (response) {
		// 				_self._CloseBusyDialog();
		// 			}
		// 		});

		// 	}

		// },//Commentd Aiswarya for adding Riji's new code
			OnChangeCategory: async function (oEvent) {
			//return new Promise((resolve, reject) => {
			this._OpenBusyDialog();
			var getView = this.getView();
			var BindData = "";
			var YBOECategory = {
				"results": [{
					"key": "C",
					"text": "Clearing Instrctions"
				}, {
					"key": "T",
					"text": "Transfer Bond"
				}]
			};
			var TGBOECategory = {
				"results": [{
					"key": "Y",
					"text": "Into Bond"
				}]
			};
			var WGBOECategory = {
				"results": [{
					"key": "C",
					"text": "Clearing Instructions"
				}]
			};
			getView.byId("IdSubCategory").setSelectedKey(null);
			this.selBOEtype = this.byId("idBOEType").getSelectedKey();
			this._fnInitialSettings(true, true, false, "BOE");
			if (this.selBOEtype == "T" || this.selBOEtype == "G") {
				BindData = TGBOECategory;
			} else if (this.selBOEtype == "Y") {
				BindData = YBOECategory;
			} else if (this.selBOEtype == "W") {
				BindData = WGBOECategory;
			}
			var ModelsubCat = getView.getModel("subcategory");
			if (ModelsubCat) {
				ModelsubCat.setData("");
				ModelsubCat.refresh();
			} else {
				ModelsubCat = new sap.ui.model.json.JSONModel([]);
				getView.setModel(ModelsubCat, "subcategory");
			}
			ModelsubCat.setData(BindData);
			ModelsubCat.refresh();
			getView.byId("IdSubCategory").setEnabled(true);
			getView.byId("IdSubCategory").setValue("");
			/*NNDO Search Help*/
			var _self = this;
			var filters = new Array();
			var filterval = new sap.ui.model.Filter("doctyp", sap.ui.model.FilterOperator.Contains, this.selBOEtype);
			filters.push(filterval);
			var oModelData = new sap.ui.model.json.JSONModel();
			var sorters = new Array();
			var sortval = new sap.ui.model.Sorter("docno", true, false);
			sorters.push(sortval);
			/**/
			/*	if (sap.ushell.Container) {
					this.userId = sap.ushell.Container.getService("UserInfo").getId().toUpperCase();
					this.getOwnerComponent().getModel("CmnModel").read("/vendor_email", {
						urlParameters: {
							$top: "500"
						},
						success: function (getData) {
							if (getData.results.length > 0) {
								_self.chaCodelogin = getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X")[0].lifnr;
								_self.chaDesclogin = getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X")[0].name1;
								_self.getView().byId("idNNDOreqVendorname").setValue(_self.chaCodelogin);
								_self.getView().byId("idNNDOreqVendorname").setEnabled(false);
							}
						},
						error: function (response) {}
					});
				}*/
			this.getOwnerComponent().getModel("BOEDOCList").read("/xBRIxi_iidbehdr", {
				urlParameters: {
					$top: "5000"
				},
				filters: filters,
				sorters: sorters,
				success: function (getData) {
					oModelData.setData(getData);
					_self.getView().setModel(oModelData, "NNDOnosearchHelp");
				},
				error: function (error) {
					MessageBox.error("Something Went Wrong . Please Try again Later");
				}
			});
			await this.getVendorDetails();
			//resolve();
			//});
		},
		getVendorDetails: async function () {
			return new Promise((resolve, reject) => {
				var _self = this;
				this.LoginUser = false;
				this.vendorDetails = {
					results: []
				};
				var oModelDataCHA = new sap.ui.model.json.JSONModel([]);
				if (sap.ushell.Container) {
					this.userId = sap.ushell.Container.getService("UserInfo").getId().toUpperCase();

					this.getOwnerComponent().getModel("CmnModel").read("/vendor_email", {
						urlParameters: {
							$top: "5000"
						},
						success: async function (getData) {
							console.log(getData);
							if (getData.results.length > 0) {
								if (getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X").length > 0) {
									_self.LoginUser = true;
									_self.chaCodelogin = getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X")[0].lifnr;
									_self.chaDesclogin = getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X")[0].name1;
									_self.getView().byId("Vendor").setValue(_self.chaCodelogin);
									_self.getView().byId("Vendor").setValueHelpOnly(true);
									_self.vendorDetails.results = getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X");
									if (getData.results.filter(fil => fil.email_id == _self.userId && fil.cha == "X").length == 1) {
										_self.getView().byId("Vendor").setEnabled(false);
									}
								} else {
									//	_self.vendorDetails.results = getData.results;
									_self.LoginUser = false;
									_self.vendorDetails.results = getData.results.filter(fil => fil.cha == "X");
									_self.byId("Vendor").setValueHelpOnly(false);
								}

								/***Additional Code***/
								var array = _self.vendorDetails.results;
								var result = Array.from(new Set(array.map(s => s.lifnr))).map(id => {
									return {
										lifnr: id,
										name1: array.find(s => s.lifnr == id).name1,
										cha: array.find(s => s.lifnr == id).cha,
										chacode: array.find(s => s.lifnr == id).chacode,
										email_id: array.find(s => s.lifnr == id).email_id
									}
								});
								/***Additional Code***/
								_self.vendorDetails.results = result;
								oModelDataCHA.setData(_self.vendorDetails);
								_self.getView().setModel(oModelDataCHA, "VendorSerchData");
								_self._CloseBusyDialog();
							}
							resolve();
						},
						error: function (response) {
							_self._CloseBusyDialog();
							console.log(response);
							reject();
						}
					});
				} else {
					this.getOwnerComponent().getModel("CmnModel").read("/vendor_email", {
						urlParameters: {
							$top: "5000"
						},
						success: async function (getData) {
							if (getData.results.length > 0) {
								_self.LoginUser = false;
								console.log(getData);
								_self.vendorDetails.results = getData.results.filter(fil => fil.cha == "X");
								/***Additional Code***/
								var array = _self.vendorDetails.results;
								var result = Array.from(new Set(array.map(s => s.lifnr))).map(id => {
									return {
										lifnr: id,
										name1: array.find(s => s.lifnr == id).name1,
										cha: array.find(s => s.lifnr == id).cha,
										chacode: array.find(s => s.lifnr == id).chacode,
										email_id: array.find(s => s.lifnr == id).email_id
									}
								});
								/***Additional Code***/
								_self.vendorDetails.results = result;

								oModelDataCHA.setData(_self.vendorDetails);
								_self.getView().setModel(oModelDataCHA, "VendorSerchData");
								_self._CloseBusyDialog();
							}
							resolve();
						},
						error: function (response) {
							_self._CloseBusyDialog();
							reject();
						}
					});
				}
			});
		},
		
		OnChangeSubCategory: function (oEvent) {
			this.SelectedSubCat = oEvent.getSource().getSelectedKey();
			var oModelDataRefDocs = new sap.ui.model.json.JSONModel();
			this._fnInitialSettings(true, true, true, "");
		},
		ReadRecordDetails: function (Type, RefNumber) {
			var _self = this;
			_self.omodel.read("/xBRIxi_iidbehdr(doctyp='" + _self.Doc + "',docno='" + _self.Dno + "')", {
				urlParameters: {

					"$expand": "to_itemdetails,to_shippingdetails,to_Salo,to_dutydetails,to_BE_BOE,to_swc_be,to_pro_be,to_ctrl_be,to_I_RSP_BE,to_I_DEPB_BE,to_I_reimport_be,to_I_statemet_be,to_I_be_sup_doc,to_I_be,to_I_EXCHANGE_BE,to_I_HSS_BE,to_I_PERM_BE,to_I_CERT_BE,to_I_iid_ctx_be,to_I_AMEND_BE,to_I_IGMS_BE"
				},
				success: function (oData) {
					_self._CloseBusyDialog();
					_self.getView().getModel("boeHeader").setData(oData);
					_self.getView().getModel("boeItems").setData(oData.to_itemdetails);
					_self.getView().getModel("boeShipping").setData(oData.to_shippingdetails);
					_self.getView().getModel("boeAllocation").setData(oData.to_Salo);
					_self.getView().getModel("boeDutyComp").setData(oData.to_dutydetails);
					_self.getView().getModel("AdditionalInfo").setData(oData.to_BE_BOE);
					_self.getView().getModel("ConstituemtsInfo").setData(oData.to_swc_be);
					_self.getView().getModel("ProductionInfo").setData(oData.to_pro_be);
					_self.getView().getModel("ControlInfo").setData(oData.to_ctrl_be);
					_self.getView().getModel("I_RSP_BE_Info").setData(oData.to_I_RSP_BE);
					_self.getView().getModel("I_DEPB_BE_Info").setData(oData.to_I_DEPB_BE);
					_self.getView().getModel("I_reimport_be_Info").setData(oData.to_I_reimport_be);
					_self.getView().getModel("I_statemet_be_Info").setData(oData.to_I_statemet_be);
					_self.getView().getModel("I_be_sup_doc_Info").setData(oData.to_I_be_sup_doc);
					_self.getView().getModel("boeBEdetails").setData(oData.to_I_be);
					_self.getView().getModel("boeExchgDetails").setData(oData.to_I_EXCHANGE_BE);
					_self.getView().getModel("boePmsnDetails").setData(oData.to_I_PERM_BE);
					_self.getView().getModel("boeCetDetails").setData(oData.to_I_CERT_BE);
					_self.getView().getModel("boeCtxDetails").setData(oData.to_I_iid_ctx_be);
					_self.getView().getModel("boeHSSDetails").setData(oData.to_I_HSS_BE);
					_self.getView().getModel("boeIGMDetails").setData(oData.to_I_IGMS_BE);
					//boeHSSDetails
					_self.getView().getModel("boeAmndtDetails").setData(oData.to_I_AMEND_BE);
					if (Type == "Display") {
						_self.router.navTo("nndodetail1", {
							Mode: "U",
							docnr: RefNumber,
							strtup: "STR_PRMS"
						});
					} else {
						_self.router.navTo("nndodetail", {
							Mode: "U",
							docnr: RefNumber
						});
					}
				},
				errror: function (oData) {
					_self._CloseBusyDialog();
					MessageBox.error("Something Went Wrong . Please Try again Later");
				}
			});
		},
		DisplayView: function (type, RefNo) {
			this._OpenBusyDialog();
			var _self = this;
			_self.Doc = "";
			var filters = new Array();
			var filterval = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.Contains, RefNo);
			filters.push(filterval);
			window.FlagDetailLoad = true;
			this.omodel = this.getOwnerComponent().getModel("BOEDOCList");
			this.omodel.read("/xBRIxi_iidbehdr", {
				filters: filters,
				success: function (getData) {
					_self.selBOEtype = getData.results[0].doctyp;
					_self.Doc = getData.results[0].doctyp;
					_self.Dno = getData.results[0].docno;
					_self.ReadRecordDetails(type, RefNo);
				},
				error: function (error) {
					_self._CloseBusyDialog();
					MessageBox.error("Something Went Wrong . Please Try again Later");
				}
			});
		},
		SetModelData: function (RefNumber) {
			var _self = this;
			var filters = new Array();
			var filterval = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.Contains, RefNumber);
			filters.push(filterval);
			this.omodel = this.getOwnerComponent().getModel("BOEDOCList");
			return new Promise((resolve, reject) => {
				_self.omodel.read("/xBRIxi_iidbehdr", {
					filters: filters,
					success: function (getData) {
						_self.Doc = getData.results[0].doctyp;
						_self.Dno = getData.results[0].docno;
						_self.omodel.read("/xBRIxi_iidbehdr(doctyp='" + _self.Doc + "',docno='" + _self.Dno + "')", {
							urlParameters: {
								"$expand": "to_itemdetails,to_shippingdetails,to_Salo,to_dutydetails"
							},
							success: function (oData) {
								_self.InvItemData = oData.to_itemdetails;
								_self.LicenseData = oData.to_Salo;
								_self.DutyData = oData.to_dutydetails;
								_self.ShippingDetails = oData.to_shippingdetails;
								_self.boeHeaderData = oData;
								resolve();
							},
							errror: function (oData) {
								MessageBox.error("Something Went Wrong . Please Try again Later");
								reject();
							}
						});
					},
					error: function (error) {
						console.log("error");
					}
				});
			});
		},
		onPressDocNo: function (oEvent) {
			var sel = oEvent.getSource().getParent().oBindingContexts.sPath;

			var RefNumber = oEvent.getSource().getParent().getCells()[0].getText();
			window.FlagDetailLoad = true;
			this.DisplayView("View", RefNumber);
			/*	//	var NNDOId = oEvent.getSource().getText();
				//	var _self = this;
				//this.omodel = this.getOwnerComponent().getModel("BOEDOCList");
				//this.Doc = this.selBOEtype;
				//this.Dno = RefNumber;
				//this.ReadRecordDetails("View", RefNumber);*/
			/*Added by sneha for Grandchild entity read*/
			/*	this.omodel.read("/xBRIxi_iidbehdr(doctyp='" + this.selBOEtype + "',docno='" + RefNumber + "')/to_itemdetails", {
					urlParameters: {
						"$expand": "to_Salo,to_dutydetails"
					},
					success: function (oData) {
						_self.getView().getModel("boeItems").setData(oData);
						//_self.getView().getModel("boeAllocation").setData(oData.results[0].to_Salo);
						//_self.getView().getModel("boeDutyComp").setData(oData.results[0].to_dutydetails);
						_self.router.navTo("nndodetail", {
							Mode: "U",
							docnr: RefNumber
						});
					},
					errror: function (oData) {
						MessageBox.error("Something Went Wrong . Please Try again Later");
					}
				});*/
		},
		getStatusCheck: function (StatusNo) {
			var _self = this;
			var filter = new Array();
			return new Promise((resolve, reject) => {
				var FilterVal = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, StatusNo);
				filter.push(FilterVal);
				_self.getOwnerComponent().getModel("Config_Model").read("/xBRIxI_DOCSTAT", {
					filters: filter,
					success: function (getData) {
						if (getData.results[0]) {
							_self.status_array.push(getData.results[0]);
						}
						resolve();
					},
					error: function () {
						reject();
					}
				});
			});
		},
		OnPressCreateNNDO: function (oEvent) {
			this.router.navTo("refdoclist", true);
		},
		handleCustBoEValueHelp: function (oEvent) {

			/*	if (this.SelectedMode == "D") {
					this._SearchHelpSelect(this.selBOEtype);
				}
				if (this.SelectedMode != "D") {
					this._SearchHelpSelect(this.SelectedSubCat);
				}*/
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			/* create value help dialog*/
			var DocType = this.getView().byId("idBOEType").getSelectedKey();
			var _self = this;
			if (!this._valueHelpCustBOEDialog) {
				this._valueHelpCustBOEDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpCustBOE", this);
				this.getView().addDependent(this._valueHelpCustBOEDialog);
			}
			this._valueHelpCustBOEDialog.open(sInputValue);
		},
		/* On press of NNDO from list  search list*/
		handleNNDOValueHelpFrom: function (oEvent) {

			if (this.SelectedMode == "D") {
				this._SearchHelpSelect(this.selBOEtype);
			}
			if (this.SelectedMode != "D") {
				this._SearchHelpSelect(this.SelectedSubCat);
			}
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			/* create value help dialog*/
			var DocType = this.getView().byId("idBOEType").getSelectedKey();
			var _self = this;
			if (!this._valueHelpNNDOFromDialog) {
				this._valueHelpNNDOFromDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpNNDOFrom", this);
				this.getView().addDependent(this._valueHelpNNDOFromDialog);
			}
			this._valueHelpNNDOFromDialog.open(sInputValue);
		},
		_handleValueHelpClose_NNDOFrom: function (oEvent) {
			var _self = this;
			var json = "";
			if (oEvent.getParameter("selectedItem")) {
				var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
				if (oSelectedItem) {

					var reqNoInputFrom = this.getView().byId("idNNDOnoFrom");
					reqNoInputFrom.setValue(oSelectedItem);
					if (this.getView().byId("idBOEType").getSelectedKey() == "Y") {
						var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
						/*	MessageBox.show("Do you want to create Ex bond?", {
								icon: sap.m.MessageBox.Icon.INFORMATION,
								title: "Information",
								actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
								id: "messageBoxId1",
								defaultAction: sap.m.MessageBox.Action.NO,
							
								styleClass: bCompact ? "sapUiSizeCompact" : "",
								onClose: function (oAction) {
									
									if (oAction === sap.m.MessageBox.Action.YES) {
										_self._OpenBusyDialog();
										_self.SetModelData(oSelectedItem)
											.then(function () {
												json = _self._FnUpdateHeader(_self._FnConvertJSON(_self.boeHeaderData), oSelectedItem);
												if (json != "") {
													_self.getOwnerComponent().getModel("BOEDOCList").create("/xBRIxi_iidbehdr", json, {
														success: function (oData, response) {
															var statusText = JSON.parse(response.headers['sap-message']).message;
															MessageBox.success(statusText, {
																actions: [sap.m.MessageBox.Action.OK],
																onClose: function (oAction) {
																	if (oAction === sap.m.MessageBox.Action.OK) {
																		_self._CloseBusyDialog();
																	}
																}
															});
														},
														error: function (Error, response) {
															if (Error.responseText) {
																var Msg = JSON.parse(Error.responseText).error.message.value;
																MessageBox.error(Msg);
															} else {
																MessageBox.error("Something went wrong. Please try again later.");
															}
															_self._CloseBusyDialog();
														}
													});
												}
											});
									}

								}
							});*/
					}
				}
				oEvent.getSource().getBinding("items").filter([]);
			}
		},
		_handleValueHelpClose_CustBOENo: function (oEvent) {
			var _self = this;
			var json = "";
			if (oEvent.getParameter("selectedItem")) {
				var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
				if (oSelectedItem) {

					var reqNoInputFrom = this.getView().byId("idCustBOEno");
					reqNoInputFrom.setValue(oSelectedItem);
					if (this.getView().byId("idBOEType").getSelectedKey() == "Y") {
						var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
						/*	MessageBox.show("Do you want to create Ex bond?", {
								icon: sap.m.MessageBox.Icon.INFORMATION,
								title: "Information",
								actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
								id: "messageBoxId1",
								defaultAction: sap.m.MessageBox.Action.NO,
							
								styleClass: bCompact ? "sapUiSizeCompact" : "",
								onClose: function (oAction) {
									
									if (oAction === sap.m.MessageBox.Action.YES) {
										_self._OpenBusyDialog();
										_self.SetModelData(oSelectedItem)
											.then(function () {
												json = _self._FnUpdateHeader(_self._FnConvertJSON(_self.boeHeaderData), oSelectedItem);
												if (json != "") {
													_self.getOwnerComponent().getModel("BOEDOCList").create("/xBRIxi_iidbehdr", json, {
														success: function (oData, response) {
															var statusText = JSON.parse(response.headers['sap-message']).message;
															MessageBox.success(statusText, {
																actions: [sap.m.MessageBox.Action.OK],
																onClose: function (oAction) {
																	if (oAction === sap.m.MessageBox.Action.OK) {
																		_self._CloseBusyDialog();
																	}
																}
															});
														},
														error: function (Error, response) {
															if (Error.responseText) {
																var Msg = JSON.parse(Error.responseText).error.message.value;
																MessageBox.error(Msg);
															} else {
																MessageBox.error("Something went wrong. Please try again later.");
															}
															_self._CloseBusyDialog();
														}
													});
												}
											});
									}

								}
							});*/
					}
				}
				oEvent.getSource().getBinding("items").filter([]);
			}
		},
		_handleValueHelpSearch_NNDOFrom: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("chacode", sap.ui.model.FilterOperator.Contains, sValue)
				],
				and: false
			});
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpSearch_CustBOENo: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("impdpsno", sap.ui.model.FilterOperator.Contains, sValue),

				],
				and: false
			});
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		/* On press of NNDO TO list  search list*/
		handleNNDOValueHelpTo: function (oEvent) {
			if (this.SelectedMode == "D") {
				this._SearchHelpSelect(this.selBOEtype);
			}
			if (this.SelectedMode != "D") {
				this._SearchHelpSelect(this.SelectedSubCat);
			}
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			var DocType = this.getView().byId("idBOEType").getSelectedKey();
			var _self = this;
			if (!_self._valueHelpNNDOToDialog) {
				_self._valueHelpNNDOToDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpNNDOTo", _self);
				_self.getView().addDependent(_self._valueHelpNNDOToDialog);
			}
			_self._valueHelpNNDOToDialog.open(sInputValue);
		},
		_handleValueHelpClose_NNDOTo: function (oEvent) {
			if (oEvent.getParameter("selectedItem")) {
				var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
				if (oSelectedItem) {
					var reqNoInputTo = this.getView().byId("idNNDOnoTo");
					reqNoInputTo.setValue(oSelectedItem);
				}
				oEvent.getSource().getBinding("items").filter([]);
			}
		},
		_handleValueHelpSearch_NNDOTo: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("chacode", sap.ui.model.FilterOperator.Contains, sValue)
				],
				and: false
			});
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		/**
		 * Search help F4 for vendor name
		 */
		handleVendorValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpVendorDialog) {
				this._valueHelpVendorDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpVendor", this);
				this.getView().addDependent(this._valueHelpVendorDialog);
			}
			this._valueHelpVendorDialog.open(sInputValue);
		},
		handleValueHelp_CHA: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			if (!this._valueHelpCHADialog) {
				this._valueHelpCHADialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.chaDialog", this);
				this.getView().addDependent(this._valueHelpCHADialog);
			}
			this._valueHelpCHADialog.open(sInputValue);
		},

		_handleValueHelpClose_Vendor: function (oEvent) {
			if (oEvent.getParameter("selectedItem")) {
				var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
				if (oSelectedItem) {
					var vendorInput = this.getView().byId("Vendor");
					vendorInput.setValue(oSelectedItem);
				}
				oEvent.getSource().getBinding("items").filter([]);
			}
		},
		_handleValueHelpSearch_Vendor: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("lifnr", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, sValue)
				],
				and: false
			});
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		onSearch: function (oEvent) {
			this._OpenBusyDialog();
			var _self = this;
			this.getView().byId('idnndoTable').setVisible(false);
			this.getView().byId('downloadBtn').setVisible(false);

			var NNDOnoFrom, NNDOnoTo, NNDODaterange, CustomsDaterange, NNDOvender, DESTPort, CUSTBoeNO, ImpCord, CFTCord, ModeShp, ETA, Ebelen, ETD, UJNo,
				CHAJNo, SHP_No, MdShp, CMPCD, CLSType, BUCord, CtryExp, DFPmnt, BOEStatus, flag =
				1,
				refdoccat = "";
			NNDOnoFrom = this.getView().byId("idNNDOnoFrom").getValue().trim();
			NNDOnoTo = this.getView().byId("idNNDOnoTo").getValue().trim();
			CUSTBoeNO = this.getView().byId("idCustBOEno").getValue().trim();
			NNDODaterange = this.getView().byId("idNNDODaterange").getValue().trim();
			CustomsDaterange = this.getView().byId("idCustomsDateRange").getValue().trim(); //Aiswarya
			NNDOvender = this.getView().byId("Vendor").getValue().trim();
			UJNo = this.getView().byId("idUJNo").getValue().trim();
			CHAJNo = this.getView().byId("idCHJNo").getValue().trim();
			CMPCD = this.getView().byId("idNNDOreqCMPCDname").getValue().trim();
			Ebelen = this.getView().byId("idPONo").getValue().trim();
			ImpCord = this.getView().byId("impcord").getValue().trim();
			CFTCord = this.getView().byId("cftcord").getValue().trim();
			ModeShp = this.getView().byId("shptyp").getSelectedKey().trim();

			MdShp = this.getView().byId("mdshpflt").getSelectedKey().trim();
			CLSType = this.getView().byId("clearance_typeflt").getSelectedKey().trim();
			BUCord = this.getView().byId("BUcord").getValue().trim();
			CtryExp = this.getView().byId("ctryexpflt").getValue().trim();
			DFPmnt = this.getView().byId("defpmtFlt").getSelectedKey().trim();

			ETA = this.getView().byId("eta_Filteritm").getValue().trim();
			ETD = this.getView().byId("etd_Filteritm").getValue().trim();
			DESTPort = this.getView().byId("gatptcod_filter").getValue().trim();
			BOEStatus = this.getView().byId("sts_fltr").getSelectedKey().trim();
			SHP_No = this.getView().byId("shpmtno").getValue().trim();

			var DocType = this.getView().byId("idBOEType").getSelectedKey();
			if ((!Check_empty(NNDOnoFrom)) && (!Check_empty(NNDOnoTo)) && (!Check_empty(NNDODaterange)) && (!Check_empty(DocType)) && (!
					Check_empty(CustomsDaterange)) && (!
					Check_empty(MdShp)) && (!Check_empty(CLSType)) && (!Check_empty(BUCord)) && (!Check_empty(CtryExp)) && (!Check_empty(
					DFPmnt)) && (!
					Check_empty(NNDOvender)) && (!Check_empty(ImpCord)) && (!Check_empty(CFTCord)) && (!Check_empty(ModeShp)) && (!Check_empty(ETA)) &&
				(!Check_empty(ETD)) && (!Check_empty(CHAJNo)) && (!Check_empty(CMPCD)) && (!Check_empty(UJNo)) && (!Check_empty(DESTPort)) && (!
					Check_empty(Ebelen)) && (!
					Check_empty(SHP_No)) && (!Check_empty(BOEStatus))) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				_self._CloseBusyDialog();
				MessageBox.error("Please Filter Atlest By Any One Criteria");
				flag = 0;
				return false;
			}
			if (!(Check_empty(NNDOnoFrom))) {
				if ((Check_empty(NNDOnoTo))) {
					_self._CloseBusyDialog();
					MessageBox.error("Please Select the BOE Document Number From.");
					flag = 0;
					return false;
				}
			}
			if (_self.LoginUser) {
				if (!Check_empty(NNDOvender)) {
					_self._CloseBusyDialog();
					MessageBox.error("Please Select any CHA Code");
					flag = 0;
					return false;
				}
			}
			if (this.getView().byId("idNNDODaterange").getValueState() == "Error" || this.getView().byId("eta_Filteritm").getValueState() ==
				"Error" || this.getView().byId("etd_Filteritm").getValueState() == "Error") {
				_self._CloseBusyDialog();
				MessageBox.error("Please Enter Proper Date Range Value");
				return false;
			}
			//********************Aiswarya******************//
			if (this.getView().byId("idCustomsDateRange").getValueState() == "Error" || this.getView().byId("eta_Filteritm").getValueState() ==
				"Error" || this.getView().byId("etd_Filteritm").getValueState() == "Error") {
				_self._CloseBusyDialog();
				MessageBox.error("Please Enter Proper Date Range Value");
				return false;
			}
			//**************************************//
			if (flag) {
				var SplitRange, SplitDatePartFrom, SplitDatePartTo;
				var DateRange, DateRange2, Date_from, Date_to, DateETA_from, DateETA_to, DateETD_from, DateETD_to;
				var where = "";
				var filters = new Array();
				var filterval;
				DateRange = this.getView().byId("idNNDODaterange").getValue();
				DateRange2 = this.getView().byId("idCustomsDateRange").getValue(); //Aiswarya
				if (NNDOnoFrom != "") {
					filterval = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.EQ, NNDOnoFrom);
					filters.push(filterval);
				}
				if (NNDOnoTo != "") {
					if (NNDOnoFrom != "") {
						filters.pop();
						filterval = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.BT, NNDOnoFrom, NNDOnoTo);
						filters.push(filterval);
					} else {
						filterval = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.EQ, NNDOnoTo);
						filters.push(filterval);
					}
				}
				if (NNDOvender != "") {
					filterval = new sap.ui.model.Filter("chacode", sap.ui.model.FilterOperator.EQ, NNDOvender);
					filters.push(filterval);
				}
				if (DocType != "") {
					filterval = new sap.ui.model.Filter("doctyp", sap.ui.model.FilterOperator.EQ, DocType);
					filters.push(filterval);
				}
				if (SHP_No != "") {
					filterval = new sap.ui.model.Filter("shipmentno", sap.ui.model.FilterOperator.EQ, SHP_No);
					filters.push(filterval);
				}
				if (CUSTBoeNO != "") {
					filterval = new sap.ui.model.Filter("impdpsno", sap.ui.model.FilterOperator.EQ, CUSTBoeNO);
					filters.push(filterval);
				}
				if (Ebelen != "") {
					filterval = new sap.ui.model.Filter("ebeln", sap.ui.model.FilterOperator.EQ, Ebelen);
					filters.push(filterval);
				}
				if (UJNo != "") {
					filterval = new sap.ui.model.Filter("ujno", sap.ui.model.FilterOperator.EQ, UJNo);
					filters.push(filterval);
				}
				if (CHAJNo != "") {
					filterval = new sap.ui.model.Filter("cha_job_no", sap.ui.model.FilterOperator.EQ, CHAJNo);
					filters.push(filterval);
				}

				if (CMPCD != "") {
					filterval = new sap.ui.model.Filter("bukrs", sap.ui.model.FilterOperator.EQ, CMPCD);
					filters.push(filterval);
				}
				if (ImpCord != "") {
					filterval = new sap.ui.model.Filter("import_coordinator", sap.ui.model.FilterOperator.EQ, ImpCord);
					filters.push(filterval);
				}
				if (CFTCord != "") {
					filterval = new sap.ui.model.Filter("c_ft_coordinator", sap.ui.model.FilterOperator.EQ, CFTCord);
					filters.push(filterval);
				}
				if (ModeShp != "") {
					filterval = new sap.ui.model.Filter("shptyp", sap.ui.model.FilterOperator.EQ, ModeShp);
					filters.push(filterval);
				}
				if (DESTPort != "") {
					filterval = new sap.ui.model.Filter("gatptcod", sap.ui.model.FilterOperator.EQ, DESTPort);
					filters.push(filterval);
				}

				if (MdShp != "") {
					filterval = new sap.ui.model.Filter("modtran", sap.ui.model.FilterOperator.EQ, MdShp);
					filters.push(filterval);
				}
				if (CLSType != "") {
					filterval = new sap.ui.model.Filter("clearance_type", sap.ui.model.FilterOperator.EQ, CLSType);
					filters.push(filterval);
				}
				if (BUCord != "") {
					filterval = new sap.ui.model.Filter("bu_coordinator", sap.ui.model.FilterOperator.EQ, BUCord);
					filters.push(filterval);
				}
				if (CtryExp != "") {
					filterval = new sap.ui.model.Filter("ctryexp", sap.ui.model.FilterOperator.EQ, CtryExp);
					filters.push(filterval);
				}
				if (DFPmnt != "") {
					filterval = new sap.ui.model.Filter("defpmt", sap.ui.model.FilterOperator.EQ, DFPmnt);
					filters.push(filterval);
				}

				if (BOEStatus != "") {
					filterval = new sap.ui.model.Filter("doc_stat", sap.ui.model.FilterOperator.EQ, BOEStatus);
					filters.push(filterval);
				}
				if (DateRange != "") {
					SplitRange = DateRange.split(" - ");
					SplitDatePartFrom = SplitRange[0].split("/");
					Date_from = SplitDatePartFrom[2].trim() + "-" + SplitDatePartFrom[1].trim() + "-" + SplitDatePartFrom[0].trim();
					SplitDatePartTo = SplitRange[1].split("/");
					Date_to = SplitDatePartTo[2].trim() + "-" + SplitDatePartTo[1].trim() + "-" + SplitDatePartTo[0].trim();
					filterval = new sap.ui.model.Filter("boedate", sap.ui.model.FilterOperator.BT, Date_from, Date_to);
					filters.push(filterval);
				}
				//******************Aiswarya********************//
				if (DateRange2 != "") {
					SplitRange = DateRange2.split(" - ");
					SplitDatePartFrom = SplitRange[0].split("/");
					Date_from = SplitDatePartFrom[2].trim() + "-" + SplitDatePartFrom[1].trim() + "-" + SplitDatePartFrom[0].trim();
					SplitDatePartTo = SplitRange[1].split("/");
					Date_to = SplitDatePartTo[2].trim() + "-" + SplitDatePartTo[1].trim() + "-" + SplitDatePartTo[0].trim();
					filterval = new sap.ui.model.Filter("impdpdat", sap.ui.model.FilterOperator.BT, Date_from, Date_to);
					filters.push(filterval);
				}
				//**************************************//
				if (ETA != "") {
					SplitRange = ETA.split(" - ");
					SplitDatePartFrom = SplitRange[0].split("/");
					DateETA_from = SplitDatePartFrom[2].trim() + "-" + SplitDatePartFrom[1].trim() + "-" + SplitDatePartFrom[0].trim();
					SplitDatePartTo = SplitRange[1].split("/");
					DateETA_to = SplitDatePartTo[2].trim() + "-" + SplitDatePartTo[1].trim() + "-" + SplitDatePartTo[0].trim();
					filterval = new sap.ui.model.Filter("eta", sap.ui.model.FilterOperator.BT, DateETA_from, DateETA_to);
					filters.push(filterval);
				}
				if (ETD != "") {
					SplitRange = ETD.split(" - ");
					SplitDatePartFrom = SplitRange[0].split("/");
					DateETD_from = SplitDatePartFrom[2].trim() + "-" + SplitDatePartFrom[1].trim() + "-" + SplitDatePartFrom[0].trim();
					SplitDatePartTo = SplitRange[1].split("/");
					DateETD_to = SplitDatePartTo[2].trim() + "-" + SplitDatePartTo[1].trim() + "-" + SplitDatePartTo[0].trim();
					filterval = new sap.ui.model.Filter("etd", sap.ui.model.FilterOperator.BT, DateETD_from, DateETD_to);
					filters.push(filterval);
				}
				if (this.SelectedMode == "D") {
					refdoccat = this.selBOEtype + "BOE";
				} else {
					if (this.SelectedSubCat == "C") {
						refdoccat = "CLIN";
					} else {
						refdoccat = this.SelectedSubCat + "BOE";
					}
				}
				var sorters = new Array();
				var sortval = new sap.ui.model.Sorter("docno", true, false);
				sorters.push(sortval);
				var oModelData = new sap.ui.model.json.JSONModel();
				this.getOwnerComponent().getModel("BOEDOCList").read("/xBRIxi_iidbehdr", {
					urlParameters: {
						$top: "5000"
					},
					filters: filters,
					sorters: sorters,
					success: function (getData) {
						_self._CloseBusyDialog();

						if (getData.results.length <= 0) {
							MessageBox.error("No Matching Result(s) Found for the Filter");
							_self.getView().byId('idnndoTable').setVisible(false);
							_self.getView().byId('downloadBtn').setVisible(false);
						} else {
							oModelData.setData(getData);
							_self.getView().setModel(oModelData, "nndoLists");
							_self.getView().byId('idnndoTable').setVisible(true);
							_self.getView().byId('downloadBtn').setVisible(true);
							_self.getView().byId("table_footer").setText("Number of Records : " + getData.results.length);
						}
					},
					error: function (error) {
						_self._CloseBusyDialog();
						MessageBox.error("Something Went Wrong . Please Try again Later");
					}
				});
			}
		},
		OnChangeMode: function () {
			/*this.SelectedMode = this.byId("idMode").getSelectedKey();*/
			this.SelectedMode = "D";
			if (this.SelectedMode == "D") {
				this.SelectedSubCat = "";
				this._fnInitialSettings(true, false, false, "BOE");
			} else {
				this._fnInitialSettings(true, false, false, "CLIN");
			}
			this.getView().byId('idnndoTable').setVisible(false);
			this.getView().byId('downloadBtn').setVisible(false);
		},
		_fnInitialSettings: function (typeFlag, subCatFlag, OtherFlag, Category) {
			var getView = this.getView();
			var ModelData = "";
			if (this.SelectedMode == "D" && subCatFlag) {
				OtherFlag = true;
			}
			if (typeFlag || typeFlag || OtherFlag) {
				getView.byId("BoeTypefilter").setVisible(typeFlag);
				if (this.SelectedMode == "D") {
					getView.byId("BoeSubCatergoryfilter").setVisible(false);
				} else {
					getView.byId("BoeSubCatergoryfilter").setVisible(subCatFlag);
				}
				getView.byId("IdStatusFltr").setVisible(OtherFlag);
				getView.byId("Idclindatefilter").setVisible(OtherFlag);
				getView.byId("CustomsDateFilter").setVisible(OtherFlag); //Aiswarya
				getView.byId("idVendorfilter").setVisible(OtherFlag);
				getView.byId("idCmpfilter").setVisible(OtherFlag);
				getView.byId("IddocnoTofilter").setVisible(OtherFlag);
				getView.byId("IdBOEnofilter").setVisible(OtherFlag);
				getView.byId("IddocNofromfilter").setVisible(OtherFlag);
				if (typeFlag && !subCatFlag && !OtherFlag) {
					getView.byId("idBOEType").setValue("");
					getView.byId("idBOEType").setSelectedKey("");
				}
				if (subCatFlag && !OtherFlag) {
					getView.byId("IdSubCategory").setValue("");
					getView.byId("IdSubCategory").setSelectedKey("");
				}
				if (OtherFlag) {
					Category = "BOE";
					if (this.SelectedMode != "D" && OtherFlag) {
						if (this.SelectedSubCat == "C") {
							Category = "CLIN";
						}
					}
					getView.byId("idNNDOnoFrom").setValue("");
					getView.byId('idNNDOnoTo').setValue("");
					getView.byId('Vendor').setValue("");
					getView.byId('idNNDODaterange').setValue("");
					getView.byId('idCustomsDateRange').setValue(""); //Aiswarya
					getView.byId("IddocNofromfilter").setLabel(Category + " No. From");
					getView.byId("IddocnoTofilter").setLabel(Category + " No. To");
					getView.byId("Idclindatefilter").setLabel(Category + " Date");
					this.getView().byId('idDocumentNumber').setText(Category + " Number");
					this.getView().byId('idDocumentDate').setText(Category + " Date");
					this.getView().byId('IdStatusFltr').setLabel(Category + " Status");

					getView.byId("idNNDOnoFrom").setEnabled(OtherFlag);
					getView.byId("idCustBOEno").setEnabled(OtherFlag);
					getView.byId("idNNDOnoTo").setEnabled(OtherFlag);
					getView.byId("Vendor").setEnabled(OtherFlag);
					getView.byId("idNNDODaterange").setEnabled(OtherFlag);
					getView.byId("idCustomsDateRange").setEnabled(OtherFlag); //Aiswarya
				}
			}
		},
		clearFilter: function (oEvent) {
			//this.getView().byId("idMode").setSelectedIndex(0);
			//this.getView().byId("idMode").setValue("Create");
			this.OnChangeMode();
		},
		handleChange: function (oEvent) {
			var oDP = oEvent.oSource;
			var bValid = oEvent.getParameter("valid");
			this._iEvent++;
			if (bValid) {
				oDP.setValueState(sap.ui.core.ValueState.None);
				return true;
			} else {
				oDP.setValueState(sap.ui.core.ValueState.Error);
				return false;
			}
		},
		GenerateBeContent: function (Data) {
			var sText = "";
			var str1 = Data[0].ieccode;
			var MetaData = this.bemodel.getServiceMetadata();
			for (var i = 0; i < MetaData.dataServices.schema[0].entityType[0].property.length; i++) {
				if (MetaData.dataServices.schema[0].entityType[1].property[9].name == "ieccode") {
					sText = "<TABLE>" + str1.padEnd(MetaData.dataServices.schema[0].entityType[1].property[9].maxLength, String.fromCharCode(29)) +
						"\n" + "<TABLE>";
				}
			}
			return sText;
		},
		_FnConvertJSON: function (obj) {
			return JSON.parse(JSON.stringify(obj));
		},
		_FnUpdateHeader: function (jsonObj, oSelectedItem) {
			var _self = this;
			var docType = "E";
			var Dateobj = new Date();
			var TodayDate = Dateobj.getFullYear() + "-" + ('0' + (Dateobj.getMonth() + 1)).slice(-2) + "-" + ('0' + Dateobj.getDate()).slice(-2);
			var Idate = TodayDate + "T00:00:00";
			jsonObj.boedate = Idate,
				jsonObj.doctyp = docType,
				jsonObj.pdoccat = "BOE",
				jsonObj.pdocno = oSelectedItem,
				jsonObj.docno = "";
			if (jsonObj.boedate) {
				jsonObj.boedate = this.DateConvert(jsonObj.boedate);
			}
			if (jsonObj.ersda) {
				jsonObj.ersda = this.DateConvert(jsonObj.ersda);
			}
			if (jsonObj.laeda) {
				jsonObj.laeda = this.DateConvert(jsonObj.laeda);
			}
			if (jsonObj.pay_due_date) {
				jsonObj.pay_due_date = this.DateConvert(jsonObj.pay_due_date);
			}
			if (jsonObj.remit_date) {
				jsonObj.remit_date = this.DateConvert(jsonObj.remit_date);
			}
			if (jsonObj.rwcrcptdat) {
				jsonObj.rwcrcptdat = this.DateConvert(jsonObj.rwcrcptdat);
			}
			if (jsonObj.datdtypmtbasc) {
				jsonObj.datdtypmtbasc = this.DateConvert(jsonObj.datdtypmtbasc);
			}
			if (jsonObj.duedatdtypmt) {
				jsonObj.duedatdtypmt = this.DateConvert(jsonObj.duedatdtypmt);
			}
			if (jsonObj.rotdt) {
				jsonObj.rotdt = this.DateConvert(jsonObj.rotdt);
			}
			if (jsonObj.rfndrcvddat) {
				jsonObj.rfndrcvddat = this.DateConvert(jsonObj.rfndrcvddat);
			}
			if (jsonObj.rfndaplndat) {
				jsonObj.rfndaplndat = this.DateConvert(jsonObj.rfndaplndat);
			}
			if (jsonObj.reqdtypmtdat) {
				jsonObj.reqdtypmtdat = this.DateConvert(jsonObj.reqdtypmtdat);
			}
			if (jsonObj.otpgendat) {
				jsonObj.otpgendat = this.DateConvert(jsonObj.otpgendat);
			}
			if (jsonObj.iwrdt) {
				jsonObj.iwrdt = this.DateConvert(jsonObj.iwrdt);
			}
			if (jsonObj.igmdat) {
				jsonObj.igmdat = this.DateConvert(jsonObj.igmdat);
			}
			if (jsonObj.grndat) {
				jsonObj.grndat = this.DateConvert(jsonObj.grndat);
			}
			if (jsonObj.gatigdt) {
				jsonObj.gatigdt = this.DateConvert(jsonObj.gatigdt);
			}
			if (jsonObj.amndtcompdt) {
				jsonObj.amndtcompdt = this.DateConvert(jsonObj.amndtcompdt);
			}
			if (jsonObj.spcerdat) {
				jsonObj.spcerdat = this.DateConvert(jsonObj.spcerdat);
			}
			if (jsonObj.timestamp) {
				jsonObj.timestamp = this.DateConvert(jsonObj.timestamp);
			}
			if (jsonObj.challan_date) {
				jsonObj.challan_date = this.DateConvert(jsonObj.challan_date);
			}
			if (jsonObj.cusfredat) {
				jsonObj.cusfredat = this.DateConvert(jsonObj.cusfredat);
			}
			if (jsonObj.chadcldat) {
				jsonObj.chadcldat = this.DateConvert(jsonObj.chadcldat);
			}
			if (jsonObj.trcdat) {
				jsonObj.trcdat = this.DateConvert(jsonObj.trcdat);
			}
			if (jsonObj.wrhdat) {
				jsonObj.wrhdat = this.DateConvert(jsonObj.wrhdat);
			}
			if (jsonObj.boe_vend_dt) {
				jsonObj.boe_vend_dt = this.DateConvert(jsonObj.boe_vend_dt);
			}
			if (jsonObj.bonddat) {
				jsonObj.bonddat = this.DateConvert(jsonObj.bonddat);
			}
			if (jsonObj.eta) {
				jsonObj.eta = this.DateConvert(jsonObj.eta);
			}
			if (jsonObj.etd) {
				jsonObj.etd = this.DateConvert(jsonObj.etd);
			}
			if (jsonObj.shipmentdate) {
				jsonObj.shipmentdate = this.DateConvert(jsonObj.shipmentdate);
			}
			if (jsonObj.impdpdat) {
				jsonObj.impdpdat = this.DateConvert(jsonObj.impdpdat);
			}
			if (jsonObj.atadestport1) {
				jsonObj.atadestport1 = this.DateConvert(jsonObj.atadestport1);
			}
			if (jsonObj.ataicd1) {
				jsonObj.ataicd1 = this.DateConvert(jsonObj.ataicd1);
			}
			if (jsonObj.shipment_on_board_date) {
				jsonObj.shipment_on_board_date = this.DateConvert(jsonObj.shipment_on_board_date);
			}
			if (jsonObj.ooc_date) {
				jsonObj.ooc_date = this.DateConvert(jsonObj.ooc_date);
			}

			if (jsonObj.ooc_reg_date) {
				jsonObj.ooc_reg_date = this.DateConvert(jsonObj.ooc_reg_date);
			}
			if (jsonObj.finalassmtdate) {
				jsonObj.finalassmtdate = this.DateConvert(jsonObj.finalassmtdate);
			}
			if (jsonObj.exch_rate_date) {
				jsonObj.exch_rate_date = this.DateConvert(jsonObj.exch_rate_date);
			}
			if (jsonObj.otherbnd_date) {
				jsonObj.otherbnd_date = this.DateConvert(jsonObj.otherbnd_date);
			}
			if (jsonObj.not_comp_date) {
				jsonObj.not_comp_date = this.DateConvert(jsonObj.not_comp_date);
			}
			if (jsonObj.doc_del_date) {
				jsonObj.doc_del_date = this.DateConvert(jsonObj.doc_del_date);
			}

			if (jsonObj.doc_rec_date) {
				jsonObj.doc_rec_date = this.DateConvert(jsonObj.doc_rec_date);
			}
			if (jsonObj.not_doc_ret_date) {
				jsonObj.not_doc_ret_date = this.DateConvert(jsonObj.not_doc_ret_date);
			}
			if (jsonObj.cust_doc_ret_date) {
				jsonObj.cust_doc_ret_date = this.DateConvert(jsonObj.cust_doc_ret_date);
			}
			if (jsonObj.tr6_challan_date) {
				jsonObj.tr6_challan_date = this.DateConvert(jsonObj.tr6_challan_date);
			}
			if (jsonObj.icd_igm_date) {
				jsonObj.icd_igm_date = this.DateConvert(jsonObj.icd_igm_date);
			}

			jsonObj.to_itemdetails = this._UpdateItenDetails(_self.InvItemData.results, oSelectedItem);
			jsonObj.to_Salo = this._UpdateSalo(_self.LicenseData.results);
			jsonObj.to_shippingdetails = this._UpdateShippingData(_self.ShippingDetails.results);
			delete jsonObj.shipmentdate;
			delete jsonObj.to_Clearance_Type;
			delete jsonObj.to_Material_type;
			delete jsonObj.to_Mode_of_Payment;
			delete jsonObj.to_drctportdelvery;
			delete jsonObj.to_shptyp;
			delete jsonObj.to_Currencycurrcode;
			delete jsonObj.to_Currencyinr;
			delete jsonObj.to_boestatus;
			delete jsonObj.to_doctype;
			delete jsonObj.to_dutydetails;
			delete jsonObj.to_BOEHeader;
			delete jsonObj.__metadata;
			return jsonObj;
		},
		DateConvert: function (value) {
			if (value.includes("00:00:00.000Z")) {
				value = value.replace(/Z/g, '');
			}
			return value;
		},
		_UpdateItenDetails: function (obj, DocNr) {
			var docType;
			for (var i = 0; i < obj.length; i++) {
				obj[i].clin = DocNr;
				obj[i].docno = "";
				obj[i].doctyp = "E";
				obj[i].classify = "E";
				delete obj[i].to_Currency;
				delete obj[i].to_UOM;
				delete obj[i].to_dochdr;
				delete obj[i].to_BOEHeader;
				delete obj[i].to_Unitdel;
				delete obj[i].to_Unitmein;
				delete obj[i].to_Unitmeins01;
				delete obj[i].to_Unitrec;
				delete obj[i].to_Unitull;
				delete obj[i].__metadata;
			}
			return obj;
		},
		_UpdateSalo: function (obj) {
			for (var i = 0; i < obj.length; i++) {
				obj[i].docnr = "";
				obj[i].doccat = "";
				obj[i].doctyp = "E";
				delete obj[i].to_Currency;
				delete obj[i].to_UOM;
				delete obj[i].to_dochdr;
				delete obj[i].to_BOEHeader;
				delete obj[i].__metadata;
			}
			return obj;
		},
		_UpdateShippingData: function (obj) {
			var Dateobj = new Date();
			var TodayDate = Dateobj.getFullYear() + "-" + ('0' + (Dateobj.getMonth() + 1)).slice(-2) + "-" + ('0' + Dateobj.getDate()).slice(-2);
			var Idate = TodayDate + "T00:00:00";
			for (var i = 0; i < obj.length; i++) {
				obj[i].boerefno = "";
				obj[i].boecdat = Idate;
				obj[i].doctyp = "E";
				obj[i].refdocno = obj[i].refdocnr;
				obj[i].refdocdat = obj[i].refdocdat;
				obj[i].refdoccat = obj[i].refdoccat;
				obj[i].nopkg = obj[i].nopkg;
				obj[i].port = obj[i].port;
				obj[i].bolnr = obj[i].bolnr;
				obj[i].boldt = obj[i].boldt;
				obj[i].hawbno = obj[i].hawbno;
				obj[i].hawbdt = obj[i].hawbdt;
				obj[i].groswt = obj[i].groswt;
				delete obj[i].to_Currency;
				delete obj[i].to_UOM;
				delete obj[i].to_dochdr;
				delete obj[i].to_BOEHeader;
				delete obj[i].to_Unit;
				delete obj[i].__metadata;
			}
			return obj;
		},
		handleVendorValueHelpPort: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			if (!this._PortDialog) {
				this._PortDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpPort", this);
				this.getView().addDependent(this._PortDialog);
			}
			this._PortDialog.open(sInputValue);
		},
		_handleValueHelpSearch_Port: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"codtyp",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpClose_Port: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
			if (oSelectedItem) {
				this.getView().byId(this.InputId).setValue(oSelectedItem);
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		handleVendorValueHelpCountry: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			if (!this._CountryDialog) {
				this._CountryDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpCountry", this);
				this.getView().addDependent(this._CountryDialog);
			}
			this._CountryDialog.open(sInputValue);
		},
		_handleValueHelpSearch_Ctry: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"Country",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpClose_Ctry: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId(this.InputId).setValue(oSelectedItem.getTitle());
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		_handleValueHelpSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			if (this.InputId.includes("idCHJNo")) {
				var No_Field = "cha_job_no";
			} else if (this.InputId.includes("idUJNo")) {
				var No_Field = "ujno";
			} else if (this.InputId.includes("idPONo")) {
				var No_Field = "ebeln";
			} else if (this.InputId.includes("impcord")) {
				var No_Field = "import_coordinator";
			} else if (this.InputId.includes("cftcord")) {
				var No_Field = "c_ft_coordinator";
			} else if (this.InputId.includes("shpmtno")) {
				var No_Field = "shipmentno";
			} else if (this.InputId.includes("BUcord")) {
				var No_Field = "bu_coordinator";
			} else if (this.InputId.includes("idNNDOreqCMPCDname")) {
				var No_Field = "bukrs";
			} else if (this.InputId.includes("Vendor")) {
				var No_Field = "lifnr";
			}
			var oFilter = new sap.ui.model.Filter(
				No_Field,
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		handleValueHelp_No: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			var itemTemplate = new sap.m.StandardListItem();
			if (!this._Dialog) {
				this._Dialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpNo", this);
				this.getView().addDependent(this._Dialog);
			}

			if (this.InputId.includes("idCHJNo")) {
				itemTemplate.bindProperty("title", "BOEDOCList>cha_job_no");
				sap.ui.getCore().byId("DocNumberList").bindAggregation("items", "BOEDOCList>/xBRIxBOE_CHA_JOB_NO", itemTemplate);
				sap.ui.getCore().byId("DocNumberList").setTitle("CHA Job Number");
			} else if (this.InputId.includes("idUJNo")) {
				itemTemplate.bindProperty("title", "BOEDOCList>ujno");
				sap.ui.getCore().byId("DocNumberList").bindAggregation("items", "BOEDOCList>/xBRIxi_ujno", itemTemplate);
				sap.ui.getCore().byId("DocNumberList").setTitle("User Job Number");
			} else if (this.InputId.includes("idPONo")) {
				itemTemplate.bindProperty("title", "BOEDOCList>ebeln");
				sap.ui.getCore().byId("DocNumberList").bindAggregation("items", "BOEDOCList>/xBRIxCE_BOE_PO_NO", itemTemplate);
				sap.ui.getCore().byId("DocNumberList").setTitle("PO Number");
			} else if (this.InputId.includes("impcord")) {
				itemTemplate.bindProperty("title", "BOEDOCList>import_coordinator");
				sap.ui.getCore().byId("DocNumberList").bindAggregation("items", "BOEDOCList>/xBRIxI_FI_import_coordinator", itemTemplate);
				sap.ui.getCore().byId("DocNumberList").setTitle("Import Coordinator");
			} else if (this.InputId.includes("cftcord")) {
				itemTemplate.bindProperty("title", "BOEDOCList>c_ft_coordinator");
				sap.ui.getCore().byId("DocNumberList").bindAggregation("items", "BOEDOCList>/xBRIxI_FI_c_ft_coordinator", itemTemplate);
				sap.ui.getCore().byId("DocNumberList").setTitle("C FT Coordinator");
			} else if (this.InputId.includes("shpmtno")) {
				itemTemplate.bindProperty("title", "BOEDOCList>shipmentno");
				sap.ui.getCore().byId("DocNumberList").bindAggregation("items", "BOEDOCList>/xBRIxI_shipmentno", itemTemplate);
				sap.ui.getCore().byId("DocNumberList").setTitle("Shipment No");
			} else if (this.InputId.includes("BUcord")) {
				itemTemplate.bindProperty("title", "BOEDOCList>bu_coordinator");
				sap.ui.getCore().byId("DocNumberList").bindAggregation("items", "BOEDOCList>/xBRIxI_boe_bu_coordinator", itemTemplate);
				sap.ui.getCore().byId("DocNumberList").setTitle("BU Coordinator / Planner");
			} else if (this.InputId.includes("idNNDOreqCMPCDname")) {
				itemTemplate.bindProperty("title", "CmnModel>bukrs");
				itemTemplate.bindProperty("description", "CmnModel>butxt");
				sap.ui.getCore().byId("DocNumberList").bindAggregation("items", "CmnModel>/company_code", itemTemplate);
				sap.ui.getCore().byId("DocNumberList").setTitle("Company Code");
			} else if (this.InputId.includes("Vendor")) {
				itemTemplate.bindProperty("title", "VendorSerchData>lifnr");
				itemTemplate.bindProperty("description", "VendorSerchData>name1");
				sap.ui.getCore().byId("DocNumberList").bindAggregation("items", "VendorSerchData>/results", itemTemplate);
				sap.ui.getCore().byId("DocNumberList").setTitle("CHA Code");
			}
			this._Dialog.open(sInputValue);
		},

		/*	ExportExcel: function (oEvent) {
				var _self = this;
				var oTable = this.getView().byId("idnndoTable");
				var aColumns = oTable.getColumns();
				var aTemplate = [];

			},*/

		exportToExcel: function () {
			var oTable = this.getView().byId("idnndoTable");
			var that = this;
			var aColumns = oTable.getColumns();
			// var aItems = oTable.getItems();
			var aItems = oTable.getRows();
			var aTemplate = [];
			for (var i = 0; i < aColumns.length; i++) {
				var pathName = '';
				var oColumn = {};
				if (aItems.length > 0 && i < aColumns.length) {
					pathName = aItems[0].getCells()[i].getBinding("text").getPath();
				}
				if (pathName == 'boedate' || pathName == 'etd' || pathName == 'eta' || pathName == 'duedatdtypmt' || pathName == 'datdtypmtbasc' ||
					pathName == 'otpgendat' || pathName == 'impdpdat') {
					oColumn = {
						name: aColumns[i].getLabel().getText(),
						template: {
							content: {
								path: null,
								formatter: function (value) {

									if (value) {
										if (value instanceof Date) {
											var NewDateform = value;
										} else if (value.indexOf("T00:00:00")) {
											return value;
										} else {}
										var mnth = ("0" + (NewDateform.getMonth() + 1)).slice(-2);
										var day = ("0" + NewDateform.getDate()).slice(-2);
										var fnDate = [day, mnth, NewDateform.getFullYear()].join("/");
										var output = fnDate;
										return output;
									}
								}
							}
						}
					};
				} else {

					oColumn = {
						name: aColumns[i].getLabel().getText(),
						template: {
							content: {
								path: null
							}
						}
					};
				}
				if (aItems.length > 0 && i < aColumns.length) {
					oColumn.template.content.path = aItems[0].getCells()[i].getBinding("text").getPath();
				}
				aTemplate.push(oColumn);
			}
			console.log(aTemplate);
			var Obj = {
				name: "Downloaded Date",
				template: {
					content: {
						path: "curdate",
						formatter: function (value) {

							if (value) {
								if (value instanceof Date) {
									var NewDateform = value;
								} else if (value.indexOf("T00:00:00")) {
									return value;
								} else {}
								var mnth = ("0" + (NewDateform.getMonth() + 1)).slice(-2);
								var day = ("0" + NewDateform.getDate()).slice(-2);
								var fnDate = [day, mnth, NewDateform.getFullYear()].join("/");
								var output = fnDate;
								return output;
							}
						}
					}
				}
			};
			aTemplate.push(Obj);

			var data = oTable.getModel("nndoLists");
			var MyAray = data.oData.results;
			var Dateobj = new Date();
			var TodayDate = Dateobj.getFullYear() + "-" + ('0' + (Dateobj.getMonth() + 1)).slice(-2) + "-" + ('0' + Dateobj.getDate()).slice(-
					2) +
				"T00:00:00";
			for (var i = 0; i < MyAray.length; i++) {
				MyAray[i].curdate = Dateobj;
			}
			data.oData.results = MyAray;

			var oExport = new sap.ui.core.util.Export({
				// Type that will be used to generate the content. Own ExportType’s can be created to support other formats

				exportType: new sap.ui.core.util.ExportTypeCSV({
					fileExtension: "xls",
					separatorChar: "\t",
					// separatorChar : ",",
					charset: "utf-8",
					// data:"text/csv",
					mimeType: "application/vnd.ms-excel:base64"

				}),
				// Pass in the model created above

				models: oTable.getModel("nndoLists"),
				// binding information for the rows aggregation
				rows: {
					path: "/results"
				},
				// column definitions with column name and binding info for the content
				columns: aTemplate
			});
			oExport.saveFile().always(function () {
				this.destroy();
			});
		}

	});
});