sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/core/util/File"
], function (Controller, History, MessageBox, File) {
	"use strict";
	return Controller.extend("EXIM_IMPNBOE.controller.chngDispBOE", {
		onInit: function (oEvent) {
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.BoeVersionModel = this.getOwnerComponent().getModel("BoeVersion_Model"); //Aiswarya
			this.getView().setModel(this.getOwnerComponent().getModel("NNDOlist"));
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
			this.BoeModel = this.getOwnerComponent().getModel("BOEDOCList");
			this.DocModel = this.getOwnerComponent().getModel("Doc_Flow");
			this.bemodel = this.getOwnerComponent().getModel("BE_model");
			this.belog_model = this.getOwnerComponent().getModel("belog_model");
			this.CmnModel = this.getOwnerComponent().getModel("CmnModel");
			this.BoeModelV = this.getOwnerComponent().getModel("BOEVersion"); //for version creation
			//this.DMSFolderModel = this.getOwnerComponent().getModel("DMSFolderModel");
			/****************Nikhila added for DMS**********************/
			this.DMS_Model = this.getOwnerComponent().getModel("DMS_Model"); //DMS Model
			this.DMSService_Model = this.getOwnerComponent().getModel("DMSService_Model"); //DMS Service Model
			this.FileServiceModel = this.getOwnerComponent().getModel("File_Service_Model"); //file service Model 
			this.S_User_Identif_Model = this.getOwnerComponent().getModel("S_User_Identif_Model"); //super user Model 

		},
		boeVersionListCheck: function () { //Aiswarya
			debugger;
			this.docno = this.boeHeaderData.docno;
			this.doctyp = this.boeHeaderData.doctyp;
			var _self = this;
			this._OpenBusyDialog();
			this.BoeVersionModel.read("/xBRIxCE_BOE_VERSIONS(docno='" + this.docno + "')/Set", {
				success: function (getData) {
					// let temp = self;//comented Aiswarya
					// let filters = new Array();
					// let filterval = new sap.ui.model.Filter("code", sap.ui.model.FilterOperator.EQ, "AMND");
					// filters.push(filterval);
					// let temp = _self;
					var filters = new Array();

					// let filters = new Array();
					var filterval = new sap.ui.model.Filter("code", sap.ui.model.FilterOperator.EQ, "AMND");
					filters.push(filterval);
					filterval = new sap.ui.model.Filter("codtyp", sap.ui.model.FilterOperator.EQ, "AMNDST"); //changed 20 to AMNDST Aiswarya
					// filterval = new sap.ui.model.Filter("codtyp", sap.ui.model.FilterOperator.EQ, "20");
					filters.push(filterval);
					// if (getData.results.length > 0) { //if version is created,
					// 	self.SB_IID_Model.read("/xBRIxI_CODTYP", {
					// 		filters: filters,
					// 		// success: function (getData) {//comented Aiswarya
					// 		// 	if (temp.boeHeaderData.doc_stat >= getData.results[0].codtyp) {
					// 		// 		temp.getView().byId("idVersionlist").setVisible(true);
					// 		// 		temp.getView().byId("btn_beamendfile").setVisible(true);
					// 		// 	}
					// 		// 	temp._CloseBusyDialog();
					// 		// },

					// 		success: function (getData) {
					// 			if (_self.boeHeaderData.doc_stat >= getData.results[0].value1) { // codtyp to value1 changed by Aiswarya
					// 				_self.getView().byId("idVersionlist").setVisible(true);
					// 				_self.getView().byId("btn_beamendfile").setVisible(true);
					// 				_self.getView().byId("btn_newversion").setVisible(true); //Aiswarya
					// 			}
					// 			_self._CloseBusyDialog();
					// 		},

					// 		error: function (response) {}
					// 	});

					// 	// } else {
					// 	// 	self.getView().byId("btn_befile").setVisible(false);
					// 	// 	self.getView().byId("btn_beamendfile").setVisible(false);

					// 	// }
					// 	else {
					// 		_self.getView().byId("btn_newversion").setVisible(false);
					// 		_self.getView().byId("btn_befile").setVisible(false);
					// 		_self.getView().byId("btn_beamendfile").setVisible(false);
					// 		_self.S_User_Identif_Model.read("/xBRIxI_CODTYP", { //Aiswarya
					// 			filters: filters,
					// 			success: function (getData) {
					// 				if (_self.boeHeaderData.doc_stat >= getData.results[0].value1) { // codtyp to value1 changed by Aiswarya
					// 					_self.getView().byId("btn_newversion").setVisible(true);

					// 				}
					// 				_self._CloseBusyDialog();
					// 			},
					// 			error: function (response) {}
					// 		});

					// 	}
					if (getData.results.length > 0) { //if version is created,
						_self.S_User_Identif_Model.read("/xBRIxI_CODTYP", {
							filters: filters,
							success: function (getData) {
								// if (_self.boeHeaderData.doc_stat >= getData.results[0].value1) { // codtyp to value1 changed by Aiswarya
								_self.getView().byId("idVersionlist").setVisible(true);
								_self.getView().byId("btn_beamendfile").setVisible(true);
								_self.getView().byId("btn_newversion").setVisible(true); //Aiswarya
								// }
								_self._CloseBusyDialog();
							},
							error: function (response) {}
						});

					} else {
						_self.getView().byId("btn_newversion").setVisible(true);
						_self.getView().byId("idVersionlist").setVisible(false);
						// _self.getView().byId("btn_befile").setVisible(false);
						_self.getView().byId("btn_beamendfile").setVisible(false);
						// _self.S_User_Identif_Model.read("/xBRIxI_CODTYP", { //Aiswarya
						// 	filters: filters,
						// 	success: function (getData) {
						// 		if (_self.boeHeaderData.doc_stat >= getData.results[0].value1) { // codtyp to value1 changed by Aiswarya
						// 			_self.getView().byId("btn_newversion").setVisible(true);

						// 		}
						// 		_self._CloseBusyDialog();
						// 	},
						// 	error: function (response) {}
						// });

					}
					_self._CloseBusyDialog();
				},
				error: function (response) {
					// MessageBox.error("Something went wrong. Please try again later.");
				}
			});
		},
		SelectedVersionList: function (oEvent) {
			var VerNo = oEvent.getSource().getText();
			var RefNo = oEvent.getSource().oPropagatedProperties.oBindingContexts.Doc_List.oModel.oData.Doc_Info[0].name.split(":")[1]

			var _self = this;
			var sPath = oEvent.getSource().oPropagatedProperties.oBindingContexts.Doc_List.sPath;
			var str = sPath.replace("/Doc_Info/0/Doc_Info/", "");
			var arrayOrder = str.charAt(0);
			var semanticObject = "";

			/*if (arrayOrder == 0) {
				semanticObject = "EXIM_NNDO";
			} else if (arrayOrder == 1) {
				semanticObject = "EXIM_CLIN_APP2";
			} else if (arrayOrder == 2) {
				if (RefNo != this.docNumber) {
					semanticObject = "BOE_APP";
				}
			}*/
			//  if (arrayOrder != 2 || (arrayOrder == 2 && RefNo != this.docNumber)) {
			if (arrayOrder <= _self.arrayL) {
				if (!isNaN(oEvent.getSource().getText())) {
					if (sap.ushell.Container) {
						var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
						var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
							target: {
								semanticObject: "BOE_APP_DISP",
								action: "Display"
							},
							params: {
								"Ref_Number": RefNo,
								"Versn_Number": VerNo
							}
						})) || "";
						var url = window.location.href.split('#')[0] + hash;
						sap.m.URLHelper.redirect(url, true);
					}
				}
			}
			/* oCrossAppNavigator.toExternal({
			  target: {
			   shellHash: hash
			  }
			 }); */ // navigate to Supplier application
		},
		OnPressBEAmendment: async function (oEvent) { //Aiswarya
			await this.genfun()
			await this.Amndfunc();
			// var param1 = this.boeHeaderData.docno + "ZZZ" + this.boeHeaderData.doctyp;
			// var _self = this;
			// var _tempSelf = this;
			// var sText = "";
			// this.mText = "";
			// this.dowlddflnme = "";
			// this.tText = "";
			// this.ftr = "";
			// this.headg = "";
			// var _self = this;
			// this.wbasr, this.svbload = "";
			// var filters = new Array();
			// var filterval1 = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.EQ, this.docNumber);
			// filters.push(filterval1);
			// var filterval2 = new sap.ui.model.Filter("doctyp", sap.ui.model.FilterOperator.EQ, this.docType);
			// filters.push(filterval2);

			// _self.bemodel.read("/xBRIxI_BE", {
			// 	urlParameters: {
			// 		"$top": "5000"
			// 	},
			// 	filters: filters,
			// 	success: function (getData) {
			// 		var day, month, yer, hour, mint, sec;
			// 		var now = new Date();
			// 		day = now.getDate();
			// 		month = now.getMonth() + 1;
			// 		yer = now.getFullYear();
			// 		hour = now.getHours();
			// 		mint = now.getMinutes();
			// 		if (hour > 12) {
			// 			hour = hour % 12;
			// 		}
			// 		if (month < 10) {
			// 			month = "0" + month;
			// 		}
			// 		if (hour < 10) {
			// 			hour = "0" + hour;
			// 		}
			// 		if (mint < 10) {
			// 			mint = "0" + mint;
			// 		}
			// 		if (day < 10) {
			// 			day = "0" + day;
			// 		}

			// 		if (getData.results[0].ujno != "" || getData.results[0].ujno != "0" || getData.results[0].ujno != null) {
			// 			_tempSelf.dowlddflnme = getData.results[0].ujno;
			// 		} else {
			// 			_tempSelf.dowlddflnme = "download";
			// 		}
			// 		if (getData.results[0].sender_id != "" || getData.results[0].sender_id != "0" || getData.results[0].sender_id != null) {
			// 			_tempSelf.Senderid = getData.results[0].sender_id;
			// 		} else {
			// 			_tempSelf.Senderid = String.fromCharCode(29);
			// 		}
			// 		if (getData.results[0].receiver_id != "" || getData.results[0].receiver_id != "0" || getData.results[0].receiver_id !=
			// 			null) {
			// 			_tempSelf.Receverid = getData.results[0].receiver_id;
			// 		} else {
			// 			_tempSelf.Receverid = String.fromCharCode(29);
			// 		}
			// 		if (getData.results[0].msg_id != "" || getData.results[0].msg_id != "0" || getData.results[0].msg_id != null) {
			// 			_tempSelf.Messageid = getData.results[0].msg_id;
			// 		} else {
			// 			_tempSelf.Messageid = String.fromCharCode(29);
			// 		}

			// 		_tempSelf.headg = "HREC" + String.fromCharCode(29) + "ZZ" + String.fromCharCode(29) + "" + _tempSelf.Senderid + "" +
			// 			String.fromCharCode(
			// 				29) +
			// 			"ZZ" + String.fromCharCode(29) + "" + _tempSelf.Receverid + "" + String.fromCharCode(29) + "" + "ICES1_5" + String.fromCharCode(
			// 				29) + "P" + String.fromCharCode(29) + "" +
			// 			String.fromCharCode(29) + "" + _tempSelf.Messageid + "_A" + "" + String.fromCharCode(29) + "" + _tempSelf.dowlddflnme + "" +
			// 			String.fromCharCode(
			// 				29) + "" + yer + month + day + "" + String.fromCharCode(29) +
			// 			"" + hour + mint + "\r" + "\n";
			// 		_tempSelf.ftr = "<END-BE>" + "\r" + "\n" + "TREC" + String.fromCharCode(29) + "" + _self.dowlddflnme;

			// 	},
			// 	error: function (error) {
			// 		_self._CloseBusyDialog();
			// 		MessageBox.error("Something Went Wrong . Please Try again Later");
			// 		reject();
			// 	}
			// });

			// this.GenerateAmendmentTable("xBRIxCE_IGMS_BE_AMEND(param1='" + param1 + "')/Set", "IGMS")
			// 	.then(this.GenerateAmendmentTable("xBRIxI_AMEND_BE", "AMEND"))
			// 	.then(this.GenerateAmendmentTable("xBRIxI_INVOICE_BE_AMEND", "INVOICE"))
			// 	.then(this.GenerateAmendmentTable("xBRIxi_items_be_amend", "ITEM"))
			// 	.then(this.GenerateAmendmentTable("xBRIxCE_CONTNER_BE_AMEND(param1='" + param1 + "')/Set", "CONTAINER"))
			// 	.then(this.GenerateAmendmentTable("xBRIxCE_be_sup_doc_amend(param1='" + param1 + "')/Set", "SUPPORTINGDOCS"))
			// 	.then(this.GenerateAmendmentTable("xBRIxCE_statemet_be_amend(param1='" + param1 + "')/Set", "STATEMENT"))

			// 	 .then(function () {
			// 		if (_self.mText != "") {
			// 			_self._CloseBusyDialog();
			// 			//debugger;
			// 			File.save(_self.headg + _self.mText + _self.ftr,
			// 				_self.dowlddflnme, "beamd");
			// 			_self.belog_model.read("/xBRIxce_belog(beno='" + _self.docNumber + "',betyp='" + _self.docType +
			// 				"',filename='download')/Set", {
			// 				success: function (e, r) { },
			// 				error: function (e) { }
			// 			});
			// 		}
			// 	});

		},
		genfun: function () { //Aiswarya
			return new Promise((resolve, reject) => {
				var param1 = this.boeHeaderData.docno + "ZZZ" + this.boeHeaderData.doctyp;
				var _self = this;
				var _tempSelf = this;
				var sText = "";
				this.mText = "";
				this.dowlddflnme = "";
				this.tText = "";
				this.ftr = "";
				this.headg = "";
				var _self = this;
				this.wbasr, this.svbload = "";
				var filters = new Array();
				var filterval1 = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.EQ, this.docNumber);
				filters.push(filterval1);
				var filterval2 = new sap.ui.model.Filter("doctyp", sap.ui.model.FilterOperator.EQ, this.docType);
				filters.push(filterval2);

				_self.bemodel.read("/xBRIxI_BE", {
					urlParameters: {
						"$top": "5000"
					},
					filters: filters,
					success: function (getData) {
						var day, month, yer, hour, mint, sec;
						var now = new Date();
						day = now.getDate();
						month = now.getMonth() + 1;
						yer = now.getFullYear();
						hour = now.getHours();
						mint = now.getMinutes();
						if (hour > 12) {
							hour = hour % 12;
						}
						if (month < 10) {
							month = "0" + month;
						}
						if (hour < 10) {
							hour = "0" + hour;
						}
						if (mint < 10) {
							mint = "0" + mint;
						}
						if (day < 10) {
							day = "0" + day;
						}

						if (getData.results[0].ujno != "" || getData.results[0].ujno != "0" || getData.results[0].ujno != null) {
							_tempSelf.dowlddflnme = getData.results[0].ujno;
						} else {
							_tempSelf.dowlddflnme = "download";
						}
						if (getData.results[0].sender_id != "" || getData.results[0].sender_id != "0" || getData.results[0].sender_id != null) {
							_tempSelf.Senderid = getData.results[0].sender_id;
						} else {
							_tempSelf.Senderid = String.fromCharCode(29);
						}
						if (getData.results[0].receiver_id != "" || getData.results[0].receiver_id != "0" || getData.results[0].receiver_id !=
							null) {
							_tempSelf.Receverid = getData.results[0].receiver_id;
						} else {
							_tempSelf.Receverid = String.fromCharCode(29);
						}
						if (getData.results[0].msg_id != "" || getData.results[0].msg_id != "0" || getData.results[0].msg_id != null) {
							_tempSelf.Messageid = getData.results[0].msg_id;
						} else {
							_tempSelf.Messageid = String.fromCharCode(29);
						}

						_tempSelf.headg = "HREC" + String.fromCharCode(29) + "ZZ" + String.fromCharCode(29) + "" + _tempSelf.Senderid + "" +
							String.fromCharCode(
								29) +
							"ZZ" + String.fromCharCode(29) + "" + _tempSelf.Receverid + "" + String.fromCharCode(29) + "" + "ICES1_5" + String.fromCharCode(
								29) + "P" + String.fromCharCode(29) + "" +
							String.fromCharCode(29) + "" + _tempSelf.Messageid + "_A" + "" + String.fromCharCode(29) + "" + _tempSelf.dowlddflnme +
							"" +
							String.fromCharCode(
								29) + "" + yer + month + day + "" + String.fromCharCode(29) +
							"" + hour + mint + "\r" + "\n";
						_tempSelf.ftr = "<END-BE>" + "\r" + "\n" + "TREC" + String.fromCharCode(29) + "" + _self.dowlddflnme;
						resolve();
					},
					error: function (error) {
						_self._CloseBusyDialog();
						MessageBox.error("Something Went Wrong . Please Try again Later");
						reject();
					}
				});
			})
		},

		Amndfunc: function () { //Aiswarya

			var param1 = this.boeHeaderData.docno + "ZZZ" + this.boeHeaderData.doctyp;
			this.flagamd = false;
			// this.ftr;
			// this.headg;
			var _self = this;
			return new Promise((resolve, reject) => {
				var filters = new Array();
				var filterval1 = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.EQ, this.docNumber);
				filters.push(filterval1);
				var filterval2 = new sap.ui.model.Filter("doctyp", sap.ui.model.FilterOperator.EQ, this.docType);
				filters.push(filterval2);

				// this.bemodel.read("/xBRIxCE_BE_CHECK(parameter1='" + param + "',parameter2='" + param + "')/Set", {

				_self.BoeModel.read("/xBRIxCE_IGMS_BE_AMEND(param1='" + param1 + "')/Set", {
					// urlParameters: {
					// 	"$top": "5000"
					// },
					// filters: filters,
					success: function (getData) {
						if (getData.results.length > 0) {
							_self.flagamd = true;
							resolve();
						} else {
							_self.flagamd = false;
						}
						if (_self.flagamd == true) {

							_self.GenerateAmendmentTable("xBRIxCE_IGMS_BE_AMEND(param1='" + param1 + "')/Set", "IGMS")
								.then(_self.GenerateAmendmentTable("xBRIxI_AMEND_BE", "AMEND"))
								.then(_self.GenerateAmendmentTable("xBRIxI_INVOICE_BE_AMEND", "INVOICE"))
								.then(_self.GenerateAmendmentTable("xBRIxi_items_be_amend", "ITEM"))
								.then(_self.GenerateAmendmentTable("xBRIxCE_CONTNER_BE_AMEND(param1='" + param1 + "')/Set", "CONTAINER"))
								.then(_self.GenerateAmendmentTable("xBRIxCE_be_sup_doc_amend(param1='" + param1 + "')/Set", "SUPPORTINGDOCS"))
								.then(_self.GenerateAmendmentTable("xBRIxCE_statemet_be_amend(param1='" + param1 + "')/Set", "STATEMENT"))

							.then(function () {
								if (_self.mText != "") {
									_self._CloseBusyDialog();
									//debugger;
									File.save(_self.headg + _self.mText + _self.ftr,
										_self.dowlddflnme, "beamd");
									_self.belog_model.read("/xBRIxce_belog(beno='" + _self.docNumber + "',betyp='" + _self.docType +
										"',filename='download')/Set", {
											success: function (e, r) {},
											error: function (e) {}
										});
								}
							});
						} else {

							_self.GenerateAmendmentTable("xBRIxI_AMEND_BE", "AMEND")
								.then(_self.GenerateAmendmentTable("xBRIxI_INVOICE_BE_AMEND", "INVOICE"))
								.then(_self.GenerateAmendmentTable("xBRIxi_items_be_amend", "ITEM"))
								.then(_self.GenerateAmendmentTable("xBRIxCE_CONTNER_BE_AMEND(param1='" + param1 + "')/Set", "CONTAINER"))
								.then(_self.GenerateAmendmentTable("xBRIxCE_be_sup_doc_amend(param1='" + param1 + "')/Set", "SUPPORTINGDOCS"))
								.then(_self.GenerateAmendmentTable("xBRIxCE_statemet_be_amend(param1='" + param1 + "')/Set", "STATEMENT"))

							.then(function () {
								if (_self.mText != "") {
									_self._CloseBusyDialog();
									//debugger;
									File.save(_self.headg + _self.mText + _self.ftr,
										_self.dowlddflnme, "beamd");
									_self.belog_model.read("/xBRIxce_belog(beno='" + _self.docNumber + "',betyp='" + _self.docType +
										"',filename='download')/Set", {
											success: function (e, r) {},
											error: function (e) {}
										});
								}
							});
						}

					},
					error: function (error) {
						_self._CloseBusyDialog();
						MessageBox.error("Something Went Wrong . Please Try again Later");
						reject();

					}
				});

			})
		},
		GenerateAmendmentTable: function (entity, FileName) { //Aiswarya
			return new Promise((resolve, reject) => {
				var sText = "";
				this.mText = "";
				// this.dowlddflnme = "";//Comented Aiswarya for whn igms have no value
				this.tText = "";
				// this.ftr = "";//Comented Aiswarya for whn igms have no value
				// this.headg = "";//Comented Aiswarya for whn igms have no value
				var _self = this;
				this.wbasr, this.svbload = "";
				if (entity == "xBRIxI_INVOICE_BE_AMEND" || entity == "xBRIxi_items_be_amend" || entity == "xBRIxI_AMEND_BE") {
					var filters = new Array();
					var filterval1 = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.EQ, this.docNumber);
					filters.push(filterval1);
					var filterval2 = new sap.ui.model.Filter("doctyp", sap.ui.model.FilterOperator.EQ, this.docType);
					filters.push(filterval2);

					this.BoeModel.read("/" + entity, {
						urlParameters: {
							"$top": "5000"
						},
						filters: filters,
						success: function (getData) {

							fileGenerationFun(getData);
						},
						error: function (error) {
							_self._CloseBusyDialog();
							MessageBox.error("Something Went Wrong . Please Try again Later");
							reject();
						}
					});
				} else {

					this.BoeModel.read("/" + entity, {
						success: function (getData) {
							fileGenerationFun(getData);
						},
						error: function (error) {
							_self._CloseBusyDialog();
							MessageBox.error("Something Went Wrong . Please Try again Later");
							reject();
						}
					});
				}

				function fileGenerationFun(getData) {

					var Title = 0;
					//Details for .be Header and Footer
					var _tempSelf = _self;
					for (var k = 0; k < getData.results.length; k++) {
						if (Title == 0) {
							_self.tText = "<TABLE>" + FileName + "\r" + "\n";
						} else {
							_self.tText = "";
						}
						var pText = "";
						var flag = false;
						var j = 0;
						Title++;
						for (var key in getData.results[k]) {
							j++;
							if (getData.results[k].hasOwnProperty(key)) {
								var msgtype = getData.results[k].msgtype;

								//condition for avoid some keys in .be
								if (key != "param1" && key != "doctyp" && key != "docno" && key != "igmsrlno" && key !=
									"boeitno" && key != "sup_doc_srlno" && key !=
									"statment_srlno" && key != "contslno" && key != "to_BOEHeader" && key != "amendslno" && key != "__metadata" && key !=
									"Parameters" && key != "amed_flag" && key != "version_num") {
									// debugger;
									console.log(key + " -> " + getData.results[k][key]);
									var len = Object.keys(getData.results[k]).length;

									if ((getData.results[k][key] == " " || getData.results[k][key] == 0 || getData.results[k][key] == null)) {
										//check is last key
										if (j == len) {
											pText = pText;
										} else {
											pText = pText + String.fromCharCode(29);
										}
										//check key is date field
									} else if (key == "ujdate" || key == "bedate" || key == "gatigdt" || key == "mawbdt" || key == "hawbdt" || key ==
										"podate" ||
										key == "contdt" || key == "lcdt" || key == "svbrefdat" || key == "svbdat" || key == "pbedt" || key == "igmdt" || key ==
										"docissuedate" || key == "docexpirydate" || key == "dcldt" || key == "invdat" || key == "reqdate" || key == "iwrdt") {
										//check key is last field
										if (j == len) {
											if (getData.results[k][key] == "" || getData.results[k][key] == null) {
												pText = pText;
											} else {
												pText = pText + _self.convertDate(getData.results[k][key]);
											}
										} else {
											pText = pText + _self.convertDate(getData.results[k][key]);
											pText = pText + String.fromCharCode(29);
										}
									} else {
										flag = true;
										//check key is last field
										if (j == len) {
											if ((getData.results[k][key] == " " || getData.results[k][key] == 0 || getData.results[k][key] == null)) {
												pText = pText;
											} else {
												pText = pText + getData.results[k][key].trim();
											}
										} else {
											pText = pText + getData.results[k][key].trim();
											pText = pText + String.fromCharCode(29);
										}
									}
								}
							}
						}
						if (flag == true) {
							_self.mText = _self.mText + _self.tText + pText + "\r" + "\n";
							resolve();
						} else {
							_self.mText = _self.mText + _self.tText;
							resolve();
						}
					}

				}
			});
		},
		handleValueHelpVersionlist: function (oEvent) { //Aiswarya
			var _self = this;
			var result = {
				VersionResults: []
			};

			this.docno = this.boeHeaderData.docno;

			this.Doc_List = [];
			var Doc_Info3 = [];

			var oModelData = new sap.ui.model.json.JSONModel();
			//	var docNo='3000001036';

			//this.BoeVersionModel.read('/xBRIxCE_BOE_VERSIONS(param1 = '" + paramScrollDate + "', param2 = '" + paramScrollNo + "')/ Set ", {
			//	this.BoeVersionModel.read("/xBRIxCE_BOE_VERSIONS( docno='" + docNo + "')/ Set", {

			this.BoeVersionModel.read("/xBRIxCE_BOE_VERSIONS(docno='" + this.docno + "')/Set", {
				urlParameters: {
					"$top": "5000"
				},

				success: function (getData) {
					if (getData.results.length <= 0) {
						MessageBox.error("No Record");
					} else {
						var lookup = {};
						_self.docNo = getData.results[0].docno;
						_self.arrayL = getData.results.length;

						for (var i = 0; i < getData.results.length; i++) {
							result.VersionResults = getData.results[i];
							oModelData.setData(result);
							if (result.VersionResults.version_num) {
								var version_num = {
									"name": result.VersionResults.version_num
								};
								Doc_Info3.push(version_num);
							}
						}
						/*	_self.Doc_List = {
								Doc_Info: [{
									name: "Versions",
									Doc_Info: Doc_Info3
								
								}]
							};*/

						_self.Doc_List = {
							Doc_Info: [{
								name: "Document Number:" + _self.docno,
								Doc_Info: [{
									name: "Versions",
									Doc_Info: Doc_Info3
								}]
							}]
						};
						var oModelContainer = new sap.ui.model.json.JSONModel([]);
						oModelContainer.setData(_self.Doc_List);
						_self.getView().setModel(oModelContainer, "Doc_List");
						_self.getView().getModel("Doc_List").refresh();
					}
				}
			});
			this.inputId = oEvent.getSource().getId();
			if (!this._dutyComponent) {
				this._dutyComponent = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.Versionlist", this);
				this.getView().addDependent(this._dutyComponent);
			}
			this._dutyComponent.open();
			this._OpenBusyDialogNoDelay();
		},
		handlePressSave: function () {
			this._dutyComponent.close();
		},
		_createBoeChildNewVersion: function (versionNum) {

			if (this.InvItemData.results.length > 0) {
				for (i = 0; i < this.InvItemData.results.length; i++) {
					this.InvItemData.results[i].version_num = versionNum;
					var item_json = this._FnDeleteMetaData(this.InvItemData.results[i]);
					delete item_json.to_BOEHeader;
					delete item_json.to_Currency;
					delete item_json.to_Currencyagc;
					delete item_json.to_Currencyfur;
					delete item_json.to_Currencyhss;
					delete item_json.to_Currencyinr;
					delete item_json.to_Currencyinsu;
					delete item_json.to_Currencymsc;
					delete item_json.to_Unitdel;
					delete item_json.to_Unitmein;
					delete item_json.to_Unitmeins01;
					delete item_json.to_Unitrec;
					delete item_json.to_Unitull;
					delete item_json.__metadata;
					this.BoeModelV.create("/xBRIxi_iidbeitm_v", item_json);
				}
			}
			if (this.ShippingInfo.results.length > 0) {
				for (i = 0; i < this.ShippingInfo.results.length; i++) {
					this.ShippingInfo.results[i].version_num = versionNum;
					delete this.ShippingInfo.results[i].__metadata;
					delete this.ShippingInfo.results[i].to_Unit;
					delete this.ShippingInfo.results[i].to_BOEHeader;
					delete this.ShippingInfo.results[i].amed_flag;
					this.BoeModelV.create("/xBRIxiiidbeshd_v", this.ShippingInfo.results[i]);
				}
			}
			if (this.boeExchgDetails.results.length > 0) {
				for (var i = 0; i < this.boeExchgDetails.results.length; i++) {
					this.boeExchgDetails.results[i].chcode = this.CHCode;
					//if (this.boeExchgDetails.results[i].Mode == "X" || !(this.boeExchgDetails.results[i].exccurslnoe)) {
					delete this.boeExchgDetails.results[i].Mode;
					delete this.boeExchgDetails.results[i].__metadata;
					delete this.boeExchgDetails.results[i].to_BOEHeader;
					delete this.boeExchgDetails.results[i].amed_flag;
					this.boeExchgDetails.results[i].version_num = versionNum;
					this.BoeModelV.create("/xBRIxI_EXCHANGE_BE_V", this.boeExchgDetails.results[i]);
					//}
				}
			}
			if (this.AdditionalInfo.results.length > 0) {
				for (var i = 0; i < this.AdditionalInfo.results.length; i++) {
					this.AdditionalInfo.results[i].ujno = this.UJCode;
					this.AdditionalInfo.results[i].ujdate = this.UJDate;
					this.AdditionalInfo.results[i].chcode = this.CHCode;
					this.AdditionalInfo.results[i].msgtype = this.MsgType;
					this.AdditionalInfo.results[i].version_num = versionNum;
					delete this.AdditionalInfo.results[i].Mode;
					delete this.AdditionalInfo.results[i].__metadata;
					delete this.AdditionalInfo.results[i].to_Unit;
					delete this.AdditionalInfo.results[i].to_BOEHeader;
					delete this.AdditionalInfo.results[i].to_cod_cof;
					delete this.AdditionalInfo.results[i].to_lnkinqu_cof;
					delete this.AdditionalInfo.results[i].to_qul_cof;
					delete this.AdditionalInfo.results[i].to_typ_cof;
					delete this.AdditionalInfo.results[i].amed_flag;
					this.BoeModelV.create("/xBRIxBE_BOE_V", this.AdditionalInfo.results[i]);
				}
			}
			if (this.LicenceItemData.results.length > 0) {
				for (i = 0; i < this.LicenceItemData.results.length; i++) {
					if ((this.LicenceItemData.results[i].bnftyp).includes("MEIS")) {
						this.LicenceItemData.results[i].bnftyp = "MEIS";
					} else if ((this.LicenceItemData.results[i].bnftyp).includes("ADVANCE LICENCE") || (this.LicenceItemData.results[i].bnftyp).includes(
							"DFL")) {
						this.LicenceItemData.results[i].bnftyp = "DFL";
					} else if ((this.LicenceItemData.results[i].bnftyp).includes("EXPORT PROMOTION CAPITAL GOODS") || (this.LicenceItemData.results[
								i]
							.bnftyp).includes("EPCG")) {
						this.LicenceItemData.results[i].bnftyp = "EPCG";
					}
					if (this.LicenceItemData.results[i].Split == "X" || this.LicenceItemData.results[i].flag1 != "X") {
						delete this.LicenceItemData.results[i].amed_flag;
						delete this.LicenceItemData.results[i].to_Currency;
						delete this.LicenceItemData.results[i].to_UOM;
						delete this.LicenceItemData.results[i].to_dochdr;
						delete this.LicenceItemData.results[i].__metadata;
						delete this.LicenceItemData.results[i].to_BOEHeader;
						delete this.LicenceItemData.results[i].Split;
						delete this.LicenceItemData.results[i].itmsrnolcs;
						delete this.LicenceItemData.results[i].lcsregprt;
						delete this.LicenceItemData.results[i].Parameters;
						delete this.LicenceItemData.results[i].message;
						this.LicenceItemData.results[i].version_num = versionNum;
						this.BoeModelV.create("/xBRIxiiidbsalo_v", this.LicenceItemData.results[i]);
					}
				}
			}
			if (this.I_be_sup_doc_Info.results.length > 0) {
				for (var i = 0; i < this.I_be_sup_doc_Info.results.length; i++) {
					this.I_be_sup_doc_Info.results[i].ujno = this.UJCode;
					this.I_be_sup_doc_Info.results[i].ujdate = this.UJDate;
					this.I_be_sup_doc_Info.results[i].chcode = this.CHCode;
					this.I_be_sup_doc_Info.results[i].msgtype = this.MsgType;
					delete this.I_be_sup_doc_Info.results[i].amed_flag; //Aiswarya
					delete this.I_be_sup_doc_Info.results[i].Mode;
					delete this.I_be_sup_doc_Info.results[i].__metadata;
					delete this.I_be_sup_doc_Info.results[i].to_BOEHeader;
					this.I_be_sup_doc_Info.results[i].version_num = versionNum;
					this.BoeModelV.create("/xBRIxI_be_sup_doc_v", this.I_be_sup_doc_Info.results[i]);
				}
			}
			if (this.ConstituemtsInfo.results.length > 0) {

				for (var i = 0; i < this.ConstituemtsInfo.results.length; i++) {
					this.ConstituemtsInfo.results[i].ujno = this.UJCode;
					this.ConstituemtsInfo.results[i].ujdate = this.UJDate;
					this.ConstituemtsInfo.results[i].chcode = this.CHCode;
					this.ConstituemtsInfo.results[i].msgtype = this.MsgType;
					delete this.ConstituemtsInfo.results[i].amed_flag;
					delete this.ConstituemtsInfo.results[i].Mode;
					delete this.ConstituemtsInfo.results[i].__metadata;
					delete this.ConstituemtsInfo.results[i].to_BOEHeader;
					this.ConstituemtsInfo.results[i].version_num = versionNum;
					this.BoeModelV.create("/xBRIxi_boe_item_swc_be_v", this.ConstituemtsInfo.results[i]);
				}
			}
			if (this.ControlInfo.results.length > 0) {
				for (var i = 0; i < this.ControlInfo.results.length; i++) {
					this.ControlInfo.results[i].ujno = this.UJCode;
					this.ControlInfo.results[i].ujdate = this.UJDate;
					this.ControlInfo.results[i].chcode = this.CHCode;
					this.ControlInfo.results[i].msgtype = this.MsgType;
					delete this.ControlInfo.results[i].amed_flag;
					delete this.ControlInfo.results[i].Mode;
					delete this.ControlInfo.results[i].__metadata;
					delete this.ControlInfo.results[i].to_BOEHeader;
					this.ControlInfo.results[i].version_num = versionNum;
					this.BoeModelV.create("/xBRIxi_boe_itm_ctrl_be_v", this.ControlInfo.results[i]);
				}
			}
			if (this.ProductionInfo.results.length > 0) {
				for (var i = 0; i < this.ProductionInfo.results.length; i++) {
					this.ProductionInfo.results[i].ujno = this.UJCode;
					this.ProductionInfo.results[i].ujdate = this.UJDate;
					this.ProductionInfo.results[i].chcode = this.CHCode;
					this.ProductionInfo.results[i].msgtype = this.MsgType;
					delete this.ProductionInfo.results[i].Mode;
					this.ProductionInfo.results[i].version_num = versionNum;
					delete this.ProductionInfo.results[i].amed_flag;
					delete this.ProductionInfo.results[i].__metadata;
					delete this.ProductionInfo.results[i].to_BOEHeader;
					this.BoeModelV.create("/xBRIxi_boe_itm_pro_be_v", this.ProductionInfo.results[i]);
				}
			}
			if (this.boeCetDetails.results.length > 0) {
				for (var i = 0; i < this.boeCetDetails.results.length; i++) {
					this.boeCetDetails.results[i].ujno = this.UJCode;
					this.boeCetDetails.results[i].ujdate = this.UJDate;
					this.boeCetDetails.results[i].chcode = this.CHCode;
					this.boeCetDetails.results[i].msgtype = this.MsgType;
					this.boeCetDetails.results[i].certytype = this.boeCetDetails.results[i].cettyp;
					delete this.boeCetDetails.results[i].__metadata;
					delete this.boeCetDetails.results[i].to_BOEHeader;
					delete this.boeCetDetails.results[i].Mode;
					delete this.boeCetDetails.results[i].amed_flag;
					this.boeCetDetails.results[i].version_num = versionNum;
					this.BoeModelV.create("/xBRIxI_CERT_BE_V", this.boeCetDetails.results[i]);
				}
			}
			if (this.boeHSSDetails.results.length > 0) {
				for (var i = 0; i < this.boeHSSDetails.results.length; i++) {
					var boeh_json = this._FnDeleteMetaData(this.boeHSSDetails.results[i]);
					boeh_json.chcode = this.CHCode;
					delete boeh_json.to_BOEHeader;
					delete boeh_json.__metadata;
					boeh_json.version_num = versionNum;
					this.BoeModelV.create("/xBRIxI_HSS_BE_V", boeh_json);
				}
			}
			if (this.boeIGMDetails.results.length > 0) {
				for (var i = 0; i < this.boeIGMDetails.results.length; i++) {
					this.boeIGMDetails.results[i].ujno = this.UJCode;
					this.boeIGMDetails.results[i].ujdate = this.UJDate;
					this.boeIGMDetails.results[i].chcode = this.CHCode;
					this.boeIGMDetails.results[i].msgtype = this.MsgType;
					delete this.boeIGMDetails.results[i].__metadata;
					delete this.boeIGMDetails.results[i].to_BOEHeader;
					delete this.boeIGMDetails.results[i].amed_flag; //Aiswarya

					delete this.boeIGMDetails.results[i].Mode;
					this.boeIGMDetails.results[i].version_num = versionNum;
					this.BoeModelV.create("/xBRIxI_IGMS_BE_V", this.boeIGMDetails.results[i]);
				}
			}
			if (this.boeCtxDetails.results.length > 0) {
				for (var i = 0; i < this.boeCtxDetails.results.length; i++) {
					this.boeCtxDetails.results[i].chcode = this.CHCode;
					this.boeCtxDetails.results[i].scode = this.boeHeaderData.gstnstcod;
					this.boeCtxDetails.results[i].version_num = versionNum;
					if (this.boeCtxDetails.results[i].Mode == "X" || !(this.boeCtxDetails.results[i].ctxslno)) {
						delete this.boeCtxDetails.results[i].__metadata;
						delete this.boeCtxDetails.results[i].to_BOEHeader;
						delete this.boeCtxDetails.results[i].Mode;
						delete this.boeCtxDetails.results[i].amed_flag;
						this.boeCtxDetails.results[i].version_num = versionNum;
						this.BoeModelV.create("/xBRIxI_iid_ctx_be_v", this.boeCtxDetails.results[i]);
					}
				}
			}
			if (this.boePmsnDetails.results.length > 0) {
				for (var i = 0; i < this.boePmsnDetails.results.length; i++) {
					var boel_json = this._FnDeleteMetaData(this.boePmsnDetails.results[i]);
					boel_json.chcode = this.CHCode;
					if (this.boeHeaderData.rsondlyclrnce) {
						boel_json.reason_req = this.boeHeaderData.rsondlyclrnce;
					} else {
						boel_json.reason_req = this.boePmsnDetails.results[i].reason_req;
					}
					boel_json.version_num = versionNum;
					delete boel_json.to_BOEHeader;
					delete boel_json.__metadata;
					this.BoeModelV.create("/xBRIxI_PERM_BE_V", boel_json);
				}
			}
			if (this.I_statemet_be_Info.results.length > 0) {

				for (var i = 0; i < this.I_statemet_be_Info.results.length; i++) {
					this.I_statemet_be_Info.results[i].ujno = this.UJCode;
					this.I_statemet_be_Info.results[i].ujdate = this.UJDate;
					this.I_statemet_be_Info.results[i].chcode = this.CHCode;
					this.I_statemet_be_Info.results[i].msgtype = this.MsgType;
					//  if (this.I_statemet_be_Info.results[i].Mode == "X") {
					delete this.I_statemet_be_Info.results[i].Mode;
					delete this.I_statemet_be_Info.results[i].amed_flag; //Aiswarya

					delete this.I_statemet_be_Info.results[i].tmpsrlNo;
					delete this.I_statemet_be_Info.results[i].__metadata;
					delete this.I_statemet_be_Info.results[i].to_BOEHeader;
					this.I_statemet_be_Info.results[i].version_num = versionNum;
					this.BoeModelV.create("/xBRIxI_statemet_be_v", this.I_statemet_be_Info.results[i]);
				}
			}
			/*for (var i = 0; i < this.boeAmndtDetails.results.length; i++) {
				var boea_json = this._FnDeleteMetaData(this.boeAmndtDetails.results[i]);
				delete boea_json.to_BOEHeader;
				delete boea_json.__metadata;
				boea_json.version_num = versionNum;
				this.BoeModelV.create("/xBRIxI_AMEND_BE", boea_json,);
			}*/

		},
		createBoeNewVersion: function () { //Aiswarya
			var _self = this;
			var requestbody = {};
			var json = {};
			var item_json = {};
			var license_json = {};
			var Additional_ = {};
			var duty_json = {};
			var boea_json = {};
			var i;
			if (this.SelVal == 25) {
				this.boeHeaderData.doc_stat = "25";
			}
			if (this.Mode == "I") {
				this.Docnumber = this.getView().byId("pdocno").getValue();
			}
			this.CustBOENo = this.getView().byId("impdpsno").getValue();
			this.BondRefNo = this.getView().byId("bondno").getValue();
			//this.IGMNumber = this.getView().byId("igmno").getValue();
			this.CustBOEDate = this.getView().byId("impdpdat").getValue();
			this.not_comp_date = this.getView().byId("not_comp_date").getValue();
			this.doc_del_date = this.getView().byId("doc_del_date").getValue();
			this.doc_rec_date = this.getView().byId("doc_rec_date").getValue();
			this.not_doc_ret_date = this.getView().byId("not_doc_ret_date").getValue();
			//  this.icd_igm_date = this.getView().byId("icd_igm_date").getValue();
			this.cust_doc_ret_date = this.getView().byId("cust_doc_ret_date").getValue();
			this.exch_rate_date = this.getView().byId("exch_rate_date").getValue();
			this.finalassmtdate = this.getView().byId("finalassmtdate").getValue();
			this.ooc_date = this.getView().byId("ooc_date").getValue();
			this.hss_agreement_date = this.getView().byId("hss_agreement_date").getValue();
			this.ooc_reg_date = this.getView().byId("ooc_reg_date").getValue();
			this.shipment_on_board_date = this.getView().byId("shipment_on_board_date").getValue();
			this.eta = this.getView().byId("eta").getValue();
			this.etd = this.getView().byId("etd").getValue();
			this.ataicd = this.getView().byId("ataicd").getValue();
			this.reqdtypmtdat = this.getView().byId("reqdtypmtdat").getValue();
			this.duedatdtypmt = this.getView().byId("duedatdtypmt").getValue();
			this.datdtypmtbasc = this.getView().byId("datdtypmtbasc").getValue();
			this.otpgendat = this.getView().byId("otpgendat").getValue();
			this.rfndaplndat = this.getView().byId("rfndaplndat").getValue();
			//this.iwrdt = this.getView().byId("iwrdt").getValue();
			//this.gatigdt = this.getView().byId("gatigdt").getValue();
			this.tr6_challan_date = this.getView().byId("tr6_challan_date").getValue();
			this.rfndrcvddat = this.getView().byId("rfndrcvddat").getValue();
			this.rwcrcptdat = this.getView().byId("rwcrcptdat").getValue();
			this.boeamdmt = this.getView().byId("boeamdmt").getSelectedKey();
			this.BondDate = this.getView().byId("bonddat").getValue();
			this.otherbnd_date = this.getView().byId("otherbnd_date").getValue();
			this.atadestport = this.getView().byId("atadestport").getValue();
			this.boeamdtreq = this.getView().byId("boeamdtreq").getValue();
			this.amndtcompdt = this.getView().byId("amndtcompdt").getValue();
			if (!this.shipment_on_board_date) {
				this.shipment_on_board_date = null;
			} else {
				var SplitDatePart = this.shipment_on_board_date.split("/");
				this.shipment_on_board_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() +
					"T00:00:00";
			}
			if (!this.eta) {
				this.eta = null;
			} else {
				var SplitDatePart = this.eta.split("/");
				this.eta = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.etd) {
				this.etd = null;
			} else {
				var SplitDatePart = this.etd.split("/");
				this.etd = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.ataicd) {
				this.ataicd = null;
			} else {
				var SplitDatePart = this.ataicd.split("/");
				this.ataicd = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.reqdtypmtdat) {
				this.reqdtypmtdat = null;
			} else {
				var SplitDatePart = this.reqdtypmtdat.split("/");
				this.reqdtypmtdat = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.duedatdtypmt) {
				this.duedatdtypmt = null;
			} else {
				var SplitDatePart = this.duedatdtypmt.split("/");
				this.duedatdtypmt = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.datdtypmtbasc) {
				this.datdtypmtbasc = null;
			} else {
				var SplitDatePart = this.datdtypmtbasc.split("/");
				this.datdtypmtbasc = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.otpgendat) {
				this.otpgendat = null;
			} else {
				var SplitDatePart = this.otpgendat.split("/");
				this.otpgendat = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.rfndaplndat) {
				this.rfndaplndat = null;
			} else {
				var SplitDatePart = this.rfndaplndat.split("/");
				this.rfndaplndat = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.tr6_challan_date) {
				this.tr6_challan_date = null;
			} else {
				var SplitDatePart = this.tr6_challan_date.split("/");
				this.tr6_challan_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.rfndrcvddat) {
				this.rfndrcvddat = null;
			} else {
				var SplitDatePart = this.rfndrcvddat.split("/");
				this.rfndrcvddat = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.rwcrcptdat) {
				this.rwcrcptdat = null;
			} else {
				var SplitDatePart = this.rwcrcptdat.split("/");
				this.rwcrcptdat = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.atadestport) {
				this.atadestport = null;
			} else {
				var SplitDatePart = this.atadestport.split("/");
				this.atadestport = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.CustBOEDate) {
				this.CustBOEDate = null;
			} else {
				var SplitDatePart = this.CustBOEDate.split("/");
				this.CustBOEDate = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.not_comp_date) {
				this.not_comp_date = null;
			} else {
				var SplitDatePart = this.not_comp_date.split("/");
				this.not_comp_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.doc_del_date) {
				this.doc_del_date = null;
			} else {
				var SplitDatePart = this.doc_del_date.split("/");
				this.doc_del_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.doc_rec_date) {
				this.doc_rec_date = null;
			} else {
				var SplitDatePart = this.doc_rec_date.split("/");
				this.doc_rec_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.not_doc_ret_date) {
				this.not_doc_ret_date = null;
			} else {
				var SplitDatePart = this.not_doc_ret_date.split("/");
				this.not_doc_ret_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}

			/*  if (!this.icd_igm_date) {
                this.icd_igm_date = null;
            } else {
                var SplitDatePart = this.icd_igm_date.split("/");
                this.icd_igm_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
            }
*/
			if (!this.cust_doc_ret_date) {
				this.cust_doc_ret_date = null;
			} else {
				var SplitDatePart = this.cust_doc_ret_date.split("/");
				this.cust_doc_ret_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}

			if (!this.exch_rate_date) {
				this.exch_rate_date = null;
			} else {
				var SplitDatePart = this.exch_rate_date.split("/");
				this.exch_rate_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}

			if (!this.finalassmtdate) {
				this.finalassmtdate = null;
			} else {
				var SplitDatePart = this.finalassmtdate.split("/");
				this.finalassmtdate = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.ooc_date) {
				this.ooc_date = null;
			} else {
				var SplitDatePart = this.ooc_date.split("/");
				this.ooc_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}

			if (!this.hss_agreement_date) {
				this.hss_agreement_date = null;
			} else {
				var SplitDatePart = this.hss_agreement_date.split("/");
				this.hss_agreement_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}

			if (!this.ooc_reg_date) {
				this.ooc_reg_date = null;
			} else {
				var SplitDatePart = this.ooc_reg_date.split("/");
				this.ooc_reg_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.amndtcompdt) {
				this.amndtcompdt = null;
			} else {
				var SplitDatePart = this.amndtcompdt.split("/");
				this.amndtcompdt = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.boeamdtreq) {
				this.boeamdtreq = null;
			} else {
				var SplitDatePart = this.boeamdtreq.split("/");
				this.boeamdtreq = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.BondDate) {
				this.BondDate = null;
			} else {
				var SplitDatePart = this.BondDate.split("/");
				this.BondDate = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.otherbnd_date) {
				this.otherbnd_date = null;
			} else {
				var SplitDatePart = this.otherbnd_date.split("/");
				this.otherbnd_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			this.NocontShip = this.getView().byId("tot_no_cont").getValue();
			//this.SuppRel = (this.getView().byId("supplier_rel").getSelected() ? "X" : "");
			this.DefPmt = this.getView().byId("defpmt").getSelectedKey();
			this.boeamdtdetl = this.getView().byId("boeamdtdetl").getValue();
			/*Additional Fields*/
			this.amndtcompdt = this.getView().byId("amndtcompdt").getValue();
			this.boeamdtreq = this.getView().byId("boeamdtreq").getValue();
			if (!this.boeamdtreq) {
				this.boeamdtreq = null;
			} else {
				var SplitDatePart = this.boeamdtreq.split("/");
				this.boeamdtreq = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.amndtcompdt) {
				this.amndtcompdt = null;
			} else {
				var SplitDatePart = this.amndtcompdt.split("/");
				this.amndtcompdt = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			this.CurSelSt = this.getView().byId("boests").getSelectedKey();
			json = this._FnUpdateHeader(this._FnConvertJSON(this.boeHeaderData));
			//console.log("new version creation json:", json);
			var mParameters = {
				groupId: "batchUpdate",
				eTag: "*"
			};
			//  this.BoeModelV.setDeferredGroups(["batchUpdate"]);
			//  this.BoeModel.setDeferredGroups(this.BoeModel.getDeferredGroups().concat(["batchUpdate"]));
			//this.BoeModelV.create("/xBRIxI_IIDBOEHDR_V", json, mParameters);
			delete json.to_ClearanceType;
			delete json.to_Clearance_Type;
			delete json.to_shptyp;
			delete json.to_DIFFDUTYPAYMENT;
			delete json.to_IMPORT_PURPOSE;
			delete json.to_ImportPurpose;
			delete json.to_Material_type;
			delete json.to_Materialtype;
			delete json.to_Mode_of_Payment;
			delete json.to_SHIPPING_LINE;
			delete json.to_SHP_TYPE;
			delete json.to_TYPE_OF_ASSMNT;
			delete json.to_WAREHOUSE_MASTER;
			delete json.to_bndocdlrymtod;
			delete json.to_drctportdelvery;
			var inputDateString = json.grndat; //Aiswarya for offset error by grndat
			if (inputDateString == null) {

			} else {
				if (inputDateString.includes('Z')) {
					var dateWithoutZ = inputDateString.replace('Z', '');
					json.grndat = dateWithoutZ; 
				}else{
				}
			}//ended code
			var self = this;
			this.BoeModelV.create("/xBRIxI_IIDBOEHDR_V", json, {
				success: function (oData, response) {
					var status = JSON.parse(response.headers['sap-message']).message;
					var vnum = status.slice(0, 2);
					var statusText = "New version " + vnum + " created for " + _self.boeHeaderData.docno;
					_self._createBoeChildNewVersion(vnum);
					_self.versionListamd(); // Aiswarya
					MessageBox.success(statusText, {
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								_self._CloseBusyDialog();
								window.FlagRefresh = true;
								window.FromDocNumber = _self.docNumber;
								window.BOEType = _self.docType;
								window.Status_val = "";
								_self.router.navTo("boelist", true);
							}
						}
					});
				},
				error: function (Error) {
					_self._CloseBusyDialog();
					//
					if (JSON.parse(JSON.stringify(Error.responseText)).error) {
						MessageBox.error(JSON.parse(Error.responseText).error.message.value);
					} else {
						MessageBox.error("Error occured while creating data,Please try again later");
						_self._CloseBusyDialog();
					}

				}
			});
			this.boeVersionListCheck();
			/*for (i = 0; i < this.InvItemData.results.length; i++) {
			    item_json = this._FnDeleteMetaData(this.InvItemData.results[i]);
			    delete item_json.to_BOEHeader;
			    delete item_json.to_Currency;
			    delete item_json.to_Currencyagc;
			    delete item_json.to_Currencyfur;
			    delete item_json.to_Currencyhss;
			    delete item_json.to_Currencyinr;
			    delete item_json.to_Currencyinsu;
			    delete item_json.to_Currencymsc;
			    delete item_json.to_Unitdel;
			    delete item_json.to_Unitmein;
			    delete item_json.to_Unitmeins01;
			    delete item_json.to_Unitrec;
			    delete item_json.to_Unitull;
			    delete item_json.__metadata;
			    //this.BoeModelV.create("/xBRIxi_iidbeitm_v", item_json);
			    this.BoeModelV.createEntry("/xBRIxi_iidbeitm_v", {
			    properties: item_json,
			        //groupId: "batchUpdate"
			});
			}*/

		},

		versionListamd: function () { //Aiswarya

			//for IGMS Aiswarya
			var _self = this;

			_self._OpenBusyDialog();
			return new Promise((resolve, reject) => {
				_self.BoeModel.read("/xBRIxi_iidbehdr(doctyp='" + _self.docType + "',docno='" + _self.docNumber + "')", {
					urlParameters: {
						"$expand": "to_itemdetails,to_shippingdetails,to_Salo,to_dutydetails,to_BE_BOE,to_swc_be,to_pro_be,to_ctrl_be,to_I_RSP_BE,to_I_DEPB_BE,to_I_reimport_be,to_I_statemet_be,to_I_be_sup_doc,to_I_be,to_I_EXCHANGE_BE,to_I_HSS_BE,to_I_PERM_BE,to_I_CERT_BE,to_I_iid_ctx_be,to_I_AMEND_BE,to_I_IGMS_BE"
					},
					success: function (oData) {
						/*********** Header infromation ************/
						_self.boeHeaderData = oData;
						/*********** Items infromation ************/
						_self.InvItemData = oData.to_itemdetails;
						/*********** Shipment infromation ************/
						_self.ShippingInfo = oData.to_shippingdetails;
						/********* allocation *********************/
						_self.LicenceItemData = oData.to_Salo;
						_self.IntitalLicenceRow = _self._FnConvertJSON(oData.to_Salo);
						_self.LicenceInitialRec = _self._FnConvertJSON(oData.to_Salo);
						/*********** Duty infromation ************/
						_self.DutyItemDataLocal = oData.to_dutydetails;
						_self.AllItemDutyDetails = oData.to_dutydetails;
						/********* .be Information *********************/
						_self.AdditionalInfo = oData.to_BE_BOE;
						_self.ControlInfo = oData.to_ctrl_be;
						_self.ConstituemtsInfo = oData.to_swc_be;
						_self.ProductionInfo = oData.to_pro_be;
						_self.I_RSP_BE_Info = oData.to_I_RSP_BE;
						_self.I_DEPB_BE_Info = oData.to_I_DEPB_BE;
						_self.I_reimport_be_Info = oData.to_I_reimport_be;
						_self.I_statemet_be_Info = oData.to_I_statemet_be;
						_self.I_be_sup_doc_Info = oData.to_I_be_sup_doc;
						_self.boeExchgDetails = oData.to_I_EXCHANGE_BE;
						_self.boeCetDetails = oData.to_I_CERT_BE;
						_self.boeCtxDetails = oData.to_I_iid_ctx_be;
						_self.boeBEdetails = oData.to_I_be;
						_self.boeHSSDetails = oData.to_I_HSS_BE;
						_self.boePmsnDetails = oData.to_I_PERM_BE;
						_self.boeIGMDetails = oData.to_I_IGMS_BE;
						_self._CloseBusyDialog();
						resolve();
					},
					errror: function (oData) {
						MessageBox.error("Something Went Wrong . Please Try again Later");
						reject();
						_self._CloseBusyDialog();
					}
				});
			})

		},
		OnPressNewVersion: function () { //Aiswarya
			var _self = this;
			MessageBox.show(
				'Would you like to create new version', {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirmation",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					initialFocus: "No",
					onClose: function (oAction) {
						if (oAction == sap.m.MessageBox.Action.YES) {
							_self.valChngFlag = 0;
							_self._OpenBusyDialog();
							_self.BoeModel.read("/xBRIxi_iidbehdr(doctyp='" + _self.docType + "',docno='" + _self.docNumber + "')", {
								urlParameters: {
									"$expand": "to_itemdetails,to_shippingdetails,to_Salo,to_dutydetails,to_BE_BOE,to_swc_be,to_pro_be,to_ctrl_be,to_I_RSP_BE,to_I_DEPB_BE,to_I_reimport_be,to_I_statemet_be,to_I_be_sup_doc,to_I_be,to_I_EXCHANGE_BE,to_I_HSS_BE,to_I_PERM_BE,to_I_CERT_BE,to_I_iid_ctx_be,to_I_AMEND_BE,to_I_IGMS_BE"
								},
								success: function (oData) {
									console.log("inside success :", oData);
									/*********** Header infromation ************/
									_self.boeHeaderData = oData;
									/*********** Items infromation ************/
									_self.InvItemData = oData.to_itemdetails;
									/*********** Shipment infromation ************/
									_self.ShippingInfo = oData.to_shippingdetails;
									/********* allocation *********************/
									_self.LicenceItemData = oData.to_Salo;
									_self.IntitalLicenceRow = _self._FnConvertJSON(oData.to_Salo);
									_self.LicenceInitialRec = _self._FnConvertJSON(oData.to_Salo);
									/*********** Duty infromation ************/
									_self.DutyItemDataLocal = oData.to_dutydetails;
									_self.AllItemDutyDetails = oData.to_dutydetails;
									/********* .be Information *********************/
									_self.AdditionalInfo = oData.to_BE_BOE;
									_self.ControlInfo = oData.to_ctrl_be;
									_self.ConstituemtsInfo = oData.to_swc_be;
									_self.ProductionInfo = oData.to_pro_be;
									_self.I_RSP_BE_Info = oData.to_I_RSP_BE;
									_self.I_DEPB_BE_Info = oData.to_I_DEPB_BE;
									_self.I_reimport_be_Info = oData.to_I_reimport_be;
									_self.I_statemet_be_Info = oData.to_I_statemet_be;
									_self.I_be_sup_doc_Info = oData.to_I_be_sup_doc;
									_self.boeExchgDetails = oData.to_I_EXCHANGE_BE;
									_self.boeCetDetails = oData.to_I_CERT_BE;
									_self.boeCtxDetails = oData.to_I_iid_ctx_be;
									_self.boeBEdetails = oData.to_I_be;
									_self.boeHSSDetails = oData.to_I_HSS_BE;
									_self.boePmsnDetails = oData.to_I_PERM_BE;
									_self.boeIGMDetails = oData.to_I_IGMS_BE;
									_self.IntialLoadData();
									_self.createBoeNewVersion();
									_self.amnd_fun(); // Aiswarya
								},
								errror: function (oData) {
									MessageBox.error("Something Went Wrong . Please Try again Later");
									_self._CloseBusyDialog();
								}
							});

						} else {
							this._CloseBusyDialog();
						}
					}
				}
			);
		},
		/*for amendment:Aiswarya*/
		amnd_fun: function () {
			//debugger;
			var _self = this;
			_self.BoeModel.read("/xBRIxi_iidbehdr(doctyp='" + _self.docType + "',docno='" + _self.docNumber + "')", {
				urlParameters: {
					"$expand": "to_I_statemet_be,to_I_be_sup_doc,to_I_be,to_I_IGMS_BE"
				},
				success: function (oData) {
					_self.boeIGMDetails_temp = oData.to_I_IGMS_BE;
					_self.boeSupDocDetails_temp = oData.to_I_be_sup_doc;
					_self.boeStatemetDetails_temp = oData.to_I_statemet_be;

				},
				errror: function (oData) {
					MessageBox.error("Something Went Wrong While loading Amendment Details. Please Try again Later");
					_self._CloseBusyDialog();
				}
			});
		},
		/*amendment ends*/
		onAfterRendering: function () {
			var _self = this;
			this.TempVar = 0;
			// if (this.getView().sId == "__xmlview2") {
			//  alert("Hi");
			// }
			_self.valChngFlag = 0;
			$(document).on("change", "Input", function (event) {
				event.preventDefault();
				_self.valChngFlag = 1;
			});
			$(document).on("click", "li.sapMComboBoxBaseItem", function (event) {
				event.preventDefault();
				_self.valChngFlag = 1;
			});
			/*	$(document).keydown(function(e){
   var code = e.keyCode || e.which;
   alert(code);
});*/
			$(document).on("change", "input", function (event) {
				event.preventDefault();
				_self.valChngFlag = 1;
			});
			$(document).on("click", "span.sapUiCalItemText", function (event) {
				event.preventDefault();
				_self.valChngFlag = 1;
			});
			$(document).on("change", "textarea", function (event) {
				event.preventDefault();
				_self.valChngFlag = 1;
			});
			$(document).on("click", "li.sapMSLI", function (event) {
				event.preventDefault();
				_self.valChngFlag = 1;
			});
			$($("#shell-header-logo")).on("click", function (event) {
				event.preventDefault();
				_self.initialLock = false;
				_self.byId("idSwtichMode").setState(false);
				_self.LockObjectCall();
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "#"
					}
				});
			});
			$($("#sapUshellNavHierarchyItems-listUl")).on("click", function (event) {
				event.preventDefault();
				_self.initialLock = false;
				_self.byId("idSwtichMode").setState(false);
				_self.LockObjectCall();
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "#"
					}
				});
			});
		},
		_handleRouteMatched: function (oEvent) {
			this.SelVal = "";
			var _self = this;
			this.valChngFlag = 0;
			this.argsList = oEvent.getParameter("arguments");
			this.strtup = this.argsList.strtup;
			this.Mode = this.argsList.Mode;
			this.BOEdocnr = this.argsList.docnr;

			/****** DMS Changed by Nikhila*****/
			this.initialFileLoad = true; //change by nikhila
			this.initialNNDOLoad = true; //change by nikhila
			this.allNNDOFiles = undefined;
			this.AllFiles = undefined;
			this.fileName = "";
			this.fileType = "";
			this.boeFolderName = ""; //change by Riji
			this.nndoFolderName = ""; //change by Riji
			this.fileServiceType = ""; //change by Riji
			this.Readcodetype(); //Added by arjun
			var tempJSONFile = { //change by nikhila
				results: [] //change by nikhila
			}; //change by nikhila
			var oModel = new sap.ui.model.json.JSONModel(); //change by nikhila
			// Load JSON in model
			oModel.setData(tempJSONFile); //change by nikhila
			this.getView().setModel(oModel, "AllNNDOFiles"); //change by nikhila
			this.getView().setModel(oModel, "AllFiles"); //change by nikhila
			/*****/
			// Amendment-temporary json* Aiswarya/ 
			_self.boeIGMDetails_temp = {};
			_self.boeSupDocDetails_temp = {};

			_self.boeStatemetDetails_temp = {};

			// amendment ends
			/******Call Lock Objects******/
			this.initialLock = true;
			/******To Call unloack on back btn click***/
			this.getOwnerComponent().getService("ShellUIService").then(function (oShellService) {
				oShellService.setBackNavigation(function () {
					_self.initialLock = false;
					_self.byId("idSwtichMode").setState(false);
					_self.LockObjectCall();
					window.history.go(-1);
					window.history.back();
				});
			});
			if (window.FlagDetailLoad) {
				this._OpenBusyDialog();

				/*********** Header infromation ************/
				if (_self.getOwnerComponent().getModel("boeHeader")) {
					_self.boeHeaderData = _self.getOwnerComponent().getModel("boeHeader").getData();
					// change by Riji for DMS Dynamic folders
					if (_self.boeHeaderData.nndo_fldr !== "") {
						_self.nndoFolderName = _self.boeHeaderData.nndo_fldr;
					} else {
						_self.nndoFolderName = "NNDO";
					}
					if (_self.boeHeaderData.boe_fldr !== "") {
						_self.boeFolderName = _self.boeHeaderData.boe_fldr;
					} else {
						_self.boeFolderName = "BOE";
					}
					//console.log("folder", _self.boeFolderName, _self.nndoFolderName);
				}
				/*********** Items infromation ************/
				if (_self.getOwnerComponent().getModel("boeItems")) {
					_self.InvItemData = _self.getOwnerComponent().getModel("boeItems").getData();
				}
				/*********** Shipment infromation ************/
				_self.ShippingInfo = {
					results: []
				};
				if (_self.getOwnerComponent().getModel("boeShipping").getData()) {
					_self.ShippingInfo = _self.getOwnerComponent().getModel("boeShipping").getData();
				}
				/*********** Duty infromation ************/
				_self.DutyItemDataLocal = {
					results: []
				};
				if (_self.getView().getModel("boeDutyComp").getData()) {
					_self.DutyItemDataLocal = _self.getView().getModel("boeDutyComp").getData();
					_self.AllItemDutyDetails = _self.getView().getModel("boeDutyComp").getData();

				}
				/********* allocation *********************/
				_self.LicenceItemData = {
					results: []
				};
				if (_self.getOwnerComponent().getModel("boeAllocation").getData()) {
					_self.LicenceItemData = _self.getOwnerComponent().getModel("boeAllocation").getData();
					_self.IntitalLicenceRow = _self._FnConvertJSON(_self.getOwnerComponent().getModel("boeAllocation").getData());
					_self.LicenceInitialRec = _self._FnConvertJSON(_self.getOwnerComponent().getModel("boeAllocation").getData());
				}
				/********* .be Information *********************/
				if (_self.getOwnerComponent().getModel("AdditionalInfo")) {
					_self.AdditionalInfo = _self.getOwnerComponent().getModel("AdditionalInfo").getData();
				}
				if (_self.getOwnerComponent().getModel("ControlInfo")) {
					_self.ControlInfo = _self.getOwnerComponent().getModel("ControlInfo").getData();
				}
				if (_self.getOwnerComponent().getModel("ConstituemtsInfo")) {
					_self.ConstituemtsInfo = _self.getOwnerComponent().getModel("ConstituemtsInfo").getData();
				}
				if (_self.getOwnerComponent().getModel("ProductionInfo")) {
					_self.ProductionInfo = _self.getOwnerComponent().getModel("ProductionInfo").getData();
				}
				if (_self.getOwnerComponent().getModel("I_RSP_BE_Info")) {
					_self.I_RSP_BE_Info = _self.getOwnerComponent().getModel("I_RSP_BE_Info").getData();
				}
				if (_self.getOwnerComponent().getModel("I_DEPB_BE_Info")) {
					_self.I_DEPB_BE_Info = _self.getOwnerComponent().getModel("I_DEPB_BE_Info").getData();
				}
				if (_self.getOwnerComponent().getModel("I_reimport_be_Info")) {
					_self.I_reimport_be_Info = _self.getOwnerComponent().getModel("I_reimport_be_Info").getData();
				}
				if (_self.getOwnerComponent().getModel("I_statemet_be_Info")) {
					_self.I_statemet_be_Info = _self.getOwnerComponent().getModel("I_statemet_be_Info").getData();
				}
				if (_self.getOwnerComponent().getModel("I_be_sup_doc_Info")) {
					_self.I_be_sup_doc_Info = _self.getOwnerComponent().getModel("I_be_sup_doc_Info").getData();
				}
				if (_self.getOwnerComponent().getModel("boeExchgDetails")) {
					_self.boeExchgDetails = _self.getOwnerComponent().getModel("boeExchgDetails").getData();
				}
				if (_self.getOwnerComponent().getModel("boeCetDetails")) {
					_self.boeCetDetails = _self.getOwnerComponent().getModel("boeCetDetails").getData();
				}
				if (_self.getOwnerComponent().getModel("boeIGMDetails")) {
					_self.boeIGMDetails = _self.getOwnerComponent().getModel("boeIGMDetails").getData();
				}
				if (_self.getOwnerComponent().getModel("boeCtxDetails")) {
					_self.boeCtxDetails = _self.getOwnerComponent().getModel("boeCtxDetails").getData();
				}
				if (_self.getOwnerComponent().getModel("boeBEdetails")) {
					_self.boeBEdetails = _self.getOwnerComponent().getModel("boeBEdetails").getData();
				}
				/*if (_self.getOwnerComponent().getModel("boeAmndtDetails")) {
					_self.boeAmndtDetails = _self.getOwnerComponent().getModel("boeAmndtDetails").getData();
				}*/
				if (_self.getOwnerComponent().getModel("boeHSSDetails")) {
					_self.boeHSSDetails = _self.getOwnerComponent().getModel("boeHSSDetails").getData();
				}

				if (_self.getOwnerComponent().getModel("boePmsnDetails")) {
					_self.boePmsnDetails = _self.getOwnerComponent().getModel("boePmsnDetails").getData();
				}
				_self.CalculateSum(oEvent);
				this.IntialLoadData();
			}
			/************Check navaigation***************/
			if (this.strtup == "STR_PRMS") {
				this.getView().byId("idSwtichMode").setVisible(false);
				this.getView().byId("idclindetailPage").setShowNavButton(false);
				document.getElementById("backBtn").remove();
			}

			var filters = new Array();
			var filterval = new sap.ui.model.Filter("modul", sap.ui.model.FilterOperator.EQ, "BOE");
			filters.push(filterval);
			this.DMS_Model.read("/xBRIxI_DMS", {
				urlParameters: {
					$top: "500"
				},
				filters: filters,
				success: function (oData) {
					_self.DocType.results = oData.results;
					var data = {
						results: []
					};
					data.results.doccat = "All";
					data.results.doctyp = "All";
					data.results.doctypdesc = "All";
					oData.results.push(data.results);
					_self.getView().getModel("DMSModel").setData(oData);
				},
				error: function (response) {}
			});
			this.link = document.createElement('a');
			this.boeVersionListCheck(); //Aiswarya
		},
		Readcodetype: function () { //Added by arjun
			var _self = this;
			_self.codetypearray = {
				results: []
			};
			var pvalue = "STYP";
			this.CmnModel.read("/xBRIxCE_CODTYP(inparam='" + pvalue + "')/Set", {
				success: function (getData) {
					for (var i = 0; i < getData.results.length; i++) {
						_self.codetypearray.results.push({
							codtyp: getData.results[i].codtyp,
							coddesc: getData.results[i].coddesc,
						});
						var oModelStype = new sap.ui.model.json.JSONModel([]);
						oModelStype.setData(_self.codetypearray);
						_self.getView().setModel(oModelStype, "TypeModel");
					}
				},
				error: function (getData) {
					MessageBox.error("error");

				}
			});
		},
		callJavaServer: function (docnr, boeFolderName) {
			var msg = {
				results: []
			};
			var _self = this;
			var paramdocno = "_" + docnr + "_"; //change by nikhila
			jQuery.ajax({
				url: "/documentservice/fileInfo",
				type: "POST",
				data: JSON.stringify({
					"docno": paramdocno,
					"foldername": boeFolderName
				}),
				async: true,
				dataType: "json",
				contentType: "application/json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Basic " + btoa("ui5user" + ":" + "@#SsdFg!05!7*3Bvl.6iNm0%)Q!"));
				},
				success: function (data) {
					var msg = {
						results: []
					};
					if (!data.msgText.match("null")) {
						var singleFile = false;
						if (data.msgText.length > 2) {
							var str;
							if (data.msgText.match("~")) {
								str = data["msgText"].replace("{BOE=", "").split("~~~");
							} else {
								str = data["msgText"].replace("{BOE=", "");
								singleFile = true;
								var results = {};
								results.filename = str.split("---")[0];
								msg.results.push(results);
							}
							if (!singleFile) {
								for (var i = 0; i < str.length; i++) {
									var results = {};
									results.filename = str[i].split("---")[0];
									msg.results.push(results);
								}
							}
						}
					}
					_self.AllFiles = {
						results: []
					};
					_self.AllFiles = msg;
					var oModel = new sap.ui.model.json.JSONModel();
					// Load JSON in model
					oModel.setData(msg);
					_self.getView().setModel(oModel, "AllFiles");
					_self.UpdateDMSTable(_self.docNumber);
					_self._CloseBusyDialog();
				},
				error: function (e) {
					_self._CloseBusyDialog();
					// MessageBox.error("Error while loading Data");
				}
			});

		},
		DMSListCall: function (docnr) {
			//	console.log("inside DMSListCall", this.boeFolderName); //testing
			//Nikhila
			var _self = this;
			this.NNDODocType = {
				results: []
			};
			this.DocType = {
				results: []
			}
			var filtersData = new Array();
			var filterval1 = new sap.ui.model.Filter("module_dms", sap.ui.model.FilterOperator.EQ, "BOE");
			var filterval2 = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.EQ, this.argsList.docnr);
			filtersData.push(filterval1);
			filtersData.push(filterval2);
			var oModelDMSData = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModelDMSData, "DMSModel");
			this.DMSService_Model.read("/xBRIxI_DMSFILCHECK", {
				urlParameters: {
					$top: "5000"
				},
				filters: filtersData,
				success: function (oData, response) {
					debugger;
					var checkCount = oData.results.length;
					_self.DMSService_Model.read("/xBRIxi_dms_table", {
						urlParameters: {
							$top: "5000"
						},
						filters: filtersData,
						success: function (oDataVar, sponse) {
							//_self.AllFiles = undefined;
							var TableCount = oDataVar.results.length;
							if (_self.boeHeaderData.boe_fldr !== "") {
								_self.boeFolderName = _self.boeHeaderData.boe_fldr;
							} else {
								_self.boeFolderName = "BOE";
							}
							if (checkCount <= 0 && TableCount <= 0) {
								//	_self._OpenBusyDialog();
								_self.callJavaServer(_self.argsList.docnr, _self.boeFolderName);
							} else {
								_self.AllFiles = {
									results: []
								};
								_self.AllFiles = oDataVar;
								var oModel = new sap.ui.model.json.JSONModel();
								oModel.setData(oDataVar);
								_self.getView().setModel(oModel, "AllFiles");
								_self._CloseBusyDialog();
							}
						},
						error: function (response) {
							debugger;
						}
					});
				},
				error: function (response) {
					debugger;
				}
			});
			this.getView().byId("fileUploader").setEnabled(false);
			this.getView().byId("btnUpload").setEnabled(false);

			//Nikhila	
		},
		FilerCompanyDetailsFromProfile: function () {
			var _self = this;
			var bukrs = this.CompanyCode;
			var filters = new Array();
			var filterval = new sap.ui.model.Filter("bukrs", sap.ui.model.FilterOperator.EQ, bukrs);
			filters.push(filterval);
			this.BoeModel.read("/xBRIxI_IBSPROFIL", {
				filters: filters,
				success: function (getData) {
					if (getData.results.length > 0) {
						_self.getView().byId("panno").setValue(getData.results[0].panno);
						_self.getView().byId("svbndfleno").setValue(getData.results[0].svbndfleno);
						_self.getView().byId("bfregno").setValue(_self.formatDate(getData.results[0].bfregno));
						_self.getView().byId("ieccodsel").setValue(getData.results[0].ieccodsel);
						_self.boeHeaderData.ieccodsel = getData.results[0].ieccodsel;
					}
				},
				error: function (error) {}
			});
		},
		IntialLoadData: function () {
			var _self = this;
			_self.byId("idSwtichMode").setState(false);
			_self.byId("btn_save").setVisible(false);
			_self.DiffArray = {
				results: []
			};
			_self.Reallocated = false;
			_self.AllocatedNewRow = false;
			var oPage = _self.getView().byId("idclindetailPage");
			_self.docnr = _self.boeHeaderData.docno;
			_self.docNumber = _self.boeHeaderData.docno;
			_self.docType = _self.boeHeaderData.doctyp;
			_self.BOEStatus = _self.boeHeaderData.doc_stat;
			_self.CompanyCode = _self.boeHeaderData.bukrs;
			_self.Chacode = _self.boeHeaderData.chacode;
			_self.BOE_PostStat = _self.boeHeaderData.boestat;
			_self.SelValFlSts = _self.boeHeaderData.be_filing_status;
			_self.ClearanceType = _self.boeHeaderData.clearance_type;
			if (_self.docType == "W") {
				var DocTypeNm = "Home Consumption";
			} else if (_self.docType == "Y") {
				var DocTypeNm = "Into Bond";
			} else if (_self.docType == "E") {
				var DocTypeNm = "Ex Bond";
			} else if (_self.docType == "B") {
				var DocTypeNm = "Bond to Bond";
			}

			if (_self.Mode == "I") {
				oPage.setTitle("Create Bill of Entry");
				_self.byId("idSwtichMode").setState(true);
				_self.OnChangeSwitchDefault();
				_self.byId("idclindetailPage").setTitle(_self.byId("idclindetailPage").getTitle().replace("Change", "Create"));
				_self.byId("idclindetailPage").setTitle(_self.byId("idclindetailPage").getTitle().replace("Display", "Create"));
				_self.byId("idSwtichMode").setVisible(false);
			} else if (_self.Mode == "U") {
				oPage.setTitle(_self.docNumber + " (" + DocTypeNm + "):" + "Display Bill of Entry Detail");
				_self.byId("idSwtichMode").setState(false);
				_self.OnChangeSwitchDefault();
				_self.byId("idclindetailPage").setTitle(_self.byId("idclindetailPage").getTitle().replace("Change", "Display"));
				_self.byId("idclindetailPage").setTitle(_self.byId("idclindetailPage").getTitle().replace("Display", "Display"));
				_self.byId("idSwtichMode").setVisible(true);
			}
			_self.ItemList = _self._FnConvertJSON(_self.InvItemData);
			var oModelBOEitemlist = new sap.ui.model.json.JSONModel([]);
			oModelBOEitemlist.setData(_self.ItemList);
			_self.getView().setModel(oModelBOEitemlist, "boeItemList");
			var oModelBOEheaderdetails = new sap.ui.model.json.JSONModel([]);
			oModelBOEheaderdetails.setData(_self.boeHeaderData);
			_self.getView().setModel(oModelBOEheaderdetails, "boeHeaderdetails");
			var oModelBOEshippingdetails = new sap.ui.model.json.JSONModel([]);
			oModelBOEshippingdetails.setData(_self.ShippingInfo.results[0]);
			_self.getView().setModel(oModelBOEshippingdetails, "boeShippingdetails");
			var oModelBOEdutyCompdetails = new sap.ui.model.json.JSONModel([]);
			oModelBOEdutyCompdetails.setData(_self.DutyItemDataLocal);
			_self.getView().setModel(oModelBOEdutyCompdetails, "boeDutyCompdetails");
			var oModelboeBEdetails = new sap.ui.model.json.JSONModel([]);
			oModelboeBEdetails.setData(_self.boeBEdetails.results[0]);
			_self.getView().setModel(oModelboeBEdetails, "boeBEdetails");
			/*	if (_self.boeAmndtDetails.results[0]) {
				_self.boeAmndtDetails = _self.boeAmndtDetails.results[0];
			} else {
				_self.boeAmndtDetails = _self.boeAmndtDetails.results;
			}
			var oModelboeAmndtDetails = new sap.ui.model.json.JSONModel([]);
			oModelboeAmndtDetails.setData(_self.boeAmndtDetails.results[0]);
			_self.getView().setModel(oModelboeAmndtDetails, "boeAmndtDetails");*/
			var oModelboePmsnDetails = new sap.ui.model.json.JSONModel([]);
			oModelboePmsnDetails.setData(_self.boePmsnDetails.results[0]);
			_self.getView().setModel(oModelboePmsnDetails, "boePmsnDetails");
			var oModelboeHSSDetails = new sap.ui.model.json.JSONModel([]);
			oModelboeHSSDetails.setData(_self.boeHSSDetails.results[0]);
			_self.getView().setModel(oModelboeHSSDetails, "boeHSSDetails");
			var oModelItemLicence = new sap.ui.model.json.JSONModel([]);
			oModelItemLicence.setData(_self.LicenceItemData);
			_self.getView().setModel(oModelItemLicence, "boeAllocationDetails");
			var oModelBEItemData = new sap.ui.model.json.JSONModel([]);
			oModelBEItemData.setData(_self.AdditionalInfo);
			_self.getView().setModel(oModelBEItemData, "AdditionalInfo");
			var oModelControlInfo = new sap.ui.model.json.JSONModel([]);
			oModelControlInfo.setData(_self.ControlInfo);
			_self.getView().setModel(oModelControlInfo, "ControlInfo");
			var oModelConstituemtsInfo = new sap.ui.model.json.JSONModel([]);
			oModelConstituemtsInfo.setData(_self.ConstituemtsInfo);
			_self.getView().setModel(oModelConstituemtsInfo, "ConstituemtsInfo");
			var oModelProductionInfo = new sap.ui.model.json.JSONModel([]);
			oModelProductionInfo.setData(_self.ProductionInfo);
			_self.getView().setModel(oModelProductionInfo, "ProductionInfo");
			var oModelI_RSP_BE_Info = new sap.ui.model.json.JSONModel([]);
			oModelI_RSP_BE_Info.setData(_self.I_RSP_BE_Info);
			_self.getView().setModel(oModelI_RSP_BE_Info, "I_RSP_BE_Info");
			var oModelI_DEPB_BE_Info = new sap.ui.model.json.JSONModel([]);
			oModelI_DEPB_BE_Info.setData(_self.I_DEPB_BE_Info);
			_self.getView().setModel(oModelI_DEPB_BE_Info, "I_DEPB_BE_Info");
			var oModelI_reimport_be_Info = new sap.ui.model.json.JSONModel([]);
			oModelI_reimport_be_Info.setData(_self.I_reimport_be_Info);
			_self.getView().setModel(oModelI_reimport_be_Info, "I_reimport_be_Info");
			var oModelI_statemet_be_Info = new sap.ui.model.json.JSONModel([]);
			oModelI_statemet_be_Info.setData(_self.I_statemet_be_Info);
			_self.getView().setModel(oModelI_statemet_be_Info, "I_statemet_be_Info");
			var oModelI_be_sup_doc_Info = new sap.ui.model.json.JSONModel([]);
			oModelI_be_sup_doc_Info.setData(_self.I_be_sup_doc_Info);
			_self.getView().setModel(oModelI_be_sup_doc_Info, "I_be_sup_doc_Info");
			var oModelboeExchgDetails = new sap.ui.model.json.JSONModel([]);
			oModelboeExchgDetails.setData(_self.boeExchgDetails);
			_self.getView().setModel(oModelboeExchgDetails, "boeExchgDetails");
			var oModelboeCetDetails = new sap.ui.model.json.JSONModel([]);
			oModelboeCetDetails.setData(_self.boeCetDetails);
			_self.getView().setModel(oModelboeCetDetails, "boeCetDetails");
			var oModelboeIGMDetails = new sap.ui.model.json.JSONModel([]);
			oModelboeIGMDetails.setData(_self.boeIGMDetails);
			_self.getView().setModel(oModelboeIGMDetails, "boeIGMDetails");
			var oModelboeCtxDetails = new sap.ui.model.json.JSONModel([]);
			oModelboeCtxDetails.setData(_self.boeCtxDetails);
			_self.getView().setModel(oModelboeCtxDetails, "boeCtxDetails");
			/********** licence ******************/
			_self.Docnumber = _self.getView().byId("pdocno").data("EditDocNo");
			/**********BOE STATUS UPDATION***********/
			this.StatusChaeckCondButton(_self.BOEStatus);
			/************Package Code Mapping*********/
			if (_self.boeHeaderData.pkgcod == "") {
				var str = this.InvItemData.results[0].packgecode;
				_self.boeHeaderData.pkgcod = str.substring(0, 3);
			}
			_self.Status();
			_self.FilerCompanyDetailsFromProfile();
			window.FlagDetailLoad = false;
			/********If the boe type is Exbond - Ware house bond and Single window should not be editable******/
			if (_self.docType == "E") {
				_self.getView().byId("bondno").setEnabled(false);
				_self.byId("tab_exchange").setVisible(false);
				//_self.byId("tab_igms").setVisible(false)
				//_self.byId("idIconTabBarNoIcons").setVisible(false);
				//_self.byId("idIconTabBarNoIconsSep").setVisible(false);
			} else {
				_self.byId("tab_exchange").setVisible(true)
					//_self.byId("tab_igms").setVisible(true)
					//_self.byId("idIconTabBarNoIcons").setVisible(true);
					//_self.byId("idIconTabBarNoIconsSep").setVisible(true);
			}
			/********************Display Balance qty field only for into bond **************************************/

			if (_self.docType == "Y") {
				_self.getView().byId("bal_inv_qty").setVisible(true);
			} else {
				_self.getView().byId("bal_inv_qty").setVisible(false)
			}
			/***************Display HSS tab - If Clearance type is HSP***************/
			if (_self.boeHeaderData.clearance_type == "HSP" && _self.docType != "E") {
				_self.byId("tab_HSS").setVisible(true);
			} else {
				_self.byId("tab_HSS").setVisible(false);
			}
			/***************Display Permission tab - if section48 or First check requested is selected**************************/
			if ((_self.boeBEdetails.results[0].secreq == "Y" || _self.boeBEdetails.results[0].fcr == "Y") && _self.docType != "E") {
				_self.byId("tab_permission").setVisible(true);
			} else {
				_self.byId("tab_permission").setVisible(false);
			}

			if (_self.boeBEdetails.results[0].secreq == "") {
				_self.getView().byId("secreq").setSelectedKey("N");
			}
			/*********If the Clearance type is Intobond merchandise thr or stock Defferd payment must be Transation**************/
			if (_self.ClearanceType == "IBMT" || _self.ClearanceType == "IBMS") {
				_self.getView().byId("defpmt").setSelectedKey("T");
			}

			//for (var i = 0; i < this.InvItemData.results.length; i++) {
			if (this.I_be_sup_doc_Info.results.length == 0) {
				this.I_be_sup_doc_Info.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					boeitno: this.InvItemData.results[0].boeitno,
					itsrno: this.InvItemData.results[0].boeitno,
					dectyp: "E",
					invsrnum: "",
					itsrno: "",
					cha_lic_number: this.boeBEdetails.results[0].chacod,
					iec: (this.boeHeaderData.ieccodsel) ? (this.boeHeaderData.ieccodsel).substring(0, 10) : this.boeHeaderData.ieccodsel,
					icegate_user_id: (this.boeBEdetails.results[0].sender_id) ? (this.boeBEdetails.results[0].sender_id).substring(0, 15) : (this.boeBEdetails
						.results[0].sender_id),
					image_ref_no: "",
					doctypcode: "",
					docissucode: "",
					docsspartyname: (this.boeHeaderData.supp_name) ? (this.boeHeaderData.supp_name).substring(0, 70) : (this.boeHeaderData.supp_name),
					docsspartyname1: (this.boeHeaderData.supp_street) ? (this.boeHeaderData.supp_street).substring(0, 70) : (this.boeHeaderData.supp_street),
					docsspartyname2: "",
					docsspartyname3: (this.boeHeaderData.supp_city) ? (this.boeHeaderData.supp_city).substring(0, 35) : (this.boeHeaderData.supp_city),
					docsspartyname4: (this.boeHeaderData.supp_postalcode) ? (this.boeHeaderData.supp_postalcode).substring(0, 10) : (this.boeHeaderData
						.supp_postalcode),
					docrefno: "",
					placeofissue: "",
					docissuedate: null,
					docexpirydate: null,
					docbenecode: "",
					docbenname: (this.boeBEdetails.results[0].namofimp) ? (this.boeBEdetails.results[0].namofimp).substring(0, 70) : (this.boeBEdetails
						.results[0].namofimp),
					docbenname1: (this.boeBEdetails.results[0].add1) ? (this.boeBEdetails.results[0].add1).substring(0, 70) : (this.boeBEdetails.results[
						0].add1),
					docbenname2: (this.boeBEdetails.results[0].add2) ? (this.boeBEdetails.results[0].add2).substring(0, 70) : (this.boeBEdetails.results[
						0].add2),
					docpartynamecity: this.boeBEdetails.results[0].city,
					docpartynamepin: this.boeBEdetails.results[0].pin,
					filetype: "",
					Mode: "X"
				});
				this.getView().getModel("I_be_sup_doc_Info").refresh();
			}
			//	}
			/***************Hide Reimport tab - If Import purpose is R***************/
			/*	if (_self.boeHeaderData.impurp == "R" || _self.boeHeaderData.impurp == "RI") {
					_self.byId("tab_reimport").setVisible(true);
				} else {
					_self.byId("tab_reimport").setVisible(false);
				}
			/********To calculate Total Duty and Actual Duty*****/
			_self.CalcActualTotalDuty();
			/*************If exbond created for the the same into bond then that into bond must not be editable***********/
			/*	if (_self.docType == "Y") {
					_self.CmnModel.read("/xBRIxCE_BONDCHK(param1='" + _self.docNumber + "',param2='" + _self.docNumber +
						"')/Set", {
							success: function (oData) {
								if (oData.results.length > 0) {
									if (oData.results[0].MESSAGES == "Y") {
										_self.getView().byId("idSwtichMode").setVisible(false);
									}
								}
							},
							error: function (response) {}
						});
				}*/
			_self._CloseBusyDialog();
			this.getView().byId("idIconTabBarSeparatorIcon").setSelectedKey("Comp");
			this.getView().byId("idItemdetailsTabform").setExpanded(false);
			this.getView().byId("idItemdetailsTabform").setVisible(false);
		},
		Status: function () {
			var _self = this;
			if (this.docType == "B") {
				var ModuleType = "BOEB";
			} else {
				var ModuleType = "BOE";
			}
			var filter = new Array();
			var filterval = new sap.ui.model.Filter("curstat", sap.ui.model.FilterOperator.EQ, this.BOEStatus);
			filter.push(filterval);
			var filterval1 = new sap.ui.model.Filter("modid", sap.ui.model.FilterOperator.EQ, ModuleType);
			filter.push(filterval1);
			this.status_array = new Array();
			_self.getOwnerComponent().getModel("Config_Model").read("/xbrixi_docflowstat", {
				filters: filter,
				success: function (getData) {
					if (getData.results.length > 0) {
						for (var i = 0; i < getData.results.length; i++) {
							/*	if (_self.docType == "Y") {
									getData.results[i].curstat = 11;
									getData.results[i].nexstat = 10;
								}*/
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
				error: function () {}
			});
		},

		StatusChaeckCondButton: function (Status) {
			var _self = this;
			if (_self.BOEStatus == "10") {
				_self.getView().byId("btn_postbe").setVisible(false);
				_self.getView().byId("btn_befile").setVisible(false);
				_self.getView().byId("idSwtichMode").setVisible(false);
				_self.getView().byId("btn_ex_rt_dt").setVisible(false);
				_self.getView().byId("btn_print").setVisible(false);
				_self.getView().byId("btn_cha").setVisible(false);
				_self.getView().byId("btn_BtoB").setVisible(false);
				_self.getView().byId("btn_ex_bond").setVisible(false);
			} else if (_self.BOEStatus <= "24") {
				_self.getView().byId("btn_postbe").setVisible(false);
				if (_self.BOEStatus >= "20") {
					_self.getView().byId("btn_befile").setVisible(true);
				} else {
					_self.getView().byId("btn_befile").setVisible(false);
				}
				_self.getView().byId("idSwtichMode").setVisible(true);
				_self.getView().byId("btn_ex_rt_dt").setVisible(true);
				_self.getView().byId("btn_print").setVisible(true);
				_self.getView().byId("btn_cha").setVisible(false);
				_self.getView().byId("btn_BtoB").setVisible(false);
				_self.getView().byId("btn_ex_bond").setVisible(false);
			} else if (_self.BOEStatus >= "25") {
				if (_self.BOE_PostStat == "P") {
					_self.getView().byId("btn_postbe").setVisible(false);
				} else {
					_self.getView().byId("btn_postbe").setVisible(true);
				}
				_self.getView().byId("btn_befile").setVisible(true);
				_self.getView().byId("idSwtichMode").setVisible(false);
				_self.getView().byId("btn_ex_rt_dt").setVisible(false);
				_self.getView().byId("btn_print").setVisible(true);
				_self.getView().byId("btn_cha").setVisible(true);
				if (_self.docType == "Y") {
					_self.getView().byId("btn_BtoB").setVisible(true);
					_self.getView().byId("btn_ex_bond").setVisible(true);
				}

			} else {
				_self.getView().byId("btn_postbe").setVisible(false);
				_self.getView().byId("btn_befile").setVisible(false);
				_self.getView().byId("idSwtichMode").setVisible(true);
				_self.getView().byId("btn_ex_rt_dt").setVisible(true);
				_self.getView().byId("btn_print").setVisible(true);
				_self.getView().byId("btn_cha").setVisible(false);
				_self.getView().byId("btn_BtoB").setVisible(false);
				_self.getView().byId("btn_ex_bond").setVisible(false);
			}
		},
		onListItemPress: function (oEvent) {
			this.getView().byId("idItemdetailsTabform").setExpanded(true);
			this.getView().byId("idItemdetailsTabform").setVisible(true);
			this.getView().byId("idItemdetailsTabform").setSelectedKey("IT");
			this.byId("btn_reallocate").setVisible(false);
			this.byId("btn_reset").setVisible(false);
			this.boeItemnumber = oEvent.getSource().mProperties.title;
			this.getView().byId("idItemDetailseditTabform").setTitle("Item Details: " + this.boeItemnumber);
			this.getView().byId("BE_Item_Form").setTitle("BE Details: " + this.boeItemnumber);
			this.getView().byId("idInvoiceSubTabform").setTitle("BE Details: " + this.boeItemnumber);
			this.getView().byId("idInvoiceeditTabform").setTitle("Invoice Details: " + this.boeItemnumber);
			this.getView().byId("idLICAllocEdit").setTitle("Allocation Details: " + this.boeItemnumber);
			this.getView().byId("iddutyDetEdit").setTitle("Duty Details: " + this.boeItemnumber);
			this.getView().byId("idOtherEditTabform").setTitle("Other Details: " + this.boeItemnumber);
			this.getView().byId("idBtoBItemform").setTitle("Bond to Bond Details: " + this.boeItemnumber);
			this.getView().byId("tbladl").setTitle("Information Details: " + this.boeItemnumber);
			this.getView().byId("tblConstituemts").setTitle("Constituent Details: " + this.boeItemnumber);
			this.getView().byId("tblcar").setTitle("Production Details: " + this.boeItemnumber);
			this.getView().byId("tblpro").setTitle("Control Details: " + this.boeItemnumber);
			this.getView().byId("tbl_RSP").setTitle("RSP Details: " + this.boeItemnumber);
			this.getView().byId("tbl_REIMPORT").setTitle("Re-Import Details: " + this.boeItemnumber);
			this.getView().byId("tbl_I_be_sup_doc").setTitle("Supporting Documents Details: " + this.boeItemnumber);
			this.getView().byId("tbl_I_statemet_be_Info").setTitle("Statement Details: " + this.boeItemnumber);
			var CurrentItemData = this._findWithAttr(this.InvItemData.results, this.boeItemnumber);
			this.ItemRecord = CurrentItemData;
			var oModelitemdesc = new sap.ui.model.json.JSONModel([]);
			oModelitemdesc.setData(this.InvItemData.results[this.ItemRecord]);
			this.getView().setModel(oModelitemdesc, "boeItemdatadetails");
			/********* allocation *********************/
			var oModelItemLicence = new sap.ui.model.json.JSONModel([]);
			oModelItemLicence.setData(this.getOwnerComponent().getModel("boeAllocation").getData());
			this.getView().setModel(oModelItemLicence, "boeAllocationDetails");

			/************Display  RSP Tab - If RSP Applicability is Yes *****************************/
			if (this.InvItemData.results[this.ItemRecord].rspappl == "") {
				this.getView().byId("rspappl").setSelectedKey("N");
			}
			if (this.InvItemData.results[this.ItemRecord].rspappl == "Y") {
				this.byId("tab_rsp").setVisible(true);
			} else {
				this.byId("tab_rsp").setVisible(false);
			}
			if (this.InvItemData.results[this.ItemRecord].valmedap == "") {
				this.getView().byId("valmedap").setSelectedKey("T");
			}
			if (this.InvItemData.results[this.ItemRecord].acessstat == "") {
				this.getView().byId("acessstat").setSelectedKey("0");
			}
			if (this.InvItemData.results[this.ItemRecord].wlf == "") {
				this.getView().byId("wlf").setSelectedKey("F");
			}
			if (this.boeHeaderData.supplier_rel == "Y" && (this.InvItemData.results[this.ItemRecord].svbf == "")) {
				this.getView().byId("svbf").setSelectedKey("A");
			}
			if (this.boeHeaderData.modtran != "AIR" && this.boeHeaderData.shptyp != "BULK" && this.docType != "E" && (this.BOEStatus >= 19 &&
					this.BOEStatus <= 24)) {

				this.getView().byId("exidv").setRequired(true);
				this.getView().byId("sealno").setRequired(true);
				this.getView().byId("contsize").setRequired(true);
				this.getView().byId("conttyp").setRequired(true);
			} else {
				this.getView().byId("exidv").setRequired(false);
				this.getView().byId("sealno").setRequired(false);
				this.getView().byId("contsize").setRequired(false);
				this.getView().byId("conttyp").setRequired(false);
			}
			/************If License attached - then duty fields must be non editable *****************************/
			if (this.LicenceItemData.results.filter(a => a.docitem == this.boeItemnumber).length > 0) {
				if (this.LicenceItemData.results.filter(a => a.docitem == this.boeItemnumber)[0].bnftyp != "") {
					var EnabledItemModel = new sap.ui.model.json.JSONModel({
						enable: false
					});
					this.getView().setModel(EnabledItemModel, "StateItem");
					this.getView().byId("hssloadamt").setEnabled(false);
					this.getView().byId("hssloadamt_curr").setEnabled(false);
					this.getView().byId("add_load_amt").setEnabled(false);
					this.getView().byId("add_aload_amt_curr").setEnabled(false);
				} else {
					if (this.byId("idSwtichMode").getState() == true) {
						var EnabledItemModel = new sap.ui.model.json.JSONModel({
							enable: true
						});
						this.getView().setModel(EnabledItemModel, "StateItem");
						/*******IF clearance type is HSP - Enable Additional Loading and HSS Load *******/
						if (this.boeHeaderData.clearance_type == "HSP") {
							this.getView().byId("hssloadamt").setEnabled(true);
							this.getView().byId("hssloadamt_curr").setEnabled(true);
							this.getView().byId("add_load_amt").setEnabled(true);
							this.getView().byId("add_aload_amt_curr").setEnabled(true);
						}
						if (this.boeItemnumber) {
							this.CalculateAssDtyVal();
						}
					}
				}
			} else {
				if (this.byId("idSwtichMode").getState() == true) {
					var EnabledItemModel = new sap.ui.model.json.JSONModel({
						enable: true
					});
					this.getView().setModel(EnabledItemModel, "StateItem");
					/*******IF clearance type is HSP - Enable Additional Loading and HSS Load *******/
					if (this.boeHeaderData.clearance_type == "HSP") {
						this.getView().byId("hssloadamt").setEnabled(true);
						this.getView().byId("hssloadamt_curr").setEnabled(true);
						this.getView().byId("add_load_amt").setEnabled(true);
						this.getView().byId("add_aload_amt_curr").setEnabled(true);
					}
					if (this.boeItemnumber) {
						this.CalculateAssDtyVal();
					}
				}
			}
			/*********FTA Mandatory Checking************/

			this.RequiredSetSVB(this.InvItemData.results[this.ItemRecord].svbf);
			if (this.InvItemData.results[this.ItemRecord].fta_entitled) {
				this.RequiredSetFTA(this.InvItemData.results[this.ItemRecord].fta_entitled, "FTA");
			} else if (this.InvItemData.results[this.ItemRecord].randd_applicability) {
				this.RequiredSetFTA(this.InvItemData.results[this.ItemRecord].randd_applicability, "RD");
			}

			/************************/
			this.Docnumber = this.getView().byId("pdocno").data("EditDocNo");
			/** intianl settings ***/
			this.CalcItemTotalActualDuty();
			var oModelItemDuty = new sap.ui.model.json.JSONModel([]);
			oModelItemDuty.setData(this.DutyItemDataLocal);
			this.getView().setModel(oModelItemDuty, "boeDutyCompDetails");
			var oTable, bindingDty, binding, sFilter, binding1, binding2, binding3, binding4, binding5, binding6, binding7, binding8, binding9;
			oTable = this.getView().byId("idLICAllocEdit");
			binding = oTable.getBinding('rows');
			sFilter = new sap.ui.model.Filter("docitem", sap.ui.model.FilterOperator.EQ, this.boeItemnumber);
			binding.filter([sFilter]);
			this.col_ItemNo = this.boeItemnumber;
			this.SelectedItems = this.col_ItemNo + ",";
			sFilter = new sap.ui.model.Filter("boeitno", sap.ui.model.FilterOperator.EQ, this.boeItemnumber);
			bindingDty = this.getView().byId("iddutyDetEdit").getBinding('rows');
			bindingDty.filter([sFilter]);
			binding = this.getView().byId("tbladl").getBinding('rows');
			binding.filter([sFilter]);
			binding1 = this.getView().byId("tblConstituemts").getBinding('rows');
			binding1.filter([sFilter]);
			binding2 = this.getView().byId("tblcar").getBinding('rows');
			binding2.filter([sFilter]);
			binding3 = this.getView().byId("tblpro").getBinding('rows');
			binding3.filter([sFilter]);
			binding4 = this.getView().byId("tbl_RSP").getBinding('rows');
			binding4.filter([sFilter]);
			binding6 = this.getView().byId("tbl_REIMPORT").getBinding('rows');
			binding6.filter([sFilter]);
			binding8 = this.getView().byId("tbl_I_be_sup_doc").getBinding('rows');
			binding8.filter([sFilter]);
			binding9 = this.getView().byId("tbl_I_statemet_be_Info").getBinding('rows');
			binding9.filter([sFilter]);
			/******Exchange Rate******/
			var _self = this;
			var filt = new Array();
			var filtval = new sap.ui.model.Filter("fcurr", sap.ui.model.FilterOperator.EQ, this.InvItemData.results[this.ItemRecord].currencycode);
			filt.push(filtval);
			var filtval1 = new sap.ui.model.Filter("tcurr", sap.ui.model.FilterOperator.EQ, "INR");
			filt.push(filtval1);
			var filtval2 = new sap.ui.model.Filter("kurst", sap.ui.model.FilterOperator.EQ, "C");
			filt.push(filtval2);
			this.ExchRte = null;
			this.CmnModel.read("/xBRIxi_tcurr", {
				filters: filt,
				success: function (getData) {
					_self.ExchRte = getData.results[0].ukurs;
				},
				error: function (response) {}
			});
		},
		_findWithAttrData: function (array, value) {
			for (var i = 0; i < array.length; i += 1) {
				if (array[i]['docitem'] === value) {
					return (i);
					break;
				}
			}
			return -1;
		},
		_findWithAttr: function (array, value) {
			for (var i = 0; i < array.length; i += 1) {
				if (array[i]['boeitno'] === value) {
					return (i);
					break;
				}
			}
			return -1;
		},

		NoPackageCheck: function (oArg) {
			var NewVal = oArg.getSource().getParent().getCells()[10].getValue() ? oArg.getSource().getParent().getCells()[10].getValue() : 0;
			var SrlNo = oArg.getSource().getParent().getCells()[0].data("igmsrlno");
			if (SrlNo) {
				var currentRow = this.boeIGMDetails.results.findIndex(function (item, i) {
					return item.igmsrlno === SrlNo
				});
			} else {
				var currentRow = oArg.getSource().getParent().sId.slice(-1);
			}
			var No_Pck = 0;
			var OldValue = 0;
			var TotNoPck = 0;
			var TotNoPck = this.getView().byId("header_packs").getValue();
			var OldValue = this.boeIGMDetails.results[currentRow].totnpck;
			for (var i = 0; i < this.boeIGMDetails.results.length; i++) {
				No_Pck = parseFloat(No_Pck) + parseFloat(this.boeIGMDetails.results[i].totnpck)
			}
			No_Pck = parseFloat(No_Pck) - parseFloat(OldValue);
			No_Pck = parseFloat(No_Pck) + parseFloat(NewVal);
			if (No_Pck > TotNoPck) {
				MessageBox.error("The Sum of Total No. of Package should not be greater than " + this.getView().byId("header_packs").getValue());
				this.boeIGMDetails.results[currentRow].totnpck = OldValue;
				return false;
			} else {

			}
		},
		ChangePackageCode: function (oArg) {
			var Value = oArg.getSource().getValue();
			if (this.boeIGMDetails.results.filter(a => a.igmsrlno == 1).length > 0) {
				this.boeIGMDetails.results.filter(a => a.igmsrlno == 1)[0].pkgcod = Value;
			}
			this.getView().getModel("boeIGMDetails").refresh();
		},
		RequiredSetFTA: function (CheckType, Type) {
			if (Type == "FTA") {
				if (CheckType == "X" || CheckType == true) {

					this.getView().byId("fta_num").setRequired(true);
					this.getView().byId("warhpno").setRequired(true);

					this.getView().byId("fta_num").setVisible(true);
					this.getView().byId("warhpno").setVisible(true);
					this.getView().byId("ftaslno").setVisible(true);
					this.getView().byId("randd_applicability").setVisible(false);
					this.getView().byId("randd_notifctn_no").setVisible(false);
					this.getView().byId("randd_serialno").setVisible(false);
				} else {
					this.InvItemData.results[this.ItemRecord].fta_num = "";
					this.getView().byId("fta_num").setRequired(false);
					this.getView().byId("warhpno").setRequired(false);

					this.getView().byId("fta_num").setVisible(false);
					this.getView().byId("warhpno").setVisible(false);
					this.getView().byId("ftaslno").setVisible(false);
					this.getView().byId("randd_applicability").setVisible(true);
					this.getView().byId("randd_notifctn_no").setVisible(false);
					this.getView().byId("randd_serialno").setVisible(false);

				}
			} else {
				if (CheckType == "X" || CheckType == true) {
					this.getView().byId("randd_notifctn_no").setRequired(true);
					this.getView().byId("randd_notifctn_no").setVisible(true);
					this.getView().byId("randd_serialno").setVisible(true);

					this.getView().byId("fta_applicable").setVisible(false);
					this.getView().byId("fta_entitled").setVisible(false);
					this.getView().byId("fta_num").setVisible(false);
					this.getView().byId("warhpno").setVisible(false);
					this.getView().byId("ftaslno").setVisible(false);

				} else {
					this.InvItemData.results[this.ItemRecord].randd_notifctn_no = "";
					this.getView().byId("randd_notifctn_no").setRequired(false);
					this.getView().byId("randd_notifctn_no").setVisible(false);
					this.getView().byId("randd_serialno").setVisible(false);

					this.getView().byId("fta_applicable").setVisible(true);
					this.getView().byId("fta_entitled").setVisible(true);
					this.getView().byId("fta_num").setVisible(false);
					this.getView().byId("warhpno").setVisible(false);
					this.getView().byId("ftaslno").setVisible(false);

				}
			}
		},
		getSplitAppObj: function () {
			var result = this.byId("SplitAppPo");
			if (!result) {
				jQuery.sap.log.info("SplitApp object can't be found");
			}
			return result;
		},
		handleIECValueHelp: function (oEvent) {
			var _self = this;
			this.inputId = oEvent.getSource().getId();
			this.getView().byId("gstno").setValue("");
			var companyCd = this.getView().byId("bukrs").getValue();
			var filters = new Array();

			var filterval = new sap.ui.model.Filter("bukrs", sap.ui.model.FilterOperator.EQ, companyCd);

			filters.push(filterval);

			this.CmnModel.read('/xBRIxi_shpcomp', {
				filters: filters,
				success: function (getData) {
					var IECModelContainer = new sap.ui.model.json.JSONModel([]);
					IECModelContainer.setData(getData);
					_self.getView().setModel(IECModelContainer, "IECode");
					if (!_self._valueHelpIEC) {
						_self._valueHelpIEC = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogIEC", _self);
						_self.getView().addDependent(_self._valueHelpIEC);
					}

					_self._valueHelpIEC.open();

				}
			});

		},

		_handleSearchIEC: function (evt) {
			var sValue = evt.getParameter("value");

			var oFilter = new sap.ui.model.Filter(

				"iecbnchcod",

				sap.ui.model.FilterOperator.Contains, sValue

			);

			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleCloseIEC: function (evt) {
			var _self = this;
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = sap.ui.getCore().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
				var companyCd = this.getView().byId("bukrs").getValue();
				var filters = new Array();
				var filterval = new sap.ui.model.Filter("iecbnchcod", sap.ui.model.FilterOperator.EQ, oSelectedItem.getTitle());
				filters.push(filterval);
				filterval = new sap.ui.model.Filter("bukrs", sap.ui.model.FilterOperator.EQ, companyCd);
				filters.push(filterval);
				this.CmnModel.read('/xBRIxi_shpcomp', {
					filters: filters,
					success: function (getData) {
						_self.getView().byId("gstno").setValue(getData.results[0].gstno);
					}
				});
			}
			evt.getSource().getBinding("items").filter([]);
		},
		ClearRequiredFileds: function () {
			var _self = this;
			if (_self.RequiredItemFileds) {
				for (var j = 0; j < _self.RequiredItemFileds.length; j++) {
					_self.getView().byId(_self.RequiredItemFileds[j]).setRequired(false);
				}
			}
			if (_self.RequiredFileds) {
				for (var j = 0; j < _self.RequiredFileds.length; j++) {
					_self.getView().byId(_self.RequiredFileds[j]).setRequired(false);
				}
			}
		},
		onPressGoBack: function () {
			var oHistory, sPreviousHash;
			var _self = this;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (this.byId("idSwtichMode").getState() == true) {
				MessageBox.confirm("Your entries will be lost if u leave this page", {
					onClose: function (oAction) {
						if (oAction == sap.m.MessageBox.Action.OK) {
							_self.byId("idSwtichMode").setState(false);
							_self.LockObjectCall();
							if (sPreviousHash !== undefined) {
								_self.ClearRequiredFileds();
								// window.FlagRefresh = true;//Aiswarya commented
								window.FlagOfRefresh = true;
								window.FromDocNumber = _self.docNumber;
								window.BOEType = _self.docType;
								_self.goBackFlag = true; //riji
								_self.router.navTo("boelist", true);
								// window.history.go(-1);
							} else {
								_self.ClearRequiredFileds();
								// window.FlagRefresh = true;
								window.FlagOfRefresh = true;//Aiswarya Added
								window.FromDocNumber = _self.docNumber;
								window.BOEType = _self.docType;
								_self.goBackFlag = true; //riji
								_self.router.navTo("boelist", true);

							}
						}
					}
				});
			} else {
				_self.ClearRequiredFileds();
				// window.FlagRefresh = true;//Aiswarya commented
				window.FlagOfRefresh = true;//Aiswarya Added
				window.FromDocNumber = _self.docNumber;
				window.BOEType = _self.docType;
				this.router.navTo("boelist", true);
			}
		},
		// onPressGoBack: function () {
		// 	var oHistory, sPreviousHash;
		// 	var _self = this;
		// 	oHistory = History.getInstance();
		// 	sPreviousHash = oHistory.getPreviousHash();
		// 	if (this.byId("idSwtichMode").getState() == true) {
		// 		MessageBox.confirm("Your entries will be lost if u leave this page", {
		// 			onClose: function (oAction) {
		// 				if (oAction == sap.m.MessageBox.Action.OK) {
		// 					_self.byId("idSwtichMode").setState(false);
		// 					_self.LockObjectCall();
		// 					if (sPreviousHash !== undefined) {
		// 						_self.ClearRequiredFileds();
		// 						window.FlagRefresh = true;
		// 						window.FromDocNumber = _self.docNumber;
		// 						window.BOEType = _self.docType;
		// 						_self.goBackFlag = true; //riji
		// 						_self.router.navTo("boelist", true);
		// 						// window.history.go(-1);
		// 					} else {
		// 						_self.ClearRequiredFileds();
		// 						window.FlagRefresh = true;
		// 						window.FromDocNumber = _self.docNumber;
		// 						window.BOEType = _self.docType;
		// 						_self.goBackFlag = true; //riji
		// 						_self.router.navTo("boelist", true);
		// 					}
		// 				}
		// 			}
		// 		});
		// 	} else {
		// 		_self.ClearRequiredFileds();
		// 		window.FlagRefresh = true;
		// 		window.FromDocNumber = _self.docNumber;
		// 		window.BOEType = _self.docType;
		// 		_self.goBackFlag = true; //riji
		// 		this.router.navTo("boelist", true);
		// 	}
		// },
		OnChangeSwitch: function (oEvent) {
			if (this.byId("idSwtichMode").getState() == false) {
				this.byId("btn_reallocate").setVisible(false);
				this.byId("btn_reset").setVisible(false);
				this.byId("id_add_RSP_row").setVisible(false);
				this.byId("id_add_reimport_row").setVisible(false);
				this.byId("id_add_SuppDoc_row").setVisible(false);
				this.byId("id_add_Stmt_row").setVisible(false);

				this.byId("id_add_Cert_row").setVisible(false);
				this.byId("id_add_igms_row").setVisible(false);
				this.byId("idaddrow").setVisible(false);
				this.byId("idaddrowcon").setVisible(false);
				this.byId("idaddpro").setVisible(false);
				this.byId("idaddcon").setVisible(false);
				this.byId("idPoList").setVisible(true);
				this.byId("idPoListEdit").setVisible(false);
				this.byId("idInv").setVisible(true);
				this.byId("idInvEdit").setVisible(false);
				this.byId("idpoQuantityEdit").setVisible(false);
				this.byId("idpoQuantity").setVisible(true);
			} else {
				if (this.byId("idItemdetailsTabform").getSelectedKey() == "LA") {
					this.byId("btn_reallocate").setVisible(true);
					this.byId("btn_reset").setVisible(true);
					if (this.LicenceItemData.results.findIndex(a => a.docitem == this.boeItemnumber) < 0) {
						this.AddNewRowAllo();
						this.AllocatedNewRow = true;
					}
				}
				this.byId("id_add_RSP_row").setVisible(true);
				this.byId("id_add_reimport_row").setVisible(true);
				this.byId("id_add_SuppDoc_row").setVisible(true);
				this.byId("id_add_Stmt_row").setVisible(true);

				this.byId("id_add_Cert_row").setVisible(true);
				this.byId("id_add_igms_row").setVisible(true);
				this.byId("idaddrow").setVisible(true);
				this.byId("idaddrowcon").setVisible(true);
				this.byId("idaddpro").setVisible(true);
				this.byId("idaddcon").setVisible(true);
				this.byId("idInv").setVisible(false);
				this.byId("idInvEdit").setVisible(true);
				this.byId("idpoQuantityEdit").setVisible(true);
				this.byId("idpoQuantity").setVisible(false);
				this.byId("idPoList").setVisible(false);
				this.byId("idPoListEdit").setVisible(true);

			}
		},
		OnDeletePress: function (oEvent) {
			MessageBox.success("PO(s) Deleted Successfully");
		},
		OnChangeSwitchDefault: function (oEvent) {
			//	console.log("inside OnChangeSwitchDefault"); //testing
			var EnabledModel = new sap.ui.model.json.JSONModel({
				enable: true
			});
			this.getView().setModel(EnabledModel, "State");
			var EnabledItemModel = new sap.ui.model.json.JSONModel({
				enable: true
			});
			this.getView().setModel(EnabledItemModel, "StateItem");
			var _self = this;
			//	console.log("initialFileLoad :", this.initialFileLoad); //testing

			/**Changed By Nikhila**/
			if (this.initialFileLoad == true) { //change by nikhila
				//	console.log("inside initialFileLoad if condition");
				this.initialFileLoad = false; //change by nikhila
				//edited by riji for DMS/OBJECT STORE
				this.FileServiceModel.read("/xBRIxi_codtye_new", {
					success: function (getData) {
						//console.log("filter:",getData.results.filter(a => a.code == "CNFG")[0].value1);
						_self.fileServiceType = getData.results.filter(a => a.code == "CNFG")[0].value1;
					},
					error: function (response) {

					}
				});
				this.ViewAllFiles(this.argsList.docnr); //change by nikhila
				this.readNNDOFiles(this.boeHeaderData.nndo); //change by nikhila
			} //change by nikhila

			if (this.byId("idSwtichMode").getState() == false) {

				this.byId("btn_reallocate").setVisible(false);
				this.byId("btn_reset").setVisible(false);
				this.byId("id_add_RSP_row").setVisible(false);
				this.byId("id_add_reimport_row").setVisible(false);
				this.byId("id_add_SuppDoc_row").setVisible(false);
				this.byId("id_add_Stmt_row").setVisible(false);

				this.byId("id_add_Cert_row").setVisible(false);
				this.byId("id_add_igms_row").setVisible(false);
				this.byId("idaddrow").setVisible(false);
				this.byId("idaddrowcon").setVisible(false);
				this.byId("idaddpro").setVisible(false);
				this.byId("idaddcon").setVisible(false);
				this.byId("idPoList").setVisible(true);
				this.byId("idPoListEdit").setVisible(false);
				this.byId("btn_save").setVisible(false);
				this.getView().byId("idLICAllocEdit").setSelectionMode('None');
				EnabledModel.setProperty('/enable', false);
				EnabledItemModel.setProperty('/enable', false);
				this.byId("idclindetailPage").setTitle(this.byId("idclindetailPage").getTitle().replace("Create", "Display"));
				this.byId("idclindetailPage").setTitle(this.byId("idclindetailPage").getTitle().replace("Change", "Display"));
				this.AuthConfiguration("Display");
				if (!this.initialLock) {
					this.LockObjectCall();
				}
				/*******IF clearance type is HSP - Enable Additional Loading and HSS Load *******/
				this.getView().byId("hssloadamt").setEnabled(false);
				this.getView().byId("hssloadamt_curr").setEnabled(false);
				this.getView().byId("add_load_amt").setEnabled(false);
				this.getView().byId("add_aload_amt_curr").setEnabled(false);
				if (this.BOEStatus >= "20") {
					this.getView().byId("btn_befile").setVisible(true);
				}

				this.byId("btn_print").setVisible(true);
				if (this.BOEStatus <= "24") {
					this.byId("btn_ex_rt_dt").setVisible(true);
				}
				if (this.BOEStatus >= "25") {
					this.byId("btn_cha").setVisible(true);
				}

			} else {
				/*******************ajoe**************/
				/*if(this.boeHeaderData.invoice_incoterm == "CIF"){
					this.byId("frgtamt").setEditable(false);
					this.byId("insuamt").setEditable(false);
					this.byId("frgt_curr").setEditable(false);
					this.byId("insu_curr").setEditable(false);
				}*/
				if (this.boeHeaderData.invoice_incoterm != "CIF") {
					this.byId("frgtamt").setEditable(true);
					this.byId("insuamt").setEditable(true);
					this.byId("frgt_curr").setEditable(true);
					this.byId("insu_curr").setEditable(true);
				}
				/*******************ajoe**************/

				this.initialLock = false;
				if (this.byId("idItemdetailsTabform").getSelectedKey() == "LA") {
					this.byId("btn_reallocate").setVisible(true);
					this.byId("btn_reset").setVisible(true);
					if (this.LicenceItemData.results.findIndex(a => a.docitem == this.boeItemnumber) < 0) {
						this.AddNewRowAllo();
						this.AllocatedNewRow = true;
					}
				}
				this.byId("id_add_RSP_row").setVisible(true);
				this.byId("id_add_reimport_row").setVisible(true);
				this.byId("id_add_SuppDoc_row").setVisible(true);
				this.byId("id_add_Stmt_row").setVisible(true);

				this.byId("id_add_Cert_row").setVisible(true);
				this.byId("id_add_igms_row").setVisible(true);
				this.byId("idaddrow").setVisible(true);
				this.byId("idaddrowcon").setVisible(true);
				this.byId("idaddpro").setVisible(true);
				this.byId("idaddcon").setVisible(true);
				this.byId("btn_save").setVisible(true);
				EnabledModel.setProperty('/enable', true);
				EnabledItemModel.setProperty('/enable', true);
				this.getView().byId("idLICAllocEdit").setSelectionMode('Multi');
				this.byId("idPoList").setVisible(false);
				this.byId("idPoListEdit").setVisible(true);
				this.byId("idclindetailPage").setTitle(this.byId("idclindetailPage").getTitle().replace("Create", "Change"));
				this.byId("idclindetailPage").setTitle(this.byId("idclindetailPage").getTitle().replace("Display", "Change"));
				this.AuthConfiguration("Change");
				this.LockObjectCall();
				this.byId("btn_befile").setVisible(false);
				this.byId("btn_cha").setVisible(false);
				this.byId("btn_print").setVisible(false);
				this.byId("btn_ex_rt_dt").setVisible(false);
				if (this.ClearanceType == "IBMT" || this.ClearanceType == "IBMS") {
					this.getView().byId("defpmt").setEnabled(false);
				}
				if (this.LicenceItemData.results.filter(a => a.docitem == this.boeItemnumber).length > 0) {
					if (this.LicenceItemData.results.filter(a => a.docitem == this.boeItemnumber)[0].bnftyp != "") {
						var EnabledItemModel = new sap.ui.model.json.JSONModel({
							enable: false
						});
						this.getView().setModel(EnabledItemModel, "StateItem");
						this.getView().byId("hssloadamt").setEnabled(false);
						this.getView().byId("hssloadamt_curr").setEnabled(false);
						this.getView().byId("add_load_amt").setEnabled(false);
						this.getView().byId("add_aload_amt_curr").setEnabled(false);
					} else {
						/*******IF clearance type is HSP - Enable Additional Loading and HSS Load *******/
						if (this.boeHeaderData.clearance_type == "HSP") {
							this.getView().byId("hssloadamt").setEnabled(true);
							this.getView().byId("hssloadamt_curr").setEnabled(true);
							this.getView().byId("add_load_amt").setEnabled(true);
							this.getView().byId("add_aload_amt_curr").setEnabled(true);
						}
						/******call Duty*****/
						if (this.boeItemnumber) {
							this.CalculateAssDtyVal();
						}
					}
				} else {
					/*******IF clearance type is HSP - Enable Additional Loading and HSS Load *******/
					if (this.boeHeaderData.clearance_type == "HSP") {
						this.getView().byId("hssloadamt").setEnabled(true);
						this.getView().byId("hssloadamt_curr").setEnabled(true);
						this.getView().byId("add_load_amt").setEnabled(true);
						this.getView().byId("add_aload_amt_curr").setEnabled(true);
					}
					if (this.boeItemnumber) {
						this.CalculateAssDtyVal();
					}
				}
				if (this.boeHeaderData.shptyp == "FCL") { //merge sumeesh code by Aiswarya
					this.getView().byId("lastDateFree").setEnabled(false);
				} else {
					this.getView().byId("lastDateFree").setEnabled(true);

				}
			}
		},
		changeshptyp: function (oEvent) { //merge sumeesh code by Aiswarya
			if (oEvent.getSource().getSelectedKey() == "FCL") {
				this.getView().byId("lastDateFree").setEnabled(false);
				this.setfree_lastdt();
			} else {
				this.getView().byId("lastDateFree").setEnabled(true);

			}
		},
		OnChangeSwitchFun: function () {
			this.amnd_fun(); //for IGMS//Aiswarya
			// if (this.boeHeaderData.shptyp == "FCL") { //if else added by Aiswarya
			// 	this.getView().byId("lastDateFree").setEnabled(false);
			// } else {
			// 	this.getView().byId("lastDateFree").setEnabled(true);
			// }
			var _self = this;
			if (this.valChngFlag == 1) {
				MessageBox.show(
					'Changes done will not be saved, Would you like to save', {
						icon: sap.m.MessageBox.Icon.INFORMATION,
						title: "Confirmation",
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO, "Cancel"],
						initialFocus: "Cancel",
						onClose: function (oAction) {
							if (oAction == sap.m.MessageBox.Action.YES) {
								_self.byId("idSwtichMode").setState(true);
								_self.OnPresssaveClin();
							} else if (oAction == "Cancel") {
								_self.byId("idSwtichMode").setState(true);
							} else {
								_self.valChngFlag = 0;
								_self._OpenBusyDialog();
								_self.BoeModel.read("/xBRIxi_iidbehdr(doctyp='" + _self.docType + "',docno='" + _self.docNumber + "')", {
									urlParameters: {
										"$expand": "to_itemdetails,to_shippingdetails,to_Salo,to_dutydetails,to_BE_BOE,to_swc_be,to_pro_be,to_ctrl_be,to_I_RSP_BE,to_I_DEPB_BE,to_I_reimport_be,to_I_statemet_be,to_I_be_sup_doc,to_I_be,to_I_EXCHANGE_BE,to_I_HSS_BE,to_I_PERM_BE,to_I_CERT_BE,to_I_iid_ctx_be,to_I_AMEND_BE,to_I_IGMS_BE"
									},
									success: function (oData) {
										/*********** Header infromation ************/
										_self.boeHeaderData = oData;
										/*********** Items infromation ************/
										_self.InvItemData = oData.to_itemdetails;
										/*********** Shipment infromation ************/
										_self.ShippingInfo = oData.to_shippingdetails;
										/********* allocation *********************/
										_self.LicenceItemData = oData.to_Salo;
										_self.IntitalLicenceRow = _self._FnConvertJSON(oData.to_Salo);
										_self.LicenceInitialRec = _self._FnConvertJSON(oData.to_Salo);
										/*********** Duty infromation ************/
										_self.DutyItemDataLocal = oData.to_dutydetails;
										_self.AllItemDutyDetails = oData.to_dutydetails;
										/********* .be Information *********************/
										_self.AdditionalInfo = oData.to_BE_BOE;
										_self.ControlInfo = oData.to_ctrl_be;
										_self.ConstituemtsInfo = oData.to_swc_be;
										_self.ProductionInfo = oData.to_pro_be;
										_self.I_RSP_BE_Info = oData.to_I_RSP_BE;
										_self.I_DEPB_BE_Info = oData.to_I_DEPB_BE;
										_self.I_reimport_be_Info = oData.to_I_reimport_be;
										_self.I_statemet_be_Info = oData.to_I_statemet_be;
										_self.I_be_sup_doc_Info = oData.to_I_be_sup_doc;
										_self.boeExchgDetails = oData.to_I_EXCHANGE_BE;
										_self.boeCetDetails = oData.to_I_CERT_BE;
										_self.boeCtxDetails = oData.to_I_iid_ctx_be;
										_self.boeBEdetails = oData.to_I_be;
										_self.boeHSSDetails = oData.to_I_HSS_BE;
										_self.boePmsnDetails = oData.to_I_PERM_BE;
										_self.boeIGMDetails = oData.to_I_IGMS_BE;
										_self.IntialLoadData();
									},
									errror: function (oData) {
										MessageBox.error("Something Went Wrong . Please Try again Later");
										_self._CloseBusyDialog();
									}
								});
							}
						}
					}
				);
			} else {
				this.OnChangeSwitchDefault();
			}
		},
		ChangeDeff: function (oEvent) {
			this.getView().byId("paymc").setSelectedKey(oEvent.getSource().getSelectedKey());
		},
		onPressItemNo: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogueItemDetail", this);
			}
			this.getView().addDependent(this._oDialog);
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		OnPressItemSave: function (oEvent) {
			this._oDialog.close();
		},
		FormatdateFun: function (Date) {
			if (!Date) {
				this.atadestport = null;
			} else {
				var SplitDatePart = this.atadestport.split("/");
				this.atadestport = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
		},
		RSP_ApplChange: function (oEvent) {
			var SelVal = oEvent.mParameters.selectedItem.mProperties.key;
			if (SelVal == "Y") {
				this.byId("tab_rsp").setVisible(true);
				if (this.I_RSP_BE_Info.results.length == 0) {
					this.addRow_RSP();
				}
			} else {
				this.byId("tab_rsp").setVisible(false);
				this.clearAllRSPData();
				this.I_RSP_BE_Info.results = new Array();
				this.getView().getModel("I_RSP_BE_Info").refresh();
			}
		},
		clearAllRSPData: function () {
			var _self = this;
			var mParameters = {
				groupId: "batchDelete",
				eTag: "*"
			};
			for (var i = 0; i < _self.I_RSP_BE_Info.results.length; i++) {
				_self.BoeModel.remove("/xBRIxI_RSP_BE(doctyp='" + _self.I_RSP_BE_Info.results[i].doctyp + "',docno='" + _self.I_RSP_BE_Info
					.results[i].docno + "',rspslno='" + _self.I_RSP_BE_Info.results[i].rspslno + "',boeitno='" + _self.I_RSP_BE_Info
					.results[i].boeitno + "')", mParameters);
				_self.BoeModel.submitChanges({
					mParameters,
					success: function (result) {
						_self.I_RSP_BE_Info.results.splice(i, 1);
						_self.getView().getModel("I_RSP_BE_Info").refresh();
					},
					error: function (err) {
						MessageBox.error("Error while Deleting Details");
					}
				});
			}
		},
		//***************************change by ajoe ***********************************************
		OnPresssaveClin: function () {
			var i;
			var flag = 1;
			var shipmnt_mode = this.boeHeaderData.modtran;
			var incoterm = this.boeHeaderData.invoice_incoterm;
			//if (incoterm != "CIF") {
			if ((shipmnt_mode == "Air") || (shipmnt_mode == "AIR")) {

				for (i = 0; i < this.InvItemData.results.length; i++) {
					var itemNumber = this.InvItemData.results[i].boeitno;
					var itminval = parseFloat(this.InvItemData.results[i].totval);
					var itmfrght = parseFloat(this.InvItemData.results[i].frgtamt);
					// var netcur = this.InvItemData.results[i].currencycode;
					// var frgcurr = this.InvItemData.results[i].frgt_curr;
					// if (netcur != frgcurr) {
					// 	MessageBox.error("Currencies of freight amount and invoice value are not the same at item number" + " " + itemNumber);
					// 	flag = 0;
					// 	break;
					// 	// return false;

					// } else {

					var itmfrght = parseFloat(itmfrght.toFixed(2));
					var itmInvCal = ((itminval) * 20) / 100;
					var itmInvCal = parseFloat(itmInvCal.toFixed(2));

					if ((itmfrght) > (itmInvCal)) {
						MessageBox.error("Value of Freight Is 20 % higher than the invoice value for Item Number" + " " + itemNumber);
						flag = 0;
						break;
					} else {
						flag = 1;
					}

					//}
				}
			}

			//}
			if (flag == 1) {
				var _self = this;
				this._OpenBusyDialog();

				var Check_Status = false;
				/*********Fill this array with order*********/
				var tables = [{
					"table": [this.boeIGMDetails, this.boeCetDetails, this.boeExchgDetails, this.boeCtxDetails, this.InvItemData, this.AdditionalInfo,
						this.ConstituemtsInfo,
						this.ProductionInfo, this.ControlInfo, this.I_be_sup_doc_Info, this.I_reimport_be_Info, this.I_RSP_BE_Info, this.I_statemet_be_Info
					],
					"message": [" In IGMS Details(Customs - Header)", " In Certificate Details(BE Details - Header)",
						" In Exchange Details(BE Details - Header)",
						" In Commercial Tax Details(BE Details - Header)", " In Item/Invoice/Other Details (Item Details)",
						" In Information Details(Single Window)", " In Constituent Details(Single Window)",
						" In Production Details(Single Window)", " In Control Details(Single Window)",
						" In Supporting Documents Details(Additional Info)", " In Reimport Details(Additional Info)",
						" In RSP Details(Additional Info)", " In Statement Details(Additional Info)"
					],
					"Item_Status": [false, false, false, false, true, true, true, true, true, true, true, true, true]
				}];

				if (_self.SelVal == 10) {
					_self.UpdateBoeFun();
				} else {
					Check_Status = _self.CheckRequiredFields("Change");
					if (Check_Status) {
						for (var k = 0; k < tables.length; k++) {
							for (var i = 0; i < tables[k].table.length; i++) {
								if (tables[k].table[i].results.length > 0) {
									for (var m = 0; m < tables[k].table[i].results.length; m++) {
										Check_Status = this.CheckItemRequiredFields(JSON.parse(JSON.stringify(tables[k].table[i].results[m])),
											tables[k].message[i], tables[k].Item_Status[i]);
										if (!Check_Status)
											break;
									}
									if (!Check_Status)
										break;
								}
							}
						}
						if (Check_Status) {
							if (_self.Msg != "" && _self.NotValid === true) {
								MessageBox.warning(_self.Msg + " is not filled,Would you like to continue?", {
									actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
									onClose: function (oAction) {
										if (oAction === sap.m.MessageBox.Action.YES) {
											var Data = _self.UpdateBoeFun();
										} else {
											_self._CloseBusyDialog();
										}
									}
								});
							} else {
								var Data = _self.UpdateBoeFun();
							}
						} else {
							_self._CloseBusyDialog();
						}
					} else {
						_self._CloseBusyDialog();
					}
				}
			}

		},
		// ******************************************************change by ajoe**********************************

		UpdateBoeFun: function () {
			var _self = this;
			var requestbody = {};
			var json = {};
			var item_json = {};
			var license_json = {};
			var Additional_json = {};
			var duty_json = {};
			var boea_json = {};
			var i;
			if (this.SelVal == 25) {
				this.boeHeaderData.doc_stat = "25";
			}
			if (this.Mode == "I") {
				this.Docnumber = this.getView().byId("pdocno").getValue();
			}
			this.CustBOENo = this.getView().byId("impdpsno").getValue();
			this.BondRefNo = this.getView().byId("bondno").getValue();
			//this.IGMNumber = this.getView().byId("igmno").getValue();
			this.CustBOEDate = this.getView().byId("impdpdat").getValue();
			this.not_comp_date = this.getView().byId("not_comp_date").getValue();
			this.doc_del_date = this.getView().byId("doc_del_date").getValue();
			this.doc_rec_date = this.getView().byId("doc_rec_date").getValue();
			this.not_doc_ret_date = this.getView().byId("not_doc_ret_date").getValue();
			//	this.icd_igm_date = this.getView().byId("icd_igm_date").getValue();
			this.cust_doc_ret_date = this.getView().byId("cust_doc_ret_date").getValue();
			this.exch_rate_date = this.getView().byId("exch_rate_date").getValue();
			this.finalassmtdate = this.getView().byId("finalassmtdate").getValue();
			this.ooc_date = this.getView().byId("ooc_date").getValue();
			this.hss_agreement_date = this.getView().byId("hss_agreement_date").getValue();
			this.ooc_reg_date = this.getView().byId("ooc_reg_date").getValue();
			this.shipment_on_board_date = this.getView().byId("shipment_on_board_date").getValue();
			this.eta = this.getView().byId("eta").getValue();
			this.etd = this.getView().byId("etd").getValue();
			this.ataicd = this.getView().byId("ataicd").getValue();
			this.reqdtypmtdat = this.getView().byId("reqdtypmtdat").getValue();
			this.duedatdtypmt = this.getView().byId("duedatdtypmt").getValue();
			this.datdtypmtbasc = this.getView().byId("datdtypmtbasc").getValue();
			this.otpgendat = this.getView().byId("otpgendat").getValue();
			this.rfndaplndat = this.getView().byId("rfndaplndat").getValue();
			//this.iwrdt = this.getView().byId("iwrdt").getValue();
			//this.gatigdt = this.getView().byId("gatigdt").getValue();
			this.tr6_challan_date = this.getView().byId("tr6_challan_date").getValue();
			this.rfndrcvddat = this.getView().byId("rfndrcvddat").getValue();
			this.rwcrcptdat = this.getView().byId("rwcrcptdat").getValue();
			this.boeamdmt = this.getView().byId("boeamdmt").getSelectedKey();
			this.BondDate = this.getView().byId("bonddat").getValue();
			this.otherbnd_date = this.getView().byId("otherbnd_date").getValue();
			this.atadestport = this.getView().byId("atadestport").getValue();
			this.boeamdtreq = this.getView().byId("boeamdtreq").getValue();
			this.amndtcompdt = this.getView().byId("amndtcompdt").getValue();
			//****************************Anita******************************************//

			this.det_free_days = this.getView().byId("detFreeDays").getValue();
			this.free_lastdt = this.getView().byId("lastDateFree").getValue();

			if (!this.free_lastdt) {
				this.free_lastdt = null;
			} else {
				var lastdatef = this.free_lastdt.split("/");
				this.free_lastdt = lastdatef[2].trim() + "-" + lastdatef[1].trim() + "-" + lastdatef[0].trim() +
					"T00:00:00";
			}

			//**********************************************************************//
			if (!this.shipment_on_board_date) {
				this.shipment_on_board_date = null;
			} else {
				var SplitDatePart = this.shipment_on_board_date.split("/");
				this.shipment_on_board_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() +
					"T00:00:00";
			}
			if (!this.eta) {
				this.eta = null;
			} else {
				var SplitDatePart = this.eta.split("/");
				this.eta = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.etd) {
				this.etd = null;
			} else {
				var SplitDatePart = this.etd.split("/");
				this.etd = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.ataicd) {
				this.ataicd = null;
			} else {
				var SplitDatePart = this.ataicd.split("/");
				this.ataicd = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.reqdtypmtdat) {
				this.reqdtypmtdat = null;
			} else {
				var SplitDatePart = this.reqdtypmtdat.split("/");
				this.reqdtypmtdat = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.duedatdtypmt) {
				this.duedatdtypmt = null;
			} else {
				var SplitDatePart = this.duedatdtypmt.split("/");
				this.duedatdtypmt = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.datdtypmtbasc) {
				this.datdtypmtbasc = null;
			} else {
				var SplitDatePart = this.datdtypmtbasc.split("/");
				this.datdtypmtbasc = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.otpgendat) {
				this.otpgendat = null;
			} else {
				var SplitDatePart = this.otpgendat.split("/");
				this.otpgendat = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.rfndaplndat) {
				this.rfndaplndat = null;
			} else {
				var SplitDatePart = this.rfndaplndat.split("/");
				this.rfndaplndat = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.tr6_challan_date) {
				this.tr6_challan_date = null;
			} else {
				var SplitDatePart = this.tr6_challan_date.split("/");
				this.tr6_challan_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.rfndrcvddat) {
				this.rfndrcvddat = null;
			} else {
				var SplitDatePart = this.rfndrcvddat.split("/");
				this.rfndrcvddat = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.rwcrcptdat) {
				this.rwcrcptdat = null;
			} else {
				var SplitDatePart = this.rwcrcptdat.split("/");
				this.rwcrcptdat = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.atadestport) {
				this.atadestport = null;
			} else {
				var SplitDatePart = this.atadestport.split("/");
				this.atadestport = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.CustBOEDate) {
				this.CustBOEDate = null;
			} else {
				var SplitDatePart = this.CustBOEDate.split("/");
				this.CustBOEDate = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.not_comp_date) {
				this.not_comp_date = null;
			} else {
				var SplitDatePart = this.not_comp_date.split("/");
				this.not_comp_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.doc_del_date) {
				this.doc_del_date = null;
			} else {
				var SplitDatePart = this.doc_del_date.split("/");
				this.doc_del_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.doc_rec_date) {
				this.doc_rec_date = null;
			} else {
				var SplitDatePart = this.doc_rec_date.split("/");
				this.doc_rec_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.not_doc_ret_date) {
				this.not_doc_ret_date = null;
			} else {
				var SplitDatePart = this.not_doc_ret_date.split("/");
				this.not_doc_ret_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}

			/*	if (!this.icd_igm_date) {
				this.icd_igm_date = null;
			} else {
				var SplitDatePart = this.icd_igm_date.split("/");
				this.icd_igm_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
*/
			if (!this.cust_doc_ret_date) {
				this.cust_doc_ret_date = null;
			} else {
				var SplitDatePart = this.cust_doc_ret_date.split("/");
				this.cust_doc_ret_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}

			if (!this.exch_rate_date) {
				this.exch_rate_date = null;
			} else {
				var SplitDatePart = this.exch_rate_date.split("/");
				this.exch_rate_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}

			if (!this.finalassmtdate) {
				this.finalassmtdate = null;
			} else {
				var SplitDatePart = this.finalassmtdate.split("/");
				this.finalassmtdate = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.ooc_date) {
				this.ooc_date = null;
			} else {
				var SplitDatePart = this.ooc_date.split("/");
				this.ooc_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}

			if (!this.hss_agreement_date) {
				this.hss_agreement_date = null;
			} else {
				var SplitDatePart = this.hss_agreement_date.split("/");
				this.hss_agreement_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}

			if (!this.ooc_reg_date) {
				this.ooc_reg_date = null;
			} else {
				var SplitDatePart = this.ooc_reg_date.split("/");
				this.ooc_reg_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.amndtcompdt) {
				this.amndtcompdt = null;
			} else {
				var SplitDatePart = this.amndtcompdt.split("/");
				this.amndtcompdt = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.boeamdtreq) {
				this.boeamdtreq = null;
			} else {
				var SplitDatePart = this.boeamdtreq.split("/");
				this.boeamdtreq = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.BondDate) {
				this.BondDate = null;
			} else {
				var SplitDatePart = this.BondDate.split("/");
				this.BondDate = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.otherbnd_date) {
				this.otherbnd_date = null;
			} else {
				var SplitDatePart = this.otherbnd_date.split("/");
				this.otherbnd_date = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			this.NocontShip = this.getView().byId("tot_no_cont").getValue();
			//this.SuppRel = (this.getView().byId("supplier_rel").getSelected() ? "X" : "");
			this.DefPmt = this.getView().byId("defpmt").getSelectedKey();
			this.boeamdtdetl = this.getView().byId("boeamdtdetl").getValue();
			/*Additional Fields*/
			this.amndtcompdt = this.getView().byId("amndtcompdt").getValue();
			this.boeamdtreq = this.getView().byId("boeamdtreq").getValue();
			if (!this.boeamdtreq) {
				this.boeamdtreq = null;
			} else {
				var SplitDatePart = this.boeamdtreq.split("/");
				this.boeamdtreq = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			if (!this.amndtcompdt) {
				this.amndtcompdt = null;
			} else {
				var SplitDatePart = this.amndtcompdt.split("/");
				this.amndtcompdt = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			}
			this.CurSelSt = this.getView().byId("boests").getSelectedKey();
			json = this._FnUpdateHeader(this._FnConvertJSON(this.boeHeaderData));
			var mParameters = {
				groupId: "batchUpdate",
				eTag: "*"
			};

			this.BoeModel.setDeferredGroups(["batchUpdate"]);
			//	this.BoeModel.setDeferredGroups(this.BoeModel.getDeferredGroups().concat(["batchUpdate"]));
			this.BoeModel.update("/xBRIxi_iidbehdr(doctyp='" + this.docType + "',docno='" + this.docNumber + "')", json, mParameters);
			for (i = 0; i < this.InvItemData.results.length; i++) {
				item_json = this._FnDeleteMetaData(this.InvItemData.results[i]);
				delete item_json.to_BOEHeader;
				delete item_json.to_Currency;
				delete item_json.to_Currencyagc;
				delete item_json.to_Currencyfur;
				delete item_json.to_Currencyhss;
				delete item_json.to_Currencyinr;
				delete item_json.to_Currencyinsu;
				delete item_json.to_Currencymsc;
				delete item_json.to_Unitdel;
				delete item_json.to_Unitmein;
				delete item_json.to_Unitmeins01;
				delete item_json.to_Unitrec;
				delete item_json.to_Unitull;
				delete item_json.__metadata;
				this.BoeModel.update("/xBRIxi_iidbeitm(doctyp='" + item_json.doctyp + "',docno='" + item_json.docno + "',boeitno='" + item_json.boeitno +
					"')", item_json, mParameters);
			}
			for (i = 0; i < this.ShippingInfo.results.length; i++) {
				var boecdat = this.ConvertJsonDate(this.ShippingInfo.results[i].boecdat);
				var refdocdat = this.ConvertJsonDate(this.ShippingInfo.results[i].refdocdat);

				this.BoeModel.update("/xBRIxiiidbeshd(doctyp='" + this.ShippingInfo.results[i].doctyp + "',boerefno='" + this.ShippingInfo.results[
						i].boerefno + "',boecdat=datetime'" + boecdat + "',refdocno='" + this.ShippingInfo.results[i].refdocno +
					"',refdocdat=datetime'" + refdocdat + "',refdoccat='" + this.ShippingInfo.results[i].refdoccat +
					"')", this.ShippingInfo.results[i], mParameters);

			}
			for (var i = 0; i < this.DiffArray.results.length; i++) {
				this.BoeModel.remove("/xBRIxiiidbsalo(docnr='" + this.DiffArray.results[i].docnr + "',doccat='" + this.DiffArray.results[
						i].doccat + "',docitem='" +
					this.DiffArray.results[i].docitem + "',lineitem='" + this.DiffArray.results[i].lineitem + "')", mParameters);
			}
			for (i = 0; i < this.LicenceItemData.results.length; i++) {
				if ((this.LicenceItemData.results[i].bnftyp).includes("MEIS")) {
					this.LicenceItemData.results[i].bnftyp = "MEIS";
				} else if ((this.LicenceItemData.results[i].bnftyp).includes("ADVANCE LICENCE") || (this.LicenceItemData.results[i].bnftyp).includes(
						"DFL")) {
					this.LicenceItemData.results[i].bnftyp = "DFL";
				} else if ((this.LicenceItemData.results[i].bnftyp).includes("EXPORT PROMOTION CAPITAL GOODS") || (this.LicenceItemData.results[
							i]
						.bnftyp).includes("EPCG")) {
					this.LicenceItemData.results[i].bnftyp = "EPCG";
				}

				if (this.LicenceItemData.results[i].Split == "X" || this.LicenceItemData.results[i].flag1 != "X") {
					delete this.LicenceItemData.results[i].to_Currency;
					delete this.LicenceItemData.results[i].to_UOM;
					delete this.LicenceItemData.results[i].to_dochdr;
					delete this.LicenceItemData.results[i].__metadata
					delete this.LicenceItemData.results[i].Split;
					delete this.LicenceItemData.results[i].itmsrnolcs;
					delete this.LicenceItemData.results[i].lcsregprt;
					delete this.LicenceItemData.results[i].Parameters;
					delete this.LicenceItemData.results[i].message;
					this.BoeModel.createEntry("/xBRIxiiidbsalo", {
						properties: this.LicenceItemData.results[i],
						groupId: "batchUpdate"
					});
				} else {
					this.BoeModel.update("/xBRIxiiidbsalo(docnr='" + this.LicenceItemData.results[i].docnr + "',doccat='" + this.LicenceItemData.results[
							i].doccat + "',docitem='" +
						this.LicenceItemData.results[i].docitem + "',lineitem='" + this.LicenceItemData.results[i].lineitem + "')", this.LicenceItemData
						.results[i], mParameters);
				}
			}
			this.CHCode = this.boeHeaderData.custhousname;
			this.beno = this.boeHeaderData.impdpsno;
			this.bedate = this.boeHeaderData.impdpdat;
			this.UJCode = this.boeBEdetails.results[0].ujno;
			this.UJDate = this.boeBEdetails.results[0].ujdate;
			this.MsgType = this.boeBEdetails.results[0].msgtype;
			for (var i = 0; i < this.AdditionalInfo.results.length; i++) {
				this.AdditionalInfo.results[i].ujno = this.UJCode;
				this.AdditionalInfo.results[i].ujdate = this.UJDate;
				this.AdditionalInfo.results[i].chcode = this.CHCode;
				this.AdditionalInfo.results[i].msgtype = this.MsgType;
				//	if (this.AdditionalInfo.results[i].Mode == "X" || !(this.AdditionalInfo.results[i].inftypsrlno)) {
				delete this.AdditionalInfo.results[i].Mode;
				this.BoeModel.createEntry("/xBRIxBE_BOE", {
					properties: this.AdditionalInfo.results[i],
					groupId: "batchUpdate"
				});
				//	} 
				/*	else {
						this.BoeModel.update("/xBRIxBE_BOE(doctyp='" + this.AdditionalInfo.results[i].doctyp + "',docno='" + this.AdditionalInfo.results[
								i].docno + "',boeitno='" + this.AdditionalInfo.results[i].boeitno + "',inftypsrlno='" + this.AdditionalInfo.results[i].inftypsrlno +
							"')", this.AdditionalInfo.results[i], mParameters);
						delete this.AdditionalInfo.results[i].to_BOEHeader;
						delete this.AdditionalInfo.results[i].to_lnkinqu_cof;
						delete this.AdditionalInfo.results[i].__metadata;
					}*/
			}
			for (var i = 0; i < this.ConstituemtsInfo.results.length; i++) {
				this.ConstituemtsInfo.results[i].ujno = this.UJCode;
				this.ConstituemtsInfo.results[i].ujdate = this.UJDate;
				this.ConstituemtsInfo.results[i].chcode = this.CHCode;
				this.ConstituemtsInfo.results[i].msgtype = this.MsgType;
				//	if (this.ConstituemtsInfo.results[i].Mode == "X" || !(this.ConstituemtsInfo.results[i].constsrlno)) {
				delete this.ConstituemtsInfo.results[i].Mode;
				this.BoeModel.createEntry("/xBRIxi_boe_item_swc_be", {
					properties: this.ConstituemtsInfo.results[i],
					groupId: "batchUpdate"
				});
				//	} 
				/*	else {
						this.BoeModel.update("/xBRIxi_boe_item_swc_be(doctyp='" + this.ConstituemtsInfo.results[i].doctyp + "',docno='" + this.ConstituemtsInfo
							.results[
								i].docno + "',boeitno='" + this.ConstituemtsInfo.results[i].boeitno + "',constsrlno='" + this.ConstituemtsInfo.results[i].constsrlno +
							"')", this.ConstituemtsInfo.results[i], mParameters);
						delete this.ConstituemtsInfo.results[i].to_BOEHeader;
						delete this.ConstituemtsInfo.results[i].to_lnkinqu_cof;
						delete this.ConstituemtsInfo.results[i].__metadata;
					}*/
			}
			for (var i = 0; i < this.ProductionInfo.results.length; i++) {
				this.ProductionInfo.results[i].ujno = this.UJCode;
				this.ProductionInfo.results[i].ujdate = this.UJDate;
				this.ProductionInfo.results[i].chcode = this.CHCode;
				this.ProductionInfo.results[i].msgtype = this.MsgType;
				//	if (this.ProductionInfo.results[i].Mode == "X" || !(_self.ProductionInfo.results[i].prodsrlno)) {
				delete this.ProductionInfo.results[i].Mode;
				this.BoeModel.createEntry("/xBRIxi_boe_itm_pro_be", {
					properties: this.ProductionInfo.results[i],
					groupId: "batchUpdate"
				});
				//	}
				/*	else {
						this.BoeModel.update("/xBRIxi_boe_itm_pro_be(doctyp='" + _self.ProductionInfo.results[i].doctyp + "',docno='" +
							_self.ProductionInfo
							.results[i].docno + "',boeitno='" + _self.ProductionInfo.results[i].boeitno + "',prodsrlno='" + _self.ProductionInfo
							.results[i].prodsrlno +
							"')", this.ProductionInfo.results[i], mParameters);
						delete this.ProductionInfo.results[i].to_BOEHeader;
						delete this.ProductionInfo.results[i].to_lnkinqu_cof;
						delete this.ProductionInfo.results[i].__metadata;
					}*/
			}
			for (var i = 0; i < this.ControlInfo.results.length; i++) {
				this.ControlInfo.results[i].ujno = this.UJCode;
				this.ControlInfo.results[i].ujdate = this.UJDate;
				this.ControlInfo.results[i].chcode = this.CHCode;
				this.ControlInfo.results[i].msgtype = this.MsgType;
				/* this.ControlInfo.results[i].cntsrtdt = this.ControlInfo.results[i].cntsrtdt ? this.ControlInfo.results[i].cntsrtdt.substring(0, 19) :
				  null;*/
				//	if (this.ControlInfo.results[i].Mode == "X" || !(_self.ControlInfo.results[i].ctrlsrlno)) {
				delete this.ControlInfo.results[i].Mode;
				this.BoeModel.createEntry("/xBRIxi_boe_itm_ctrl_be", {
					properties: this.ControlInfo.results[i],
					groupId: "batchUpdate"
				});
				//	}
				/*else {
						this.BoeModel.update("/xBRIxi_boe_itm_ctrl_be(doctyp='" + _self.ControlInfo.results[i].doctyp + "',docno='" +
							_self.ControlInfo
							.results[i].docno + "',boeitno='" + _self.ControlInfo.results[i].boeitno + "',ctrlsrlno='" + _self.ControlInfo
							.results[i].ctrlsrlno +
							"')", this.ControlInfo.results[i], mParameters);
						delete this.ControlInfo.results[i].to_BOEHeader;
						delete this.ControlInfo.results[i].to_lnkinqu_cof;
						delete this.ControlInfo.results[i].__metadata;
					}*/
			}
			if (this.I_RSP_BE_Info.results.length > 0) {
				for (var i = 0; i < this.I_RSP_BE_Info.results.length; i++) {
					this.I_RSP_BE_Info.results[i].ujno = this.UJCode;
					this.I_RSP_BE_Info.results[i].ujdate = this.UJDate;
					this.I_RSP_BE_Info.results[i].chcode = this.CHCode;
					this.I_RSP_BE_Info.results[i].msgtype = this.MsgType;
					//	if (this.I_RSP_BE_Info.results[i].Mode == "X" || !(_self.I_RSP_BE_Info.results[i].rspslno)) {
					delete this.I_RSP_BE_Info.results[i].Mode;
					this.BoeModel.createEntry("/xBRIxI_RSP_BE", {
						properties: this.I_RSP_BE_Info.results[i],
						groupId: "batchUpdate"
					});
					//	} 
					/*	else {
							this.BoeModel.update("/xBRIxI_RSP_BE(doctyp='" + _self.I_RSP_BE_Info.results[i].doctyp + "',docno='" + _self.I_RSP_BE_Info
								.results[i].docno + "',rspslno='" + _self.I_RSP_BE_Info.results[i].rspslno + "',boeitno='" + _self.I_RSP_BE_Info
								.results[i].boeitno + "')", this.I_RSP_BE_Info.results[i], mParameters);
							delete this.I_RSP_BE_Info.results[i].to_BOEHeader;
							delete this.I_RSP_BE_Info.results[i].to_lnkinqu_cof;
							delete this.I_RSP_BE_Info.results[i].__metadata;
						}*/
				}
			}
			/*	// if (this.I_DEPB_BE_Info.results.length > 0) {
				//  for (var i = 0; i < this.I_DEPB_BE_Info.results.length; i++) {
				//   this.I_DEPB_BE_Info.results[i].ujno = this.UJCode;
				//   this.I_DEPB_BE_Info.results[i].ujdate = this.UJDate;
				//   this.I_DEPB_BE_Info.results[i].chcode = this.CHCode;
				//   this.I_DEPB_BE_Info.results[i].msgtype = this.MsgType;
				//   if (this.I_DEPB_BE_Info.results[i].Mode == "X") {
				//    delete this.I_DEPB_BE_Info.results[i].Mode;
				//    this.BoeModel.createEntry("/xBRIxI_DEPB_BE", {
				//     properties: this.I_DEPB_BE_Info.results[i],
				//     groupId: "batchUpdate"
				//    });
				//   } else {
				//    this.BoeModel.update("/xBRIxI_DEPB_BE(doctyp='" + this.I_DEPB_BE_Info.results[i].doctyp + "',docno='" + this.I_DEPB_BE_Info
				//     .results[i].docno + "',boeitno='" + this.I_DEPB_BE_Info.results[i].boeitno + "',licetyp='" + this.I_DEPB_BE_Info
				//     .results[i].licetyp + "',trkno='" + this.I_DEPB_BE_Info.results[i].trkno + "')", this.I_DEPB_BE_Info.results[
				//      i], mParameters);
				//    delete this.I_DEPB_BE_Info.results[i].to_BOEHeader;
				//    delete this.I_DEPB_BE_Info.results[i].to_lnkinqu_cof;
				//    delete this.I_DEPB_BE_Info.results[i].__metadata;
				//   }
				//  }
				// }*/
			if (this.I_reimport_be_Info.results.length > 0) {
				for (var i = 0; i < this.I_reimport_be_Info.results.length; i++) {
					this.I_reimport_be_Info.results[i].ujno = this.UJCode;
					this.I_reimport_be_Info.results[i].ujdate = this.UJDate;
					this.I_reimport_be_Info.results[i].chcode = this.CHCode;
					this.I_reimport_be_Info.results[i].msgtype = this.MsgType;
					//	if (this.I_reimport_be_Info.results[i].Mode == "X" || !(this.I_reimport_be_Info.results[i].shpbillslno)) {
					delete this.I_reimport_be_Info.results[i].Mode;
					this.BoeModel.createEntry("/xBRIxI_reimport_be", {
						properties: this.I_reimport_be_Info.results[i],
						groupId: "batchUpdate"
					});
					//	} 
					/*else {
						this.BoeModel.update("/xBRIxI_reimport_be(doctyp='" + this.I_reimport_be_Info.results[i].doctyp + "',docno='" + this.I_reimport_be_Info
							.results[i].docno + "',boeitno='" + this.I_reimport_be_Info.results[i].boeitno + "',shpbillslno='" + this.I_reimport_be_Info
							.results[i].shpbillslno + "')", this.I_reimport_be_Info.results[
								i], mParameters);
						delete this.I_reimport_be_Info.results[i].to_BOEHeader;
						delete this.I_reimport_be_Info.results[i].to_lnkinqu_cof;
						delete this.I_reimport_be_Info.results[i].__metadata;
					}*/
				}
			}
			if (this.I_statemet_be_Info.results.length > 0) {
				/*for amendment Aiswarya*/
				this.boeStatemetDetails_temp = this.I_statemet_be_Info;
				if (this.boeStatemetDetails_temp.hasOwnProperty('results')) {
					// if (Array.isArray(this.boeStatemetDetails_temp)) {
					for (var i = 0; i < this.boeStatemetDetails_temp.results.length; i++) {
						var arr1 = this.I_statemet_be_Info.results[i];
						var arr2 = this.boeStatemetDetails_temp.results[i];
						if (arr1 != arr2) {
							if (this.I_statemet_be_Info.results[i].amed_flag == "N") {
								this.I_statemet_be_Info.results[i].amed_flag = "N";
							} else {
								this.I_statemet_be_Info.results[i].amed_flag = "A";
							}
						}
						/*else {
							this.I_statemet_be_Info.results[i].amed_flag = '';
						}*/
					}
				}
				for (var i = 0; i < this.I_statemet_be_Info.results.length; i++) {
					this.I_statemet_be_Info.results[i].ujno = this.UJCode;
					this.I_statemet_be_Info.results[i].ujdate = this.UJDate;
					this.I_statemet_be_Info.results[i].chcode = this.CHCode;
					this.I_statemet_be_Info.results[i].msgtype = this.MsgType;
					//	if (this.I_statemet_be_Info.results[i].Mode == "X") {
					delete this.I_statemet_be_Info.results[i].Mode;
					delete this.I_statemet_be_Info.results[i].tmpsrlNo;
					this.BoeModel.createEntry("/xBRIxI_statemet_be", {
						properties: this.I_statemet_be_Info.results[i],
						groupId: "batchUpdate"
					});
					/*	} else {
							this.BoeModel.update("/xBRIxI_statemet_be(doctyp='" + _self.I_statemet_be_Info.results[i].doctyp + "',docno='" +
								_self.I_statemet_be_Info.results[i].docno + "',boeitno='" + _self.I_statemet_be_Info.results[i].boeitno +
								"',statment_srlno='" + _self.I_statemet_be_Info.results[i].statment_srlno +
								"')", this.I_statemet_be_Info.results[
									i], mParameters);
							delete this.I_statemet_be_Info.results[i].to_BOEHeader;
							delete this.I_statemet_be_Info.results[i].to_lnkinqu_cof;
							delete this.I_statemet_be_Info.results[i].__metadata;
						}*/
				}
			}
			if (this.I_be_sup_doc_Info.results.length > 0) {
				// /Aiswarya/	/*for amendment*/ 
				if (this.boeSupDocDetails_temp.hasOwnProperty('results')) {
					// if (Array.isArray(this.boeSupDocDetails_temp)) {
					for (var i = 0; i < this.boeSupDocDetails_temp.results.length; i++) {
						var arr1 = this.I_be_sup_doc_Info.results[i];
						var arr2 = this.boeSupDocDetails_temp.results[i];
						if (arr1 != arr2) {
							if (this.I_be_sup_doc_Info.results[i].amed_flag == "N") {
								this.I_be_sup_doc_Info.results[i].amed_flag = "N";
							} else {
								this.I_be_sup_doc_Info.results[i].amed_flag = "A";
							}
						}
						/*	else {
								this.I_be_sup_doc_Info.results[i].amed_flag = '';
							}*/
					}
				}
				for (var i = 0; i < this.I_be_sup_doc_Info.results.length; i++) {
					this.I_be_sup_doc_Info.results[i].ujno = this.UJCode;
					this.I_be_sup_doc_Info.results[i].ujdate = this.UJDate;
					this.I_be_sup_doc_Info.results[i].chcode = this.CHCode;
					this.I_be_sup_doc_Info.results[i].msgtype = this.MsgType;
					//	if (this.I_be_sup_doc_Info.results[i].Mode == "X" || !(this.I_be_sup_doc_Info.results[i].sup_doc_srlno)) {
					delete this.I_be_sup_doc_Info.results[i].Mode;
					this.BoeModel.createEntry("/xBRIxI_be_sup_doc", {
						properties: this.I_be_sup_doc_Info.results[i],
						groupId: "batchUpdate"
					});
					//	} 
					/*else {
						this.BoeModel.update("/xBRIxI_be_sup_doc(doctyp='" + this.I_be_sup_doc_Info.results[i].doctyp + "',docno='" + this.I_be_sup_doc_Info
							.results[i].docno + "',boeitno='" + this.I_be_sup_doc_Info.results[i].boeitno + "',sup_doc_srlno='" + this.I_be_sup_doc_Info
							.results[i].sup_doc_srlno + "')", this.I_be_sup_doc_Info.results[
								i], mParameters);
						delete this.I_be_sup_doc_Info.results[i].to_BOEHeader;
						delete this.I_be_sup_doc_Info.results[i].to_lnkinqu_cof;
						delete this.I_be_sup_doc_Info.results[i].__metadata;
					}*/
				}
			}
			for (var i = 0; i < this.boeBEdetails.results.length; i++) {
				var boei_json = this._FnDeleteMetaData(this.boeBEdetails.results[i]);
				// boei_json.beno = this.beno;
				// boei_json.bedate = this.bedate;
				boei_json.chcode = this.CHCode;
				boei_json.poo = this.boeHeaderData.loadport;
				boei_json.pos = this.boeHeaderData.loadport;
				boei_json.chacod = this.boeHeaderData.chacode;
				boei_json.coo = this.InvItemData.results[0].cntryorgn;
				boei_json.coc = this.boeHeaderData.ctryexp;
				boei_json.audcod = this.boeHeaderData.adcod;
				boei_json.paymc = this.boeHeaderData.defpmt;
				boei_json.paccode = this.boeHeaderData.pkgcod;
				boei_json.receiver_id = this.boeHeaderData.custhousname;
				if (this.boeHeaderData.doctyp == "W") {
					boei_json.betype = "H";
				} else if (this.boeHeaderData.doctyp == "Y" || this.boeHeaderData.doctyp == "T") {
					boei_json.betype = "W";
				} else {
					boei_json.betype = "X";
				}
				if (this.boeHeaderData.clearance_type == "HSP") {
					boei_json.hssf = "Y";
				} else {
					boei_json.hssf = "N";
				}

				if (this.boeHeaderData.be_filing_status == "N") {
					boei_json.whpri = "N";
				} else if (this.boeHeaderData.be_filing_status == "P") {
					boei_json.whpri = "Y";
				} else if (this.boeHeaderData.be_filing_status == "A") {
					boei_json.whpri = "A";
				} else {
					boei_json.whpri = "N";
				}

				delete boei_json.to_BOEHeader;
				delete boei_json.__metadata;
				this.BoeModel.update("/xBRIxI_BE(doctyp='" + this.docType + "',docno='" + this.docNumber + "')", boei_json,
					mParameters);
			}
			for (var i = 0; i < this.boePmsnDetails.results.length; i++) {
				var boel_json = this._FnDeleteMetaData(this.boePmsnDetails.results[i]);
				// boel_json.beno = this.beno;
				// boel_json.bedate = this.bedate;
				boel_json.chcode = this.CHCode;
				if (this.boeHeaderData.rsondlyclrnce) {
					boel_json.reason_req = this.boeHeaderData.rsondlyclrnce;
				} else {
					boel_json.reason_req = this.boePmsnDetails.results[i].reason_req;
				}
				delete boel_json.to_BOEHeader;
				delete boel_json.__metadata;
				this.BoeModel.update("/xBRIxI_PERM_BE(doctyp='" + this.docType + "',docno='" + this.docNumber + "',permslno='" + boel_json.permslno +
					"')", boel_json,
					mParameters);
			}
			for (var i = 0; i < this.boeHSSDetails.results.length; i++) {
				var boeh_json = this._FnDeleteMetaData(this.boeHSSDetails.results[i]);
				// boeh_json.beno = this.beno;
				// boeh_json.bedate = this.bedate;
				boeh_json.chcode = this.CHCode;
				delete boeh_json.to_BOEHeader;
				delete boeh_json.__metadata;
				this.BoeModel.update("/xBRIxI_HSS_BE(doctyp='" + this.docType + "',docno='" + this.docNumber + "',iecslno='" + boeh_json.iecslno +
					"')", boeh_json,
					mParameters);
			}
			/*	for (var i = 0; i < this.boeAmndtDetails.results.length; i++) {
					var boea_json = this._FnDeleteMetaData(this.boeAmndtDetails.results[i]);
					delete boea_json.to_BOEHeader;
					delete boea_json.__metadata;
					this.BoeModel.update("/xBRIxI_AMEND_BE(doctyp='" + this.docType + "',docno='" + this.docNumber + "',amendslno='" + boea_json.amendslno +
						"')", boea_json,
						mParameters);
				}*/
			for (var i = 0; i < this.boeExchgDetails.results.length; i++) {
				// this.boeExchgDetails.results[i].beno = this.beno;
				// this.boeExchgDetails.results[i].bedt = this.bedate;
				this.boeExchgDetails.results[i].chcode = this.CHCode;
				if (this.boeExchgDetails.results[i].Mode == "X" || !(this.boeExchgDetails.results[i].exccurslnoe)) {
					delete this.boeExchgDetails.results[i].Mode;
					delete this.boeExchgDetails.results[i].__metadata
					this.BoeModel.createEntry("/xBRIxI_EXCHANGE_BE", {
						properties: this.boeExchgDetails.results[i],
						groupId: "batchUpdate"
					});
				} else {
					this.BoeModel.update("/xBRIxI_EXCHANGE_BE(doctyp='" + this.boeExchgDetails.results[i].doctyp + "',docno='" + this.boeExchgDetails
						.results[i].docno + "',exccurslnoe='" + this.boeExchgDetails.results[i].exccurslnoe + "')", this.boeExchgDetails
						.results[i], mParameters);
				}
			}
			for (var i = 0; i < this.boeCetDetails.results.length; i++) {
				this.boeCetDetails.results[i].ujno = this.UJCode;
				this.boeCetDetails.results[i].ujdate = this.UJDate;
				this.boeCetDetails.results[i].chcode = this.CHCode;
				this.boeCetDetails.results[i].msgtype = this.MsgType;
				//	if (this.boeCetDetails.results[i].Mode == "X" || !(this.boeCetDetails.results[i].certynumb)) {
				this.boeCetDetails.results[i].certytype = this.boeCetDetails.results[i].cettyp;
				delete this.boeCetDetails.results[i].__metadata
				delete this.boeCetDetails.results[i].Mode;
				this.BoeModel.createEntry("/xBRIxI_CERT_BE", {
					properties: this.boeCetDetails.results[i],
					groupId: "batchUpdate"
				});
				//	} 
				/*else {
					this.BoeModel.update("/xBRIxI_CERT_BE(doctyp='" + this.boeCetDetails.results[i].doctyp + "',docno='" + this.boeCetDetails.results[
							i].docno + "',certytype='" + this.boeCetDetails.results[i].certytype + "',certynumb='" + this.boeCetDetails.results[i].certynumb +
						"')", this.boeCetDetails
						.results[i], mParameters);
				}*/
			}
			if (this.boeIGMDetails.results.length > 0) { //if condition added Aiswarya
				/*for amendment */
				if (this.boeIGMDetails_temp.hasOwnProperty('results')) {
					// if (Array.isArray(this.boeIGMDetails_temp)) {
					for (var i = 0; i < this.boeIGMDetails_temp.results.length; i++) {
						var arr1 = this.boeIGMDetails.results[i];
						var arr2 = this.boeIGMDetails_temp.results[i];
						if (arr1 != arr2) {
							if (this.boeIGMDetails.results[i].amed_flag == "N") {
								this.boeIGMDetails.results[i].amed_flag = "N";
							} else {
								this.boeIGMDetails.results[i].amed_flag = "A";
							}
						}
						/*else {
							this.boeIGMDetails.results[i].amed_flag = '';
						}*/
					}
				}
				console.log("this.boeIGMDetails.results:", this.boeIGMDetails.results);
				for (var i = 0; i < this.boeIGMDetails.results.length; i++) {
					this.boeIGMDetails.results[i].ujno = this.UJCode;
					this.boeIGMDetails.results[i].ujdate = this.UJDate;
					this.boeIGMDetails.results[i].chcode = this.CHCode;
					this.boeIGMDetails.results[i].msgtype = this.MsgType;
					//	if (this.boeIGMDetails.results[i].Mode == "X" || !(this.boeIGMDetails.results[i].igmsrlno)) {

					delete this.boeIGMDetails.results[i].__metadata
					delete this.boeIGMDetails.results[i].Mode;
					this.BoeModel.createEntry("/xBRIxI_IGMS_BE", {
						properties: this.boeIGMDetails.results[i],
						groupId: "batchUpdate"
					});
					//	} 
					/*else {
						this.BoeModel.update("/xBRIxI_IGMS_BE(doctyp='" + _self.boeIGMDetails.results[i].doctyp + "',docno='" + _self.boeIGMDetails
								.results[i].docno + "',igmsrlno='" + _self.boeIGMDetails.results[i].igmsrlno + "')", this.boeIGMDetails
							.results[i], mParameters);
					}*/
				}
			}

			for (var i = 0; i < this.boeCtxDetails.results.length; i++) {
				// this.boeCtxDetails.results[i].beno = this.beno;
				// this.boeCtxDetails.results[i].bedate = this.bedate;
				this.boeCtxDetails.results[i].chcode = this.CHCode;
				this.boeCtxDetails.results[i].scode = this.boeHeaderData.gstnstcod;
				if (this.boeCtxDetails.results[i].Mode == "X" || !(this.boeCtxDetails.results[i].ctxslno)) {
					delete this.boeCtxDetails.results[i].__metadata
					delete this.boeCtxDetails.results[i].Mode;
					this.BoeModel.createEntry("/xBRIxI_iid_ctx_be", {
						properties: this.boeCtxDetails.results[i],
						groupId: "batchUpdate"
					});
				} else {
					this.BoeModel.update("/xBRIxI_iid_ctx_be(doctyp='" + this.boeCtxDetails.results[i].doctyp + "',docno='" + this.boeCtxDetails.results[
							i].docno + "',ctxslno='" + this.boeCtxDetails.results[i].ctxslno + "')", this.boeCtxDetails
						.results[i], mParameters);
				}
			}
			this.BoeModel.submitChanges({
				success: function (result, response) {
					_self.BoeModel.resetChanges();
					var EnabledModel = new sap.ui.model.json.JSONModel({
						enable: true
					});
					_self.getView().setModel(EnabledModel, "State");
					var error = false;
					if (result.__batchResponses) {
						if (result.__batchResponses["0"].response) {
							var m = {
								message: []
							};
							m.message = JSON.parse(result.__batchResponses["0"].response.body).error.message.value;
							error = true;
						} else {
							var m = JSON.parse(result.__batchResponses["0"].__changeResponses["0"].headers["sap-message"]);
						}
					} else {
						var m = {
							message: []
						};
						m.message = "BOE " + _self.docNumber + " updated successfully";
					}
					if (!error) {
						MessageBox.success(m.message, {
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									_self._CloseBusyDialog();
									_self.UpdateDMSTable(_self.docNumber);
									_self.byId("idSwtichMode").setState(false);
									_self.ClearRequiredFileds();
									_self.LockObjectCall();
									// window.FlagRefresh = true;// commented Aiswarya Added
									window.FlagOfRefresh = true //Aiswarya Added
									window.FromDocNumber = _self.docNumber;
									window.BOEType = _self.docType;
									_self._IntialDisplayView();
									_self.router.navTo("boelist", true);
								}
							}
						});
					} else {
						var arr = m.message.split("'")[1];
						var label
						if (arr != undefined && _self.byId(arr) != undefined) {
							if (_self.byId(arr).getParent().sId.match("idLICAllocEdit") || _self.byId(arr).getParent().sId.match("iddutyDetEdit") ||
								_self.byId(arr).getParent().sId.match("tbladl") ||
								_self.byId(arr).getParent().sId.match("tblConstituemts") || _self.byId(arr).getParent().sId.match("tblcar") || _self.byId(
									arr).getParent().sId.match("tblpro") || _self.byId(arr).getParent().sId.match("tbl_RSP") || _self.byId(arr).getParent().sId
								.match("tbl_REIMPORT") || _self.byId(arr).getParent().sId.match("tbl_I_be_sup_doc") ||
								_self.byId(arr).getParent().sId.match("idExchg") || _self.byId(arr).getParent().sId.match("idCet") || _self.byId(arr).getParent()
								.sId.match("idCtx")) {
								label = "'" + _self.byId(arr).getLabel().getText() + "'";
							} else {
								label = "'" + _self.byId(arr).getParent().getLabel().getText() + "'";
							}
							m.message = m.message.replace(m.message.split("'")[1], label);
						}
						MessageBox.error(m.message, {
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {
								_self._CloseBusyDialog();
								if (_self.boeHeaderData.doc_stat >= 25) {
									_self.AuthConfiguration("Display");
								}
								// window.FlagRefresh = true;// commented Aiswarya Added
								window.FlagOfRefresh = true //Aiswarya Added
								window.FromDocNumber = _self.docNumber;
								window.BOEType = _self.docType;
							}
						});
					}
				},
				error: function (err) {
					_self.BoeModel.resetChanges();
					if (err.responseText.match("<?")) {
						MessageBox.error("Something went wrong. Please try again later.");
					} else if (err.responseText) {
						var Msg = JSON.parse(err.responseText).error.message.value;
						MessageBox.error(Msg);
					} else {
						MessageBox.error("Something went wrong. Please try again later.");
					}
					if (_self.boeHeaderData.doc_stat >= 25) {
						_self.AuthConfiguration("Display");
					}
					_self._CloseBusyDialog();
				},
				groupId: "batchUpdate",
				eTag: "*"
			});
		},
		setfree_lastdt: function (oEvent) { //merge sumeesh code by Aiswarya
			if (this.boeHeaderData.shptyp == "FCL") {
				if (this.getView().byId("detFreeDays").getValue() != "" && this.getView().byId("ataicd").getValue() != "" || this.getView().byId(
						"atadestport").getValue() != "") {

					var days = parseInt(this.getView().byId("detFreeDays").getValue());
					if (this.getView().byId("ataicd").getValue() != "") {
						this.tempdate = this.getView().byId("ataicd").getValue();
					} else {
						this.tempdate = this.getView().byId("atadestport").getValue();
					}
					if (!this.tempdate) {
						this.tempdate = null;
					} else {
						var SplitDatePart = this.tempdate.split("/");
						this.toadddate = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00.000Z";
					}
					const date = new Date(this.toadddate);
					const newDate = this.addDays(date, days);
					// 2022-05-20T00:00:00.000Z
					console.log(newDate);
				}
			}
		},
		addDays: function (date, days) { //merge sumeesh code by Aiswarya
			date.setDate(date.getDate() + days);
			this.getView().byId("lastDateFree").setDateValue(date);

			return date;
		},
		SetAllFileJson: function (Type) {
			var jsonArray = {
				results: []
			};

			if (Type == "BOE") {
				if (this.AllFiles && this.docNumber) {
					for (var i = 0; i < this.AllFiles.results.length; i++) {
						var json = {};
						json.docno = this.docNumber;
						json.module_dms = "BOE";
						json.doccat = "BOE";
						json.doctype = "BOE";
						json.filename = this.AllFiles.results[i].filename;
						json.fileid = this.AllFiles.results[i].fileid;
						json.mimetype = this.AllFiles.results[i].mimetype;
						json.filesize = this.AllFiles.results[i].filesize;
						json.servicetype = this.AllFiles.results[i].servicetype;
						jsonArray.results.push(json);
					}
				}
			} else {
				if (this.allNNDOFiles && this.boeHeaderData.nndo) {
					for (var i = 0; i < this.allNNDOFiles.results.length; i++) {
						var json = {};
						json.docno = this.boeHeaderData.nndo;
						json.module_dms = "NNDO";
						json.doccat = "NNDO";
						json.doctype = "NNDO";
						json.filename = this.allNNDOFiles.results[i].filename;
						json.fileid = this.allNNDOFiles.results[i].fileid;
						json.mimetype = this.allNNDOFiles.results[i].mimetype;
						json.filesize = this.allNNDOFiles.results[i].filesize;
						json.servicetype = this.allNNDOFiles.results[i].servicetype;
						jsonArray.results.push(json);
					}
				}
			}
			return jsonArray;
		},
		DeleteDMSNNDOFile_Table: function (docNumber) {
			this.DMSService_Model.remove("/xBRIxi_dms_table(docno='" + docNumber + "',module_dms='" + this.allNNDOFiles.results[this.dmsFileIndex]
				.module_dms +
				"',doccat='" + this.allNNDOFiles.results[this.dmsFileIndex].doccat + "',doctype='" + this.allNNDOFiles.results[this.dmsFileIndex]
				.doctype + "',filename='" + encodeURI(this.allNNDOFiles.results[this.dmsFileIndex].filename) + "')", {
					success: function (oData, response) {
						eval();
					},
					error: function (response) {
						debugger;
					}
				});
		},
		DeleteDMSFile_Table: function (docNumber) {
			this.DMSService_Model.remove("/xBRIxi_dms_table(docno='" + docNumber + "',module_dms='" + this.AllFiles.results[this.dmsFileIndex]
				.module_dms +
				"',doccat='" + this.AllFiles.results[this.dmsFileIndex].doccat + "',doctype='" + this.AllFiles.results[this.dmsFileIndex]
				.doctype + "',filename='" + encodeURI(this.AllFiles.results[this.dmsFileIndex].filename) + "')", {
					success: function (oData, response) {
						eval();
					},
					error: function (response) {
						debugger;
					}
				});
		},
		UpdateDMSTable: function (DocNumber) {
			this.DMSService_Model.setDeferredGroups(["batchUpdate"]);
			var JsonData = this.SetAllFileJson("BOE");
			//	console.log("Boe JsonData",JsonData);
			if (JsonData.results.length > 0) {
				for (var i = 0; i < JsonData.results.length; i++) {
					this.DMSService_Model.createEntry("/xBRIxi_dms_table", {
						properties: JsonData.results[i],
						groupId: "batchUpdate"
					});
				}
			}
			var JsonDataNNDO = this.SetAllFileJson("NNDO");
			//console.log("nndo JsonData",JsonDataNNDO);
			if (JsonDataNNDO.results.length > 0) {
				for (var i = 0; i < JsonDataNNDO.results.length; i++) {
					this.DMSService_Model.createEntry("/xBRIxi_dms_table", {
						properties: JsonDataNNDO.results[i],
						groupId: "batchUpdate"
					});
				}
			}
			if (JsonData.results.length > 0 || JsonDataNNDO.results.length > 0) {
				this.DMSService_Model.submitChanges({
					success: function (result) {
						debugger;
					},
					error: function (err) {
						debugger;
					},
					groupId: "batchUpdate",
					eTag: "*"
				});
			}
		},
		ftaSelect: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].fta_applicable = oEvent.mParameters.selected ? "X" : "";
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		RDSelect: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].randd_applicability = oEvent.mParameters.selected ? "X" : "";
			this.RequiredSetFTA(oEvent.mParameters.selected, "RD");
			this.getView().getModel("boeItemdatadetails").refresh();
			this.calculateFtaDuty();
		},
		fta_entitledSelect: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].fta_entitled = oEvent.mParameters.selected ? "X" : "";
			this.RequiredSetFTA(oEvent.mParameters.selected, "FTA");
			this.getView().getModel("boeItemdatadetails").refresh();
			this.calculateFtaDuty();
		},
		_FnConvertJSON: function (obj) {
			return JSON.parse(JSON.stringify(obj));
		},
		FunUpAmndtDetails: function (jsonObj) {
			delete jsonObj.to_BOEHeader;
			delete jsonObj.__metadata;
			return jsonObj;
		},
		ConvertJsonDate: function (value) {
			var output = "";
			if (value) {
				if (value instanceof Date) {
					var NewDateform = value;
				} else {
					var formattedJsonDate = eval('new' + value.replace(/\//g, ' '));
					var NewDateform = new Date(formattedJsonDate);
				}
				var mnth = ("0" + (NewDateform.getMonth() + 1)).slice(-2);
				var day = ("0" + NewDateform.getDate()).slice(-2);
				var tim = "00:00:00";
				var output = [NewDateform.getFullYear(), mnth, day].join("-");
				var datUpdate = [output, tim].join("T");
				var x = datUpdate;
				this.otp = datUpdate;
				x = x.replace(new RegExp(":", "g"), "%3A");
				this.otp = x;
			}
			return this.otp;
		},
		_FnUpdateHeader: function (jsonObj) {
			if (this.Mode == "I") {
				var Dateobj = new Date();
				var TodayDate = Dateobj.getFullYear() + "-" + ('0' + (Dateobj.getMonth() + 1)).slice(-2) + "-" + ('0' + Dateobj.getDate()).slice(-
					2);
				var Idate = TodayDate + "T00:00:00";
				jsonObj.boedate = Idate;
			}
			if (jsonObj.boedate) {
				if (jsonObj.boedate.includes("00:00:00.000Z")) {
					jsonObj.boedate = jsonObj.boedate.replace(/Z/g, '');
				}
			}
			if (jsonObj.ersda) {
				if (jsonObj.ersda.includes("00:00:00.000Z")) {
					jsonObj.ersda = jsonObj.ersda.replace(/Z/g, '');
				}
			}
			if (jsonObj.laeda) {
				if (jsonObj.laeda.includes("00:00:00.000Z")) {
					jsonObj.laeda = jsonObj.laeda.replace(/Z/g, '');
				}
			}
			if (jsonObj.pay_due_date) {
				if (jsonObj.pay_due_date.includes("00:00:00.000Z")) {
					jsonObj.pay_due_date = jsonObj.pay_due_date.replace(/Z/g, '');
				}
			}
			if (jsonObj.remit_date) {
				if (jsonObj.remit_date.includes("00:00:00.000Z")) {
					jsonObj.remit_date = jsonObj.remit_date.replace(/Z/g, '');
				}
			}
			if (jsonObj.spcerdat) {
				if (jsonObj.spcerdat.includes("00:00:00.000Z")) {
					jsonObj.spcerdat = jsonObj.spcerdat.replace(/Z/g, '');
				}
			}
			if (jsonObj.timestamp) {
				if (jsonObj.timestamp.includes("00:00:00.000Z")) {
					jsonObj.timestamp = jsonObj.timestamp.replace(/Z/g, '');
				}
			}
			if (jsonObj.challan_date) {
				if (jsonObj.challan_date.includes("00:00:00.000Z")) {
					jsonObj.challan_date = jsonObj.challan_date.replace(/Z/g, '');
				}
			}
			if (jsonObj.cusfredat) {
				if (jsonObj.cusfredat.includes("00:00:00.000Z")) {
					jsonObj.cusfredat = jsonObj.cusfredat.replace(/Z/g, '');
				}
			}
			if (jsonObj.chadcldat) {
				if (jsonObj.chadcldat.includes("00:00:00.000Z")) {
					jsonObj.chadcldat = jsonObj.chadcldat.replace(/Z/g, '');
				}
			}
			if (jsonObj.trcdat) {
				if (jsonObj.trcdat.includes("00:00:00.000Z")) {
					jsonObj.trcdat = jsonObj.trcdat.replace(/Z/g, '');
				}
			}
			if (jsonObj.agmtdat) {
				if (jsonObj.agmtdat.includes("00:00:00.000Z")) {
					jsonObj.agmtdat = jsonObj.agmtdat.replace(/Z/g, '');
				}
			}

			if (jsonObj.wrhdat) {
				if (jsonObj.wrhdat.includes("00:00:00.000Z")) {
					jsonObj.wrhdat = jsonObj.wrhdat.replace(/Z/g, '');
				}
			}
			if (jsonObj.boe_vend_dt) {
				if (jsonObj.boe_vend_dt.includes("00:00:00.000Z")) {
					jsonObj.boe_vend_dt = jsonObj.boe_vend_dt.replace(/Z/g, '');
				}
			}
			jsonObj.atadestport1 = this.atadestport;
			jsonObj.impdpsno = this.CustBOENo;
			jsonObj.bondno = this.BondRefNo;
			jsonObj.boeamdmt = this.boeamdmt;
			jsonObj.impdpdat = this.CustBOEDate;
			jsonObj.not_comp_date = this.not_comp_date;
			jsonObj.doc_del_date = this.doc_del_date;
			jsonObj.doc_rec_date = this.doc_rec_date;
			jsonObj.not_doc_ret_date = this.not_doc_ret_date;
			//	jsonObj.icd_igm_date = this.icd_igm_date;
			jsonObj.cust_doc_ret_date = this.cust_doc_ret_date;
			jsonObj.exch_rate_date = this.exch_rate_date;
			jsonObj.finalassmtdate = this.finalassmtdate;
			jsonObj.ooc_date = this.ooc_date;
			jsonObj.hss_agreement_date = this.hss_agreement_date;
			jsonObj.ooc_reg_date = this.ooc_reg_date;
			jsonObj.amndtcompdt = this.amndtcompdt;
			jsonObj.shipment_on_board_date = this.shipment_on_board_date;
			jsonObj.eta = this.eta;
			jsonObj.etd = this.etd;
			//********************Anita***********************//
			jsonObj.free_lastdt = this.free_lastdt;
			jsonObj.det_free_days = this.det_free_days;
			//*******************************************//
			jsonObj.ataicd1 = this.ataicd;
			jsonObj.reqdtypmtdat = this.reqdtypmtdat;
			jsonObj.duedatdtypmt = this.duedatdtypmt;
			jsonObj.datdtypmtbasc = this.datdtypmtbasc;
			jsonObj.otpgendat = this.otpgendat;
			jsonObj.rfndaplndat = this.rfndaplndat;
			jsonObj.rfndrcvddat = this.rfndrcvddat;
			jsonObj.rwcrcptdat = this.rwcrcptdat;
			jsonObj.bonddat = this.BondDate;
			jsonObj.otherbnd_date = this.otherbnd_date;
			jsonObj.tr6_challan_date = this.tr6_challan_date;
			/*****Additional Fields***/
			jsonObj.boeamdtreq = this.boeamdtreq;
			jsonObj.boeamdtdetl = this.boeamdtdetl;
			jsonObj.defpmt = this.DefPmt;
			jsonObj.nocontshped = this.NocontShip;
			jsonObj.ujno = this.boeBEdetails.results[0].ujno;
			jsonObj.to_itemdetails = [];
			delete jsonObj.icd_igm_date;
			delete jsonObj.gatigdt;
			delete jsonObj.iwrdt;
			delete jsonObj.igmdat;
			delete jsonObj.panno;
			delete jsonObj.svbndfleno;
			delete jsonObj.bfregno;

			delete jsonObj.ieccodsel;
			delete jsonObj._shipping_line;
			delete jsonObj.to_Currencycurrcode;
			delete jsonObj.to_Currencyinr;
			delete jsonObj.to_boestatus;
			delete jsonObj.to_doctype;
			delete jsonObj.to_itemdetails;
			delete jsonObj.to_shippingdetails;
			delete jsonObj.to_Salo;
			delete jsonObj.to_dutydetails;
			delete jsonObj.to_BE_BOE;
			delete jsonObj.to_ctrl_be;
			delete jsonObj.to_swc_be;
			delete jsonObj.to_pro_be;
			delete jsonObj.to_I_RSP_BE;
			delete jsonObj.to_I_DEPB_BE;
			delete jsonObj.to_I_reimport_be;
			delete jsonObj.to_I_statemet_be;
			delete jsonObj.to_I_be_sup_doc;
			delete jsonObj.shipmentdate;
			delete jsonObj.to_I_be;
			delete jsonObj.to_I_EXCHANGE_BE;
			delete jsonObj.to_I_PERM_BE;
			delete jsonObj.to_I_CERT_BE;
			delete jsonObj.to_I_iid_ctx_be;
			delete jsonObj.to_I_HSS_BE;
			delete jsonObj.to_I_IGMS_BE;
			delete jsonObj.to_I_AMEND_BE;
			delete jsonObj.__metadata;
			return jsonObj;
		},
		StatusChange: function (oEvent) {

			this.SelVal = oEvent.mParameters.selectedItem.mProperties.key;
			/*	if (this.SelVal == 20) {
					this.boeHeaderData.doc_stat = "19";
				}
				if (this.BOEStatus >= 20) {
					this.AuthConfiguration("Display");
				}*/
			if (this.SelVal == 25) {
				this.boeHeaderData.doc_stat = "24";
			}
			if (this.BOEStatus >= 25) {
				this.AuthConfiguration("Display");
			}
			if (this.boeHeaderData.shptyp == "FCL") { //if else added by Aiswarya
				this.getView().byId("lastDateFree").setEnabled(false);
			} else {
				this.getView().byId("lastDateFree").setEnabled(true);
			}
		},

		openCMNServiceDialog: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.Unit", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			this._valueHelpDialog1.open(sInputValue);
		},
		_handleValueHelpSearch1: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"UnitOfMeasure",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},

		_handleValueHelpClose1: function (oEvent) {
			if (oEvent.getParameter("selectedItem")) {
				var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
				if (oSelectedItem) {
					var reqNoInputFrom = this.getView().byId(this.inputId);
					reqNoInputFrom.setValue(oSelectedItem);
				}
				oEvent.getSource().getBinding("items").filter([]);
			}
		},

		/** Tariff search help *************/
		/** Plant search help *************/
		_handlePlantValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpPlantDialog) {
				this._valueHelpPlantDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpPlant", this);
				this.getView().addDependent(this._valueHelpPlantDialog);
			}
			this._valueHelpPlantDialog.open(sInputValue);
		},
		handleValueHelpLclShpCd: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			if (!this._valueHelpLclShpLnCdDialog) {
				this._valueHelpLclShpLnCdDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.LoclShpLnCd", this);
				this.getView().addDependent(this._valueHelpLclShpLnCdDialog);
			}
			this._valueHelpLclShpLnCdDialog.open(sInputValue);
		},
		_handleValueHelpClose_Plant: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
			var oSelectedDesc = oEvent.getParameter("selectedItem").getDescription();
			if (oSelectedItem) {
				var vendorInput = this.getView().byId("werks");
				vendorInput.setValue(oSelectedItem);
				this.getView().byId("PlantDesc").setText(oSelectedDesc);
			}
			oEvent.getSource().getBinding("items").filter([]);
			this.InvItemData.results[this.ItemRecord].werks = oSelectedItem;
		},
		suggestionPlantItemSelected: function (oEvent) {
			var oSelectedItem;
			if (oEvent.getParameter('selectedItem')) {
				oSelectedItem = oEvent.getParameter('selectedItem').getText();
			}
			if (oSelectedItem) {
				var reqNoInputFrom = this.getView().byId("werks");
				reqNoInputFrom.setValue(oSelectedItem);
			}
		},
		_handleValueHelpSearch_Ctry: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"Country",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpSearch_Plant: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"werks",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		handleMiscValueHelp: function (oEvent) {
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpMisc) {
				this._valueHelpMisc = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.miscChrg", this);
				this.getView().addDependent(this._valueHelpMisc);
			}
			this._valueHelpMisc.open();
		},
		_handleSearchMisc: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"code",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleCloseMisc: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var _self = this;
			if (oSelectedItem) {
				var productInput = _self.getView().byId(_self.inputId);
				productInput.setValue(oSelectedItem.getTitle());
				_self.getView().byId("mc_desc").setText(evt.getParameter("selectedItem").getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/********************Fragment -Open/Serach/Close***************************************/
		handleValueHelp_No: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			var itemTemplate = new sap.m.StandardListItem();
			if (!this._Dialog) {
				this._Dialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpNo", this);
				this.getView().addDependent(this._Dialog);
			}
			if (this.InputId.includes("mc_code")) {
				itemTemplate.bindProperty("title", "BOEDOCList>code");
				itemTemplate.bindProperty("description", "BOEDOCList>description");
				//	sap.ui.getCore().byId("DocNumberList01").bindAggregation("items", "BOEDOCList>/xBRIxMiscellaneous", itemTemplate);
				sap.ui.getCore().byId("DocNumberList01").bindAggregation("items", "BOEDOCList>/xBRIxMiscellaneous", itemTemplate);
				sap.ui.getCore().byId("DocNumberList01").setTitle("Miscellaneous Charges");
			}
			this._Dialog.open(sInputValue);
		},
		getSenderId: function (oEvent) {
			var _self = this;
			this.CmnModel.read("/xBRIxce_SENDER_ID(parameter1='" + this.Chacode + "')/Set", {
				urlParameters: {
					$top: "5000"
				},
				success: function (oData) {
					if (oData.results.length > 0) {
						var IdModel = new sap.ui.model.json.JSONModel([]);
						IdModel.setData(oData);
						_self.getView().setModel(IdModel, "IdModel");
					}
				},
				error: function (response) {}
			});
		},
		handleSndrId: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			this.getSenderId();
			if (!this._valueHelpSndrId) {
				this._valueHelpSndrId = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.SndrId", this);
				this.getView().addDependent(this._valueHelpSndrId);
			}
			this._valueHelpSndrId.open(sInputValue);
			this._OpenBusyDialogNoDelay();
		},
		_handleValueHelpSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			if (this.InputId.includes("mc_code")) {
				var No_Field = "code";
			} else if (this.InputId.includes("sender_id")) {
				var No_Field = "sender_id";
			}
			var oFilter = new sap.ui.model.Filter(
				No_Field,
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpClose_Port: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
			if (oSelectedItem) {
				this.getView().byId(this.InputId).setValue(oSelectedItem);
				if (this.InputId.includes("mc_code")) {
					this.getView().byId("mc_desc").setText(oEvent.getParameter("selectedItem").getDescription());
				} else if (this.InputId.includes("loadport")) {
					this.getView().byId("PortloadDescription").setText(oEvent.getParameter("selectedItem").getDescription());
				} else if (this.InputId.includes("port")) {
					this.getView().byId("DischPortDescription").setText(oEvent.getParameter("selectedItem").getDescription());
				} else if (this.InputId.includes("icd")) {
					this.boeHeaderData.custhousname = oSelectedItem;
				} else if (this.InputId.includes("local_shipping_line")) {
					this.getView().byId("_shipping_line").setText(oEvent.getParameter("selectedItem").getDescription());
				} else if (this.InputId.includes("bndwarehousename")) {
					this.getView().byId("warehouse_name").setText(oEvent.getParameter("selectedItem").getDescription());
				} else if (this.InputId.includes("sender_id")) {
					this.getView().byId("chacod").setValue(oEvent.getParameter("selectedItem").getDescription());
				}
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		/**************************************** calculate sum of no packs/Gross weight **********************/
		CalculateSum: function (oEvent) {
			var id;
			if (oEvent.getId() == "routePatternMatched") {
				id = oEvent.getId();
			} else {
				id = oEvent.getSource().getId();
				if (id.includes("packs")) {
					this.InvItemData.results[this.ItemRecord].packs = oEvent.getSource().getValue();
				} else if (id.includes("invgrwt")) {
					this.InvItemData.results[this.ItemRecord].invgrwt = oEvent.getSource().getValue();
				}
			}

			var TotalNoPack = 0;
			var TotalGweight = 0;
			for (var i = 0; i < this.InvItemData.results.length; i++) {
				if (id.includes("packs")) {
					TotalNoPack = parseFloat(TotalNoPack) + parseFloat(this.InvItemData.results[i].packs);
				} else if (id.includes("invgrwt")) {
					TotalGweight = parseFloat(TotalGweight) + parseFloat(this.InvItemData.results[i].invgrwt);
				} else if (id.includes("routePatternMatched")) {
					TotalNoPack = parseFloat(TotalNoPack) + parseFloat(this.InvItemData.results[i].packs);
					TotalGweight = parseFloat(TotalGweight) + parseFloat(this.InvItemData.results[i].invgrwt);
				}
			}
			TotalGweight = TotalGweight.toFixed(3);
			if (id.includes("packs")) {
				this.getView().byId("header_packs").setValue(TotalNoPack);
			} else if (id.includes("invgrwt")) {
				this.getView().byId("grswght").setValue(TotalGweight);
			} else if (id.includes("routePatternMatched")) {
				this.getView().byId("header_packs").setValue(TotalNoPack);
				this.getView().byId("grswght").setValue(TotalGweight);
				this.boeHeaderData.packs = "" + TotalNoPack + "";
				this.boeBEdetails.results[0].grswght = "" + TotalGweight + "";
			}
		},
		/**** item details update **********/
		CalculateAmount: function (oEvent) {
			this.LicenceItemData.results[0].alloqty = oEvent.getSource().getValue();
			this.getView().getModel("boeAllocationDetails").refresh();
		},
		OnBenefitSelection: function (oEvent) {
			this.bnftType = oEvent.getSource().getSelectedKey();
			this.getView().byId("Idtracknoedit").setValue("");
			var ItemCodes = oEvent.getSource().getParent().getCells()[0].data("Docitem").split(",");
			this.Docitem = ItemCodes[0]
			this.Lineitem = ItemCodes[1];
			this.LicenceItemData.results.filter(a => a.docitem == this.Docitem && a.lineitem == this.Lineitem)[0].bnftyp = oEvent.getSource()
				.getSelectedKey();
		},
		PressDutyProtest: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].protdty = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressAsset: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].anln1 = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressAntDubm: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].andumpdty = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressSubno: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].anln2 = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		/**** goods details update **********/
		PressPackDesc: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].packdesc = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressPackMarks: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].packmark = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressPackNo: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].packno = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressGRitcNo: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].ritcno = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		/****Quantity update *****************/
		PressQuantity: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].menge = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressQuantityUOM: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].meins = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressDelQty: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].delqty = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressDelQtyUOM: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].del_uom = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressRecQty: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].recqty = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressRecQtyUOM: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].rec_uom = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		pressUllQty: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].ullqty = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		pressUllQtyUOM: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].ull_uom = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressAgenCommVal: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].agcomm = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressAgenCurrVal: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].agc_curr = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressInsAmountVal: function (oEvent) {
			if (this.getView().byId("insuamt").getValue() == "") {
				this.getView().byId("insuamt").setValue("0");
			} else if (this.InvItemData.results[this.ItemRecord].insu_curr == "") {
				MessageBox.error("Please select insurance currency before entering insurance amount");
				this.getView().byId("insuamt").setValue("0");
				return false;
			}
			this.InvItemData.results[this.ItemRecord].insuamt = oEvent.getSource().getValue();
			this.CalculateAssDtyVal();
		},
		PressInsCurrVal: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].insu_curr = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressAddChrgVal: function (oEvent) {
			if (this.getView().byId("add_load_amt").getValue() == "") {
				this.getView().byId("add_load_amt").setValue("0");
			} else if (this.InvItemData.results[this.ItemRecord].add_aload_amt_curr == "") {
				MessageBox.error("Please select Add. Load. Cahrge currency before entering amount");
				this.getView().byId("add_load_amt").setValue("0");
				return false;
			}
			this.InvItemData.results[this.ItemRecord].add_load_amt = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
			this.CalculateAssDtyVal();
		},
		PressHssChrgVal: function (oEvent) {
			if (this.getView().byId("hssloadamt").getValue() == "") {
				this.getView().byId("hssloadamt").setValue("0");
			} else if (this.InvItemData.results[this.ItemRecord].hssloadamt_curr == "") {
				MessageBox.error("Please select HSS Load currency before entering amount");
				this.getView().byId("hssloadamt").setValue("0");
				return false;
			}
			this.InvItemData.results[this.ItemRecord].hssloadamt = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
			this.CalculateAssDtyVal();
		},
		PressmiscChrgVal: function (oEvent) {
			if (this.getView().byId("misschar").getValue() == "") {
				this.getView().byId("misschar").setValue("0");
			} else if (this.InvItemData.results[this.ItemRecord].msc_curr == "") {
				MessageBox.error("Please select Misc. Charge currency before entering amount");
				this.getView().byId("misschar").setValue("0");
				return false;
			}
			this.InvItemData.results[this.ItemRecord].misschar = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
			this.CalculateAssDtyVal();
		},
		PressFreightVal: function (oEvent) {
			if (this.getView().byId("frgtamt").getValue() == "") {
				this.getView().byId("frgtamt").setValue("0");
			} else if (this.InvItemData.results[this.ItemRecord].frgt_curr == "") {
				MessageBox.error("Please select freight Currency before entering freight amount");
				this.getView().byId("frgtamt").setValue("0");
				return false;
			}
			this.InvItemData.results[this.ItemRecord].frgtamt = oEvent.getSource().getValue();
			this.CalculateAssDtyVal();
			/* var oparameters = {
   doctyp: "Y",
   docno: "3000000004"
  };
  this.getOwnerComponent().getModel("BOEDOCList").callFunction("/boestat", {
   method: "POST",
   urlParameters: oparameters,
   success: function (oData, response) {
    console.log(response);
   },
   error: function (oError) {
    console.log(oError);
   }
  });
*/
		},
		convertToSAPdate: function (value) {
			if (value) {
				if (value instanceof Date) {
					var NewDateform = value;
				} else {}
				var mnth = ("0" + (NewDateform.getMonth() + 1)).slice(-2);
				var day = ("0" + NewDateform.getDate()).slice(-2);
				var output = [NewDateform.getFullYear(), mnth, day].join("-") + "T00:00:00";
				return output;
			}
		},

		PressFreightCurr: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].frgt_curr = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},

		PressmiscCurrVal: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].msc_curr = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressNpExgRat: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].net_exch = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressFrExgRat: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].frgt_exch = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressInsExgRat: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].insu_exch = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressAgeExgRat: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].agc_exch = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressMiscExgRat: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].msc_exch = oEvent.getSource().getValue();
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate1: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].lcldocrtdt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource().getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate451: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].lccustpodt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource().getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate452: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].lcinvdt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource().getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		handleChangeManDt: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.ProductionInfo.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].datofmanu = oEvent.getSource().getValue() ?
				oEvent.getSource().getValue() : null;
			this.getView().getModel("ProductionInfo").refresh();
		},
		handleChangeExpDt: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.ProductionInfo.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].datofexp = oEvent.getSource().getValue() ?
				oEvent.getSource().getValue() : null;
			this.getView().getModel("ProductionInfo").refresh();
		},
		handleChangeBEDate: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.I_DEPB_BE_Info.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].bedate = oEvent.getSource().getValue() ?
				oEvent.getSource().getValue() : null;
			this.getView().getModel("I_DEPB_BE_Info").refresh();
		},
		handleChangeWDDate: function (oEvent) {
			this.boeBEdetails.results[0].whbedt = oEvent.getSource().getValue() ? oEvent.getSource().getValue() : null;
		},
		handleChangeUJDate: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.I_statemet_be_Info.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].ujdate = oEvent.getSource().getValue() ?
				oEvent.getSource().getValue() : null;
			this.getView().getModel("I_statemet_be_Info").refresh();
		},
		handleChangeDclDate: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.I_statemet_be_Info.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].dcldt = oEvent.getSource().getValue() ?
				oEvent.getSource().getValue() : null;
			this.getView().getModel("I_statemet_be_Info").refresh();
		},
		handleChangeDIDate: function (oEvent) {
			//	var currentRow = oEvent.getSource().getParent().sId.slice(-1);
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.I_be_sup_doc_Info.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].docissuedate = oEvent.getSource().getValue() ?
				oEvent.getSource().getValue() : null;
			this.getView().getModel("I_be_sup_doc_Info").refresh();
		},
		handleChangeDExDate: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.I_be_sup_doc_Info.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].docexpirydate = oEvent.getSource().getValue() ?
				oEvent.getSource().getValue() : null;
			this.getView().getModel("I_be_sup_doc_Info").refresh();
		},
		handleChangeReBEDate: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.I_reimport_be_Info.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].bedate = oEvent.getSource().getValue() ?
				oEvent.getSource().getValue() : null;
			this.getView().getModel("I_reimport_be_Info").refresh();
		},
		handleChangeSHPDate: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.I_reimport_be_Info.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].shipbdat = oEvent.getSource().getValue() ?
				oEvent.getSource().getValue() : null;
			this.getView().getModel("I_reimport_be_Info").refresh();
		},
		handleChangeBstBfrDt: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.ProductionInfo.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].bstbfr = oEvent.getSource().getValue() ?
				oEvent.getSource().getValue() : null;
			this.getView().getModel("ProductionInfo").refresh();
		},
		handleChangeStrtDt: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.ControlInfo.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].cntsrtdt = oEvent.getSource().getValue() ?
				oEvent
				.getSource().getValue() : null;
			this.getView().getModel("ControlInfo").refresh();
		},
		handleChangeCerDt: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.boeExchgDetails.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].cerdt = oEvent.getSource().getValue() ?
				oEvent.getSource().getValue() : null;
			this.getView().getModel("boeExchgDetails").refresh();
		},
		handleChangeCerDtData: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.boeCetDetails.results[currentRow].cetdt = oEvent.getSource().getValue() ? oEvent.getSource().getValue() : null;
			this.getView().getModel("boeCetDetails").refresh();
		},
		handleChangeCertDt: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.ControlInfo.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].cntsrtdt = oEvent.getSource().getValue() ?
				oEvent
				.getSource().getValue() : null;
			this.getView().getModel("ControlInfo").refresh();
		},
		handleChangeEndDt: function (oEvent) {
			var currentRow = oEvent.getSource().getParent().getIndex();
			this.ControlInfo.results.filter(a => a.boeitno == this.boeItemnumber)[currentRow].cntenddt = oEvent.getSource().getValue() ?
				oEvent
				.getSource().getValue() : null;
			this.getView().getModel("ControlInfo").refresh();
		},
		PressLocalDate2: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].lclshpcrdt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource().getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate3: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].locvehicleloadmtdt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource()
				.getValue()) : null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate4: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].locvehicleplacemtdt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource()
				.getValue()) : null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate5: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].locvehiclereachmtdt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource()
				.getValue()) : null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate6: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].locvehicleunloadmtdt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource()
				.getValue()) : null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate7: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].plncontowrhsdt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource()
					.getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate789: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].pbedt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource().getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate65: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].podate = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource().getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate66: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].lcdt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource().getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate67: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].contdt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource().getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate8: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].actcontowrhsdt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource()
					.getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate9: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].goodrecieptdat = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource()
					.getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate10: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].dateofemptycont = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource()
				.getValue()) : null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate40: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].svborderdate = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource().getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate41: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].finalassmtdate = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource()
					.getValue()) :
				null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		PressLocalDate42: function (oEvent) {
			this.InvItemData.results[this.ItemRecord].undrprtstpmntreqdt = oEvent.getSource().getValue() ? this.formattoSAPdate(oEvent.getSource()
				.getValue()) : null;
			this.getView().getModel("boeItemdatadetails").refresh();
		},
		/********** track number search help & close **********/
		/**************************************************/
		_handleTrackValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			this.CurrentRowObj = oEvent.getSource();
			var BnftTyp;
			var ItemCodes = this.getView().byId(this.inputId).data("Docitem").split(",");
			this.Docitem = ItemCodes[0]
			this.Lineitem = ItemCodes[1];
			var Matnr = this.getView().byId("matnr").getValue();
			var _self = this;
			var filters = new Array();
			var filterval;
			if ((oEvent.getSource().getParent().getCells()[0].getSelectedKey()).includes("MEIS")) {
				BnftTyp = "MEIS";
				filterval = new sap.ui.model.Filter("bnftyp", sap.ui.model.FilterOperator.Contains, BnftTyp);
			} else if ((oEvent.getSource().getParent().getCells()[0].getSelectedKey()).includes("ADVANCE LICENCE") || (oEvent.getSource().getParent()
					.getCells()[0].getSelectedKey()).includes(
					"DFL")) {
				BnftTyp = "DFL";
				filterval = new sap.ui.model.Filter("bnftyp", sap.ui.model.FilterOperator.EQ, BnftTyp);
			} else if ((oEvent.getSource().getParent().getCells()[0].getSelectedKey()).includes("EXPORT PROMOTION CAPITAL GOODS") || (oEvent.getSource()
					.getParent().getCells()[0].getSelectedKey()).includes("EPCG")) {
				BnftTyp = "EPCG";
				filterval = new sap.ui.model.Filter("bnftyp", sap.ui.model.FilterOperator.EQ, BnftTyp);
			} else if ((oEvent.getSource().getParent().getCells()[0].getSelectedKey()).includes("RODTEP LICENCE") || (oEvent.getSource()
					.getParent().getCells()[0].getSelectedKey()).includes("RODT")) {
				BnftTyp = "RODT";
				filterval = new sap.ui.model.Filter("bnftyp", sap.ui.model.FilterOperator.EQ, BnftTyp);
			} else if ((oEvent.getSource().getParent().getCells()[0].getSelectedKey()).includes("RoSCTL LICENCE") || (oEvent.getSource()
					.getParent().getCells()[0].getSelectedKey()).includes("ROSC")) {
				BnftTyp = "ROSC";
				filterval = new sap.ui.model.Filter("bnftyp", sap.ui.model.FilterOperator.EQ, BnftTyp);
			}
			filters.push(filterval);
			var sorters = new Array();
			var sortval = new sap.ui.model.Sorter("trkno", true, false);
			sorters.push(sortval);
			var oModelData = new sap.ui.model.json.JSONModel();

			//BnftTyp = oEvent.getSource().getParent().getCells()[0].getSelectedKey();

			var paramTrackNo = this.InvItemData.results[this.ItemRecord].pono + "ZZZ" + this.InvItemData.results[this.ItemRecord].matnr +
				"ZZZ" +
				BnftTyp;

			this.BoeModel.read("/xBRIxce_iid_ibsmaster(param1='" + paramTrackNo + "')/Set", {
				urlParameters: {
					"$top": "5000"
				},
				success: function (getData) {
					var FilterRecord = {
						results: []
					};
					if (getData) {
						oModelData.setData(getData);
						_self.getView().setModel(oModelData, "TrackNoList");
						if (!_self._valueHelpTrackNoDialog) {
							_self._valueHelpTrackNoDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpTrackNo", _self);
							_self.getView().addDependent(_self._valueHelpTrackNoDialog);
						}

						_self._valueHelpTrackNoDialog.open(sInputValue);
						_self._OpenBusyDialogNoDelay();

					}
				},
				error: function (error) {
					console.log("error");
				}
			});

		},
		SetPermissionCode: function (oEvent, PermCode) {
			var SelVal = oEvent.mParameters.selectedItem.mProperties.key;
			if (SelVal == "Y") {
				if (PermCode == "S48") {
					this.getView().byId("permcode").setValue("S48");
				} else {
					this.getView().byId("permcode").setValue("FCK");
				}
				this.byId("tab_permission").setVisible(true);
			} else if (this.boeBEdetails.results[0].secreq == "Y" && this.docType != "E") {
				this.getView().byId("permcode").setValue("S48");
				this.byId("tab_permission").setVisible(true);
			} else if (this.boeBEdetails.results[0].fcr == "Y" && this.docType != "E") {
				this.getView().byId("permcode").setValue("FCK");
				this.byId("tab_permission").setVisible(true);
			} else {
				this.getView().byId("permcode").setValue("");
				this.byId("tab_permission").setVisible(false);
			}
		},
		_handleValueHelpSearch_Port: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"codtyp",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpSearch_LnCd: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"lifnr",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpSearch_BndCd: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"param1",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpSearch_TrackNo: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"bsno",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		AddNewRowAllo: function () {
			var localthis = this;
			var jsonLicence = {};
			var FilterRecord = {
				results: []
			};
			FilterRecord.results = localthis.LicenceItemData.results.filter(a => a.docitem == localthis.boeItemnumber);
			localthis.LicenceItemData.results = localthis.LicenceItemData.results.filter(function (val) {
				return FilterRecord.results.indexOf(val) == -1;
			});
			jsonLicence.actdty = localthis.InvItemData.results[localthis.ItemRecord].totdtyval;
			jsonLicence.assval = localthis.InvItemData.results[localthis.ItemRecord].assval;
			jsonLicence.cifval = localthis.InvItemData.results[localthis.ItemRecord].cifvlrs;
			jsonLicence.meins = localthis.InvItemData.results[localthis.ItemRecord].meins;
			jsonLicence.totdty = localthis.InvItemData.results[localthis.ItemRecord].totdtyval;
			jsonLicence.alloqty = localthis.InvItemData.results[localthis.ItemRecord].menge;
			jsonLicence.totqty = localthis.InvItemData.results[localthis.ItemRecord].menge;
			jsonLicence.benefitamt = "0.000";
			jsonLicence.doccat = "BOE";
			jsonLicence.doctyp = localthis.docType;
			jsonLicence.docitem = localthis.boeItemnumber; //refdocnr;refdocit Replaced Refdocnr to iteno as said by shani
			jsonLicence.lineitem = "1";
			jsonLicence.docnr = localthis.docNumber;
			jsonLicence.menge = localthis.InvItemData.results[localthis.ItemRecord].menge;
			jsonLicence.matnr = localthis.InvItemData.results[localthis.ItemRecord].matnr;
			jsonLicence.bnftyp = "";
			jsonLicence.Split = "X";
			localthis.LicenceItemData.results.push(jsonLicence);
			var oModelItemLicence = new sap.ui.model.json.JSONModel([]);
			oModelItemLicence.setData(localthis.LicenceItemData);
			localthis.getView().setModel(oModelItemLicence, "boeAllocationDetails");
			localthis.getView().getModel("boeAllocationDetails").refresh();
			var oTable, binding, sFilter;
			oTable = this.getView().byId("idLICAllocEdit");
			binding = oTable.getBinding('rows');
			sFilter = new sap.ui.model.Filter("docitem", sap.ui.model.FilterOperator.EQ, this.boeItemnumber);
			binding.filter([sFilter]);
			if (this.byId("idSwtichMode").getState() == true) {
				var EnabledItemModel = new sap.ui.model.json.JSONModel({
					enable: true
				});
				this.getView().setModel(EnabledItemModel, "StateItem");
				/*******IF clearance type is HSP - Enable Additional Loading and HSS Load *******/
				if (this.boeHeaderData.clearance_type == "HSP") {
					this.getView().byId("hssloadamt").setEnabled(true);
					this.getView().byId("hssloadamt_curr").setEnabled(true);
					this.getView().byId("add_load_amt").setEnabled(true);
					this.getView().byId("add_aload_amt_curr").setEnabled(true);
				}
			}
		},
		onReAllocateFun: function () {
			var localthis = this;
			debugger;
			MessageBox.confirm("Changes Cannot be Reversed. Do You Still Want to Reallocate ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						localthis._OpenBusyDialog();
						localthis.BoeModel.read("/xBRIxCE_REALLOCATE(doccat='BOE',docnr='" + localthis.docNumber +
							"',docitem='" + localthis.boeItemnumber + "')/Set", {
								success: function (oData) {
									MessageBox.success("Reallocated successfully", {
										actions: [sap.m.MessageBox.Action.OK],
										onClose: function (oAction) {
											if (oAction === sap.m.MessageBox.Action.OK) {
												localthis.AddNewRowAllo();
												localthis.Reallocated = true;
												localthis.CalcItemTotalActualDuty();
												localthis.CalcActualTotalDuty();
												localthis._CloseBusyDialog();
											}
										}
									});
								},
								error: function (response) {
									localthis._CloseBusyDialog();
								}
							});
					}
				}
			});
		},
		_handleValueHelpClose_TrackNo: function (oEvent) {
			var _self = this;
			if (oEvent.getParameter("selectedItem")) {
				var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
				var TrackDescription = oEvent.getParameter("selectedItem").getDescription();
				if (oSelectedItem) {
					/*********/
					if (this.LicenceItemData.results.filter(a => a.docitem == this.boeItemnumber)[0].trackno == oSelectedItem) {
						MessageBox.error("The selected Benefit Number is already used for this BoE Item");
					} else {
						var Input = this.getView().byId(this.inputId);
						Input.setValue(oSelectedItem);
						this.SelBnfNo = oSelectedItem;
						this.CurrentRowObj.getParent().getCells()[10].setText(this.formatDate(oEvent.getParameter("selectedItem").getInfo()));
						this.trackdt = oEvent.getParameter("selectedItem").getInfo();
						var SplitDescr = TrackDescription.split(",");
						var UnitPrice = SplitDescr[1].split(":");
						//	var CIFval = SplitDescr[2].split(":");
						var ActualScheme = SplitDescr[0].split(":");
						//this.BenefitAmount = parseFloat(CIFval[1]);
						this.BenefitQuantity = parseFloat(UnitPrice[1]);
						this.ActualSchemeNo = ActualScheme[1].toString();
						this.getView().byId(this.inputId).getParent().getCells()[2].setValue(this.ActualSchemeNo);
						for (var i = 0; i < this.LicenceItemData.results.length; i++) {
							if (this.LicenceItemData.results[i].docitem == this.Docitem && this.LicenceItemData.results[i].lineitem == this.Lineitem) {
								this.RecordNo = i;
							}
						}
						this.LicenceItemData.results[this.RecordNo].trackno = oSelectedItem;
						this.LicenceItemData.results[this.RecordNo].benno = oSelectedItem;
						this.LicenceItemData.results[this.RecordNo].bnftyp = this.bnftType;
						var val = oEvent.getParameter("selectedItem").getInfo().split("/");
						if (val) {
							var year = val[2];
							var month = val[1];
							var day = val[0];
							this.LicenseDate = year + "-" + month + "-" + day + "T00:00:00";
						}
						var SGD_ADD_Rt = 0;
						if (this.DutyItemDataLocal.results.filter(a => a.dutcode == "SGD" && a.boeitno == this.boeItemnumber).length > 0) {
							SGD_ADD_Rt = this.DutyItemDataLocal.results.filter(a => a.dutcode == "SGD" && a.boeitno == this.boeItemnumber)[0].actvalu;
						} else if (this.DutyItemDataLocal.results.filter(a => a.dutcode == "ADD" && a.boeitno == this.boeItemnumber).length > 0) {
							SGD_ADD_Rt = this.DutyItemDataLocal.results.filter(a => a.dutcode == "ADD" && a.boeitno == this.boeItemnumber)[0].actvalu;
						}
						this.SGD_ADD_Rt = SGD_ADD_Rt;

						/*	MessageBox.confirm(
								"Do you want to fully utilise available unit '" + this.BenefitQuantity + "'?", {
									title: "Confirm",
									actions: [sap.m.MessageBox.Action.YES,
										sap.m.MessageBox.Action.NO
									],
									onClose: function (oAction) {
										if (oAction === sap.m.MessageBox.Action.YES) {

											_self.LicParam1 = _self.InvItemData.results[_self.ItemRecord].cifvlrs + "ZZZ" + _self.LicenceItemData.results[_self.RecordNo]
												.totdty +
												"ZZZ" + _self.InvItemData.results[_self.ItemRecord].menge + "ZZZ" + _self.InvItemData.results[_self.ItemRecord].assval +
												"ZZZ" +
												_self.InvItemData.results[_self.ItemRecord].fta_entitled + "ZZZ" + _self.InvItemData.results[_self.ItemRecord].fta_num +
												"ZZZ" +
												_self.InvItemData.results[_self.ItemRecord].ftaslno + "ZZZ" + _self.InvItemData.results[_self.ItemRecord].assval;

											_self.LicParam2 = oSelectedItem + "ZZZ" + _self.InvItemData.results[_self.ItemRecord].matnr + "ZZZ" + _self.bnftType +
												"ZZZ" +
												_self
												.InvItemData
												.results[_self.ItemRecord].pono + "ZZZ" + _self.InvItemData.results[_self.ItemRecord]
												.po_itm_no +
												"ZZZ" + _self.InvItemData.results[_self.ItemRecord].randd_applicability + "ZZZ" + _self.InvItemData.results[_self.ItemRecord]
												.randd_notifctn_no +
												"ZZZ" + _self.InvItemData.results[_self.ItemRecord].randd_serialno;

											_self.LicParam3 = _self.docNumber + "ZZZBOEZZZ" + _self.InvItemData.results[_self.ItemRecord].meins + "ZZZ" + _self.LicenceItemData
												.results[
													_self.RecordNo].docitem + "ZZZ" + _self.LicenceItemData.results[_self.RecordNo].lineitem + "ZZZ" + SGD_ADD_Rt + "ZZZ" +
												_self.BenefitQuantity;
											//var localthis = this;
											_self.resetparam = false;
											_self.LicenseAllocationFun();
										} else {
											if (!_self.bnftDialog) {
												_self.bnftDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogConfirmBNFT", _self);
												_self.getView().addDependent(_self.bnftDialog);
											}
											_self.bnftDialog.open();
											sap.ui.getCore().byId("bnftamt").setValue(_self.BenefitQuantity);
										}
									}
								});*/

						// _self.LicParam1 = _self.InvItemData.results[_self.ItemRecord].cifvlrs + "ZZZ" + _self.LicenceItemData.results[_self.RecordNo]
						// 	.totdty +
						// 	"ZZZ" + _self.InvItemData.results[_self.ItemRecord].menge + "ZZZ" + _self.InvItemData.results[_self.ItemRecord].assval +
						// 	"ZZZ" +
						// 	_self.InvItemData.results[_self.ItemRecord].fta_entitled + "ZZZ" + _self.InvItemData.results[_self.ItemRecord].fta_num +
						// 	"ZZZ" +
						// 	_self.InvItemData.results[_self.ItemRecord].ftaslno + "ZZZ" + _self.InvItemData.results[_self.ItemRecord].assval;
						_self.srnoftanum = _self.InvItemData.results[_self.ItemRecord].fta_num;
						_self.srnoftaslno = _self.InvItemData.results[_self.ItemRecord].ftaslno;

						_self.LicParam1 = _self.CurrentRowObj.getParent().getCells()[5].getText() + "ZZZ" + _self.LicenceItemData.results[_self.RecordNo]
							.totdty +
							"ZZZ" + _self.CurrentRowObj.getParent().getCells()[3].getValue() + "ZZZ" + _self.CurrentRowObj.getParent().getCells()[6].getText() +
							"ZZZ" +
							_self.InvItemData.results[_self.ItemRecord].fta_entitled + "ZZZ" + encodeURIComponent(_self.srnoftanum) +
							"ZZZ" +
							encodeURIComponent(_self.srnoftaslno) + "ZZZ" + _self.InvItemData.results[_self.ItemRecord].assval;

						_self.LicParam2 = oSelectedItem + "ZZZ" + _self.InvItemData.results[_self.ItemRecord].matnr + "ZZZ" + _self.bnftType +
							"ZZZ" +
							_self
							.InvItemData
							.results[_self.ItemRecord].pono + "ZZZ" + _self.InvItemData.results[_self.ItemRecord]
							.po_itm_no +
							"ZZZ" + _self.InvItemData.results[_self.ItemRecord].randd_applicability + "ZZZ" + _self.InvItemData.results[_self.ItemRecord]
							.randd_notifctn_no +
							"ZZZ" + _self.InvItemData.results[_self.ItemRecord].randd_serialno;

						_self.LicParam3 = _self.docNumber + "ZZZBOEZZZ" + _self.InvItemData.results[_self.ItemRecord].meins + "ZZZ" + _self.LicenceItemData
							.results[
								_self.RecordNo].docitem + "ZZZ" + _self.LicenceItemData.results[_self.RecordNo].lineitem + "ZZZ" + SGD_ADD_Rt + "ZZZ" +
							_self.BenefitQuantity;
						//var localthis = this;
						_self.resetparam = false;
						_self.LicenseAllocationFun();

					}
					oEvent.getSource().getBinding("items").filter([]);
				}
			}
		},
		handlePressBNFTOK: function (oEvent) {
			this.BenefitQuantity = sap.ui.getCore().byId("bnftamt").getValue();
			this.bnftDialog.close();

			// this.LicParam1 = this.InvItemData.results[this.ItemRecord].cifvlrs + "ZZZ" + this.LicenceItemData.results[this.RecordNo].totdty +
			// 	"ZZZ" + this.InvItemData.results[this.ItemRecord].menge + "ZZZ" + this.InvItemData.results[this.ItemRecord].assval + "ZZZ" +
			// 	this.InvItemData.results[this.ItemRecord].fta_entitled + "ZZZ" + this.InvItemData.results[this.ItemRecord].fta_num + "ZZZ" +
			// 	this.InvItemData.results[this.ItemRecord].ftaslno + "ZZZ" + this.InvItemData.results[this.ItemRecord].assval;
			_self.srnoftanum = _self.InvItemData.results[_self.ItemRecord].fta_num;
			_self.srnoftaslno = _self.InvItemData.results[_self.ItemRecord].ftaslno;

			this.LicParam1 = _self.CurrentRowObj.getParent().getCells()[5].getText() + "ZZZ" + this.LicenceItemData.results[this.RecordNo].totdty +
				"ZZZ" + this.CurrentRowObj.getParent().getCells()[3].getValue() + "ZZZ" + _self.CurrentRowObj.getParent().getCells()[6].getText() +
				"ZZZ" +
				this.InvItemData.results[this.ItemRecord].fta_entitled + "ZZZ" + encodeURIComponent(_self.srnoftanum) + "ZZZ" +
				encodeURIComponent(_self.srnoftaslno) + "ZZZ" + this.InvItemData.results[this.ItemRecord].assval;

			this.LicParam2 = this.SelBnfNo + "ZZZ" + this.InvItemData.results[this.ItemRecord].matnr + "ZZZ" + this.bnftType + "ZZZ" +
				this
				.InvItemData
				.results[this.ItemRecord].pono + "ZZZ" + this.InvItemData.results[this.ItemRecord]
				.po_itm_no +
				"ZZZ" + this.InvItemData.results[this.ItemRecord].randd_applicability + "ZZZ" + this.InvItemData.results[this.ItemRecord].randd_notifctn_no +
				"ZZZ" + this.InvItemData.results[this.ItemRecord].randd_serialno;
			this.LicParam3 = this.docNumber + "ZZZBOEZZZ" + this.InvItemData.results[this.ItemRecord].meins + "ZZZ" + this.LicenceItemData
				.results[
					this.RecordNo].docitem + "ZZZ" + this.LicenceItemData.results[this.RecordNo].lineitem + "ZZZ" + this.SGD_ADD_Rt + "ZZZ" + this.BenefitQuantity;
			this.LicenseAllocationFun();
		},
		LicenseAllocationFun: function () {
			var _self = this;
			var localthis = this;
			this.BoeModel.read("/xBRIxCE_License_Alocation(param1='" + this.LicParam1 + "',param2='" + this.LicParam2 +
				"',param3='" + this.LicParam3 + "')/Set", {
					success: function (oData) {
						if (oData.results.length > 0) {
							if (oData.results[0].message != "") {
								MessageBox.error(oData.results[0].message);
								localthis.LicenceItemData.results[localthis.RecordNo].trackdt = "";
								localthis.LicenceItemData.results[localthis.RecordNo].trackno = "";
							} else {
								localthis.getView().byId(localthis.inputId).getParent().getCells()[2].setValue(localthis.ActualSchemeNo);
								for (var i = 0; i < oData.results.length > 0; i++) {
									delete oData.results[i].param1;
									delete oData.results[i].param2;
									delete oData.results[i].param3;
									delete oData.results[i].dbtqnty;
									delete oData.results[i].dbtuofm;
									delete oData.results[i].dbtvlu;
									delete oData.results[i].itmsrnolcs;
									delete oData.results[i].lcsregprt;
									delete oData.results[i].Parameters;
									if (i == 0) {
										localthis.resetparam = true;
										localthis.LicenceItemData.results[localthis.RecordNo].actdty = oData.results[i].actdty;
										localthis.LicenceItemData.results[localthis.RecordNo].actual_scheme_no = oData.results[i].actual_scheme_no;
										localthis.LicenceItemData.results[localthis.RecordNo].actual_track_no = oData.results[i].actual_track_no;
										localthis.LicenceItemData.results[localthis.RecordNo].adduty = oData.results[i].adduty;
										localthis.LicenceItemData.results[localthis.RecordNo].alloqty = oData.results[i].alloqty;
										localthis.LicenceItemData.results[localthis.RecordNo].andumpdty = oData.results[i].andumpdty;
										localthis.LicenceItemData.results[localthis.RecordNo].anln1 = oData.results[i].anln1;
										localthis.LicenceItemData.results[localthis.RecordNo].anln2 = oData.results[i].anln2;
										localthis.LicenceItemData.results[localthis.RecordNo].assval = oData.results[i].assval;
										localthis.LicenceItemData.results[localthis.RecordNo].benclass = oData.results[i].benclass;
										localthis.LicenceItemData.results[localthis.RecordNo].doctyp = localthis.docType;
										localthis.LicenceItemData.results[localthis.RecordNo].benefitamt = oData.results[i].benefitamt;
										localthis.LicenceItemData.results[localthis.RecordNo].benno = oData.results[i].trackno;
										localthis.LicenceItemData.results[localthis.RecordNo].bgamtlc = oData.results[i].bgamtlc;
										localthis.LicenceItemData.results[localthis.RecordNo].bgno = oData.results[i].bgno;
										localthis.LicenceItemData.results[localthis.RecordNo].bnkguarno = oData.results[i].bnkguarno;
										localthis.LicenceItemData.results[localthis.RecordNo].bondno = oData.results[i].bondno;
										localthis.LicenceItemData.results[localthis.RecordNo].bondregnno = oData.results[i].bondregnno;
										localthis.LicenceItemData.results[localthis.RecordNo].bondvalu = oData.results[i].bondvalu;
										localthis.LicenceItemData.results[localthis.RecordNo].bukrs = oData.results[i].bukrs;
										localthis.LicenceItemData.results[localthis.RecordNo].cifval = oData.results[i].cifval;
										localthis.LicenceItemData.results[localthis.RecordNo].cthno = oData.results[i].cthno;
										localthis.LicenceItemData.results[localthis.RecordNo].cukyfc = oData.results[i].cukyfc;
										localthis.LicenceItemData.results[localthis.RecordNo].cukyrs = oData.results[i].cukyrs;
										localthis.LicenceItemData.results[localthis.RecordNo].depbdty = oData.results[i].depbdty;
										localthis.LicenceItemData.results[localthis.RecordNo].depbval = oData.results[i].depbval;
										localthis.LicenceItemData.results[localthis.RecordNo].doccat = oData.results[i].doccat;
										localthis.LicenceItemData.results[localthis.RecordNo].docitem = oData.results[i].docitem;
										localthis.LicenceItemData.results[localthis.RecordNo].docnr = oData.results[i].docnr;
										localthis.LicenceItemData.results[localthis.RecordNo].document_no = oData.results[i].document_no;
										localthis.LicenceItemData.results[localthis.RecordNo].dty_saved = oData.results[i].dty_saved;
										localthis.LicenceItemData.results[localthis.RecordNo].fiscal_year = oData.results[i].fiscal_year;
										localthis.LicenceItemData.results[localthis.RecordNo].licbonddt = oData.results[i].licbonddt;
										localthis.LicenceItemData.results[localthis.RecordNo].licbondno = oData.results[i].licbondno;
										localthis.LicenceItemData.results[localthis.RecordNo].lineitem = oData.results[i].lineitem;
										localthis.LicenceItemData.results[localthis.RecordNo].matkl = oData.results[i].matkl;
										localthis.LicenceItemData.results[localthis.RecordNo].matldes = oData.results[i].matldes;
										localthis.LicenceItemData.results[localthis.RecordNo].matnr = oData.results[i].matnr;
										localthis.LicenceItemData.results[localthis.RecordNo].meins = oData.results[i].meins;
										localthis.LicenceItemData.results[localthis.RecordNo].menge = oData.results[i].menge;
										localthis.LicenceItemData.results[localthis.RecordNo].natdtycod = oData.results[i].natdtycod;
										localthis.LicenceItemData.results[localthis.RecordNo].port = oData.results[i].port;
										localthis.LicenceItemData.results[localthis.RecordNo].post_status = oData.results[i].post_status;
										localthis.LicenceItemData.results[localthis.RecordNo].protdty = oData.results[i].protdty;
										localthis.LicenceItemData.results[localthis.RecordNo].siono = oData.results[i].siono;
										localthis.LicenceItemData.results[localthis.RecordNo].totdty = oData.results[i].totdty;
										localthis.LicenceItemData.results[localthis.RecordNo].trackdt = localthis.LicenseDate ? localthis.LicenseDate : null;;
										localthis.LicenceItemData.results[localthis.RecordNo].trackno = oData.results[i].trackno;
										localthis.LicenceItemData.results[localthis.RecordNo].uom = oData.results[i].uom;
										localthis.LicenceItemData.results[localthis.RecordNo].waers_inr = oData.results[i].waers_inr;
										localthis.LicenceItemData.results[localthis.RecordNo].actual_scheme_no = localthis.ActualSchemeNo;
									} else {
										oData.results[i].Split = "X";
										oData.results[i].doctyp = localthis.docType;
										localthis.LicenceItemData.results.push(oData.results[i]);
										localthis.Split = true;
									}
								}
								if (localthis.LicenceItemData.results.filter(a => a.docitem == localthis.boeItemnumber)[0].bnftyp != "") {
									var EnabledItemModel = new sap.ui.model.json.JSONModel({
										enable: false
									});
									localthis.getView().setModel(EnabledItemModel, "StateItem");
									/*******IF clearance type is HSP - Enable Additional Loading and HSS Load *******/

									//	if (this.boeHeaderData.clearance_type == "HSP") {
									localthis.getView().byId("hssloadamt").setEnabled(false);
									localthis.getView().byId("hssloadamt_curr").setEnabled(false);
									localthis.getView().byId("add_load_amt").setEnabled(false);
									localthis.getView().byId("add_aload_amt_curr").setEnabled(false);
									//}
									localthis.CalcItemTotalActualDuty();
									localthis.CalcActualTotalDuty();
								} else {
									if (localthis.byId("idSwtichMode").getState() == true) {
										var EnabledItemModel = new sap.ui.model.json.JSONModel({
											enable: true
										});
										localthis.getView().setModel(EnabledItemModel, "StateItem");
										/*******IF clearance type is HSP - Enable Additional Loading and HSS Load *******/
										if (localthis.boeHeaderData.clearance_type == "HSP") {
											localthis.getView().byId("hssloadamt").setEnabled(true);
											localthis.getView().byId("hssloadamt_curr").setEnabled(true);
											localthis.getView().byId("add_load_amt").setEnabled(true);
											localthis.getView().byId("add_aload_amt_curr").setEnabled(true);
										}
									}
								}
							}
							localthis.getView().getModel("boeAllocationDetails").refresh();
						}
					},
					error: function (response) {
						console.log(response);
					}
				});
		},
		formatDate: function (value) { // value is the date  
			if (typeof value === 'undefined' || value === null || value == "00000000" || value == "") {
				return "";
			} else if (value instanceof Date) {
				var NewDateform = value;
				var mnth = ("0" + (NewDateform.getMonth() + 1)).slice(-2);
				var day = ("0" + NewDateform.getDate()).slice(-2);
				var output = [day, mnth, NewDateform.getFullYear()].join("/");
				return output;
			} else {
				var date = new Date(value),
					mnth = ("0" + (date.getMonth() + 1)).slice(-2),
					day = ("0" + date.getDate()).slice(-2),
					yr = date.getFullYear();
				return day + "/" + mnth + "/" + yr;
			}
		},
		_findAllocationRecord(benAmount, trkno) {
			var tempLineitem = -1;
			for (var i = 0; i < this.LicenceItemData.results.length; i++) {
				if (this.LicenceItemData.results[i].docitem == this.Docitem) {
					if (parseInt(this.LicenceItemData.results[i].lineitem) > tempLineitem) {
						tempLineitem = parseInt(this.LicenceItemData.results[i].lineitem);
					}
				}
				delete this.LicenceItemData.results[i].__metadata;
				if (this.LicenceItemData.results[i].docitem == this.Docitem && this.LicenceItemData.results[i].lineitem == this.Lineitem) {
					var ParentLicenceData = this.LicenceInitialRec.results.filter(a => a.docitem == this.Docitem && a.lineitem == this.Lineitem)[0];
					var ParentQty = ParentLicenceData.alloqty;
					this.OldValue = this._FnConvertJSON(this.LicenceItemData.results[i]);
					this.IdAssValue = this.OldValue.assval;
					this.IdTotalDutyValue = this.OldValue.totdty;
					this.IdTotalQty = this.OldValue.alloqty;
					this.NetAssValue = parseFloat(this.IdAssValue) / parseFloat(this.IdTotalQty);
					this.NetDutyVal = parseFloat(this.IdTotalDutyValue) / parseFloat(this.IdTotalQty);
					this.AplQuantity = (parseFloat(this.BenefitAmount) / this.NetAssValue).toFixed(3);
					var SplitQty = (parseFloat(ParentLicenceData.alloqty) - parseFloat(this.AplQuantity)).toFixed(2);
					this.AplAmount = parseFloat(this.AplQuantity) * parseFloat(this.NetAssValue).toFixed(2);
					this.DutyVal = parseFloat(this.AplQuantity) * parseFloat(this.NetDutyVal).toFixed(2);
					var SplitCifval = (parseFloat(ParentLicenceData.cifval) - parseFloat(this.AplAmount)).toFixed(2);
					SplitCifval = SplitCifval > 0 ? SplitCifval : 0;
					var SplitAssval = (parseFloat(ParentLicenceData.assval) - parseFloat(this.AplAmount)).toFixed(2);
					var SplitDuty = (parseFloat(ParentLicenceData.totdty) - parseFloat(this.DutyVal)).toFixed(2);
					this.OldValue.cifval = SplitCifval;
					this.OldValue.assval = SplitAssval;
					this.OldValue.totdty = SplitDuty;
					this.OldValue.actdty = SplitDuty;
					this.OldValue.alloqty = SplitQty;
					this.OldValue.trackno = "";
					this.OldValue.benclass = "";
					this.RecordNo = i;
				}
			}
			var NextDigit = parseInt(tempLineitem) + 1;
			this.NextItemNo = (NextDigit.toString()).padStart(5, "0");
			this.OldValue.lineitem = this.NextItemNo;
			this.LicenceItemData.results[this.RecordNo].trackno = trkno;
			this.LicenceItemData.results[this.RecordNo].benefitamt = benAmount;
			this.LicenceItemData.results[this.RecordNo].cifval = this.AplAmount;
			this.LicenceItemData.results[this.RecordNo].assval = this.AplAmount;
			this.LicenceItemData.results[this.RecordNo].alloqty = this.AplQuantity;
			this.LicenceItemData.results[this.RecordNo].totdty = this.DutyVal;
			this.LicenceItemData.results[this.RecordNo].actdty = "0";
			ParentLicenceData.benefitamt = benAmount;
			ParentLicenceData.cifval = this.AplAmount;
			ParentLicenceData.assval = this.AplAmount;
			ParentLicenceData.alloqty = this.AplQuantity;
			ParentLicenceData.totdty = this.DutyVal;
			ParentLicenceData.actdty = "0";
			if (this.OldValue.alloqty > 0) {
				this.LicenceItemData.results.push(this.OldValue);
				this.LicenceInitialRec.results.push(this._FnConvertJSON(this.OldValue));
			}
			return 0;
		},

		OnPressResetItem: function (oEvent) {
			this.LicenceItemData = this._FnConvertJSON(this.IntitalLicenceRow);
			this.LicenceInitialRec = this._FnConvertJSON(this.IntitalLicenceRow);
			var localthis = this;
			if (localthis.Reallocated == true || localthis.AllocatedNewRow == true) {
				this.AddNewRowAllo();
			} else {
				this.getView().getModel("boeAllocationDetails").setData(this.LicenceItemData);
				this.getView().getModel("boeAllocationDetails").refresh();
			}
			if (!this.AllItemDutyDetails) {
				this.getView().getModel("boeDutyCompDetails").setData("");
				this.getView().getModel("boeDutyCompDetails").refresh();
			} else {
				this.DutyItemDataLocal = this._FnConvertJSON(this.AllItemDutyDetails);
				this.getView().getModel("boeDutyCompDetails").setData(this.DutyItemDataLocal);
				this.getView().getModel("boeDutyCompDetails").refresh();
			}
		},
		OnPressCopyItem: function (oEvent) {
			var selectedIndex = this.getView().byId("idLICAllocEdit").getSelectedIndices()[0];
			if (selectedIndex < 0) {
				MessageBox.error("Please Select the  Record to Copy");
			} else {
				var AllCodes = this.getView().byId("idLICAllocEdit").getRows()[selectedIndex].getCells()[1].data("Docitem");
				var ItemCodes = AllCodes.split(",");
				var Docitem = ItemCodes[0];
				var Lineitem = ItemCodes[1];
				var UpdOldValue = this.LicenceItemData.results.filter(a => a.docitem == Docitem && a.lineitem == Lineitem)[0];
				var OldValue = this.LicenceInitialRec.results.filter(a => a.docitem == Docitem && a.lineitem == Lineitem)[0];
				var NewLicRecdPush = this._FnConvertJSON(this.LicenceItemData.results.filter(a => a.docitem == Docitem && a.lineitem == Lineitem)[
					0]);
				var AllLiItemRec = this._FnConvertJSON(this.LicenceItemData.results.filter(a => a.docitem == Docitem));
				var OldTotQty = OldValue.totqty;
				var OldAllQty = OldValue.alloqty;
				var OldAssValue = OldValue.assval;
				var OldCifval = OldValue.cifval;
				var OldTotalDutyVal = OldValue.totdty;
				var OldActdty = OldValue.actdty;
				var NetAssValue = parseFloat(OldAssValue) / parseFloat(OldAllQty);
				var NetTotDutyVal = parseFloat(OldTotalDutyVal) / parseFloat(OldAllQty);
				var NetCIFVal = parseFloat(OldCifval) / parseFloat(OldAllQty);
				var NetAcduty = parseFloat(OldActdty) / parseFloat(OldAllQty);
				var SplitQty = this.getView().byId("idLICAllocEdit").getRows()[selectedIndex].getCells()[2].getValue();
				var UpdatedAllQty = SplitQty;
				var UpdatedTotalQty = SplitQty;
				var UpdatedCifval = parseFloat(NetCIFVal) * parseFloat(SplitQty).toFixed(2);
				var UpdatedTotDuty = (parseFloat(NetTotDutyVal) * parseFloat(SplitQty)).toFixed(2);
				var UpdatedActDuty = (parseFloat(NetAcduty) * parseFloat(SplitQty)).toFixed(2);
				var UpdatedActassVal = (parseFloat(NetAssValue) * parseFloat(SplitQty)).toFixed(2);
				var addTotqty = (parseFloat(OldTotQty) - parseFloat(UpdatedTotalQty)).toFixed(2);
				if (parseFloat(addTotqty) < 0) {
					MessageBox.error("Original Quantity Cannot be Increased");
					var selindex = this.getView().byId("idLICAllocEdit").getSelectedIndex();
					this.getView().byId("idLICAllocEdit").getRows()[selindex].getCells()[2].setValue(OldTotQty);
				} else if (parseFloat(addTotqty) == 0) {
					MessageBox.error("Quantity Should be Changed to do the Split");
				} else {
					UpdOldValue.totqty = UpdatedTotalQty;
					UpdOldValue.alloqty = UpdatedAllQty;
					UpdOldValue.assval = UpdatedActassVal;
					UpdOldValue.cifval = UpdatedCifval;
					UpdOldValue.totdty = UpdatedTotDuty;
					UpdOldValue.actdty = UpdatedActDuty;
					OldValue.totqty = UpdatedTotalQty;
					OldValue.alloqty = UpdatedAllQty;
					OldValue.assval = UpdatedActassVal;
					OldValue.cifval = UpdatedCifval;
					OldValue.totdty = UpdatedTotDuty;
					OldValue.actdty = UpdatedActDuty;
					var addAlloqty = (parseFloat(OldAllQty) - parseFloat(UpdatedAllQty)).toFixed(2);
					var addCifval = (parseFloat(OldCifval) - parseFloat(UpdatedCifval)).toFixed(2);
					var addAssval = (parseFloat(OldAssValue) - parseFloat(UpdatedActassVal)).toFixed(2);
					var addActdty = (parseFloat(OldActdty) - parseFloat(UpdatedActDuty)).toFixed(2);
					var addTotdty = (parseFloat(OldTotalDutyVal) - parseFloat(UpdatedTotDuty)).toFixed(2);
					var addTrackno = "";
					var addBenclass = "";
					var NextDigit = parseInt(this._findLastItem(AllLiItemRec)) + 1;
					var AddLineitem = (NextDigit.toString()).padStart(5, "0");
					NewLicRecdPush.lineitem = AddLineitem;
					NewLicRecdPush.totqty = addTotqty;
					NewLicRecdPush.alloqty = addAlloqty;
					NewLicRecdPush.assval = addAssval;
					NewLicRecdPush.cifval = addCifval;
					NewLicRecdPush.totdty = addTotdty;
					NewLicRecdPush.actdty = addActdty;
					NewLicRecdPush.trackno = "";
					NewLicRecdPush.benclass = "";
					this.LicenceItemData.results.push(NewLicRecdPush);
					this.LicenceInitialRec.results.push(this._FnConvertJSON(NewLicRecdPush));
					this.getView().getModel("boeAllocationDetails").refresh();
				}
			}
		},
		_findLastItem(json) {
			var tempLineitem = -1;
			for (var i = 0; i < json.length; i++) {
				if (parseInt(json[i].Lineitem) > tempLineitem) {
					tempLineitem = parseInt(json[i].Lineitem);
				}
			}
			return tempLineitem;
		},
		_FnDeleteMetaData: function (obj) {
			for (var i = 0; i < obj.length; i++) {
				if (typeof obj[i].Invoicedt == "undefined") {} else {
					obj[i].Invoicedt = this.formattoSAPdate(obj[i].Invoicedt);
				}
				delete obj[i].__metadata;
			}
			return obj;
		},
		OnItemSelect: function (oEvent) {
			this.boeItemnumber = oEvent.getSource().mProperties.title;
			var CurrentItemData = this._findWithAttr(this.InvItemData.results, this.boeItemnumber);
			var SelectedFlag, ItemRecord, ItemData, CurrentItemData, itemNo, Ponumber;
			SelectedFlag = oEvent.getParameter("listItem").getSelected();
			Ponumber = oEvent.getParameter("listItem").getTitle();
			CurrentItemData = this._findWithAttr(this.InvItemData.results, Ponumber);
			this.SelLineItem = this.LicenceItemData.results[this.ItemRecord].lineitem;
			this.ItemRecord = CurrentItemData;
			ItemRecord = this.InvItemData.results[this.ItemRecord];
			if (SelectedFlag) {
				ItemRecord.sel = "X";
			} else {
				ItemRecord.sel = "";
			}
		},
		_IntialDisplayView: function () {
			this.getView().byId("idIconTabBarSeparatorIcon").setExpanded(false);
			this.byId("idSwtichMode").setState(false);
			this.getView().byId("idItemdetailsTabform").setVisible(false);
		},
		OnSelectChange: function (oEvent) {
			/*	if (this.getView().byId("idLICAllocEdit")._getSelectedIndicesCount() <= 0) {*/
		},
		handleChange: function (oEvent) {
			if (oEvent.getSource().getId().split("--")[1] == "atadestport") { //merge sumeesh code by Aiswarya
				if (this.getView().byId("ataicd").getValue() == "") {
					this.setfree_lastdt();
				}
			}
			var oDP = oEvent.oSource;
			var bValid = oEvent.getParameter("valid");
			this._iEvent++;
			if (bValid) {
				oDP.setValueState(sap.ui.core.ValueState.None);
				var atadestport = this.getView().byId("atadestport").getValueState();
				var ideditCustBOEdate = this.getView().byId("impdpdat").getValueState();
				var finalassmtdate = this.getView().byId("finalassmtdate").getValueState();
				var ooc_date = this.getView().byId("ooc_date").getValueState();
				var ooc_reg_date = this.getView().byId("ooc_reg_date").getValueState();
				var hss_agreement_date = this.getView().byId("hss_agreement_date").getValueState();
				var not_comp_date = this.getView().byId("not_comp_date").getValueState();
				var doc_del_date = this.getView().byId("doc_del_date").getValueState();
				var doc_rec_date = this.getView().byId("doc_rec_date").getValueState();
				var not_doc_ret_date = this.getView().byId("not_doc_ret_date").getValueState();
				//	var icd_igm_date = this.getView().byId("icd_igm_date").getValueState();
				var cust_doc_ret_date = this.getView().byId("cust_doc_ret_date").getValueState();
				var exch_rate_date = this.getView().byId("exch_rate_date").getValueState();
				var shipment_on_board_date = this.getView().byId("shipment_on_board_date").getValueState();
				var eta = this.getView().byId("eta").getValueState();
				var etd = this.getView().byId("etd").getValueState();
				var ataicd = this.getView().byId("ataicd").getValueState();
				var amndtcompdt = this.getView().byId("amndtcompdt").getValueState();
				var boeamdtreq = this.getView().byId("boeamdtreq").getValueState();
				var reqdtypmtdat = this.getView().byId("reqdtypmtdat").getValueState();
				var duedatdtypmt = this.getView().byId("duedatdtypmt").getValueState();
				var datdtypmtbasc = this.getView().byId("datdtypmtbasc").getValueState();
				var otpgendat = this.getView().byId("otpgendat").getValueState();
				var rfndaplndat = this.getView().byId("rfndaplndat").getValueState();
				var rfndrcvddat = this.getView().byId("rfndrcvddat").getValueState();
				var rwcrcptdat = this.getView().byId("rwcrcptdat").getValueState();
				var ideditBonddate = this.getView().byId("bonddat").getValueState();
				var tr6_challan_date = this.getView().byId("tr6_challan_date").getValueState();
				if (ideditCustBOEdate == "Error" || ideditBonddate == "Error" || ooc_date == "Error" || ooc_reg_date == "Error" ||
					finalassmtdate ==
					"Error" || not_comp_date == "Error" || doc_del_date == "Error" || doc_rec_date == "Error" || not_doc_ret_date == "Error" ||

					cust_doc_ret_date == "Error" || tr6_challan_date == "Error" ||
					amndtcompdt == "Error" || boeamdtreq == "Error" || atadestport == "Error" || exch_rate_date == "Error" ||
					reqdtypmtdat == "Error" || duedatdtypmt == "Error" == "Error" || datdtypmtbasc ==
					"Error" || otpgendat == "Error" ||
					rfndaplndat == "Error" || shipment_on_board_date == "Error" || eta == "Error" || etd == "Error" || ataicd == "Error" ||
					rfndrcvddat == "Error" || hss_agreement_date == "Error" || rwcrcptdat == "Error") {
					this.getView().byId("btn_save").setEnabled(false);
					return false;
				} else {
					this.getView().byId("btn_save").setEnabled(true);
					return true;
				}
			} else {
				oDP.setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("btn_save").setEnabled(false);
				return false;
			}
		},
		DisplayResetBtn: function (oEvent) {
			var SelKey = oEvent.getSource().getSelectedKey();
			if (SelKey == "LA") {
				if (this.byId("idSwtichMode").getState() == false) {
					this.getView().byId("btn_reset").setVisible(false);
					this.getView().byId("btn_reallocate").setVisible(false);
				} else {
					this.getView().byId("btn_reset").setVisible(true);
					this.getView().byId("btn_reallocate").setVisible(true);
					if (this.LicenceItemData.results.findIndex(a => a.docitem == this.boeItemnumber) < 0) {
						this.AddNewRowAllo();
						this.AllocatedNewRow = true;
					}
				}
			} else {
				this.getView().byId("btn_reset").setVisible(false);
				this.getView().byId("btn_reallocate").setVisible(false);
			}
		},
		formattoSAPdate: function (value) {
			var SplitDatePart = value.split("/");
			value = SplitDatePart[2].trim() + "-" + SplitDatePart[1].trim() + "-" + SplitDatePart[0].trim() + "T00:00:00";
			return value;
		},
		_handleValueHelpSearch_Tno: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"tarntno",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_OpenBusyDialog: function () {
			if (!this.bsdalog) {
				this.bsdalog = sap.ui.xmlfragment(this.getView().getId(), "EXIM_IMPNBOE.view.fragments.BusyDialoge", this);
				this.getView().addDependent(this.bsdalog);
			}
			this.bsdalog.open();
		},
		_OpenBusyDialogNoDelay: function () {
			if (!this.bsdalog) {
				this.bsdalog = sap.ui.xmlfragment(this.getView().getId(), "EXIM_IMPNBOE.view.fragments.BusyDialoge", this);
				this.getView().addDependent(this.bsdalog);
			}
			this.bsdalog.open();
			jQuery.sap.delayedCall(1000, this, function () {
				this.bsdalog.close();
			});
		},
		_CloseBusyDialog: function () {
			this.bsdalog.close();
		},
		handleValueHelpDocrpt: function (oEvent) {
			this.a = null;
			var _self = this;
			var result = {
				DocflowResults: []
			};
			/*	var type = "BL";
				var pat = "BOE_number";
				var docno = this.docNumber;
				var filters = new Array();
				var filterval = new sap.ui.model.Filter({
					path: pat,
					operator: sap.ui.model.FilterOperator.EQ,
					value1: docno
				});*/
			/**********For Ex bond and Into bond - Filter criteria changed******/
			var type = "CI";
			var pat = "CLIN_number";
			var docno = this.boeHeaderData.clin;
			var filters = new Array();
			var filterval = new sap.ui.model.Filter({
				path: pat,
				operator: sap.ui.model.FilterOperator.EQ,
				value1: docno
			});
			filters.push(filterval);
			if (this.docType == "W") {
				var filtervalData = new sap.ui.model.Filter({
					path: "BOE_type",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "W"
				});
				filters.push(filtervalData);
			} else if (this.docType == "Y") {
				var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("BOE_type", sap.ui.model.FilterOperator.Contains, "Y"),
						new sap.ui.model.Filter("BOE_type", sap.ui.model.FilterOperator.Contains, "E"),
						new sap.ui.model.Filter("BOE_type", sap.ui.model.FilterOperator.Contains, "B")
					],
					and: false
				});
				filters.push(oFilter);
			} else if (this.docType == "E") {
				var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("BOE_type", sap.ui.model.FilterOperator.Contains, "Y"),
						new sap.ui.model.Filter("BOE_type", sap.ui.model.FilterOperator.Contains, "E")
					],
					and: false
				});
				filters.push(oFilter);
			} else if (this.docType == "B") {
				var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("BOE_type", sap.ui.model.FilterOperator.Contains, "Y"),
						new sap.ui.model.Filter("BOE_type", sap.ui.model.FilterOperator.Contains, "B")
					],
					and: false
				});
				filters.push(oFilter);
			}
			var locjsn = [];
			this.Doc_List = [];
			var Doc_Info2 = [];
			var Doc_Info3 = [];
			var oModelData = new sap.ui.model.json.JSONModel();
			var Doc_Info1 = [];
			this.DocModel.read('/xBRIxI_IMPDOCFLOW', {
				filters: filters,
				success: function (getData) {
					if (getData.results.length <= 0) {
						MessageBox.error("No Record");
					} else {
						var lookup = {};
						for (var i = 0; i < getData.results.length; i++) {
							result.DocflowResults = getData.results[i];
							oModelData.setData(result);
							var nndo = {
								"name": result.DocflowResults.NNDO_Number
							};
							if (result.DocflowResults.CLIN_number) {
								var name = result.DocflowResults.CLIN_number;
								if (!(name in lookup)) {
									lookup[name] = 1;
									var clin = {
										"name": result.DocflowResults.CLIN_number
									};
									Doc_Info2.push(clin);
								}
							}
							if (result.DocflowResults.BOE_number) {
								var boe = {
									"name": result.DocflowResults.BOE_number
								};
								Doc_Info3.push(boe);
							}
							if (i == 0) {
								Doc_Info1.push(nndo);
							}
						}
						_self.Doc_List = {
							Doc_Info: [{
								name: "Document Flow",
								Doc_Info: [{
									name: "Non Negotiable Document",
									"Doc_Info": Doc_Info1
								}, {
									name: "Clearing Instruction",
									Doc_Info: Doc_Info2
								}, {
									name: "Bill Of Entry",
									Doc_Info: Doc_Info3
								}]
							}]
						};
						var oModelContainer = new sap.ui.model.json.JSONModel([]);
						oModelContainer.setData(_self.Doc_List);
						_self.getView().setModel(oModelContainer, "Doc_List");
						_self.getView().getModel("Doc_List").refresh();
					}
				}
			});
			this.inputId = oEvent.getSource().getId();
			if (!this._dutyComponents) {
				this._dutyComponents = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.DocFlowRpt", this);
				this.getView().addDependent(this._dutyComponents);
			}
			this._dutyComponents.open();
			this._OpenBusyDialogNoDelay();
		},
		SelectedRecordDetails: function (oEvent) {
			var RefNo = oEvent.getSource().getText();
			var _self = this;
			var sPath = oEvent.getSource().oPropagatedProperties.oBindingContexts.Doc_List.sPath;
			var str = sPath.replace("/Doc_Info/0/Doc_Info/", "");
			var arrayOrder = str.charAt(0);
			var semanticObject = "";
			if (arrayOrder == 0) {
				semanticObject = "EXIM_NNDO";
			} else if (arrayOrder == 1) {
				semanticObject = "EXIM_CLIN_APP2";
			} else if (arrayOrder == 2) {
				if (RefNo != this.docNumber) {
					semanticObject = "BOE_APP";
				}
			}
			if (arrayOrder != 2 || (arrayOrder == 2 && RefNo != this.docNumber)) {
				if (!isNaN(oEvent.getSource().getText())) {
					if (sap.ushell.Container) {
						var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
						var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
							target: {
								semanticObject: semanticObject,
								action: "Display"
							},
							params: {
								"Ref_Number": RefNo
							}
						})) || "";
						var url = window.location.href.split('#')[0] + hash;
						sap.m.URLHelper.redirect(url, true);
					}
				}
			}
			/* oCrossAppNavigator.toExternal({
			  target: {
			   shellHash: hash
			  }
			 }); */ // navigate to Supplier application
		},
		handlePressok: function () {
			this._dutyComponents.close();
		},
		handleVendorValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._VendorDialog) {
				this._VendorDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpVendor", this);
				this.getView().addDependent(this._VendorDialog);
			}
			this._VendorDialog.open(sInputValue);
		},
		handleNotifiValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._NotiDialog) {
				this._NotiDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpNoti", this);
				this.getView().addDependent(this._NotiDialog);
			}
			this._NotiDialog.open(sInputValue);
		},
		_handleValueHelpSearch_Noti: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("tarntno", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("notifslno", sap.ui.model.FilterOperator.Contains, sValue)
				],
				and: false
			});
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpClose_Noti: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId(this.inputId).setValue(oSelectedItem.getTitle());
				if (this.inputId.includes("othnoti")) {
					this.getView().byId("othnotisrno").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("ncdnoti")) {
					this.getView().byId("ncdnotisrno").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("cuseducessnotino")) {
					this.getView().byId("cuseducessnotisrno").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("addn")) {
					this.getView().byId("addnsn").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("sw_surchrg_noti")) {
					this.getView().byId("sw_surchrg_notslno").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("cvdnoti")) {
					this.getView().byId("cvdnotisrno").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("bcdnoti")) {
					this.getView().byId("bcdnotisrno").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("adtnoti2")) {
					this.getView().byId("adtnoti2srno").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("adtnoti1")) {
					this.getView().byId("adtnoti1srno").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("saptan")) {
					this.getView().byId("saptasn").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("sgdn")) {
					this.getView().byId("sgdsn").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("agdn")) {
					this.getView().byId("agdsn").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("healthn")) {
					this.getView().byId("healthsn").setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("rspnoti")) {
					this.getView().byId(this.inputId).getParent().getCells()[4].setValue(oSelectedItem.getDescription());
				} else if (this.inputId.includes("notifno")) {
					this.getView().byId(this.inputId).getParent().getCells()[10].setValue(oSelectedItem.getDescription());
				}
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		handleCustHouse: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._CustDialog) {
				this._CustDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogCust", this);
				this.getView().addDependent(this._CustDialog);
			}
			this._CustDialog.open(sInputValue);
		},
		_handleValueHelpClose_Vendor: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
			if (oSelectedItem) {
				this.getView().byId(this.inputId).setValue(oSelectedItem);
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		handleVendorValueHelpDPort: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			if (!this._DPortDialog) {
				this._DPortDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogDport", this);
				this.getView().addDependent(this._DPortDialog);
			}
			this._DPortDialog.open(sInputValue);
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
		handleVendorValueHelpCountry: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			if (!this._CountryDialog) {
				this._CountryDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpCountry", this);
				this.getView().addDependent(this._CountryDialog);
			}

			this._CountryDialog.open(sInputValue);
		},
		handleBondWarehouse: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			if (!this._BondWarehouseDialog) {
				this._BondWarehouseDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.BondWareHouseCd", this);
				this.getView().addDependent(this._BondWarehouseDialog);
			}
			this._BondWarehouseDialog.open(sInputValue);
		},

		_handleValueHelpClose_Ctry: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId(this.InputId).setValue(oSelectedItem.getTitle());
				this.getView().byId("coc").setValue(oSelectedItem.getTitle());
				this.getView().byId("ExportCountryName").setText(oSelectedItem.getDescription());
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		addRow: function (oArg) {
			if (!this.AdditionalInfo) {
				/*************** container details ***************************/
				this.AdditionalInfo = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						boeitno: this.boeItemnumber,
						itsrno: this.boeItemnumber,
						info_type: "",
						info_qua: "",
						info_code: "",
						info_text: "",
						info_msr: "0.00",
						info_uqc: "",
						Mode: "X"
					}]
				};
				var oModelContainer = new sap.ui.model.json.JSONModel([]);
				oModelContainer.setData(this.AdditionalInfo);
				this.getView().setModel(oModelContainer, "AdditionalInfo");
				/*************** container details ***************************/
			} else {
				this.AdditionalInfo.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					boeitno: this.boeItemnumber,
					itsrno: this.boeItemnumber,
					info_type: "",
					info_qua: "",
					info_code: "",
					info_text: "",
					info_msr: "0.00",
					info_uqc: "",
					Mode: "X"
				});
				this.getView().getModel("AdditionalInfo").refresh();
			}
		},
		deleteRow: function (oArg) {
			var _self = this;
			var seqiteno = "1";
			var NextseqNo = "";
			var mParameters = {
				groupId: "batchDelete",
				eTag: "*"
			};
			//var currentRow = oArg.getSource().getParent().sId.slice(-1);
			var SrlNo = oArg.getSource().getParent().getCells()[0].data("InfSrlNo");
			if (SrlNo) {
				var currentRow = this.AdditionalInfo.results.findIndex(function (item, i) {
					return item.boeitno === _self.boeItemnumber && item.inftypsrlno === SrlNo
				});
			} else {
				var currentRow = oArg.getSource().getParent().sId.slice(-1);
			}
			MessageBox.confirm("Changes Cannot be Reversed. Do You Still Want to Delete ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						_self.BoeModel.remove("/xBRIxBE_BOE(doctyp='" + _self.AdditionalInfo.results[currentRow].doctyp + "',docno='" + _self.AdditionalInfo
							.results[currentRow].docno + "',boeitno='" + _self.AdditionalInfo.results[currentRow].boeitno + "',inftypsrlno='" + _self
							.AdditionalInfo
							.results[currentRow].inftypsrlno +
							"')", mParameters);
						_self.BoeModel.submitChanges({
							mParameters,
							success: function (result) {
								MessageBox.success("Selected Data Deleted Successfully");
								_self.AdditionalInfo.results.splice(currentRow, 1);
								_self.getView().getModel("AdditionalInfo").refresh();
							},
							error: function (err) {
								MessageBox.error("Error while Deleting Details");
							}
						});
					}
				}
			});
		},
		addRowCon: function (oArg) {
			if (!this.ConstituemtsInfo) {
				/*************** container details ***************************/
				this.ConstituemtsInfo = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						boeitno: this.boeItemnumber,
						itsrno: this.boeItemnumber,
						const_sr_no: "",
						const_ele_name: "",
						const_ele_code: "",
						const_percent: "0.00",
						const_yield: "0.00",
						active_ing: "",
						Mode: "X"
					}]
				};
				var oModelContainer = new sap.ui.model.json.JSONModel([]);
				oModelContainer.setData(this.ConstituemtsInfo);
				this.getView().setModel(oModelContainer, "ConstituemtsInfo");
				/*************** container details ***************************/
			} else {
				this.ConstituemtsInfo.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					boeitno: this.boeItemnumber,
					itsrno: this.boeItemnumber,
					const_sr_no: "",
					const_ele_name: "",
					const_ele_code: "",
					const_percent: "0.00",
					const_yield: "0.00",
					active_ing: "",
					Mode: "X"
				});
				this.getView().getModel("ConstituemtsInfo").refresh();
			}
		},
		deleteRowCon: function (oArg) {
			var seqiteno = "1";
			var NextseqNo = "";
			//var currentRow = oArg.getSource().getParent().sId.slice(-1);
			var _self = this;
			var mParameters = {
				groupId: "batchDelete",
				eTag: "*"
			};
			var SrlNo = oArg.getSource().getParent().getCells()[0].data("CstSrlNo");
			if (SrlNo) {
				var currentRow = this.ConstituemtsInfo.results.findIndex(function (item, i) {
					return item.boeitno === _self.boeItemnumber && item.constsrlno === SrlNo
				});
			} else {
				var currentRow = oArg.getSource().getParent().sId.slice(-1);
			}
			MessageBox.confirm("Changes Cannot be Reversed. Do You Still Want to Delete ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						_self.BoeModel.remove("/xBRIxi_boe_item_swc_be(doctyp='" + _self.ConstituemtsInfo.results[currentRow].doctyp + "',docno='" +
							_self.ConstituemtsInfo
							.results[currentRow].docno + "',boeitno='" + _self.ConstituemtsInfo.results[currentRow].boeitno + "',constsrlno='" +
							_self.ConstituemtsInfo
							.results[currentRow].constsrlno +
							"')", mParameters);
						_self.BoeModel.submitChanges({
							mParameters,
							success: function (result) {
								MessageBox.success("Selected Data Deleted Successfully");
								_self.ConstituemtsInfo.results.splice(currentRow, 1);
								_self.getView().getModel("ConstituemtsInfo").refresh();
							},
							error: function (err) {
								MessageBox.error("Error while Deleting Details");
							}
						});
					}
				}
			});
		},
		addRowPro: function (oArg) {
			if (!this.ProductionInfo) {
				/*************** container details ***************************/
				this.ProductionInfo = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						boeitno: this.boeItemnumber,
						itsrno: this.boeItemnumber,
						prdbthidfr: "",
						prdbthqnty: "0.00",
						untqntycod: "",
						datofmanu: null,
						datofexp: null,
						bstbfr: null,
						Mode: "X"
					}]
				};
				var oModelContainer = new sap.ui.model.json.JSONModel([]);
				oModelContainer.setData(this.ProductionInfo);
				this.getView().setModel(oModelContainer, "ProductionInfo");
				/*************** container details ***************************/
			} else {
				this.ProductionInfo.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					boeitno: this.boeItemnumber,
					itsrno: this.boeItemnumber,
					prdbthidfr: "",
					prdbthqnty: "0.00",
					untqntycod: "",
					datofmanu: null,
					datofexp: null,
					bstbfr: null,
					Mode: "X"
				});
				this.getView().getModel("ProductionInfo").refresh();
			}
		},
		deletePro: function (oArg) {
			var seqiteno = "1";
			var NextseqNo = "";
			var _self = this;
			var mParameters = {
				groupId: "batchDelete",
				eTag: "*"
			};
			var SrlNo = oArg.getSource().getParent().getCells()[0].data("PrdSrlNo");
			if (SrlNo) {
				var currentRow = this.ProductionInfo.results.findIndex(function (item, i) {
					return item.boeitno === _self.boeItemnumber && item.prodsrlno === SrlNo
				});
			} else {
				var currentRow = oArg.getSource().getParent().sId.slice(-1);
			}
			MessageBox.confirm("Changes Cannot be Reversed. Do You Still Want to Delete ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						_self.BoeModel.remove("/xBRIxi_boe_itm_pro_be(doctyp='" + _self.ProductionInfo.results[currentRow].doctyp + "',docno='" +
							_self.ProductionInfo
							.results[currentRow].docno + "',boeitno='" + _self.ProductionInfo.results[currentRow].boeitno + "',prodsrlno='" + _self.ProductionInfo
							.results[currentRow].prodsrlno +
							"')", mParameters);
						_self.BoeModel.submitChanges({
							mParameters,
							success: function (result) {
								MessageBox.success("Selected Data Deleted Successfully");
								_self.ProductionInfo.results.splice(currentRow, 1);
								_self.getView().getModel("ProductionInfo").refresh();
							},
							error: function (err) {
								MessageBox.error("Error while Deleting Details");
							}
						});
					}
				}
			});
		},

		addRowControl: function (oArg) {
			if (!this.ControlInfo) {
				/*************** container details ***************************/
				this.ControlInfo = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						boeitno: this.boeItemnumber,
						itsrno: this.boeItemnumber,
						cnttypcod: "",
						cntrsltcod: "",
						cntloctn: "",
						cntsrtdt: null,
						cntenddt: null,
						Mode: "X"
					}]
				};
				var oModelContainer = new sap.ui.model.json.JSONModel([]);
				oModelContainer.setData(this.ControlInfo);
				this.getView().setModel(oModelContainer, "ControlInfo");
				/*************** container details ***************************/
			} else {
				this.ControlInfo.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					boeitno: this.boeItemnumber,
					itsrno: this.boeItemnumber,
					cnttypcod: "",
					cntrsltcod: "",
					cntloctn: "",
					cntsrtdt: null,
					cntenddt: null,
					Mode: "X"
				});
				this.getView().getModel("ControlInfo").refresh();
			}
		},
		deleteControl: function (oArg) {
			var seqiteno = "1";
			var NextseqNo = "";
			//	var currentRow = oArg.getSource().getParent().sId.slice(-1);
			var _self = this;
			var mParameters = {
				groupId: "batchDelete",
				eTag: "*"
			};
			var SrlNo = oArg.getSource().getParent().getCells()[0].data("CtrSrlNo");
			if (SrlNo) {
				var currentRow = this.ControlInfo.results.findIndex(function (item, i) {
					return item.boeitno === _self.boeItemnumber && item.ctrlsrlno === SrlNo
				});
			} else {
				var currentRow = oArg.getSource().getParent().sId.slice(-1);
			}
			MessageBox.confirm("Changes Cannot be Reversed. Do You Still Want to Delete ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						_self.BoeModel.remove("/xBRIxi_boe_itm_ctrl_be(doctyp='" + _self.ControlInfo.results[currentRow].doctyp + "',docno='" +
							_self.ControlInfo
							.results[currentRow].docno + "',boeitno='" + _self.ControlInfo.results[currentRow].boeitno + "',ctrlsrlno='" + _self.ControlInfo
							.results[currentRow].ctrlsrlno +
							"')", mParameters);
						_self.BoeModel.submitChanges({
							mParameters,
							success: function (result) {
								MessageBox.success("Selected Data Deleted Successfully");
								_self.ControlInfo.results.splice(currentRow, 1);
								_self.getView().getModel("ControlInfo").refresh();
							},
							error: function (err) {
								MessageBox.error("Error while Deleting Details");
							}
						});
					}
				}
			});
		},

		addRow_RSP: function (oArg) {
			if (!this.I_RSP_BE_Info) {
				/*************** RSP details ***************************/
				this.I_RSP_BE_Info = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						boeitno: this.boeItemnumber,
						itmsrnoin: this.boeItemnumber,
						invsrnum: "",
						itmsrnoin: "",
						itmsrnorsp: "",
						rsprs: "0.00",
						qunty: "0.00",
						desitm: "",
						rspnoti: "",
						rspnotislno: "",
						Mode: "X"
					}]
				};
				var oModelRSP = new sap.ui.model.json.JSONModel([]);
				oModelRSP.setData(this.I_RSP_BE_Info);
				this.getView().setModel(oModelRSP, "I_RSP_BE_Info");
				/*************** oModelRSP details ***************************/
			} else {
				this.I_RSP_BE_Info.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					boeitno: this.boeItemnumber,
					itmsrnoin: this.boeItemnumber,
					invsrnum: "",
					itmsrnoin: "",
					itmsrnorsp: "",
					rsprs: "0.00",
					qunty: "0.00",
					desitm: "",
					rspnoti: "",
					rspnotislno: "",
					Mode: "X"
				});
				this.getView().getModel("I_RSP_BE_Info").refresh();
			}
		},
		deleteRSP: function (oArg) {
			var seqiteno = "1";
			var NextseqNo = "";
			var _self = this;
			var mParameters = {
				groupId: "batchDelete",
				eTag: "*"
			};
			var SrlNo = oArg.getSource().getParent().getCells()[0].data("SrlNo");
			if (SrlNo) {
				var currentRow = this.I_RSP_BE_Info.results.findIndex(function (item, i) {
					return item.boeitno === _self.boeItemnumber && item.rspslno === SrlNo
				});
			} else {
				var currentRow = oArg.getSource().getParent().sId.slice(-1);
			}
			MessageBox.confirm("Changes Cannot be Reversed. Do You Still Want to Delete ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						_self.BoeModel.remove("/xBRIxI_RSP_BE(doctyp='" + _self.I_RSP_BE_Info.results[currentRow].doctyp + "',docno='" + _self.I_RSP_BE_Info
							.results[currentRow].docno + "',rspslno='" + _self.I_RSP_BE_Info.results[currentRow].rspslno + "',boeitno='" + _self.I_RSP_BE_Info
							.results[currentRow].boeitno + "')", mParameters);
						_self.BoeModel.submitChanges({
							mParameters,
							success: function (result) {
								MessageBox.success("Selected Data Deleted Successfully");
								_self.I_RSP_BE_Info.results.splice(currentRow, 1);
								_self.getView().getModel("I_RSP_BE_Info").refresh();
							},
							error: function (err) {
								MessageBox.error("Error while Deleting Details");
							}
						});
					}
				}
			});
		},

		addRow_DEPB: function (oArg) {
			if (!this.I_DEPB_BE_Info) {
				/*************** DEPB details ***************************/
				this.I_DEPB_BE_Info = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						boeitno: this.boeItemnumber,
						itmsrnoin: "",
						invsrnum: "",
						exemreq: "",
						bcdnotisrno: "",
						bcdnoti: "",
						Mode: "X"
					}]
				};
				var oModelDEPB = new sap.ui.model.json.JSONModel([]);
				oModelDEPB.setData(this.I_DEPB_BE_Info);
				this.getView().setModel(oModelDEPB, "I_DEPB_BE_Info");
				/*************** oModelDEPB details ***************************/
			} else {
				this.I_DEPB_BE_Info.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					boeitno: this.boeItemnumber,
					itmsrnoin: "",
					invsrnum: "",
					exemreq: "",
					bcdnotisrno: "",
					bcdnoti: "",
					Mode: "X"
				});
				this.getView().getModel("I_DEPB_BE_Info").refresh();
			}
		},
		deleteDEPB: function (oArg) {
			var seqiteno = "1";
			var NextseqNo = "";
			var currentRow = oArg.getSource().getParent().sId.slice(-1);
			var _self = this;
			var mParameters = {
				groupId: "batchDelete",
				eTag: "*"
			};
			MessageBox.confirm("Changes Cannot be Reversed. Do You Still Want to Delete ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						_self.BoeModel.remove("/xBRIxI_DEPB_BE(doctyp='" + _self.I_DEPB_BE_Info.results[currentRow].doctyp + "',docno='" + _self.I_DEPB_BE_Info
							.results[currentRow].docno + "',boeitno='" + _self.I_DEPB_BE_Info.results[currentRow].boeitno + "',licetyp='" + _self.I_DEPB_BE_Info
							.results[currentRow].licetyp + "',trkno='" + _self.I_DEPB_BE_Info.results[currentRow].trkno + "')", mParameters);
						_self.BoeModel.submitChanges({
							mParameters,
							success: function (result) {
								MessageBox.success("Selected Data Deleted Successfully");
								_self.I_DEPB_BE_Info.results.splice(currentRow, 1);
								_self.getView().getModel("I_DEPB_BE_Info").refresh();
							},
							error: function (err) {
								MessageBox.error("Error while Deleting Details");
							}
						});
					}
				}
			});
		},

		addRow_Reimport: function (oArg) {
			if (!this.I_reimport_be_Info) {
				/*************** DEPB details ***************************/
				this.I_reimport_be_Info = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						boeitno: this.boeItemnumber,
						itmsrnoin: this.boeItemnumber,
						notifsrno: "",
						notifno: "",
						itmsrnoin: "",
						invsrnum: "",
						shipbno: "",
						shipbdat: null,
						portexp: "",
						itemno: "",
						invoiceno: "",
						expinsur: "0.00",
						expfrieght: "0.00",
						cusdut: "0.00",
						excisedut: "0.00",
						Mode: "X"
					}]
				};
				var oModelreimport = new sap.ui.model.json.JSONModel([]);
				oModelreimport.setData(this.I_reimport_be_Info);
				this.getView().setModel(oModelreimport, "I_reimport_be_Info");
				/*************** oModelDEPB details ***************************/
			} else {
				this.I_reimport_be_Info.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					boeitno: this.boeItemnumber,
					itmsrnoin: this.boeItemnumber,
					notifsrno: "",
					notifno: "",
					itmsrnoin: "",
					invsrnum: "",
					shipbno: "",
					shipbdat: null,
					portexp: "",
					itemno: "",
					invoiceno: "",
					expinsur: "0.00",
					expfrieght: "0.00",
					cusdut: "0.00",
					excisedut: "0.00",
					Mode: "X"
				});
				this.getView().getModel("I_reimport_be_Info").refresh();
			}
		},
		delete_Reimport: function (oArg) {
			var seqiteno = "1";
			var NextseqNo = "";
			//var currentRow = oArg.getSource().getParent().sId.slice(-1);
			var _self = this;
			var mParameters = {
				groupId: "batchDelete",
				eTag: "*"
			};
			var SrlNo = oArg.getSource().getParent().getCells()[0].data("ShpSrlNo");
			if (SrlNo) {
				var currentRow = this.I_reimport_be_Info.results.findIndex(function (item, i) {
					return item.boeitno === _self.boeItemnumber && item.shpbillslno === SrlNo
				});
			} else {
				var currentRow = oArg.getSource().getParent().sId.slice(-1);
			}
			MessageBox.confirm("Changes Cannot be Reversed. Do You Still Want to Delete ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						_self.BoeModel.remove("/xBRIxI_reimport_be(doctyp='" + _self.I_reimport_be_Info.results[currentRow].doctyp + "',docno='" +
							_self.I_reimport_be_Info.results[currentRow].docno + "',boeitno='" + _self.I_reimport_be_Info.results[currentRow].boeitno +
							"',shpbillslno='" + _self.I_reimport_be_Info.results[currentRow].shpbillslno + "')", mParameters);
						_self.BoeModel.submitChanges({
							mParameters,
							success: function (result) {
								MessageBox.success("Selected Data Deleted Successfully");
								_self.I_reimport_be_Info.results.splice(currentRow, 1);
								_self.getView().getModel("I_reimport_be_Info").refresh();
							},
							error: function (err) {
								MessageBox.error("Error while Deleting Details");
							}
						});
					}
				}
			});
		},

		addRow_boeExchgDetails: function (oArg) {
			if (!this.boeExchgDetails) {
				/*************** DEPB details ***************************/
				this.boeExchgDetails = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						boeitno: this.boeItemnumber,
						untinrs: "",
						stdcr: "",
						cerno: "",
						cerdt: "",
						rate: "",
						efdt: "",
						curcd: "",
						bknam: "",
						Mode: "X"
					}]
				};
				var oModelboeExchgDetails = new sap.ui.model.json.JSONModel([]);
				oModelboeExchgDetails.setData(this.boeExchgDetails);
				this.getView().setModel(oModelboeExchgDetails, "boeExchgDetails");
				/*************** oModelDEPB details ***************************/
			} else {
				this.boeExchgDetails.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					boeitno: this.boeItemnumber,
					untinrs: "",
					stdcr: "",
					cerno: "",
					cerdt: "",
					rate: "",
					efdt: "",
					curcd: "",
					bknam: "",
					Mode: "X"
				});
				this.getView().getModel("boeExchgDetails").refresh();
			}
		},

		addRow_boeCetDetails: function (oArg) {
			if (!this.boeCetDetails) {
				/*************** DEPB details ***************************/
				this.boeCetDetails = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						cettyp: "",
						cetnum: "",
						cetdt: null,
						Mode: "X"
					}]
				};
				var oModelboeCetDetails = new sap.ui.model.json.JSONModel([]);
				oModelboeCetDetails.setData(this.boeCetDetails);
				this.getView().setModel(oModelboeCetDetails, "boeCetDetails");
				/*************** oModelDEPB details ***************************/
			} else {
				this.boeCetDetails.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					cettyp: "",
					cetnum: "",
					cetdt: null,
					Mode: "X"
				});
				this.getView().getModel("boeCetDetails").refresh();
			}
		},
		deleteCert: function (oArg) {
			var seqiteno = "1";
			var NextseqNo = "";
			var currentRow = oArg.getSource().getParent().sId.slice(-1);
			var _self = this;
			var mParameters = {
				groupId: "batchDelete",
				eTag: "*"
			};
			MessageBox.confirm("Changes Cannot be Reversed. Do You Still Want to Delete ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						_self.BoeModel.remove("/xBRIxI_CERT_BE(doctyp='" + _self.boeCetDetails.results[currentRow].doctyp + "',docno='" + _self.boeCetDetails
							.results[currentRow].docno + "',certytype='" + _self.boeCetDetails.results[currentRow].certytype + "',certynumb='" +
							_self.boeCetDetails
							.results[currentRow].certynumb + "')", mParameters);
						_self.BoeModel.submitChanges({
							mParameters,
							success: function (result) {
								MessageBox.success("Selected Data Deleted Successfully");
								_self.boeCetDetails.results.splice(currentRow, 1);
								_self.getView().getModel("boeCetDetails").refresh();
							},
							error: function (err) {
								MessageBox.error("Error while Deleting Details");
							}
						});
					}
				}
			});
		},
		addRow_boeCtxDetails: function (oArg) {
			if (!this.boeCtxDetails) {
				/*************** DEPB details ***************************/
				this.boeCtxDetails = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						ctxtype: "",
						ctxregno: "",
						scode: "",
						Mode: "X"
					}]
				};
				var oModelboeCtxDetails = new sap.ui.model.json.JSONModel([]);
				oModelboeCtxDetails.setData(this.boeCtxDetails);
				this.getView().setModel(oModelboeCtxDetails, "boeCtxDetails");
				/*************** oModelDEPB details ***************************/
			} else {
				this.boeCtxDetails.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					ctxtype: "",
					ctxregno: "",
					scode: "",
					Mode: "X"
				});
				this.getView().getModel("boeCtxDetails").refresh();
			}
		},
		addRow_Stmnt: function (oArg) {
			this.TempVar = this.TempVar + 1;
			if (!this.I_statemet_be_Info) {
				/*************** DEPB details ***************************/
				this.I_statemet_be_Info = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						boeitno: this.boeItemnumber,
						itsrno: this.boeItemnumber,
						dcltyp: "B",
						ujno: "",
						ujdate: "",
						//	dclnum: "",
						//	dcldt: null,
						tmpsrlNo: this.TempVar,
						//invsrnum: "",
						//itsrno: "",
						stmnt: "REM",
						stmcod: "",
						stmtxt: "",
						Mode: "X"
					}]
				};
				var oModelStmnt = new sap.ui.model.json.JSONModel([]);
				oModelStmnt.setData(this.I_statemet_be_Info);
				this.getView().setModel(oModelStmnt, "I_statemet_be_Info");
				/*************** oModelDEPB details ***************************/
			} else {
				this.I_statemet_be_Info.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					boeitno: this.boeItemnumber,
					itsrno: this.boeItemnumber,
					dcltyp: "B",
					ujno: "",
					ujdate: "",
					//	dclnum: "",
					tmpsrlNo: this.TempVar,
					//invsrnum: "",
					//	itsrno: "",
					stmnt: "REM",
					stmcod: "",
					stmtxt: "",
					Mode: "X"
				});
				this.getView().getModel("I_statemet_be_Info").refresh();
			}
		},
		deleteStmnt: function (oArg) {
			var seqiteno = "1";
			var NextseqNo = "";
			var _self = this;
			var mParameters = {
				groupId: "batchDelete",
				eTag: "*"
			};
			var SrlNo = oArg.getSource().getParent().getCells()[0].data("StSrlNo");
			var TempSl = oArg.getSource().getParent().getCells()[0].data("TmpsrlNo");
			if (SrlNo) {
				var currentRow = this.I_statemet_be_Info.results.findIndex(function (item, i) {
					return item.boeitno === _self.boeItemnumber && item.statment_srlno === SrlNo
				});
			} else {
				//	var currentRow = oArg.getSource().getParent().sId.slice(-1);
				var currentRow = this.I_statemet_be_Info.results.findIndex(function (item, i) {
					return item.boeitno === _self.boeItemnumber && item.tmpsrlNo === TempSl
				});
			}
			//var currentRow = oArg.getSource().getParent().sId.slice(-1);

			MessageBox.confirm("Changes Cannot be Reversed. Do You Still Want to Delete ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						if (SrlNo) {
							_self.BoeModel.remove("/xBRIxI_statemet_be(doctyp='" + _self.I_statemet_be_Info.results[currentRow].doctyp + "',docno='" +
								_self.I_statemet_be_Info.results[currentRow].docno + "',boeitno='" + _self.I_statemet_be_Info.results[currentRow].boeitno +
								"',statment_srlno='" + _self.I_statemet_be_Info.results[currentRow].statment_srlno +
								"')", mParameters);
							_self.BoeModel.submitChanges({
								mParameters,
								success: function (result) {
									debugger;
									MessageBox.success("Selected Data Deleted Successfully");
									_self.I_statemet_be_Info.results.splice(currentRow, 1);
									_self.getView().getModel("I_statemet_be_Info").refresh();
								},
								error: function (err) {
									debugger;
									MessageBox.error("Error while Deleting Details");
								}
							});
						} else {
							MessageBox.success("Selected Data Deleted Successfully");
							_self.I_statemet_be_Info.results.splice(currentRow, 1);
							_self.getView().getModel("I_statemet_be_Info").refresh();
						}

					}
				}
			});
		},
		addRow_Sup: function (oArg) {
			if (!this.I_be_sup_doc_Info) {
				/*************** Supporting details ***************************/
				this.I_be_sup_doc_Info = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						boeitno: this.boeItemnumber,
						itsrno: this.boeItemnumber,
						dectyp: "E",
						invsrnum: "",
						itsrno: "",
						cha_lic_number: this.boeBEdetails.results[0].chacod,
						iec: (this.boeHeaderData.ieccodsel) ? (this.boeHeaderData.ieccodsel).substring(0, 10) : this.boeHeaderData.ieccodsel,
						icegate_user_id: (this.boeBEdetails.results[0].sender_id) ? (this.boeBEdetails.results[0].sender_id).substring(0, 15) : (
							this
							.boeBEdetails.results[0].sender_id),
						image_ref_no: "",
						doctypcode: "",
						docissucode: "",
						docsspartyname: (this.boeHeaderData.supp_name) ? (this.boeHeaderData.supp_name).substring(0, 70) : (this.boeHeaderData.supp_name),
						docsspartyname1: (this.boeHeaderData.supp_street) ? (this.boeHeaderData.supp_street).substring(0, 70) : (this.boeHeaderData
							.supp_street),
						docsspartyname2: "",
						docsspartyname3: (this.boeHeaderData.supp_city) ? (this.boeHeaderData.supp_city).substring(0, 35) : (this.boeHeaderData.supp_city),
						docsspartyname4: (this.boeHeaderData.supp_postalcode) ? (this.boeHeaderData.supp_postalcode).substring(0, 10) : (this.boeHeaderData
							.supp_postalcode),
						docrefno: "",
						placeofissue: "",
						docissuedate: null,
						docexpirydate: null,
						docbenecode: "",
						docbenname: (this.boeBEdetails.results[0].namofimp) ? (this.boeBEdetails.results[0].namofimp).substring(0, 70) : (this.boeBEdetails
							.results[0].namofimp),
						docbenname1: (this.boeBEdetails.results[0].add1) ? (this.boeBEdetails.results[0].add1).substring(0, 70) : (this.boeBEdetails
							.results[
								0].add1),
						docbenname2: (this.boeBEdetails.results[0].add2) ? (this.boeBEdetails.results[0].add2).substring(0, 70) : (this.boeBEdetails
							.results[
								0].add2),
						docpartynamecity: this.boeBEdetails.results[0].city,
						docpartynamepin: this.boeBEdetails.results[0].pin,
						filetype: "",
						Mode: "X"
					}]
				};
				var oModelSup = new sap.ui.model.json.JSONModel([]);
				oModelSup.setData(this.I_be_sup_doc_Info);
				this.getView().setModel(oModelSup, "I_be_sup_doc_Info");
				/*************** oModelDEPB details ***************************/
			} else {
				this.I_be_sup_doc_Info.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					boeitno: this.boeItemnumber,
					itsrno: this.boeItemnumber,
					dectyp: "E",
					invsrnum: "",
					itsrno: "",
					cha_lic_number: this.boeBEdetails.results[0].chacod,
					iec: (this.boeHeaderData.ieccodsel) ? (this.boeHeaderData.ieccodsel).substring(0, 10) : this.boeHeaderData.ieccodsel,
					icegate_user_id: (this.boeBEdetails.results[0].sender_id) ? (this.boeBEdetails.results[0].sender_id).substring(0, 15) : (this
						.boeBEdetails
						.results[0].sender_id),
					image_ref_no: "",
					doctypcode: "",
					docissucode: "",
					docsspartyname: (this.boeHeaderData.supp_name) ? (this.boeHeaderData.supp_name).substring(0, 70) : (this.boeHeaderData.supp_name),
					docsspartyname1: (this.boeHeaderData.supp_street) ? (this.boeHeaderData.supp_street).substring(0, 70) : (this.boeHeaderData.supp_street),
					docsspartyname2: "",
					docsspartyname3: (this.boeHeaderData.supp_city) ? (this.boeHeaderData.supp_city).substring(0, 35) : (this.boeHeaderData.supp_city),
					docsspartyname4: (this.boeHeaderData.supp_postalcode) ? (this.boeHeaderData.supp_postalcode).substring(0, 10) : (this.boeHeaderData
						.supp_postalcode),
					docrefno: "",
					placeofissue: "",
					docissuedate: null,
					docexpirydate: null,
					docbenecode: "",
					docbenname: (this.boeBEdetails.results[0].namofimp) ? (this.boeBEdetails.results[0].namofimp).substring(0, 70) : (this.boeBEdetails
						.results[0].namofimp),
					docbenname1: (this.boeBEdetails.results[0].add1) ? (this.boeBEdetails.results[0].add1).substring(0, 70) : (this.boeBEdetails.results[
						0].add1),
					docbenname2: (this.boeBEdetails.results[0].add2) ? (this.boeBEdetails.results[0].add2).substring(0, 70) : (this.boeBEdetails.results[
						0].add2),
					docpartynamecity: this.boeBEdetails.results[0].city,
					docpartynamepin: this.boeBEdetails.results[0].pin,
					filetype: "",
					Mode: "X"
				});
				this.getView().getModel("I_be_sup_doc_Info").refresh();
			}
		},
		deleteSup: function (oArg) {
			var seqiteno = "1";
			var NextseqNo = "";
			//	var currentRow = oArg.getSource().getParent().sId.slice(-1);
			var _self = this;
			var mParameters = {
				groupId: "batchDelete",
				eTag: "*"
			};
			var SrlNo = oArg.getSource().getParent().getCells()[0].data("SupSrlNo");
			if (SrlNo) {
				var currentRow = this.I_be_sup_doc_Info.results.findIndex(function (item, i) {
					return item.boeitno === _self.boeItemnumber && item.sup_doc_srlno === SrlNo
				});
			} else {
				var currentRow = oArg.getSource().getParent().sId.slice(-1);
			}

			MessageBox.confirm("Changes Cannot be Reversed. Do You Still Want to Delete ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						_self.BoeModel.remove("/xBRIxI_be_sup_doc(doctyp='" + _self.I_be_sup_doc_Info.results[currentRow].doctyp + "',docno='" +
							_self.I_be_sup_doc_Info.results[currentRow].docno + "',boeitno='" + _self.I_be_sup_doc_Info.results[currentRow].boeitno +
							"',sup_doc_srlno='" + _self.I_be_sup_doc_Info.results[currentRow].sup_doc_srlno + "')", mParameters);
						_self.BoeModel.submitChanges({
							mParameters,
							success: function (result) {
								MessageBox.success("Selected Data Deleted Successfully");
								_self.I_be_sup_doc_Info.results.splice(currentRow, 1);
								_self.getView().getModel("I_be_sup_doc_Info").refresh();
							},
							error: function (err) {
								MessageBox.error("Error while Deleting Details");
							}
						});
					}
				}
			});
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
		AuthConfiguration: function (Type) {
			if (Type == "Display") {
				var entity = "xBRIxI_UICONFIG03";
			} else if (Type == "Change") {
				var entity = "xBRIxI_UICONFIG02";
			} else {
				var entity = "xBRIxI_UICONFIG01";
			}
			if (this.docType == "W") {
				var ModuleType = "BOE";
			} else if (this.docType == "Y") {
				var ModuleType = "BOEI";
			} else if (this.docType == "E") {
				var ModuleType = "BOEX";
			} else if (this.docType == "B") {
				var ModuleType = "BOEB";
			}
			var _self = this;
			var filters = new Array();
			var filterval = new sap.ui.model.Filter("modid", sap.ui.model.FilterOperator.EQ, ModuleType);
			filters.push(filterval);
			var filterval = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, this.BOEStatus);
			filters.push(filterval);
			this.RequiredFileds = new Array();
			this.RequiredDrpFileds = new Array();
			this.RequiredFiledsDesc = new Array();
			this.RequiredFiledsErrorSts = new Array();
			this.RequiredItemFileds = new Array();
			this.RequiredItemFiledsDesc = new Array();
			this.RequiredItemFiledsErrorSts = new Array();
			this.ItemFileds = new Array();
			this.ItemFiledsDesc = new Array();
			this.ItemFiledsErrorSts = new Array();
			this.EnabledFileds = new Array();
			this.getOwnerComponent().getModel("Config_Model").read("/" + entity, {
				urlParameters: {
					$top: "5000"
				},
				filters: filters,
				success: function (getData) {
					var arr = getData.results;
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].entityset == "tab_") {
							_self.getView().byId('tab_' + arr[i].fldnam).setVisible((arr[i].visible == "true") ? true : false);
						} else
						if (arr[i].entityset == "btn_") {
							_self.getView().byId(arr[i].fldnam).setVisible((arr[i].visible == "true") ? true : false);
						} else
						if (arr[i].tbl == true) {
							if (_self.getView().byId(arr[i].fldnam)) {
								_self.getView().byId(arr[i].fldnam).setVisible((arr[i].visible == "true") ? true : false);
							}
						} else {
							if (_self.getView().byId(arr[i].fldnam)) {
								/*if (Type == "Display") {
									console.log(arr[i].fldnam);
									_self.getView().byId(arr[i].fldnam).setVisible((arr[i].visible == "true") ? true : false);

									_self.getView().byId(arr[i].fldnam).setEnabled((arr[i].enable == "true") ? true : false);
									if (arr[i].enable == "true") {
										_self.EnabledFileds.push(arr[i].fldnam);
									}
								} else {*/
								console.log(arr[i].fldnam);
								_self.getView().byId(arr[i].fldnam).setVisible((arr[i].visible == "true") ? true : false);
								_self.getView().byId(arr[i].fldnam).setEnabled((arr[i].enable == "true") ? true : false);
								// _self.getView().byId(arr[i].fldnam).setEditable((arr[i].editable == "true") ? true : false);
								_self.getView().byId(arr[i].fldnam).setRequired((arr[i].required == "true") ? true : false);
								if (arr[i].required == "true") {
									if (arr[i].entityset.match("xBRIxI_EXCHANGE_BE") || arr[i].entityset.match("xBRIxI_iid_ctx_be") || arr[i].entityset.match(
											"xBRIxI_reimport_be") || arr[i].entityset.match("xBRIxi_iidbeitm") || arr[i].entityset.match("xBRIxBE_BOE") || arr[i]
										.entityset
										.match("xBRIxi_boe_item_swc_be") || arr[i].entityset.match("xBRIxI_CERT_BE") || arr[i].entityset.match("xBRIxI_IGMS_BE") ||
										arr[i].entityset.match("xBRIxi_boe_itm_pro_be") || arr[i].entityset.match("xBRIxi_boe_itm_ctrl_be") || arr[i].entityset
										.match(
											"xBRIxI_RSP_BE") || arr[i].entityset.match("xBRIxI_statemet_be") || arr[i].entityset.match(
											"xBRIxI_be_sup_doc") || arr[i].entityset.match("xBRIxI_IIDBEHDR")) {
										_self.RequiredItemFileds.push(arr[i].fldnam);
										_self.RequiredItemFiledsDesc.push(arr[i].flddescr);
										_self.RequiredItemFiledsErrorSts.push(arr[i].errstat);
									} else {
										_self.RequiredFileds.push(arr[i].fldnam);
										_self.RequiredDrpFileds.push(arr[i].dropdwn);
										_self.RequiredFiledsDesc.push(arr[i].flddescr);
										_self.RequiredFiledsErrorSts.push(arr[i].errstat);
									}

								}
								//	}
							}
						}
					}
				},
				error: function (error) {
					MessageBox.error("Something Went Wrong . Please Try again Later");
				}
			});
		},
		SuppRelChange: function (oEvent) {
			var SelVal = oEvent.mParameters.selectedItem.mProperties.key;
			if (SelVal == "Y" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.getView().byId("svd_order_number").setRequired(true);
				this.getView().byId("svbf").setRequired(true);
				this.getView().byId("wlf").setRequired(true);
			} else {
				this.getView().byId("svd_order_number").setRequired(false);
				this.getView().byId("svbf").setRequired(false);
				this.getView().byId("wlf").setRequired(false);
			}
		},
		SVBFlag_Change: function (oEvent) {
			var SelVal = oEvent.mParameters.selectedItem.mProperties.key;
			if (SelVal == "B" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.getView().byId("svb_loadduty").setRequired(true);
				this.getView().byId("svb_load_assval").setRequired(true);
			} else if (SelVal == "A" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.getView().byId("svb_loadduty").setRequired(false);
				this.getView().byId("svb_load_assval").setRequired(true);
			} else if (SelVal == "D" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.getView().byId("svb_loadduty").setRequired(true);
				this.getView().byId("svb_load_assval").setRequired(false);
			} else {
				this.getView().byId("svb_loadduty").setRequired(true);
				this.getView().byId("svb_load_assval").setRequired(false);
			}
		},
		RequiredSetSVB: function (svbf_val) {
			var SelVal = svbf_val;
			if (this.boeHeaderData.supplier_rel == "Y" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.getView().byId("svd_order_number").setRequired(true);
				this.getView().byId("svbf").setRequired(true);
				this.getView().byId("wlf").setRequired(true);
			} else {
				this.getView().byId("svd_order_number").setRequired(false);
				this.getView().byId("svbf").setRequired(false);
				this.getView().byId("wlf").setRequired(false);
			}
			if (SelVal == "B" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.getView().byId("svb_loadduty").setRequired(true);
				this.getView().byId("svb_load_assval").setRequired(true);
			} else if (SelVal == "A" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.getView().byId("svb_loadduty").setRequired(false);
				this.getView().byId("svb_load_assval").setRequired(true);
			} else if (SelVal == "D" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.getView().byId("svb_loadduty").setRequired(true);
				this.getView().byId("svb_load_assval").setRequired(false);
			} else {
				this.getView().byId("svb_loadduty").setRequired(true);
				this.getView().byId("svb_load_assval").setRequired(false);
			}
		},
		AddRequiredFields: function () {
			/******IF Clearance type HSP - Proceding levle mandatory*******/
			if (this.boeHeaderData.clearance_type == "HSP" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.RequiredFileds.push("proclevl");
				this.RequiredDrpFileds.push("true");
				this.RequiredFiledsDesc.push("Preceding level");
				this.RequiredFiledsErrorSts.push("E");
			}
			/******IF Section req 48 or first check requested is yes - Reason for request mandatory*******/

			if ((this.boeBEdetails.results[0].secreq == "Y" || this.boeBEdetails.results[0].fcr == "Y") && (this.BOEStatus >= 19 && this.BOEStatus <=
					24) && (this.docType != "E")) {
				this.RequiredFileds.push("reason_req");
				this.RequiredDrpFileds.push("false");
				this.RequiredFiledsDesc.push("Reasons for request");
				this.RequiredFiledsErrorSts.push("E");
			}
			/**************Either ATA at ICD or ATA At Destination port*************/

			if (this.getView().byId("ataicd").getValue() == "" && this.getView().byId("atadestport").getValue() == "" && this.docType != "B" &&
				(this.BOEStatus >= 25 &&
					this.BOEStatus <= 28)) {
				this.RequiredFileds.push("ataicd");
				this.RequiredDrpFileds.push("false");
				this.RequiredFiledsDesc.push("ATA at ICD");
				this.RequiredFiledsErrorSts.push("E");
				this.RequiredFileds.push("atadestport");
				this.RequiredDrpFileds.push("false");
				this.RequiredFiledsDesc.push("ATA at Destination Port");
				this.RequiredFiledsErrorSts.push("E");
			}
			/****************If Gateway Port Code and Final Destination Port is Different then These fields must be mandatory***************************/
			/*	if ((this.getView().byId("gatptcod").getValue() != "") && (this.getView().byId("icd").getValue() != "")) {
					if (!(this.getView().byId("gatptcod").getValue()).match(this.getView().byId("icd").getValue())) {
						this.getView().byId("icd_igm_no").setRequired(true);
						this.getView().byId("icd_igm_date").setRequired(true);
						this.RequiredFileds.push("icd_igm_no");
						this.RequiredDrpFileds.push("false");
						this.RequiredFiledsDesc.push("ICD IGM No.");
						this.RequiredFiledsErrorSts.push("E");
						this.RequiredFileds.push("icd_igm_date");
						this.RequiredDrpFileds.push("false");
						this.RequiredFiledsDesc.push("ICD IGM Date");
						this.RequiredFiledsErrorSts.push("E");
					}
				}*/
		},
		FindIndexAndRemove: function (Type) {
			if (Type == "Header") {
				/*, "icd_igm_no", "icd_igm_date"*/
				var Header_arry = ["proclevl", "reason_req"];
				for (var i = 0; i < Header_arry.length; i++) {
					var index = this.RequiredFileds.indexOf(Header_arry[i]);
					if (index > -1) {
						this.RequiredFileds.splice(index, 1);
						this.RequiredDrpFileds.splice(index, 1);
						this.RequiredFiledsDesc.splice(index, 1);
						this.RequiredFiledsErrorSts.splice(index, 1);
					}
				}
			} else {
				var Item_arry = ["fta_num", "warhpno", "svd_order_number", "svbf", "wlf", "svb_loadduty", "svb_load_assval", "exidv", "sealno",
					"contsize", "conttyp", "igmno", "igmdt", "iwrdt", "randd_notifctn_no", "info_text", "stmcod", "stmtxt"
				];
				for (var i = 0; i < Item_arry.length; i++) {
					var index = this.RequiredItemFileds.indexOf(Item_arry[i]);
					if (index > -1) {
						this.RequiredItemFileds.splice(index, 1);
						this.RequiredItemFiledsDesc.splice(index, 1);
						this.RequiredItemFiledsErrorSts.splice(index, 1);
					}
				}
			}
		},
		AddItemRequiredFields: function (arr) {
			if (arr["fta_entitled"]) {
				this.RequiredItemFileds.push("fta_num");
				this.RequiredItemFiledsDesc.push("FTA Number");
				this.RequiredItemFiledsErrorSts.push("E");
				this.RequiredItemFileds.push("warhpno");
				this.RequiredItemFiledsDesc.push("FTA CoO No.");
				this.RequiredItemFiledsErrorSts.push("E");
			}
			//comnted by swathy	if (arr["info_code"] == "SIUNAPL" || arr["info_code"] == "COOG" || arr["info_code"] == "COOP") {
			if (arr["info_code"] == "SIUNAPL" || ((arr["info_code"] == "COOG" || arr["info_code"] == "COOP") && (arr["info_type"] == "ORC") &&
					(arr["info_qua"] == "ORG")) || (arr["info_type"] == "ORC" && arr["info_qua"] == "COO")) {
				//if (arr["info_code"] == "QW") {
				this.RequiredItemFileds.push("info_text");
				this.RequiredItemFiledsDesc.push("Text");
				this.RequiredItemFiledsErrorSts.push("E");
			}
			if (arr["randd_applicability"]) {
				this.RequiredItemFileds.push("randd_notifctn_no");
				this.RequiredItemFiledsDesc.push("R and D Notification Number");
				this.RequiredItemFiledsErrorSts.push("E");
			}

			if (this.boeHeaderData.supplier_rel == "Y" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.RequiredItemFileds.push("svd_order_number");
				this.RequiredItemFiledsDesc.push("SVB Order Number");
				this.RequiredItemFiledsErrorSts.push("E");
				this.RequiredItemFileds.push("svbf");
				this.RequiredItemFiledsDesc.push("SVB Flag");
				this.RequiredItemFiledsErrorSts.push("E");
				this.RequiredItemFileds.push("wlf");
				this.RequiredItemFiledsDesc.push("Whether load Final/Provisional on Assessable Value");
				this.RequiredItemFiledsErrorSts.push("E");
			}
			if (arr["svbf"] == "B" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.RequiredItemFileds.push("svb_loadduty");
				this.RequiredItemFiledsDesc.push("SVB Load (Duty)");
				this.RequiredItemFiledsErrorSts.push("E");
				this.RequiredItemFileds.push("svb_load_assval");
				this.RequiredItemFiledsDesc.push("SVB Load (Assessable Value)");
				this.RequiredItemFiledsErrorSts.push("E");
			}
			if (this.boeHeaderData.modtran != "AIR" && this.boeHeaderData.shptyp != "BULK" && this.docType != "E" && (this.BOEStatus >= 19 &&
					this.BOEStatus <= 24)) {
				this.RequiredItemFileds.push("exidv");
				this.RequiredItemFiledsDesc.push("Container Number");
				this.RequiredItemFiledsErrorSts.push("E");
				this.RequiredItemFileds.push("sealno");
				this.RequiredItemFiledsDesc.push("Container Seal No.");
				this.RequiredItemFiledsErrorSts.push("E");
				this.RequiredItemFileds.push("contsize");
				this.RequiredItemFiledsDesc.push("Container size");
				this.RequiredItemFiledsErrorSts.push("E");
				this.RequiredItemFileds.push("conttyp");
				this.RequiredItemFiledsDesc.push("Container Type");
				this.RequiredItemFiledsErrorSts.push("E");
			}
			/************If statement is REM then set Mandatory*******************/
			if (arr["stmnt"] == "REM") {
				this.RequiredItemFileds.push("stmcod");
				this.RequiredItemFiledsDesc.push("Statement Code");
				this.RequiredItemFiledsErrorSts.push("E");
				this.RequiredItemFileds.push("stmtxt");
				this.RequiredItemFiledsDesc.push("Statement Text");
				this.RequiredItemFiledsErrorSts.push("E");
			}
			/******IF BE Filing status  Normal, Prior or Advanced -  N (3 Mandatory),P (2 Manadatory) and A (0 Mandatory)*******/
			if (this.SelValFlSts == "N" && this.docType != "E" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.RequiredItemFileds.push("igmno");
				this.RequiredItemFiledsDesc.push("IGM No.");
				this.RequiredItemFiledsErrorSts.push("E");
				this.RequiredItemFileds.push("igmdt");
				this.RequiredItemFiledsDesc.push("IGM Date");
				this.RequiredItemFiledsErrorSts.push("E");
				this.RequiredItemFileds.push("iwrdt");
				this.RequiredItemFiledsDesc.push("Inward Date");
				this.RequiredItemFiledsErrorSts.push("E");
			} else if (this.SelValFlSts == "P" && this.docType != "E" && (this.BOEStatus >= 19 && this.BOEStatus <= 24)) {
				this.RequiredItemFileds.push("igmno");
				this.RequiredItemFiledsDesc.push("IGM No.");
				this.RequiredItemFiledsErrorSts.push("E");
				this.RequiredItemFileds.push("igmdt");
				this.RequiredItemFiledsDesc.push("IGM Date");
				this.RequiredItemFiledsErrorSts.push("E");
			}

		},
		CheckRequiredFields: function (Type) {
			var ErrorMsg = "";
			var WarningMsg = "";
			var arra = this.RequiredFileds;
			this.NotValid = false;
			var MsgType = "";
			var CurrentSelSts = this.getView().byId("boests").getSelectedKey();
			this.AddRequiredFields();
			for (var i = 0; i < this.RequiredFileds.length; i++) {
				// if (this.getView().byId(this.RequiredFileds[i]).getValue() == "") {
				// if (this.RequiredFileds[i] == "clearance_type" || this.RequiredFileds[i] == "impurp" || this.RequiredFileds[i] == "defpmt" || this
				//  .RequiredFileds[i] == "shptyp") {
				if (this.RequiredDrpFileds[i] == "true") {
					var value = this.byId(this.RequiredFileds[i]).getSelectedKey();
				} else {
					/*********Should not accept 0*********/
					if (this.RequiredFileds[i] == "whcsid" || this.RequiredFileds[i] == "npr" || this.RequiredFileds[i] == "grswght" || this.RequiredFileds[
							i] == "ujno") {
						if (this.byId(this.RequiredFileds[i]).getValue() <= 0) {
							this.byId(this.RequiredFileds[i]).setValue("");
						}
					}
					var value = this.byId(this.RequiredFileds[i]).getValue();
				}
				if (value == "") {
					if (this.RequiredFiledsErrorSts[i] == "E") {
						MsgType = "Error";
						this.NotValid = true;
						ErrorMsg = ErrorMsg + this.RequiredFiledsDesc[i] + ","
					} else {
						if (CurrentSelSts >= 20) {
							MsgType = "Error";
						}
						this.NotValid = true;
						WarningMsg = WarningMsg + this.RequiredFiledsDesc[i] + ","
					}
				}
			}
			this.FindIndexAndRemove("Header");
			if (MsgType == "Error") {
				if (CurrentSelSts >= 20 && ErrorMsg == "") {
					ErrorMsg = WarningMsg;
				}
				this.Msg = ErrorMsg.substring(0, ErrorMsg.length - 1);
				MessageBox.error("Please fill " + this.Msg + " In Header Tabs");
				return false;
			} else {
				this.Msg = WarningMsg.substring(0, WarningMsg.length - 1) + " In Header Tabs";
			}
			return true;
		},
		CheckItemRequiredFields: function (arr, Message, ItemNo) {
			var ErrorMsg = "";
			var WarningMsg = "";
			var arra = this.RequiredItemFileds;
			this.NotValid = false;
			var MsgType = "";
			var CurrentSelSts = this.getView().byId("boests").getSelectedKey();
			this.AddItemRequiredFields(arr);
			debugger;

			for (var i = 0; i < this.RequiredItemFileds.length; i++) {
				if (arr.hasOwnProperty(this.RequiredItemFileds[i])) {
					if (this.RequiredItemFileds[i] == "rsprs" || this.RequiredItemFileds[i] == "qunty") {
						if (arr[this.RequiredItemFileds[i]] <= 0) {
							this.getView().byId(this.RequiredItemFileds[i]).setValue("");
							arr[this.RequiredItemFileds[i]] = 0;
						}
					}
					if (arr[this.RequiredItemFileds[i]] == "" || arr[this.RequiredItemFileds[i]] == null) {
						if (this.RequiredItemFiledsErrorSts[i] == "E") {
							MsgType = "Error";
							this.NotValid = true;
							ErrorMsg = ErrorMsg + this.RequiredItemFiledsDesc[i] + ","
						} else {
							if (CurrentSelSts >= 20) {
								MsgType = "Error";
							}
							this.NotValid = true;
							WarningMsg = WarningMsg + this.RequiredItemFiledsDesc[i] + ","
						}
					}
				}
			}
			this.FindIndexAndRemove("Item");
			if (ItemNo) {
				var boeItem = " for BoE Item No " + arr.boeitno;
			} else {
				var boeItem = "";
			}
			if (MsgType == "Error") {
				if (CurrentSelSts >= 20 && ErrorMsg == "") {
					ErrorMsg = WarningMsg;
				}
				this.Msg = ErrorMsg.substring(0, ErrorMsg.length - 1);
				MessageBox.error("Please fill " + this.Msg + "" + Message + "" + boeItem);
				return false;
			} else {
				this.Msg = WarningMsg.substring(0, WarningMsg.length - 1) + "" + Message + "" + boeItem;
			}
			return true;
		},
		OnPressPostBE: function () {
			var _self = this;
			this._OpenBusyDialog();
			var oparameters = {
				doctyp: this.docType,
				docno: this.docNumber
			};
			this.BoeModel.callFunction("/boepost", {
				method: "POST",
				urlParameters: oparameters,
				success: function (result, response) {
					var error = false;
					if (result.__batchResponses) {
						if (result.__batchResponses["0"].response) {
							var m = {
								message: []
							};
							m.message = JSON.parse(result.__batchResponses["0"].response.body).error.message.value;
							error = true;
						} else {
							var m = JSON.parse(result.__batchResponses["0"].__changeResponses["0"].headers["sap-message"]);
						}
					} else {
						var m = {
							message: []
						};
						m.message = "BoE Posted Successfully";
					}
					if (!error) {
						MessageBox.success(m.message, {
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									_self._CloseBusyDialog();
									_self.getView().byId("btn_postbe").setVisible(false);
								}
							}
						});
					} else {
						MessageBox.error(m.message, {
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {
								_self._CloseBusyDialog();
							}
						});
					}
				},
				error: function (err) {
					if (err.responseText) {
						if (JSON.parse(err.responseText).error.message.value) {
							var Msg = JSON.parse(err.responseText).error.message.value;
						} else {
							var Msg = err.message;
						}
						MessageBox.error(Msg);
					} else {
						MessageBox.error("Something went wrong. Please try again later.");
					}
					_self._CloseBusyDialog();
				}
			});
		},
		OnPressCHA: function () {
			var _self = this;
			var semanticObject = "CHA_CREATE_APP1";
			this.BolNo = this.getView().byId("bolnr").getValue();
			if (this.Chacode && this.BolNo) {
				var RefNo = this.Chacode;
				var BolNo = this.BolNo;
			} else {
				var RefNo = "";
				var BolNo = "";
			}
			if (sap.ushell.Container) {
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
				var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
					target: {
						semanticObject: semanticObject,
						action: "Display"
					},
					params: {
						"Ref_Number": RefNo,
						"BOL_Number": BolNo,
						"BOE_Num": this.docNumber,
						"Doc_Type": "I"
					}
				})) || "";
				var url = window.location.href.split('#')[0] + hash;
				sap.m.URLHelper.redirect(url, true);
			}
		},
		OnPressPrint: function () {
			var _self = this;
			var semanticObject = "BOE_PRINTS";
			var RefNo = this.docNumber;
			var RefType = "BOE";
			if (sap.ushell.Container) {
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
				var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
					target: {
						semanticObject: semanticObject,
						action: "Display"
					},
					params: {
						"Ref_Number": RefNo,
						"Ref_Type": RefType
					}
				})) || "";
				var url = window.location.href.split('#')[0] + hash;
				sap.m.URLHelper.redirect(url, true);
			}
		},
		handleBondNo: function (oEvent) {
			this.inputId = oEvent.getSource().getId();
			var newArr = new Array();
			var resar = new Array();
			var res = {};
			var _self = this;
			var sorters = new Array();
			var sortval = new sap.ui.model.Sorter("trkno", true, false);
			sorters.push(sortval);
			this.BoeModel.read("/xBRIxI_IBSBNDMAST", {
				urlParameters: {
					$top: "5000"
				},
				sorters: sorters,
				success: function (getData) {
					newArr = getData.results;
					_self.BondDataResults = getData;
					if (_self.inputId.includes("bondno")) {
						resar = newArr.filter(function (aa1) {
							//	return aa1.bondtyp === "WB";
							return aa1.bondsubtyp === "I";
						});
					} else {
						resar = newArr.filter(function (aa1) {
							return aa1.bondsubtyp != "I";
						});
					}
					res = {
						result: resar
					};
					var oModeldata = new sap.ui.model.json.JSONModel();
					oModeldata.setData(res);
					_self.getView().setModel(oModeldata, "datamodel");
					if (!_self._valueHelpTrack) {
						_self._valueHelpTrack = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.bondNo", _self);
						_self.getView().addDependent(_self._valueHelpTrack);
						_self._OpenBusyDialogNoDelay();
					}
					_self._valueHelpTrack.open();
				},
				error: function (error) {}
			});
		},
		_handleCloseBondNo: function (evt) {
			var _self = this;
			var oSelectedItem = evt.getParameter("selectedItem");
			var totdtyval = this.getView().byId("totdtyval").getValue();
			if (oSelectedItem) {
				_self.BoeModel.read("/xBRIxCE_WH_BONDNO_CHECK(bondno='" + oSelectedItem.getTitle() + "',totdtyval='" + totdtyval +
					"')/Set", {
						success: function (getData) {
							if (getData.results[0].status == "true") {
								var productInput = _self.getView().byId(_self.inputId);
								productInput.setValue(oSelectedItem.getTitle());
								if (_self.BondDataResults.results.filter(a => a.trkno == oSelectedItem.getTitle()).length > 0) {
									var BondDate = _self.BondDataResults.results.filter(a => a.trkno == oSelectedItem.getTitle())[0].bonddate;
									BondDate = _self.formatDate(BondDate);
								}
								if (_self.inputId.includes("bondno")) {
									_self.getView().byId("bonddat").setValue(BondDate);

								} else if (_self.inputId.includes("otherbndno")) {
									_self.getView().byId("otherbnd_date").setValue(BondDate);
								}
							} else {
								var message = getData.results[0].message;
								MessageBox.error(message);
							}
						},
						error: function (getData) {
							console.log("error");
						}
					});
			}
			evt.getSource().getBinding("items").filter([]);
		},
		ExchangeRateDateChange: function (oEvent) {
			if (!this._ExRtDtDialog) {
				this._ExRtDtDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.ChangeExrtDt", this);
				this.getView().addDependent(this._ExRtDtDialog);
			}
			this._ExRtDtDialog.open();
		},
		oncloseWin: function () {
			this._ExRtDtDialog.close();
		},
		AddNewAlocationRows: function (boeItemnumber, CurrentItemData) {
			var localthis = this;
			var jsonLicence = {};
			var FilterRecord = {
				results: []
			};
			FilterRecord.results = localthis.LicenceItemData.results.filter(a => a.docitem == boeItemnumber);
			localthis.LicenceItemData.results = localthis.LicenceItemData.results.filter(function (val) {
				return FilterRecord.results.indexOf(val) == -1;
			});
			jsonLicence.actdty = localthis.InvItemData.results[CurrentItemData].totdtyval;
			jsonLicence.assval = localthis.InvItemData.results[CurrentItemData].assval;
			jsonLicence.cifval = localthis.InvItemData.results[CurrentItemData].cifvlrs;
			jsonLicence.meins = localthis.InvItemData.results[CurrentItemData].meins;
			jsonLicence.totdty = localthis.InvItemData.results[CurrentItemData].totdtyval;
			jsonLicence.alloqty = localthis.InvItemData.results[CurrentItemData].menge;
			jsonLicence.totqty = localthis.InvItemData.results[CurrentItemData].menge;
			jsonLicence.benefitamt = "0.000";
			jsonLicence.doccat = "BOE";
			jsonLicence.doctyp = localthis.docType;
			jsonLicence.docitem = boeItemnumber; //refdocnr;refdocit Replaced Refdocnr to iteno as said by shani
			jsonLicence.lineitem = "1";
			jsonLicence.docnr = localthis.docNumber;
			jsonLicence.menge = localthis.InvItemData.results[CurrentItemData].menge;
			jsonLicence.matnr = localthis.InvItemData.results[CurrentItemData].matnr;
			jsonLicence.bnftyp = "";
			jsonLicence.Split = "X";
			localthis.LicenceItemData.results.push(jsonLicence);
		},
		ChangeExchFun: function (oEvent) {
			var ExRtDtVal = sap.ui.getCore().byId("exch_rate_date").getValue();
			var ExRtDt = this.formatToCalcDate(ExRtDtVal);
			var _self = this;
			if (ExRtDtVal) {
				MessageBox.confirm(
					"Duty of all BoE Items will be recalculated with new exchange rate date and Allocated Licence will be reallocated.Do you want to continue?", {
						actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								_self._OpenBusyDialog();
								_self.BoeModel.read("/xBRIxCE_BOE_DUTY(boenumber='" + _self.docNumber + "',exchangedate='" + ExRtDt + "')/Set", {
									urlParameters: {
										$top: "5000"
									},
									success: function (getData) {
										_self.DutyChanged = false;
										_self.DiffArrayVal = [];
										_self.CalculatedDataLocal = getData;
										_self.CalculatedDataLocal.results = _self.CalculatedDataLocal.results.filter(function (val) {
											if (val.dutcode === "DIFF") {
												var CurrentItemData = _self._findWithAttr(_self.InvItemData.results, val.boeitno);
												_self.InvItemData.results[CurrentItemData].frgt_exch = val.frgt_exch;
												_self.InvItemData.results[CurrentItemData].insu_exch = val.insu_exch;
												_self.InvItemData.results[CurrentItemData].msc_exch = val.msc_exch;
												_self.InvItemData.results[CurrentItemData].add_load_amt_exch = val.add_load_amt_exch;
												_self.InvItemData.results[CurrentItemData].hssloadamt_exch = val.hssloadamt_exch;
												_self.InvItemData.results[CurrentItemData].agc_exch = val.agc_exch;
												if (val.duty_diff) {
													if (_self.LicenceItemData.results.filter(a => a.docitem == val.boeitno).length > 0) {
														//	_self.DiffArrayVal.push(_self.LicenceItemData.results.filter(a => a.docitem == val.boeitno)[0]);
														var FilterRecordArry = {
															results: []
														};
														FilterRecordArry.results = _self.LicenceItemData.results.filter(a => a.docitem == val.boeitno);
														for (var i = 0; i < FilterRecordArry.results.length; i++) {
															_self.DiffArrayVal.push(FilterRecordArry.results[i]);
														}
														//	Array.prototype.push.apply(_self.DiffArrayVal.results, FilterRecordArry.results);
														_self.LicenceItemData.results = _self.LicenceItemData.results.filter(function (bal) {
															return FilterRecordArry.results.indexOf(bal) == -1;
														});
													}
													//_self.AddNewAlocationRows(val.boeitno, CurrentItemData);
													_self.CalcItemDutys(val.boeitno, CurrentItemData);
													_self.DutyChanged = true;
												}
											}
											return val.dutcode != "DIFF";
										});
										if (_self.DutyChanged) {
											MessageBox.warning("Please click save button to save the updated details.", {
												actions: [sap.m.MessageBox.Action.OK],
												onClose: function (oAction) {
													_self._ExRtDtDialog.close();
													_self.getView().byId("exch_rate_date").setValue(ExRtDtVal);
													_self.DutyItemDataLocal.results = _self.CalculatedDataLocal.results;
													_self.CalcActualTotalDuty();
													_self.DiffArray.results = _self.DiffArrayVal;
													_self.byId("btn_save").setVisible(true);
													_self.byId("idSwtichMode").setVisible(false);
													_self.getView().byId("idItemdetailsTabform").setExpanded(false);
													_self.getView().byId("idItemdetailsTabform").setVisible(false);
													_self._CloseBusyDialog();
												}
											});
										} else {
											MessageBox.warning("There is no duty calculation change.", {
												actions: [sap.m.MessageBox.Action.OK],
												onClose: function (oAction) {
													_self._ExRtDtDialog.close();
													_self.getView().byId("exch_rate_date").setValue(ExRtDtVal);
												}
											});
											_self._CloseBusyDialog();
										}
									},
									error: function (Error) {
										console.log("error");
									}
								});
							}
						}
					});
			} else {
				MessageBox.error("Please Select Date");
			}
		},
		handleInfoValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			if (!this._InfoTypeDialog) {
				this._InfoTypeDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpInfo", this);
				this.getView().addDependent(this._InfoTypeDialog);
			}
			this._InfoTypeDialog.open(sInputValue);
		},
		handleInfoQualValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.typedesc = oEvent.getSource().getParent().getCells()[1];
			this.InputId = oEvent.getSource().getId();
			if (!this._InfoTypeQDialog) {
				this._InfoTypeQDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpInfoQual", this);
				this.getView().addDependent(this._InfoTypeQDialog);
			}
			this._InfoTypeQDialog.open(sInputValue);
		},
		handleInfoCodeValueHelp: function (oEvent) {
			var _self = this;
			this.InputId = oEvent.getSource().getId();
			debugger;
			var infotype = this.getView().byId(this.InputId).getParent().getCells()[0].getValue();
			var infoqualifier = this.getView().byId(this.InputId).getParent().getCells()[2].getValue();
			//	var results[]= {};
			var resultArray = {
				results: []
			};

			if (infotype == "ORC" && infoqualifier == "COO") {
				debugger;
				this.CmnModel.read("/I_Country", {
					urlParameters: {
						$top: "5000"
					},
					success: function (oData) {

						debugger;
						if (oData.results.length > 0) {
							_self._OpenBusyDialogNoDelay();
							debugger;
							resultArray.results = oData.results.map(elm => ({
								code: elm.Country,
								discription: elm.Country_Text
							}));
							var InfoCodeData = new sap.ui.model.json.JSONModel([]);
							InfoCodeData.setData(resultArray);
							_self.getView().setModel(InfoCodeData, "InfoCodeDataModel");
						}
					},
					error: function (response) {}
				});
			} else {
				this.BoeModel.read("/xBRIxi_inf_cod_cof", {
					urlParameters: {
						$top: "5000"
					},
					success: function (oData) {
						if (oData.results.length > 0) {
							_self._OpenBusyDialogNoDelay();
							resultArray.results = oData.results.map(elm => ({
								code: elm.inf_cod,
								discription: elm.inf_cod_des
							}));
							var InfoCodeData = new sap.ui.model.json.JSONModel([]);
							InfoCodeData.setData(resultArray);
							_self.getView().setModel(InfoCodeData, "InfoCodeDataModel");
						}
					},
					error: function (response) {}
				});
			}
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			if (!this._InfoTypeCDialog) {
				_self._OpenBusyDialogNoDelay();
				this._InfoTypeCDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpInfoCode", this);
				this.getView().addDependent(this._InfoTypeCDialog);
			}
			this._InfoTypeCDialog.open(sInputValue);

		},
		_handleValueHelpClose_Qual: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.InputId);
				productInput.setValue(oSelectedItem.getTitle());
				this.getView().byId(this.InputId).getParent().getCells()[3].setText(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		_handleValueHelpClose_Code: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.InputId);
				productInput.setValue(oSelectedItem.getTitle());
				this.getView().byId(this.InputId).getParent().getCells()[5].setText(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		_handleValueHelpClose_type: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId(this.InputId).setValue(oSelectedItem.getTitle());
				this.getView().byId(this.InputId).getParent().getCells()[1].setText(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		_handleValueHelpSearch_Qual: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"inf_qual",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleSearchBondNo: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"trkno",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpCust_Code: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"codtyp",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpSearch_Code: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"code",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpSearchD_Code: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"description",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpSearch_type: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"inf_type",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		handleCtrlCodeValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			if (!this._ICtrlCdTypeQDialog) {
				this._ICtrlCdTypeQDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpCtrlCode", this);
				this.getView().addDependent(this._ICtrlCdTypeQDialog);
			}
			this._ICtrlCdTypeQDialog.open(sInputValue);
		},
		_handleValueHelpSearch_CtrlCd: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"ctr_typ_cod",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpClose_CtrlCd: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.InputId);
				productInput.setValue(oSelectedItem.getTitle());
				this.getView().byId(this.InputId).getParent().getCells()[1].setText(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		_handleValueHelpClose_CtrlRsltCd: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.InputId);
				productInput.setValue(oSelectedItem.getTitle());
				this.getView().byId(this.InputId).getParent().getCells()[3].setText(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		_handleValueHelpSearch_CtrlRsltCd: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"ctr_rslt_cod",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		handleCtrlRsltCodeValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.InputId = oEvent.getSource().getId();
			if (!this.CtrlRsltCode) {
				this.CtrlRsltCode = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpCtrlRsltCode", this);
				this.getView().addDependent(this.CtrlRsltCode);
			}
			this.CtrlRsltCode.open(sInputValue);
		},
		LockObjectCall: function () {
			this.fileCat = "BOE";
			var dispMode;
			if (this.byId("idSwtichMode").getState() == false) {
				dispMode = "D";
			} else {
				dispMode = "E";
			}
			var param = this.fileCat + "ZZZ" + this.docType + "ZZZ" + this.docNumber + "ZZZ" + dispMode + "ZZZ" + this.BOEStatus;
			var _self = this;
			if (sap.ushell.Container) {
				_self.userId = sap.ushell.Container.getService("UserInfo").getId();
				_self.CmnModel.read("/xBRIxce_lock(param1='" + param + "',email='" + _self.userId +
					"')/Set", {
						success: function (getData) {
							if (getData.results.length > 0) {
								if (dispMode == "E") {
									MessageBox.error(getData.results[0].MESSAGES);
								}
								_self.byId("idSwtichMode").setState(false);
								_self.initialLock = true;
								_self.OnChangeSwitchDefault();
							}
						},
						error: function (getData) {}
					});
			}
		},
		getFTANumbers: function () {
			var _self = this;
			var paramDate = this.boeHeaderData.boedate.getFullYear() + ("0" + (this.boeHeaderData.boedate.getMonth() + 1)).slice(-2) + ("0" +
				this.boeHeaderData.boedate.getDate()).slice(-2);
			this.BoeModel.read("/xBRIxCE_FTA(steuc='" + this.InvItemData.results[this.ItemRecord].hs_code + "',ctryorg='" + this.InvItemData.results[
				this.ItemRecord].cntryorgn + "',docdate='" + paramDate + "')/Set", {
				urlParameters: {
					$top: "5000"
				},
				success: function (oData) {
					if (oData.results.length > 0) {
						var FTAData = new sap.ui.model.json.JSONModel([]);
						FTAData.setData(oData);
						_self.getView().setModel(FTAData, "FTAModel");
					}
				},
				error: function (response) {}
			});
		},
		getRandDNumbers: function () {
			var _self = this;
			var paramDate = this.boeHeaderData.boedate.getFullYear() + ("0" + (this.boeHeaderData.boedate.getMonth() + 1)).slice(-2) + ("0" +
				this.boeHeaderData.boedate.getDate()).slice(-2);
			this.BoeModel.read("/xBRIxCE_R_AND_D(steuc='" + this.InvItemData.results[this.ItemRecord].hs_code + "',ctryorg='" + this.InvItemData
				.results[
					this.ItemRecord].cntryorgn + "',docdate='" + paramDate + "')/Set", {
					urlParameters: {
						$top: "5000"
					},
					success: function (oData) {
						if (oData.results.length > 0) {
							var FTAData = new sap.ui.model.json.JSONModel([]);
							FTAData.setData(oData);
							_self.getView().setModel(FTAData, "FTAModel");
						}
					},
					error: function (response) {}
				});
		},
		_handleFTANoHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (this.inputId.includes("randd_notifctn_no")) {
				this.getRandDNumbers();
			} else {
				this.getFTANumbers();
			}
			if (!this._valueHelpFTADialog) {
				this._valueHelpFTADialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpFTA", this);
				this.getView().addDependent(this._valueHelpFTADialog);
			}
			this._valueHelpFTADialog.open(sInputValue);
			this._OpenBusyDialogNoDelay();
		},
		_handleValueHelpSearch_FTA: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"tarntno",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		PressLanChg: function (oEvent) {
			if (oEvent.getSource().getValue() == "") {
				this.getView().byId("landchar").setValue("0");
			}
			this.InvItemData.results[this.ItemRecord].landchar = oEvent.getSource().getValue();
			this.CalculateAssDtyVal();
		},
		PressSVBLdAss: function (oEvent) {
			if (oEvent.getSource().getValue() == "") {
				this.getView().byId("svb_load_assval").setValue("0");
			}
			this.InvItemData.results[this.ItemRecord].svb_load_assval = oEvent.getSource().getValue();
			this.CalculateAssDtyVal();
		},
		PressSVBLdDty: function (oEvent) {
			if (oEvent.getSource().getValue() == "") {
				this.getView().byId("svb_loadduty").setValue("0");
			}
			this.InvItemData.results[this.ItemRecord].svb_loadduty = oEvent.getSource().getValue();
			this.CalcItemTotalActualDuty();
			this.CalcActualTotalDuty();
		},
		CalcPanaltyTotalDuty: function (oEvent) {
			this.inputId = oEvent.getSource().getId();
			if (oEvent.getSource().getValue() == "") {
				this.getView().byId(oEvent.getSource().getId()).setValue("0");
			}
			if (this.inputId.includes("intrstgst")) {
				this.boeHeaderData.intrstgst = oEvent.getSource().getValue();
			} else if (this.inputId.includes("latfnechge")) {
				this.boeHeaderData.latfnechge = oEvent.getSource().getValue();
			} else if (this.inputId.includes("penlty")) {
				this.boeHeaderData.penlty = oEvent.getSource().getValue();
			}
			this.CalcActualTotalDuty();
		},
		CalculateAssDtyVal: function () {
			var localassess = 0;
			var ciflc = 0;
			var MiscAm = 0;
			var AddLdAm = 0;
			var HSSLdAmnt = 0;
			if (this.InvItemData.results[this.ItemRecord]) {
				ciflc = (parseFloat(this.InvItemData.results[this.ItemRecord].frgtamt) * parseFloat(this.InvItemData.results[this.ItemRecord].frgt_exch)) +
					(parseFloat(this.InvItemData.results[this.ItemRecord].insuamt) * parseFloat(this.InvItemData.results[this.ItemRecord].insu_exch)) +
					(parseFloat(this.InvItemData.results[this.ItemRecord].totval) * parseFloat(this.InvItemData.results[this.ItemRecord].net_exch));
				this.InvItemData.results[this.ItemRecord].cifvlrs = parseFloat(ciflc).toFixed(3).toString();
				this.getView().byId("cifvlrs").setText(parseFloat(ciflc).toFixed(3));
				MiscAm = (parseFloat(this.InvItemData.results[this.ItemRecord].misschar) * parseFloat(this.InvItemData.results[this.ItemRecord]
					.msc_exch));
				if (this.boeHeaderData.clearance_type == "HSP") {
					AddLdAm = (parseFloat(this.InvItemData.results[this.ItemRecord].add_load_amt) * parseFloat(this.InvItemData.results[this.ItemRecord]
						.add_load_amt_exch));
					HSSLdAmnt = (parseFloat(this.InvItemData.results[this.ItemRecord].hssloadamt) * parseFloat(this.InvItemData.results[this.ItemRecord]
						.hssloadamt_exch));
				}
				localassess = (parseFloat(this.InvItemData.results[this.ItemRecord].landchar) + parseFloat(this.InvItemData.results[this.ItemRecord]
					.cifvlrs) + parseFloat(MiscAm) + parseFloat(AddLdAm) + parseFloat(HSSLdAmnt) + parseFloat(this.InvItemData
					.results[this.ItemRecord].svb_load_assval)).toFixed(3);
				this.InvItemData.results[this.ItemRecord].assval = parseFloat(localassess).toFixed(3).toString();
				this.getView().byId("assval").setValue(parseFloat(localassess).toFixed(3));
				if (this.LicenceItemData.results.filter(a => a.docitem == this.boeItemnumber).length > 0) {
					this.LicenceItemData.results.filter(a => a.docitem == this.boeItemnumber)[0].cifval = parseFloat(ciflc).toFixed(3).toString();
					this.LicenceItemData.results.filter(a => a.docitem == this.boeItemnumber)[0].assval = parseFloat(localassess).toFixed(3).toString();
				}
				this.calculateFtaDuty();
			}
		},
		calculateFtaDuty: function () {
			var month = ("0" + (this.boeHeaderData.boedate.getMonth() + 1)).slice(-2);
			var day = ("0" + this.boeHeaderData.boedate.getDate()).slice(-2);
			var year = this.boeHeaderData.boedate.getFullYear();
			var paramDate = this.boeHeaderData.boedate.getFullYear() + ("0" + (this.boeHeaderData.boedate.getMonth() + 1)).slice(-2) + ("0" +
				this.boeHeaderData.boedate.getDate()).slice(-2);
			var paramExchDate = this.boeHeaderData.exch_rate_date.getFullYear() + ("0" + (this.boeHeaderData.exch_rate_date.getMonth() + 1)).slice(-
				2) + ("0" + this.boeHeaderData.exch_rate_date.getDate()).slice(-2);
			var dtyParam1 = this.InvItemData.results[this.ItemRecord].matnr + "ZZZ" + this.InvItemData.results[this.ItemRecord].zeile + "ZZZ" +
				this.InvItemData.results[this.ItemRecord].menge + "ZZZ" + this.InvItemData.results[this.ItemRecord].meins + "ZZZ" + this.InvItemData
				.results[this.ItemRecord].cntryorgn + "ZZZ" + paramDate + "ZZZ" + this.boeHeaderData.bukrs + "ZZZ" + this.InvItemData.results[
					this
					.ItemRecord].hs_code;
			var dtyParam2 = this.InvItemData.results[this.ItemRecord].fta_entitled + "ZZZ" + this.InvItemData.results[this.ItemRecord].fta_num +
				"ZZZ" + this.InvItemData.results[this.ItemRecord].frgt_exch + "ZZZ" + this.InvItemData.results[this.ItemRecord].frgtamt + "ZZZ" +
				this.InvItemData.results[this.ItemRecord].insu_exch + "ZZZ" + this.InvItemData.results[this.ItemRecord].insuamt + "ZZZ" + this.InvItemData
				.results[this.ItemRecord].totval + "ZZZ" + this.InvItemData
				.results[this.ItemRecord].currencycode;
			var dtyParam3 = paramExchDate + "ZZZ" + this.InvItemData.results[this.ItemRecord].assval + "ZZZ" + this.InvItemData.results[this.ItemRecord]
				.ftaslno +
				"ZZZ" + this.InvItemData.results[this.ItemRecord].randd_applicability + "ZZZ" + this.InvItemData.results[this.ItemRecord].randd_notifctn_no +
				"ZZZ" + this.InvItemData.results[this.ItemRecord].randd_serialno;
			var tempSplit = dtyParam1.split("/");
			var tempJoin = tempSplit.join("%2F");
			dtyParam1 = tempJoin;
			tempSplit = dtyParam2.split("/");
			tempJoin = tempSplit.join("%2F");
			dtyParam2 = tempJoin;
			tempSplit = dtyParam3.split("/");
			tempJoin = tempSplit.join("%2F");
			dtyParam3 = tempJoin;
			dtyParam1 = dtyParam1.replace("/\\/g", "%5C");
			dtyParam1 = dtyParam1.replace("(/g", "%28");
			dtyParam1 = dtyParam1.replace(")/g", "%29");
			dtyParam2 = dtyParam2.replace("/\\/g", "%5C");
			dtyParam2 = dtyParam2.replace("(/g", "%28");
			dtyParam2 = dtyParam2.replace(")/g", "%29");
			// dtyParam3 = dtyParam3.replace("//g", "%2F");
			dtyParam3 = dtyParam3.replace("/\\/g", "%5C");
			dtyParam3 = dtyParam3.replace("(/g", "%28");
			dtyParam3 = dtyParam3.replace(")/g", "%29");
			var localthis = this;
			this.BoeModel.read("/xBRIxprmtrcstmentity(param1='" + dtyParam1 + "',param2='" + dtyParam2 + "',param3='" + dtyParam3 + "')/Set", {
				success: function (oData) {

					if (oData.results.length > 0) {
						/*Remove the selected boe item records from duty model*/
						var SelectItemRecord = {
							results: []
						};
						SelectItemRecord.results = localthis.DutyItemDataLocal.results.filter(a => a.boeitno == localthis.col_ItemNo);
						localthis.DutyItemDataLocal.results = localthis.DutyItemDataLocal.results.filter(function (val) {
							return SelectItemRecord.results.indexOf(val) == -1;
						});
						for (var i = 0; i < oData.results.length; i++) {
							delete oData.results[i].addtflag;
							delete oData.results[i].dutytp;
							delete oData.results[i].fta_coono;
							delete oData.results[i].itsrno;
							delete oData.results[i].meins;
							delete oData.results[i].notifno;
							delete oData.results[i].param1;
							delete oData.results[i].param2;
							delete oData.results[i].param3;
							delete oData.results[i].waers_inr;
							oData.results[i].doccat = "BOE";
							oData.results[i].docno = localthis.docNumber;
							if (localthis.DutyItemDataLocal.results.filter(a => a.boeitno == localthis.col_ItemNo).length > 0) {
								oData.results[i].docyear = localthis.DutyItemDataLocal.results.filter(a => a.boeitno == localthis.col_ItemNo)[0].docyear;
							}
							/*Add the selected boe item records to the duty model*/
							localthis.DutyItemDataLocal.results.push(oData.results[i]);
						}
						localthis.getView().getModel("boeDutyCompDetails").refresh();
						var CompleteTot = false;
						if (localthis.DutyItemDataLocal.results) {
							localthis.DutyItemDataLocal = localthis.getView().getModel("boeDutyComp").getData();
							localthis.CalcItemTotalActualDuty();
							CompleteTot = true;
						}
						if (CompleteTot == true && localthis.InvItemData.results) {
							localthis.CalcActualTotalDuty();
							localthis.AddNewRowAllo();
						}
					}
				},
				error: function (response) {}
			});
		},
		CalcItemTotalActualDuty: function () {
			var localthis = this;
			var total_duty = 0;
			var ItemDuty = 0;
			var svb_loadduty = this.getView().byId("svb_loadduty").getValue();
			for (var i = 0; i < localthis.DutyItemDataLocal.results.length; i++) {
				//total_duty = parseFloat(total_duty) + parseFloat(localthis.DutyItemDataLocal.results[i].actvalu);
				localthis.DutyItemDataLocal.results[i].ttldtpdadcst = localthis.ttldtpdadcst;
				if (localthis.DutyItemDataLocal.results[i].boeitno === localthis.boeItemnumber) {
					ItemDuty = parseFloat(ItemDuty) + parseFloat(localthis.DutyItemDataLocal.results[i].actvalu);
				}
			}
			ItemDuty = parseFloat(ItemDuty) + parseFloat(svb_loadduty);
			localthis.InvItemData.results[localthis.ItemRecord].totdtyval = parseFloat(ItemDuty).toFixed(3).toString();
			localthis.getView().byId("IdTotalDutyValue").setValue(parseFloat(ItemDuty).toFixed(3));
			debugger;
			var FilterRecord = {
				results: []
			};
			FilterRecord.results = localthis.LicenceItemData.results.filter(a => a.docitem == localthis.boeItemnumber);
			var ItemActualDuty, BenefitAmnt = 0;
			for (var i = 0; i < FilterRecord.results.length; i++) {
				BenefitAmnt = parseFloat(BenefitAmnt) + parseFloat(FilterRecord.results[i].benefitamt);
			}
			ItemActualDuty = parseFloat(ItemDuty) - parseFloat(BenefitAmnt);
			if (this.docType == "Y") {
				ItemActualDuty = 0;
			}
			localthis.InvItemData.results[localthis.ItemRecord].actdtypyd = parseFloat(ItemActualDuty).toFixed(3).toString();
			localthis.getView().byId("item_actdtypyd").setValue(parseFloat(ItemActualDuty).toFixed(3));
			localthis.latfnechge = localthis.getView().byId("latfnechge").getValue();
			var TotalDtyPaidAddCst = parseFloat(localthis.latfnechge) + parseFloat(ItemActualDuty);
			localthis.InvItemData.results[localthis.ItemRecord].hss_comchrg = parseFloat(TotalDtyPaidAddCst).toFixed(3).toString();
			localthis.getView().byId("hss_comchrg").setValue(parseFloat(TotalDtyPaidAddCst).toFixed(3));

		},
		CalcItemDutys: function (boeItemnumber, CurrentItemData) {
			var localthis = this;
			var total_duty = 0;
			var ItemDuty = 0;

			for (var i = 0; i < localthis.DutyItemDataLocal.results.length; i++) {
				//total_duty = parseFloat(total_duty) + parseFloat(localthis.DutyItemDataLocal.results[i].actvalu);
				localthis.DutyItemDataLocal.results[i].ttldtpdadcst = localthis.ttldtpdadcst;
				if (localthis.DutyItemDataLocal.results[i].boeitno === boeItemnumber) {
					ItemDuty = parseFloat(ItemDuty) + parseFloat(localthis.DutyItemDataLocal.results[i].actvalu);
				}
			}
			var svb_loadduty = localthis.InvItemData.results[CurrentItemData].svb_loadduty;
			ItemDuty = parseFloat(ItemDuty) + parseFloat(svb_loadduty);
			localthis.InvItemData.results[CurrentItemData].totdtyval = parseFloat(ItemDuty).toFixed(3).toString();
			var FilterRecord = {
				results: []
			};
			FilterRecord.results = localthis.LicenceItemData.results.filter(a => a.docitem == boeItemnumber);
			var ItemActualDuty, BenefitAmnt = 0;
			for (var i = 0; i < FilterRecord.results.length; i++) {
				BenefitAmnt = parseFloat(BenefitAmnt) + parseFloat(FilterRecord.results[i].benefitamt);
			}
			ItemActualDuty = parseFloat(ItemDuty) - parseFloat(BenefitAmnt);
			if (this.docType == "Y") {
				ItemActualDuty = 0;
			}
			localthis.InvItemData.results[CurrentItemData].actdtypyd = parseFloat(ItemActualDuty).toFixed(3).toString();
			localthis.latfnechge = localthis.getView().byId("latfnechge").getValue();
			var TotalDtyPaidAddCst = parseFloat(localthis.latfnechge) + parseFloat(ItemActualDuty);
			localthis.InvItemData.results[CurrentItemData].hss_comchrg = parseFloat(TotalDtyPaidAddCst).toFixed(3).toString();
		},

		CalcActualTotalDuty: function () {
			var localthis = this;
			var HeaderDuty = 0;
			var TotAssesVal = 0;
			var TotSvbDty = 0;
			var Itrest = this.getView().byId("intrstgst").getValue();
			var LatFnChrg = this.getView().byId("latfnechge").getValue();
			var Penalty = this.getView().byId("penlty").getValue();
			for (var i = 0; i < localthis.InvItemData.results.length; i++) {
				TotAssesVal = parseFloat(TotAssesVal) + parseFloat(localthis.InvItemData.results[i].assval);
				TotSvbDty = parseFloat(TotSvbDty) + parseFloat(localthis.InvItemData.results[i].svb_loadduty);
			}
			for (var i = 0; i < localthis.DutyItemDataLocal.results.length; i++) {
				HeaderDuty = parseFloat(HeaderDuty) + parseFloat(localthis.DutyItemDataLocal.results[i].actvalu);
			}
			HeaderDuty = parseFloat(HeaderDuty) + parseFloat(TotSvbDty);
			localthis.boeHeaderData.totdtyval = parseFloat(HeaderDuty).toFixed(3).toString();
			localthis.boeHeaderData.totassval = parseFloat(TotAssesVal).toFixed(3).toString();
			localthis.getView().byId("totdtyval").setValue(parseFloat(HeaderDuty).toFixed(3));
			localthis.getView().byId("totassval").setValue(parseFloat(TotAssesVal).toFixed(3));
			/********Actual duty paid - Total duty - Sum of Benefit amount*******/
			var HeaderActualDuty, BenefitAmnt = 0;
			for (var i = 0; i < localthis.LicenceItemData.results.length; i++) {
				BenefitAmnt = parseFloat(BenefitAmnt) + parseFloat(localthis.LicenceItemData.results[i].benefitamt);
			}
			HeaderActualDuty = parseFloat(HeaderDuty) - parseFloat(BenefitAmnt);
			if (this.docType == "Y") {
				HeaderActualDuty = 0;
			}
			localthis.boeHeaderData.actdtypyd = parseFloat(HeaderActualDuty).toFixed(3).toString();
			localthis.getView().byId("actdtypyd").setValue(parseFloat(HeaderActualDuty).toFixed(3));
			/********Total duty with interest penalty - Sum of Intrest,Latefine charge ,Penalty and Actual duty paid*******/
			var TotVal = parseFloat(Itrest) + parseFloat(LatFnChrg) + parseFloat(Penalty);
			var IntrWtPnlty = parseFloat(TotVal) + parseFloat(HeaderActualDuty);
			localthis.boeHeaderData.totdty_penalty = parseFloat(IntrWtPnlty).toFixed(3).toString();
			localthis.getView().byId("totdty_penalty").setValue(parseFloat(IntrWtPnlty).toFixed(3));

		},
		_handleValueHelpClose_FTA: function (oEvent) {
			var oSelectedItem = oEvent.getParameter('selectedItem');
			var _self = this;
			if (oSelectedItem) {
				this.getView().byId(this.inputId).setValue(oSelectedItem.getTitle());
				if (this.inputId.includes("fta_num")) {
					this.InvItemData.results[this.ItemRecord].fta_num = oSelectedItem.getTitle();
					this.getView().byId("ftaslno").setValue(oSelectedItem.getDescription());
				} else {
					this.InvItemData.results[this.ItemRecord].randd_notifctn_no = oSelectedItem.getTitle();
					this.getView().byId("randd_serialno").setValue(oSelectedItem.getDescription());
				}
				this.calculateFtaDuty();
			}
			oEvent.getSource().getBinding("items").filter([]);
			this._CloseBusyDialog();
		},
		formatToCalcDate: function (value) {
			var SplitDatePart = value.split("/");
			value = SplitDatePart[2].trim() + "" + SplitDatePart[1].trim() + "" + SplitDatePart[0].trim();
			return value;
		},
		convertDate: function (str) {
			var date = new Date(str),
				mnth = ("0" + (date.getMonth() + 1)).slice(-2),
				day = ("0" + date.getDate()).slice(-2);
			return [date.getFullYear(), mnth, day].join("");
		},

		GenerateTable: function (entity, FileName) {
			return new Promise((resolve, reject) => {
				var sText = "";
				this.mText = "";
				this.dowlddflnme = "";
				this.tText = "";
				this.ftr = "";
				var _self = this;
				this.wbasr, this.svbload = "";
				//Filter data by docnumber and doctype, entity name (parameter)
				var filters = new Array();
				var filterval1 = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.EQ, this.docNumber);
				filters.push(filterval1);
				var filterval2 = new sap.ui.model.Filter("doctyp", sap.ui.model.FilterOperator.EQ, this.docType);
				filters.push(filterval2);
				this.bemodel.read("/" + entity, {
					urlParameters: {
						"$top": "5000"
					},
					filters: filters,
					success: function (getData) {
						if (entity === "xBRIxI_invoice_be") {
							if (getData.results.length > 0) {
								_self.mischa = getData.results[0].mischa;
								_self.wbasr = getData.results[0].wbasr;
								_self.svbload = getData.results[0].svbloadass;
							}
						}
						if (entity === "xBRIxI_EXCHANGE_BE") {
							if (getData.results.length > 0) {
								_self.standrdcurr = getData.results[0].stdc;
							}
						}
						var Title = 0;
						for (var k = 0; k < getData.results.length; k++) {
							if (Title == 0) {
								_self.tText = "<TABLE>" + FileName + "\r" + "\n";
							} else {
								_self.tText = "";
							}
							var pText = "";
							var flag = false;
							var j = 0;
							Title++;

							for (var key in getData.results[k]) {
								j++;
								if (getData.results[k].hasOwnProperty(key)) {
									var msgtype = getData.results[k].msgtype;
									if (entity === "xbrixI_items_be") {
										_self.rspappl = getData.results[0].rspappl;
									}
									if (entity === "xBRIxI_BE") {
										if (_self.dowlddflnme == "0" || _self.dowlddflnme == "" || _self.dowlddflnme == null) {
											_self.dowlddflnme = "download";
										} else {
											_self.dowlddflnme = getData.results[0].ujno;
										}
										if (_self.dowlddflnme == "0" || _self.dowlddflnme == "" || _self.dowlddflnme == null) {
											_self.dowlddflnme = "download";
										} else {
											_self.dowlddflnme = getData.results[0].ujno;
										}
										if (getData.results[0].sender_id != "" || getData.results[0].sender_id != "0" || getData.results[0].sender_id != null) {
											_self.Senderid = getData.results[0].sender_id;
										} else {
											_self.Senderid = String.fromCharCode(29);
										}
										if (getData.results[0].receiver_id != "" || getData.results[0].receiver_id != "0" || getData.results[0].receiver_id !=
											null) {
											_self.Receverid = getData.results[0].receiver_id;
										} else {
											_self.Receverid = String.fromCharCode(29);
										}
										if (getData.results[0].msg_id != "" || getData.results[0].msg_id != "0" || getData.results[0].msg_id != null) {
											_self.Messageid = getData.results[0].msg_id;
										} else {
											_self.Messageid = String.fromCharCode(29);
										}
									}
									//Details for .be Header and Footer
									var day, month, yer, hour, mint, sec;
									var now = new Date();
									day = now.getDate();
									month = now.getMonth() + 1;
									yer = now.getFullYear();
									hour = now.getHours();
									mint = now.getMinutes();
									if (hour > 12) {
										hour = hour % 12;
									}
									if (month < 10) {
										month = "0" + month;
									}
									if (hour < 10) {
										hour = "0" + hour;
									}
									if (mint < 10) {
										mint = "0" + mint;
									}
									if (day < 10) {
										day = "0" + day;
									}
									//condition for Document type Exbound E
									if (_self.docType == "E") {
										_self.headg = "HREC" + String.fromCharCode(29) + "ZZ" + String.fromCharCode(29) + "" + _self.Senderid + "" + String.fromCharCode(
												29) +
											"ZZ" + String.fromCharCode(29) + "" + _self.Receverid + "" + String.fromCharCode(29) + "" + "ICES1_5" + String.fromCharCode(
												29) + "P" + String.fromCharCode(29) + "" + "X" + String.fromCharCode(29) + "" + _self.Messageid + "" + String.fromCharCode(
												29) + "" + _self.dowlddflnme + "" + String.fromCharCode(
												29) + "" + yer + month + day + "" + String.fromCharCode(29) +
											"" + hour + mint + "\r" + "\n";
									} else {
										_self.headg = "HREC" + String.fromCharCode(29) + "ZZ" + String.fromCharCode(29) + "" + _self.Senderid + "" + String.fromCharCode(
												29) +
											"ZZ" + String.fromCharCode(29) + "" + _self.Receverid + "" + String.fromCharCode(29) + "" + "ICES1_5" + String.fromCharCode(
												29) + "P" + String.fromCharCode(29) + "" +
											String.fromCharCode(29) + "" + _self.Messageid + "" + String.fromCharCode(29) + "" + _self.dowlddflnme + "" + String.fromCharCode(
												29) + "" + yer + month + day + "" + String.fromCharCode(29) +
											"" + hour + mint + "\r" + "\n";
									}

									_self.ftr = "<END-BE>" + "\r" + "\n" + "TREC" + String.fromCharCode(29) + "" + _self.dowlddflnme;
									//condition for avoid some keys in .be
									if (key != "licetyp" && key != "trkno" && key != "shpbillslno" && key != "rspslno" && key != "__metadata" && key !=
										"doctyp" && key != "docno" && key !=
										"exccurslnoe" && key != "permslno" && key != "invslno" && key != "dutyslno" && key != "mischslno" && key != "boeitno" &&
										key != "iecslno" && key != "igmsrlno" && key != "contslno" && key != "ctxslno" && key != "amendslno" && key !=
										"bondslno" && key != "exch_type" && key != "bondcod" && key != "certytype" && key != "certynumb" && key != "boeitno" &&
										key != "inftypsrlno" && key != "constsrlno" && key != "ctrlsrlno" && key != "prodsrlno" && key != "statment_srlno" &&
										key != "sup_doc_srlno" && key != "msg_id" && key != "sender_id" && key != "receiver_id" && key != "dutycod" &&
										key != "s1" && key != "s2" && key != "s3") {
										// debugger;
										//getData.results[k][key] = getData.results[k][key].trim();
										console.log(key + " -> " + getData.results[k][key]);
										var len = Object.keys(getData.results[k]).length;
										//Grossweight in xBRIxI_BE show only in  if BOE Type is X - Ex Bond andif BOE Type is Home consumption or Into Bond replace value with a delimeter GS
										if (key == "grswght" && entity == "xBRIxI_BE" && (_self.betype == "H" || _self.betype == "W")) {
											pText = pText + String.fromCharCode(29);
										} else if (key == "svbloadass" && _self.wbasr == "Y") {
											if (_self.svbload == "0" || _self.svbload == "" || _self.svbload == "0.00000") {
												if (j == len) {
													pText = pText + "0.00000";
												} else {
													pText = pText + "0.00000";
													pText = pText + String.fromCharCode(29);
												}
											} else {
												if (j == len) {
													pText = pText + getData.results[k][key].trim();
												} else {
													pText = pText + getData.results[k][key].trim();
													pText = pText + String.fromCharCode(29);
												}
											}

										}
										//if value is "0" show value as 0
										else if ((key == "itsrno" || key == "invsrnum" || key == "brsrno") && getData.results[k][key] == "0") {
											if (j == len) {
												pText = pText + getData.results[k][key].trim();
											} else {
												pText = pText + getData.results[k][key].trim();
												pText = pText + String.fromCharCode(29);
											}
											//check key value "" or 0 or null
										} else if (((getData.results[k][key] == " " || getData.results[k][key] == 0 || getData.results[k][key] == null) && (
												key !=
												"acessstat")) ||
											(key == "acessstat" && (getData.results[k][key] == " " || getData.results[k][key] == null))) {
											//check is last key
											if (j == len) {
												pText = pText;
											} else {
												pText = pText + String.fromCharCode(29);
											}
											//check key is date field
										} else if (key == "docissuedate" || key == "docexpirydate" || key == "ujdate" || key == "bedate" || key == "bedt" ||
											key == "efdt" || key == "cerdt" || key == "invdat" ||
											key == "podate" || key == "lcdt" ||
											key == "svbrefdat" || key == "lcsregdt" || key == "shipbdat" || key == "igmdt" || key == "iwrdt" || key == "gatigdt" ||
											key == "mawbdt" || key == "hawbdt" || key == "reqdate" || key == "cntsrtdt" || key == "cntenddt" ||
											key == "svbdat" || key == "datofmanu" || key == "datofexp" || key == "bstbfr" || key == "whbedt" || key == "contdt" ||
											key == "pbedt" || key == "cetdt"
										) {
											//check key is last field
											if (j == len) {
												if (getData.results[k][key] == "" || getData.results[k][key] == null) {
													pText = pText;
												} else {
													pText = pText + _self.convertDate(getData.results[k][key]);
												}
											} else {
												pText = pText + _self.convertDate(getData.results[k][key]);
												pText = pText + String.fromCharCode(29);
											}
										} else {
											flag = true;
											//check key is last field
											if (j == len) {
												if (((getData.results[k][key] == " " || getData.results[k][key] == 0 || getData.results[k][key] == null) && key !=
														"acessstat") || (key == "acessstat" && (getData.results[k][key] == " " || getData.results[k][key] == null))) {
													pText = pText;
												} else {
													pText = pText + getData.results[k][key].trim();
												}
											} else {
												pText = pText + getData.results[k][key].trim();
												pText = pText + String.fromCharCode(29);
											}
										}
									}
								}
							}
							if (flag == true) {
								_self.mText = _self.mText + _self.tText + pText + "\r" + "\n";
								resolve();
							} else {
								_self.mText = _self.mText + _self.tText;
								resolve();
							}
						}
					},
					error: function (error) {
						_self._CloseBusyDialog();
						MessageBox.error("Something Went Wrong . Please Try again Later");
						reject();
					}
				});
			});
		},
		OnPressBE: function (oEvent) {
			this._OpenBusyDialog();
			this.hssf = "";
			this.secreq = "";
			this.fcr = "";
			this.rspappl = "";
			this.mischa = "";
			this.betype = "";
			var _self = this
			var filters = new Array();
			var filterval1 = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.EQ, this.docNumber);
			filters.push(filterval1);
			var filterval2 = new sap.ui.model.Filter("doctyp", sap.ui.model.FilterOperator.EQ, this.docType);
			filters.push(filterval2);
			this.bemodel.read("/xBRIxI_BE", {
				urlParameters: {
					"$top": "5000"
				},
				filters: filters,
				success: function (getData) {
					_self.secreq = getData.results[0].secreq;
					_self.fcr = getData.results[0].fcr;
					_self.hssf = getData.results[0].hssf;
					_self.betype = getData.results[0].betype;
					console.log("BETYPE******************");
					console.log(getData.results[0].betype);
					_self.NewArray = new Array();
					_self.GenerateTable("xBRIxI_BE", "BE")
						.then(_self.GenerateTable("xBRIxI_EXCHANGE_BE", "EXCHANGE"))
						.then(((_self.secreq == "Y" || _self.fcr == "Y") && _self.docType == "W") ? _self.GenerateTable("xBRIxI_PERM_BE",
							"PERMISSION") : null)
						.then(_self.GenerateTable("xBRIxI_invoice_be", "INVOICE"))
						.then((_self.mischa > 0 && _self.mischa != "") ? _self.GenerateTable("xBRIxI_MIS_CHAR_BE", "MISC_CH") : null)
						.then(_self.GenerateTable("xbrixI_items_be", "ITEMS"))
						.then(_self.GenerateTable("xBRIxI_LICENCE_BE", "LICENCE"))
						.then(_self.GenerateTable("xBRIxI_RSP_BE", "RSP"))
						.then(_self.GenerateTable("xBRIxI_DEPB_BE", "DEPB"))
						// .then(_self.GenerateTable("xBRIxI_BONDS_BE", "BOND"))
						// restrict the BOND segment to be passed if BOE type is Ex-BOND (E)
						.then((_self.docType == "E") ? null : _self.GenerateTable("xBRIxI_BONDS_BE", "BOND"))
						// .then((_self.standrdcurr == "N") ? _self.GenerateTable("xBRIxI_CERT_BE", "CERT") : null)
						.then(_self.GenerateTable("xBRIxI_CERT_BE", "CERT"))
						//hssf(high sea sails) =="y"  and W(Home Consumption) in BE
						.then((_self.hssf == "Y" && _self.docType == "W") ? _self.GenerateTable("xBRIxI_HSS_BE", "HSS") : null)
						.then(_self.GenerateTable("xBRIxI_SBEDUTY_BE", "SBEDUTY"))
						// .then(_self.GenerateTable("xBRIxI_IGMS_BE", "IGMS"))
						.then((_self.docType == "W" || _self.docType == "Y") ? _self.GenerateTable("xBRIxI_IGMS_BE", "IGMS") : null)
						.then(_self.GenerateTable("xBRIxI_CONTNER_BE", "CONTAINER"))
						.then(_self.GenerateTable("xBRIxI_iid_ctx_be", "CTX"))
						//.then(_self.GenerateTable("xBRIxI_AMEND_BE", "AMEND"))
						//in the case of exbound use I_SW_INFO_EXBOND oter cases use  xBRIxI_ITEM_SW_BE
						//.then(_self.GenerateTable("xBRIxI_ITEM_SW_BE", "BE_ITEM_SW_INFO_TYPE"))
						//Condition E Exbond
						.then((_self.docType == "E") ? _self.GenerateTable("xBRIxI_SW_INFO_EXBOND", "BE_ITEM_SW_INFO_TYPE") : _self.GenerateTable(
							"xBRIxI_ITEM_SW_BE", "BE_ITEM_SW_INFO_TYPE"))
						// .then(_self.GenerateTable("xBRIxI_ITEM_SWC_BE", "BE_ITEM_SW_CONST"))
						.then((_self.docType == "E") ? null : _self.GenerateTable("xBRIxI_ITEM_SWC_BE", "BE_ITEM_SW_CONST"))
						// .then(_self.GenerateTable("xBRIxI_ITM_PRO_BE", "BE_ITEM_SW_PROD"))
						.then((_self.docType == "E") ? null : _self.GenerateTable("xBRIxI_ITM_PRO_BE", "BE_ITEM_SW_PROD"))
						// .then(_self.GenerateTable("xBRIxI_ITM_CTRL_BE", "BE_ITEM_SW_CTRL"))
						.then((_self.docType == "E") ? null : _self.GenerateTable("xBRIxI_ITM_CTRL_BE", "BE_ITEM_SW_CTRL"))
						//commented by swathy and replace with xBRIxI_statemet_b .then(_self.GenerateTable("xBRIxI_statemet_be", "STATEMENT"))
						.then(_self.GenerateTable("xBRIxI_statemet_b", "STATEMENT"))
						//comted by swathy replace xBRIxI_be_sup_doc byxBRIxI_be_sup_doc_new .then(_self.GenerateTable("xBRIxI_be_sup_doc", "SUPPORTINGDOCS"))
						.then(_self.GenerateTable("xBRIxI_be_sup_doc_new", "SUPPORTINGDOCS"))
						.then(function () {
							if (_self.mText != "") {
								_self._CloseBusyDialog();
								File.save(_self.headg + _self.mText + _self.ftr,
									_self.dowlddflnme, "be");
								_self.belog_model.read("/xBRIxce_belog(beno='" + _self.docNumber + "',betyp='" + _self.docType +
									"',filename='download')/Set", {
										success: function (e, r) {},
										error: function (e) {}
									});
							}
						});
				},
				error: function (error) {
					_self._CloseBusyDialog();
					MessageBox.error("Something Went Wrong . Please Try again Later");
					reject();
				}
			});
		},
		_handleValueHelpSearch_Crncy: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"Currency",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		handleValueHelpCrncy: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._CrncyDialog) {
				this._CrncyDialog = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogSrchHelpCrncy", this);
				this.getView().addDependent(this._CrncyDialog);
			}
			this._CrncyDialog.open(sInputValue);
		},

		CheckBeDetails: function () {
			var param = this.docType + "ZZZ" + this.docNumber;
			this.bemodel.read("/xBRIxCE_BE_CHECK(parameter1='" + param + "',parameter2='" + param + "')/Set", {
				success: function (oData) {
					if (oData.results.length > 0) {}
				},
				error: function (response) {}
			});
		},
		handleGstnValueHelp: function (oEvent) {
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpGstn) {
				this._valueHelpGstn = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogGstnCode", this);
				this.getView().addDependent(this._valueHelpGstn);
			}
			this._valueHelpGstn.open();
		},
		_handleSearchGstn: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"statecode",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		handleDocTypeValueHelp: function (oEvent) {
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpDocType) {
				this._valueHelpDocType = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogCdTpe", this);
				this.getView().addDependent(this._valueHelpDocType);
			}
			this._valueHelpDocType.open();

		},
		// search help added by arjun 19/10/2023
		handleStmntTypeValueHelp: function (oEvent) {
			this.inputId = oEvent.getSource().getId();
			if (!this.StmntType) {
				this.StmntType = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.StmntType", this);
				this.getView().addDependent(this.StmntType);
			}
			this.StmntType.open();

		},
		_handleSearchStType: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"codtyp",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpClose_stmtType: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
			if (oSelectedItem) {
				this.getView().byId(this.inputId).setValue(oSelectedItem);
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		// search help added by arjun 19/10/2023
		handleStmntCdValueHelp: function (oEvent) {
			this.inputId = oEvent.getSource().getId();
			if (!this.StmntCd) {
				this.StmntCd = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.StmntCd", this);
				this.getView().addDependent(this.StmntCd);
			}
			this.StmntCd.open();

		},
		_handleSearchDocType: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"codtyp",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose_Currency: function (oEvent) {
			if (oEvent.getParameter("selectedItem")) {
				var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
				if (oSelectedItem) {
					var _self = this;
					var reqNoInputFrom = this.getView().byId(this.inputId);
					reqNoInputFrom.setValue(oSelectedItem);
					if (this.inputId.match("frgt_curr")) {
						this.InvItemData.results[this.ItemRecord].frgt_curr = oSelectedItem;
						var filters = new Array();
						var filterval = new sap.ui.model.Filter("fcurr", sap.ui.model.FilterOperator.EQ, oSelectedItem);
						filters.push(filterval);
						var filterval = new sap.ui.model.Filter("tcurr", sap.ui.model.FilterOperator.EQ, "INR");
						filters.push(filterval);
						var filterval = new sap.ui.model.Filter("kurst", sap.ui.model.FilterOperator.EQ, "C");
						filters.push(filterval);
						this.CmnModel.read("/xBRIxi_tcurr", {
							filters: filters,
							success: function (getData) {
								if (getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date).length > 0) {
									var index = getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date).length;
									_self.InvItemData.results[_self.ItemRecord].frgt_exch = getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date)[
										index - 1].ukurs;
									_self.CalculateAssDtyVal();
								} else {
									_self.InvItemData.results[_self.ItemRecord].frgt_exch = "0";
									_self.CalculateAssDtyVal();
								}

								_self.getView().getModel("boeItemdatadetails").refresh();
							},
							error: function (response) {}
						});

					} else if (this.inputId.match("insu_curr")) {
						this.InvItemData.results[this.ItemRecord].insu_curr = oSelectedItem;
						var filters = new Array();
						var filterval = new sap.ui.model.Filter("fcurr", sap.ui.model.FilterOperator.EQ, oSelectedItem);
						filters.push(filterval);
						var filterval = new sap.ui.model.Filter("tcurr", sap.ui.model.FilterOperator.EQ, "INR");
						filters.push(filterval);
						var filterval = new sap.ui.model.Filter("kurst", sap.ui.model.FilterOperator.EQ, "C");
						filters.push(filterval);
						this.CmnModel.read("/xBRIxi_tcurr", {
							filters: filters,
							success: function (getData) {
								if (getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date).length > 0) {
									var index = getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date).length;
									_self.InvItemData.results[_self.ItemRecord].insu_exch = getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date)[
										index - 1].ukurs;
									_self.CalculateAssDtyVal();
								} else {
									_self.InvItemData.results[_self.ItemRecord].insu_exch = "0";
									_self.CalculateAssDtyVal();
								}
								_self.getView().getModel("boeItemdatadetails").refresh();
							},
							error: function (response) {}
						});

					} else if (this.inputId.match("agc_curr")) {
						this.InvItemData.results[this.ItemRecord].agc_curr = oSelectedItem;
						var filters = new Array();
						var filterval = new sap.ui.model.Filter("fcurr", sap.ui.model.FilterOperator.EQ, oSelectedItem);
						filters.push(filterval);
						var filterval = new sap.ui.model.Filter("tcurr", sap.ui.model.FilterOperator.EQ, "INR");
						filters.push(filterval);
						var filterval = new sap.ui.model.Filter("kurst", sap.ui.model.FilterOperator.EQ, "C");
						filters.push(filterval);
						this.CmnModel.read("/xBRIxi_tcurr", {
							filters: filters,
							success: function (getData) {
								if (getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date).length > 0) {
									var index = getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date).length;
									_self.InvItemData.results[_self.ItemRecord].agc_exch = getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date)[
										index - 1].ukurs;
								} else {
									_self.InvItemData.results[_self.ItemRecord].agc_exch = "0";
								}
								_self.getView().getModel("boeItemdatadetails").refresh();
							},
							error: function (response) {}
						});

					} else if (this.inputId.match("msc_curr")) {
						this.InvItemData.results[this.ItemRecord].msc_curr = oSelectedItem;
						var filters = new Array();
						var filterval = new sap.ui.model.Filter("fcurr", sap.ui.model.FilterOperator.EQ, oSelectedItem);
						filters.push(filterval);
						var filterval = new sap.ui.model.Filter("tcurr", sap.ui.model.FilterOperator.EQ, "INR");
						filters.push(filterval);
						var filterval = new sap.ui.model.Filter("kurst", sap.ui.model.FilterOperator.EQ, "C");
						filters.push(filterval);
						this.CmnModel.read("/xBRIxi_tcurr", {
							filters: filters,
							success: function (getData) {
								if (getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date).length > 0) {
									var index = getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date).length;
									_self.InvItemData.results[_self.ItemRecord].msc_exch = getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date)[
										index - 1].ukurs;
									_self.CalculateAssDtyVal();
								} else {
									_self.InvItemData.results[_self.ItemRecord].msc_exch = "0";
									_self.CalculateAssDtyVal();
								}
								_self.getView().getModel("boeItemdatadetails").refresh();
							},
							error: function (response) {}
						});
					} else if (this.inputId.match("add_aload_amt_curr")) {
						this.InvItemData.results[this.ItemRecord].add_aload_amt_curr = oSelectedItem;
						var filters = new Array();
						var filterval = new sap.ui.model.Filter("fcurr", sap.ui.model.FilterOperator.EQ, oSelectedItem);
						filters.push(filterval);
						var filterval = new sap.ui.model.Filter("tcurr", sap.ui.model.FilterOperator.EQ, "INR");
						filters.push(filterval);
						var filterval = new sap.ui.model.Filter("kurst", sap.ui.model.FilterOperator.EQ, "C");
						filters.push(filterval);
						this.CmnModel.read("/xBRIxi_tcurr", {
							filters: filters,
							success: function (getData) {
								if (getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date).length > 0) {
									var index = getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date).length;
									_self.InvItemData.results[_self.ItemRecord].add_load_amt_exch = getData.results.filter(a => a.gdatu <= _self.boeHeaderData
										.exch_rate_date)[
										index - 1].ukurs;
									_self.CalculateAssDtyVal();
								} else {
									_self.InvItemData.results[_self.ItemRecord].add_load_amt_exch = "0";
									_self.CalculateAssDtyVal();
								}
								_self.getView().getModel("boeItemdatadetails").refresh();
							},
							error: function (response) {}
						});
					} else if (this.inputId.match("hssloadamt_curr")) {
						this.InvItemData.results[this.ItemRecord].hssloadamt_curr = oSelectedItem;
						var filters = new Array();
						var filterval = new sap.ui.model.Filter("fcurr", sap.ui.model.FilterOperator.EQ, oSelectedItem);
						filters.push(filterval);
						var filterval = new sap.ui.model.Filter("tcurr", sap.ui.model.FilterOperator.EQ, "INR");
						filters.push(filterval);
						var filterval = new sap.ui.model.Filter("kurst", sap.ui.model.FilterOperator.EQ, "C");
						filters.push(filterval);
						this.CmnModel.read("/xBRIxi_tcurr", {
							filters: filters,
							success: function (getData) {
								if (getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date).length > 0) {
									var index = getData.results.filter(a => a.gdatu <= _self.boeHeaderData.exch_rate_date).length;
									_self.InvItemData.results[_self.ItemRecord].hssloadamt_exch = getData.results.filter(a => a.gdatu <= _self.boeHeaderData
										.exch_rate_date)[
										index - 1].ukurs;
									_self.CalculateAssDtyVal();
								} else {
									_self.InvItemData.results[_self.ItemRecord].hssloadamt_exch = "0";
									_self.CalculateAssDtyVal();
								}
								_self.getView().getModel("boeItemdatadetails").refresh();
							},
							error: function (response) {}
						});
					}
				}
			}
		},
		OnPressCheckbe: function () {
			this.CheckbeInfo = {
				results: []
			};
			var _self = this;
			var param = "WZZZ" + this.docNumber;
			this.bemodel.read("/xBRIxCE_BE_CHECK(parameter1='" + param + "',parameter2='" + param + "')/Set", {
				success: function (getData) {
					_self.CheckbeInfo.result = getData.results;
					var checkbedetails = new sap.ui.model.json.JSONModel([]);
					checkbedetails.setData(getData);
					_self.getView().setModel(checkbedetails, "CheckBEdetails");
					if (!_self._checkbe) {
						_self._checkbe = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.checkBE", _self);
						_self.getView().addDependent(_self._checkbe);
					}
					_self._checkbe.open();
				},
				error: function (getData) {
					MessageBox.error("Something Went Wrong . Please Try again Later");
					reject();
				}
			});
		},
		handleCloseFrgmnt: function () {
			this._checkbe.close();
		},
		handleExchangeRateDtChange: function (oEvent) {
			console.log(sap.ui.Device.system.phone);
			console.log(sap.ui.Device.system.desktop);
			console.log(sap.ui.Device.system.combi);
		},
		FnUpdateFlSts: function (oEvent) {
			this.SelValFlSts = oEvent.mParameters.selectedItem.mProperties.key;
		},
		handleChangeBolDate: function (oEvent) {
			if (oEvent.getSource().getValue()) {
				this.ShippingInfo.results[0].boldt = this.formattoSAPdate(oEvent.getSource().getValue());
			} else {
				this.ShippingInfo.results[0].boldt = null;
			}
		},
		handleChangeHAWDate: function (oEvent) {
			if (oEvent.getSource().getValue()) {
				this.ShippingInfo.results[0].hawbdt = this.formattoSAPdate(oEvent.getSource().getValue());
			} else {
				this.ShippingInfo.results[0].hawbdt = null;
			}
		},
		handleValueHelpEUI: function (oEvent) {
			this.inputId = oEvent.getSource().getId();
			if (!this.valueHelpEUI) {
				this.valueHelpEUI = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.dialogEUI", this);
				this.getView().addDependent(this.valueHelpEUI);
			}
			this.valueHelpEUI.open();
		},
		handleValueHelpSearchEUI: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter("param1", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		addRow_IGMSDetails: function (oArg) {
			if (!this.boeIGMDetails) {
				this.boeIGMDetails = {
					results: [{
						doctyp: this.docType,
						docno: this.docNumber,
						igmno: "",
						igmdt: null,
						iwrdt: null,
						gatignum: "",
						gatigdt: null,
						gatptcod: "",
						mawbno: "",
						mawbdt: null,
						hawbno: "",
						hawbdt: null,
						totnpck: "0",
						grswght: "0",
						untqtycod: "",
						pkgcod: "",
						mrknum1: "",
						mrknum2: "",
						mrknum3: ""
					}]
				}
				var oModelboeIGMDetails = new sap.ui.model.json.JSONModel([]);
				oModelboeIGMDetails.setData(this.boeIGMDetails);
				this.getView().setModel(oModelboeIGMDetails, "boeIGMDetails");
			} else {
				this.boeIGMDetails.results.push({
					doctyp: this.docType,
					docno: this.docNumber,
					igmno: "",
					igmdt: null,
					iwrdt: null,
					gatignum: "",
					gatigdt: null,
					gatptcod: "",
					mawbno: "",
					mawbdt: null,
					hawbno: "",
					hawbdt: null,
					totnpck: "0",
					grswght: "0",
					untqtycod: "",
					pkgcod: "",
					mrknum1: "",
					mrknum2: "",
					mrknum3: "",
					Mode: "X"
				});
				this.getView().getModel("boeIGMDetails").refresh();
			}
		},
		deleteIGMS: function (oArg) {
			var seqiteno = "1";
			var NextseqNo = "";
			var currentRow = oArg.getSource().getParent().sId.slice(-1);
			var _self = this;
			var mParameters = {
				groupId: "batchDelete",
				eTag: "*"
			};
			MessageBox.confirm("Changes Cannot be Reversed. Do You Still Want to Delete ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						_self.BoeModel.remove("/xBRIxI_IGMS_BE(doctyp='" + _self.boeIGMDetails.results[currentRow].doctyp + "',docno='" + _self.boeIGMDetails
							.results[currentRow].docno + "',igmsrlno='" + _self.boeIGMDetails.results[currentRow].igmsrlno + "')", mParameters);
						_self.BoeModel.submitChanges({
							mParameters,
							success: function (result) {
								MessageBox.success("Selected Data Deleted Successfully");
								_self.boeIGMDetails.results.splice(currentRow, 1);
								_self.getView().getModel("boeIGMDetails").refresh();
							},
							error: function (err) {
								MessageBox.error("Error while Deleting Details");
							}
						});
					}
				}
			});
		},
		handleChangeIGMDate: function (oEvent) {
			var Id = oEvent.getSource().getId();
			var currentRow = oEvent.getSource().getParent().getIndex();
			if (Id.includes("igmdt")) {
				this.boeIGMDetails.results[currentRow].igmdt = oEvent.getSource().getValue() ? oEvent.getSource().getValue() : null;
			} else if (Id.includes("iwrdt")) {
				this.boeIGMDetails.results[currentRow].iwrdt = oEvent.getSource().getValue() ? oEvent.getSource().getValue() : null;
			} else if (Id.includes("gatigdt")) {
				this.boeIGMDetails.results[currentRow].gatigdt = oEvent.getSource().getValue() ? oEvent.getSource().getValue() : null;
			} else if (Id.includes("mawbdt")) {
				this.boeIGMDetails.results[currentRow].mawbdt = oEvent.getSource().getValue() ? oEvent.getSource().getValue() : null;
			} else if (Id.includes("hawbdt")) {
				this.boeIGMDetails.results[currentRow].hawbdt = oEvent.getSource().getValue() ? oEvent.getSource().getValue() : null;
			}
			this.getView().getModel("boeIGMDetails").refresh();
		},
		Create_BondFun: function (oEvent) {
			var BtnId = oEvent.getSource().getId();
			if (!this.BondCrtWin) {
				this.BondCrtWin = sap.ui.xmlfragment("EXIM_IMPNBOE.view.fragments.BondCrtionWin", this);
			}
			if (BtnId.includes("btn_BtoB")) {
				sap.ui.getCore().byId("BndCrtUi").setTitle("Create Bond to Bond");
				sap.ui.getCore().byId("CrtBndtoBnd").setVisible(true);
				sap.ui.getCore().byId("CrtExBnd").setVisible(false);
				sap.ui.getCore().byId("BndItmsTbl").getColumns()[6].setVisible(false);
				sap.ui.getCore().byId("BndItmsTbl").getColumns()[5].setVisible(true);
			} else {
				sap.ui.getCore().byId("BndCrtUi").setTitle("Create Ex Bond");
				sap.ui.getCore().byId("CrtBndtoBnd").setVisible(false);
				sap.ui.getCore().byId("CrtExBnd").setVisible(true);
				sap.ui.getCore().byId("BndItmsTbl").getColumns()[6].setVisible(true);
				sap.ui.getCore().byId("BndItmsTbl").getColumns()[5].setVisible(false);
			}
			this.getView().addDependent(this.BondCrtWin);
			this.BondCrtWin.open();
		},
		CloseWin: function () {
			this.BondCrtWin.close();
		},
		CreateBond: function (oEvent) {
			var _self = this;
			this._OpenBusyDialog();
			var BtnId = oEvent.getSource().getId();
			var oTblModelData = sap.ui.getCore().byId("BndItmsTbl").getModel("boeItemList").oData;

			if (BtnId.includes("CrtBndtoBnd")) {
				var json = this._FnUpdateBndHeader(this._FnConvertJSON(this.boeHeaderData), this.docNumber, "B");
			} else {
				var json = this._FnUpdateBndHeader(this._FnConvertJSON(this.boeHeaderData), this.docNumber, "E");
			}
			if (json) {
				this.BoeModel.create("/xBRIxi_iidbehdr", json, {
					success: function (oData, response) {
						var statusText = JSON.parse(response.headers['sap-message']).message;
						MessageBox.success(statusText, {
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									_self._CloseBusyDialog();
									window.FlagRefresh = true;
									window.FromDocNumber = _self.docNumber;
									window.BOEType = _self.docType;
									_self._IntialDisplayView();
									_self.router.navTo("boelist", true);
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
		},
		_FnUpdateBndHeader: function (jsonObj, oSelectedItem, Type) {
			var _self = this;
			var docType = Type;
			var Dateobj = new Date();
			var TodayDate = Dateobj.getFullYear() + "-" + ('0' + (Dateobj.getMonth() + 1)).slice(-2) + "-" + ('0' + Dateobj.getDate()).slice(-
				2);
			var Idate = TodayDate + "T00:00:00";
			jsonObj.boedate = Idate,
				jsonObj.doctyp = docType,
				jsonObj.pdoccat = "BOE",
				jsonObj.pdocno = oSelectedItem,
				jsonObj.docno = "";
			if (jsonObj.boedate) {
				jsonObj.boedate = this.DateConvert(jsonObj.boedate);
			}
			//********* for last date of free days *******//
			if (jsonObj.free_lastdt) {
				jsonObj.free_lastdt = this.DateConvert(jsonObj.free_lastdt);
			}
			//********* for last date of free days *******//
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
			if (jsonObj.agmtdat) {
				jsonObj.agmtdat = this.DateConvert(jsonObj.agmtdat);
			}
			if (jsonObj.hss_agreement_date) {
				jsonObj.hss_agreement_date = this.DateConvert(jsonObj.hss_agreement_date);
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

			jsonObj.to_itemdetails = this._UpdateItenDetails(this._FnConvertJSON(this.ItemList.results), oSelectedItem, Type);
			jsonObj.to_Salo = this._UpdateSalo(this._FnConvertJSON(this.LicenceItemData.results), Type);
			jsonObj.to_shippingdetails = this._UpdateShippingData(this._FnConvertJSON(this.ShippingInfo.results), Type);

			/*	if (docType == "E") {
					jsonObj.to_I_be = this.BEDetailsUpdate(this._FnConvertJSON(this.boeBEdetails.results), Type);
					jsonObj.to_I_IGMS_BE = this.IGMSDetailsUpdate(this._FnConvertJSON(this.boeIGMDetails.results), Type);
				} else {*/
			delete jsonObj.to_I_be;
			delete jsonObj.to_I_IGMS_BE;
			//	}

			delete jsonObj.impdpsno;
			delete jsonObj.impdpdat;
			delete jsonObj.boeamdmt;
			delete jsonObj.boeamdtdetl;
			delete jsonObj.boeamdtreq;
			delete jsonObj.amndtcompdt;
			delete jsonObj.rsonboeamndt;
			delete jsonObj.rsoncustdly;
			delete jsonObj.rsonshpdly;
			delete jsonObj.icd_igm_no;
			delete jsonObj.icd_igm_date;
			delete jsonObj.ooc_date;
			delete jsonObj.ooc_reg_date;
			delete jsonObj.pkgcod;
			delete jsonObj.challan_no;
			delete jsonObj.tr6_challan_date;
			delete jsonObj.rsonfilprov;
			delete jsonObj.rsondlyclrnce;
			delete jsonObj.panno;
			delete jsonObj.svbndfleno;
			delete jsonObj.ieccodsel;
			delete jsonObj.to_BE_BOE;
			delete jsonObj.to_bndocdlrymtod;
			delete jsonObj.to_ClearanceType;
			delete jsonObj.to_ctrl_be;
			delete jsonObj.to_DIFFDUTYPAYMENT;
			delete jsonObj.to_ImportPurpose;
			delete jsonObj.to_IMPORT_PURPOSE;
			delete jsonObj.to_I_AMEND_BE;

			delete jsonObj.to_I_be_sup_doc;
			delete jsonObj.to_I_CERT_BE;
			delete jsonObj.to_I_DEPB_BE;
			delete jsonObj.to_I_EXCHANGE_BE;
			delete jsonObj.to_I_HSS_BE;

			delete jsonObj.to_I_iid_ctx_be;
			delete jsonObj.to_I_PERM_BE;
			delete jsonObj.to_I_reimport_be;
			delete jsonObj.to_I_RSP_BE;
			delete jsonObj.to_I_statemet_be;
			delete jsonObj.to_Materialtype;
			delete jsonObj.to_boestatus;
			delete jsonObj.to_Clearance_Type;
			delete jsonObj.to_Currencycurrcode;
			delete jsonObj.to_Currencyinr;
			delete jsonObj.to_doctype;
			delete jsonObj.to_drctportdelvery;
			delete jsonObj.to_dutydetails;
			delete jsonObj.to_Material_type;
			delete jsonObj.to_Mode_of_Payment;
			delete jsonObj.to_shptyp;
			delete jsonObj.to_pro_be;
			delete jsonObj.to_SHIPPING_LINE;
			delete jsonObj.to_SHP_TYPE;
			delete jsonObj.to_swc_be;
			delete jsonObj.to_TYPE_OF_ASSMNT;
			delete jsonObj.to_WAREHOUSE_MASTER;

			delete jsonObj.__metadata;

			if (jsonObj.to_itemdetails) {
				return jsonObj;
			} else {
				MessageBox.error("Please Fill the Quantity");
				this._CloseBusyDialog();
				return false;
			}

		},

		DateConvert: function (value) {
			if (value.includes("00:00:00.000Z")) {
				value = value.replace(/Z/g, '');
			}
			return value;
		},
		_UpdateItenDetails: function (obj, DocNr, Type) {
			/*A blank array to identify the itemnumber which is needs to copy for Ex/Bond*/
			var ItemIds = new Array();
			if (Type == "E") {
				var Classify = "E";
			} else {
				var Classify = "N";
			}
			var docType;

			for (var i = 0; i < obj.length; i++) {
				/* Get the item details ,If the Qauntity enterd */
				if ((Type == "E" && (obj[i].exbnd_inv_qty != undefined && obj[i].exbnd_inv_qty != null && obj[i].exbnd_inv_qty != 0)) || (Type ==
						"B" && (obj[i].btob_inv_qty != undefined && obj[i].btob_inv_qty != null && obj[i].btob_inv_qty != 0))) {
					ItemIds.push(obj[i].boeitno);
					var MengQty = (Type == "E") ? obj[i].exbnd_inv_qty : obj[i].btob_inv_qty;

					obj[i].clin = DocNr;
					obj[i].docno = "";
					obj[i].doctyp = Type;
					obj[i].classify = Classify;

					obj[i].frgtamt = (((parseFloat(obj[i].frgtamt) / parseFloat(obj[i].menge)) * parseFloat(MengQty)).toFixed(3)).toString();
					obj[i].insuamt = (((parseFloat(obj[i].insuamt) / parseFloat(obj[i].menge)) * parseFloat(MengQty)).toFixed(3)).toString();
					obj[i].agcomm = (((parseFloat(obj[i].agcomm) / parseFloat(obj[i].menge)) * parseFloat(MengQty)).toFixed(3)).toString();
					obj[i].misschar = (((parseFloat(obj[i].misschar) / parseFloat(obj[i].menge)) * parseFloat(MengQty)).toFixed(3)).toString();
					obj[i].landchar = (((parseFloat(obj[i].landchar) / parseFloat(obj[i].menge)) * parseFloat(MengQty)).toFixed(3)).toString();
					obj[i].svb_load_assval = (((parseFloat(obj[i].svb_load_assval) / parseFloat(obj[i].menge)) * parseFloat(MengQty)).toFixed(3)).toString();
					obj[i].svb_loadduty = (((parseFloat(obj[i].svb_loadduty) / parseFloat(obj[i].menge)) * parseFloat(MengQty)).toFixed(3)).toString();
					obj[i].add_load_amt = (((parseFloat(obj[i].add_load_amt) / parseFloat(obj[i].menge)) * parseFloat(MengQty)).toFixed(3)).toString();
					obj[i].hssloadamt = (((parseFloat(obj[i].hssloadamt) / parseFloat(obj[i].menge)) * parseFloat(MengQty)).toFixed(3)).toString();
					obj[i].invgrwt = (((parseFloat(obj[i].invgrwt) / parseFloat(obj[i].menge)) * parseFloat(MengQty)).toFixed(3)).toString();
					obj[i].invntwt = (((parseFloat(obj[i].invntwt) / parseFloat(obj[i].menge)) * parseFloat(MengQty)).toFixed(3)).toString();
					// code added by abin
					obj[i].reason_if_fta_not_entitles = (((parseFloat(obj[i].reason_if_fta_not_entitles) / parseFloat(obj[i].menge)) * parseFloat(
						MengQty)).toFixed(3)).toString();
					obj[i].totval = ((parseFloat(obj[i].netpr) * parseFloat(MengQty)).toFixed(3)).toString();
					//	obj[i].invoiceval = ((parseFloat(obj[i].netpr) * parseFloat(MengQty)).toFixed(3)).toString();
					obj[i].cifvlrs = ((parseFloat(obj[i].frgtamt) * parseFloat(obj[i].frgt_exch)) + (parseFloat(obj[i].insuamt) * parseFloat(obj[i]
							.insu_exch)) +
						(parseFloat(obj[i].totval) * parseFloat(obj[i].net_exch))).toFixed(3).toString();

					var MiscAm = (parseFloat(obj[i].misschar) * parseFloat(obj[i].msc_exch));

					obj[i].assval = ((parseFloat(obj[i].cifvlrs) + parseFloat(obj[i].svb_load_assval) + parseFloat(obj[i].landchar) + (parseFloat(
							MiscAm)) + (parseFloat(obj[i].hssloadamt) * parseFloat(obj[i].hssloadamt_exch)) + (parseFloat(obj[i].add_load_amt) *
							parseFloat(obj[i].add_load_amt_exch)))
						.toFixed(3)).toString();

					obj[i].menge = MengQty;
					obj[i].bal_inv_qty = MengQty;

					if (obj[i].invoicedt) {
						obj[i].invoicedt = this.DateConvert(obj[i].invoicedt);
					}
					if (obj[i].actcontowrhsdt) {
						obj[i].actcontowrhsdt = this.DateConvert(obj[i].actcontowrhsdt);
					}
					if (obj[i].svborderdate) {
						obj[i].svborderdate = this.DateConvert(obj[i].svborderdate);
					}
					if (obj[i].locvehicleplacemtdt) {
						obj[i].locvehicleplacemtdt = this.DateConvert(obj[i].locvehicleplacemtdt);
					}
					if (obj[i].plncontowrhsdt) {
						obj[i].plncontowrhsdt = this.DateConvert(obj[i].plncontowrhsdt);
					}

					if (obj[i].locvehicleloadmtdt) {
						obj[i].locvehicleloadmtdt = this.DateConvert(obj[i].locvehicleloadmtdt);
					}
					if (obj[i].lccustpodt) {
						obj[i].lccustpodt = this.DateConvert(obj[i].lccustpodt);
					}
					if (obj[i].lcinvdt) {
						obj[i].lcinvdt = this.DateConvert(obj[i].lcinvdt);
					}
					if (obj[i].lcldocrtdt) {
						obj[i].lcldocrtdt = this.DateConvert(obj[i].lcldocrtdt);
					}

					if (obj[i].so_crea_dt) {
						obj[i].so_crea_dt = this.DateConvert(obj[i].so_crea_dt);
					}

					if (obj[i].lclshpcrdt) {
						obj[i].lclshpcrdt = this.DateConvert(obj[i].lclshpcrdt);
					}
					if (obj[i].locvehiclereachmtdt) {
						obj[i].locvehiclereachmtdt = this.DateConvert(obj[i].locvehiclereachmtdt);
					}
					if (obj[i].locvehicleunloadmtdt) {
						obj[i].locvehicleunloadmtdt = this.DateConvert(obj[i].locvehicleunloadmtdt);
					}
					if (obj[i].pbedt) {
						obj[i].pbedt = this.DateConvert(obj[i].pbedt);
					}
					if (obj[i].podate) {
						obj[i].podate = this.DateConvert(obj[i].podate);
					}
					if (obj[i].contdt) {
						obj[i].contdt = this.DateConvert(obj[i].contdt);
					}
					if (obj[i].lcdt) {
						obj[i].lcdt = this.DateConvert(obj[i].lcdt);
					}
					if (obj[i].goodrecieptdat) {
						obj[i].goodrecieptdat = this.DateConvert(obj[i].goodrecieptdat);
					}
					if (obj[i].undrprtstpmntreqdt) {
						obj[i].undrprtstpmntreqdt = this.DateConvert(obj[i].undrprtstpmntreqdt);
					}
					if (obj[i].dateofemptycont) {
						obj[i].dateofemptycont = this.DateConvert(obj[i].dateofemptycont);
					}
					if (obj[i].finalassmtdate) {
						obj[i].finalassmtdate = this.DateConvert(obj[i].finalassmtdate);
					}

					delete obj[i].to_Currency;
					delete obj[i].to_UOM;
					delete obj[i].to_dochdr;
					delete obj[i].to_BOEHeader;
					delete obj[i].to_Unitdel;
					delete obj[i].to_Unitmein;
					delete obj[i].to_Unitmeins01;
					delete obj[i].to_Unitrec;
					delete obj[i].to_Unitull;
					delete obj[i].btob_inv_qty;
					delete obj[i].exbnd_inv_qty;
					delete obj[i].__metadata;

				}
			}
			/* Get all the other records which no need to copy*/
			this.RemoveArray = obj.filter(function (f) {
				return (!ItemIds.includes(f.boeitno));
			});
			/*Removed the unwanted  records from obj*/
			this.RemoveArray.map(function (f) {
				obj.splice(obj.findIndex(x => x.boeitno == f.boeitno), 1)
					//	BoeItemobj.splice(obj.findIndex(x => x.boeitno == f.boeitno),1)

			});

			if (obj.length == 0) {
				return false;
			} else {
				return obj;
			}

		},

		_UpdateSalo: function (obj, Type) {
			for (var i = 0; i < obj.length; i++) {
				obj[i].docnr = "";
				obj[i].doccat = "";
				obj[i].doctyp = Type;
				if (obj[i].trackdt) {
					obj[i].trackdt = this.DateConvert(obj[i].trackdt);
				}
				delete obj[i].to_Currency;
				delete obj[i].to_UOM;
				delete obj[i].to_dochdr;
				delete obj[i].to_BOEHeader;
				delete obj[i].__metadata;
			}
			this.RemoveArray.map(function (f) {
				obj.splice(obj.findIndex(x => x.docitem == f.boeitno), 1)
			});

			return obj;
		},
		_UpdateShippingData: function (obj, Type) {
			var Dateobj = new Date();
			var TodayDate = Dateobj.getFullYear() + "-" + ('0' + (Dateobj.getMonth() + 1)).slice(-2) + "-" + ('0' + Dateobj.getDate()).slice(-
				2);
			var Idate = TodayDate + "T00:00:00";
			for (var i = 0; i < obj.length; i++) {
				obj[i].boerefno = "";
				obj[i].boecdat = Idate;
				obj[i].doctyp = Type;
				obj[i].refdocno = obj[i].refdocnr;
				if (obj[i].refdocdat) {
					obj[i].refdocdat = this.DateConvert(obj[i].refdocdat);
				}
				obj[i].refdoccat = obj[i].refdoccat;
				obj[i].nopkg = obj[i].nopkg;
				obj[i].port = obj[i].port;
				obj[i].bolnr = obj[i].bolnr;
				if (obj[i].boldt) {
					obj[i].boldt = this.DateConvert(obj[i].boldt);
				}
				if (obj[i].ersda) {
					obj[i].ersda = this.DateConvert(obj[i].ersda);
				}
				if (obj[i].laeda) {
					obj[i].laeda = this.DateConvert(obj[i].laeda);
				}
				if (obj[i].hawbdt) {
					obj[i].hawbdt = this.DateConvert(obj[i].hawbdt);
				}

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

		CheckQtyVal: function (oEvent) {
			//	var ItemNo = oEvent.getSource().getParent().getCells()[0].data("boeitno");
			if (parseFloat(oEvent.getSource().getValue()) > parseFloat(oEvent.getSource().getParent().getCells()[4].getValue())) {
				MessageBox.error("Entered Quantity should not be greater than Balance Invoice Quantity");
				oEvent.getSource().getParent().getCells()[5].setValue("");
				oEvent.getSource().getParent().getCells()[6].setValue("");
				return false;
			}
		},

		//Nikhila
		OnDocSelection: function (oEvent) {
			//this._OpenBusyDialog();
			this.NNDO_docnr = this.boeHeaderData.nndo;
			//this._setFolderName(oEvent.getSource().getSelectedKey());
			if (this.initialNNDOLoad) {
				if (this.NNDODocType.results.length <= 0) {
					var filters = new Array();
					var filterval = new sap.ui.model.Filter("modul", sap.ui.model.FilterOperator.EQ, "NNDO");
					filters.push(filterval);
					var oModelDMSData = new sap.ui.model.json.JSONModel();
					this.getView().setModel(oModelDMSData, "DMSNNDOModel");
					var _self = this;
					this.DMS_Model.read("/xBRIxI_DMS", {
						urlParameters: {
							$top: "500"
						},
						filters: filters,
						success: function (oData) {
							_self.NNDODocType.results = oData.results;
							var data = {
								results: []
							};
							data.results.doccat = "All";
							data.results.doctyp = "All";
							data.results.doctypdesc = "All";
							oData.results.push(data.results);
							_self.getView().getModel("DMSNNDOModel").setData(oData);
							_self.getView().byId("itemNNDOCB").setSelectedKey("All");
						},
						error: function (response) {}
					});
					if (oEvent.getSource().getSelectedKey() == "NNDODoc") {
						this.getView().byId("itemNNDOCB").setSelectedKey("All");
						if (this.allNNDOFiles) {
							this.viewAllFilteredNNDOFiles();
						} else {
							this._OpenBusyDialog();
						}
					} else {
						this.getView().byId("itemCB").setSelectedKey("All");
						if (this.AllFiles) {
							this.ViewAllFilteredFiles();
						} else {
							this._OpenBusyDialog();
						}

					}
				}
			} /* else {*/
			if (oEvent.getSource().getSelectedKey() == "NNDODoc") {
				this.getView().byId("itemNNDOCB").setSelectedKey("All");
				if (this.allNNDOFiles) {
					this.viewAllFilteredNNDOFiles();
				} else {
					this._OpenBusyDialog();
				}
			} else {
				this.getView().byId("itemCB").setSelectedKey("All");
				if (this.AllFiles) {
					this.ViewAllFilteredFiles();
				} else {
					this._OpenBusyDialog();
				}

			}
			//	}
		},
		dmsNNDOTypeChange: function (oEvent) {
			this.NNDO_doctype = oEvent.getSource().getSelectedKey();
			this.viewAllFilteredNNDOFiles(); //change by nikhila
		},
		viewAllFilteredNNDOFiles: function () { //change by nikhila
			/*var key = this.getView().byId("itemNNDOCB").getSelectedKey(); //change by nikhila
			var oModel = new sap.ui.model.json.JSONModel(); //change by nikhila
			// Load JSON in model
			var tempJson = {
			results: []
			};
			tempJson.results = this.allNNDOFiles.results.filter(a => a.Name.startsWith(key)); //change by nikhila
			oModel.setData(tempJson); //change by nikhila
			_self.getView().setModel(oModel, "AllNNDOFiles"); //change by nikhila*/

			if (this.byId("itemNNDOCB").getSelectedKey() == "All") {

				var oModel = new sap.ui.model.json.JSONModel();
				// Load JSON in model
				oModel.setData(this.allNNDOFiles);
				this.getView().setModel(oModel, "AllNNDOFiles");
			} else {
				var key = this.byId("itemNNDOCB").getSelectedKey();
				var oModel = new sap.ui.model.json.JSONModel();
				var tempJSON = {
					results: []
				};
				tempJSON.results = this.allNNDOFiles.results.filter(a => a.filename.startsWith(key));
				// Load JSON in model
				oModel.setData(tempJSON);
				this.getView().setModel(oModel, "AllNNDOFiles");
			}
			//this._CloseBusyDialog();

		}, //change by nikhila
		readJavaNNDOFiles: function (docnr, nndoFolderName) {
			//console.log("readJavaNNDOFiles", nndoFolderName);
			var msg = {
				results: []
			};
			var _self = this;
			var paramdocno = "_" + docnr + "_"; //change by nikhila
			jQuery.ajax({
				url: "/documentservice/fileInfo",
				type: "POST",
				data: JSON.stringify({
					"docno": paramdocno,
					"foldername": nndoFolderName
				}),
				async: true,
				dataType: "json",
				contentType: "application/json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Basic " + btoa("ui5user" + ":" + "@#SsdFg!05!7*3Bvl.6iNm0%)Q!"));
				},
				success: function (data) {
					var msg = {
						results: []
					};
					if (!data.msgText.match("null")) {
						var singleFile = false;
						if (data.msgText.length > 2) {
							var str;
							if (data.msgText.match("~")) {
								str = data["msgText"].replace("{NNDO=", "").split("~~~");
							} else {
								str = data["msgText"].replace("{NNDO=", "");
								singleFile = true;
								var results = {};
								results.filename = str.split("---")[0];
								msg.results.push(results);
							}
							if (!singleFile) {
								for (var i = 0; i < str.length; i++) {
									var results = {};
									results.filename = str[i].split("---")[0];
									msg.results.push(results);
								}
							}
						}
					}
					_self.allNNDOFiles = { //change by nikhila
						results: [] //change by nikhila
					}; //change by nikhila
					_self.allNNDOFiles = msg; //change by nikhila
					var oModel = new sap.ui.model.json.JSONModel();
					// Load JSON in model
					oModel.setData(msg);
					_self.getView().setModel(oModel, "AllNNDOFiles");
					_self._CloseBusyDialog();
				},
				error: function (e) {
					_self._CloseBusyDialog();
				}
			});
		},
		readNNDOFiles: function (docnr) {
			//console.log("inside readNNDOFiles", this.nndoFoldeName);//testing
			var _self = this;
			var filtersData = new Array();
			var filterval1 = new sap.ui.model.Filter("module_dms", sap.ui.model.FilterOperator.EQ, "NNDO");
			var filterval2 = new sap.ui.model.Filter("docno", sap.ui.model.FilterOperator.EQ, this.boeHeaderData.nndo);
			filtersData.push(filterval1);
			filtersData.push(filterval2);
			var oModelDMSData = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModelDMSData, "DMSModel");
			this.DMSService_Model.read("/xBRIxI_DMSFILCHECK", {
				urlParameters: {
					$top: "5000"
				},
				filters: filtersData,
				success: function (oData, response) {
					debugger;
					var checkCount = oData.results.length;
					_self.DMSService_Model.read("/xBRIxi_dms_table", {
						urlParameters: {
							$top: "5000"
						},
						filters: filtersData,
						success: function (oDataVar, sponse) {
							var TableCount = oDataVar.results.length;
							if (_self.boeHeaderData.nndo_fldr !== "") {
								_self.nndoFolderName = _self.boeHeaderData.nndo_fldr;
							} else {
								_self.nndoFolderName = "NNDO";
							}
							if (checkCount <= 0 && TableCount <= 0) {
								_self.readJavaNNDOFiles(_self.boeHeaderData.nndo, _self.nndoFolderName);
							} else {
								_self.allNNDOFiles = { //change by nikhila
									results: [] //change by nikhila
								}; //change by nikhila
								_self.allNNDOFiles = oDataVar; //change by nikhila
								var oModel = new sap.ui.model.json.JSONModel();
								// Load JSON in model
								oModel.setData(oDataVar);
								_self.getView().setModel(oModel, "AllNNDOFiles");
								_self._CloseBusyDialog();
							}
						},
						error: function (response) {
							debugger;
						}
					});
				},
				error: function (response) {
					debugger;
				}
			});
			this.getView().byId("fileUploader").setEnabled(false);
			this.getView().byId("btnUpload").setEnabled(false);

		},
		onPressDeleteNNDO: function (oEvent) {
			var folderName = this.nndoFolderName;
			var fileName = oEvent.getSource().getParent().getCells()[0].getText();
			this.NNDOfileName = fileName;
			this.dmsFileIndex = this.allNNDOFiles.results.findIndex(obj => obj.filename == fileName);
			var msg = "Do you want to delete " + fileName;
			var that = this;
			var email = sap.ushell.Container.getService("UserInfo").getId();
			//var email = "riji.cp@ivldsp.com"; //
			var filter = new Array();
			var filterval;
			filterval = new sap.ui.model.Filter("email_id", sap.ui.model.FilterOperator.EQ, email);
			filter.push(filterval);
			this.S_User_Identif_Model.read("/xBRIxi_super_user", {
				filters: filter,
				success: function (getData) {
					console.log("suser:", getData);
					if (getData.results.length != 0 && getData.results[0].usertyp == 'S') {
						MessageBox.show(msg, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Confirmation",
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							initialFocus: sap.m.MessageBox.Action.NO,
							onClose: function (oAction) {
								if (oAction == sap.m.MessageBox.Action.YES) {
									that._OpenBusyDialog();
									jQuery.ajax({
										url: "/documentservice/deletefile",
										type: "POST",
										data: JSON.stringify({
											foldername: folderName,
											filename: fileName
										}),
										dataType: "json",
										contentType: "application/json",
										beforeSend: function (xhr) {
											xhr.setRequestHeader("Authorization", "Basic " + btoa("ui5user" + ":" + "@#SsdFg!05!7*3Bvl.6iNm0%)Q!"));
										},
										success: function (data) {
											//console.log(data);
											MessageBox.show("File deleted successfully");
											//console.log("File deleted successfully");

											that.DeleteDMSNNDOFile_Table(that.boeHeaderData.nndo);
											var index = that.allNNDOFiles.results.findIndex(obj => obj.filename == that.NNDOfileName); //change by nikhila
											that.allNNDOFiles.results.splice(index, 1); //change by nikhila
											that.viewAllFilteredNNDOFiles(); //change by nikhila
											that._CloseBusyDialog();
										},
										error: function (e) {
											console.log(e);
											console.log("Error while deleting the file");
											that._CloseBusyDialog();
										}
									});
								} else {
									that.nndoBtn.setVisible(false);
									that._CloseBusyDialog();
								}
							}
						});

					} else {
						MessageBox.warning("You have no authorization to delete this document", {
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {
								that._CloseBusyDialog();
							}
						});

					}
				},
				error: function (response) {

				}

			});

		},

		onPressDeleteBOE: function (oEvent) {
			//	console.log("inside onPressDeleteBOE", this.boeFolderName);
			var folderName = this.boeFolderName;
			var fileName = oEvent.getSource().getParent().getCells()[0].getText();
			this.BOEFileName = fileName;
			var msg = "Do you want to delete " + fileName;
			this.dmsFileIndex = this.AllFiles.results.findIndex(obj => obj.filename == fileName);
			var that = this;
			that._OpenBusyDialog();
			var email = sap.ushell.Container.getService("UserInfo").getId();
			//var email = "riji.cp@ivldsp.com"; //
			var filter = new Array();
			var filterval;
			filterval = new sap.ui.model.Filter("email_id", sap.ui.model.FilterOperator.EQ, email);
			filter.push(filterval);
			this.S_User_Identif_Model.read("/xBRIxi_super_user", {
				filters: filter,
				success: function (getData) {
					//console.log("suser:", getData);
					if (getData.results.length != 0 && getData.results[0].usertyp == 'S') {
						MessageBox.show(msg, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Confirmation",
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							initialFocus: sap.m.MessageBox.Action.NO,
							onClose: function (oAction) {
								if (oAction == sap.m.MessageBox.Action.YES) {
									that._OpenBusyDialog();
									jQuery.ajax({
										url: "/documentservice/deletefile",
										type: "POST",
										data: JSON.stringify({
											foldername: folderName,
											filename: fileName
										}),
										dataType: "json",
										contentType: "application/json",
										beforeSend: function (xhr) {

											xhr.setRequestHeader("Authorization", "Basic " + btoa("ui5user" + ":" + "@#SsdFg!05!7*3Bvl.6iNm0%)Q!"));
										},
										success: function (data) {
											MessageBox.show("File deleted successfully");
											that.DeleteDMSFile_Table(that.argsList.docnr);
											var index = that.AllFiles.results.findIndex(obj => obj.filename == that.BOEFileName); //change by nikhila
											that.AllFiles.results.splice(index, 1); //change by nikhila
											that.ViewAllFilteredFiles(); //change by nikhila
											that.boeBtn.setVisible(false);
											that._CloseBusyDialog();
										},
										error: function (e) {
											console.log(e);
											console.log("Error while deleting the file");
											that._CloseBusyDialog();

										}
									});
								} else {
									that.boeBtn.setVisible(false);
									that._CloseBusyDialog();
								}
							}
						});

					} else {
						MessageBox.warning("You have no authorization to delete this document", {
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {
								that._CloseBusyDialog();
							}
						});

					}
				},
				error: function (response) {

				}

			});

		},

		SelectNNDORow: function (oEvent) {

			if (this.prevNNDO != undefined) {
				/*this.getView().byId("idNNDOTab").getRows()[this.prevNNDO].getCells()[2].setVisible(false);
				var id = this.getView().byId("idNNDOTab").getRows()[this.prevNNDO].getCells()[1].getId();
				oEvent.getSource().getSelectedIndex() < 0
				document.getElementById(id).removeChild(this.link);*/
				this.nndoBtn.setVisible(false);
				// document.getElementById(this.nndoIndexId).removeChild(this.link);
				if (document.getElementById(this.nndoIndexId).hasChildNodes()) {
					document.getElementById(this.nndoIndexId).removeChild(this.link);
				}
				this.prevNNDO = undefined;
			}
			if (oEvent.getSource().getSelectedIndex() < 0 && this.prevNNDO != undefined) {
				/*this.getView().byId("idNNDOTab").getRows()[this.prevNNDO].getCells()[2].setVisible(false);
				var id = this.getView().byId("idNNDOTab").getRows()[this.prevNNDO].getCells()[1].getId();
				oEvent.getSource().getSelectedIndex() < 0
				document.getElementById(id).removeChild(this.link);*/
				this.nndoBtn.setVisible(false);
				if (document.getElementById(this.nndoIndexId).hasChildNodes()) {
					document.getElementById(this.nndoIndexId).removeChild(this.link);
				}
				this.prevNNDO = undefined;
			}
			if (oEvent.getSource().getSelectedIndex() >= 0) {
				this.prevNNDO = oEvent.getSource().getSelectedIndex();
				this._OpenBusyDialog();
				/*this.File_Name = this.getView().byId("idNNDOTab").getRows()[oEvent.getSource().getSelectedIndex()].getCells()[0].getText();
				this.getView().byId("idNNDOTab").getRows()[oEvent.getSource().getSelectedIndex()].getCells()[2].setVisible(false);
				var id = this.getView().byId("idNNDOTab").getRows()[oEvent.getSource().getSelectedIndex()].getCells()[1].getId();*/
				this.File_Name = this.getView().byId("idNNDOTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties
					.firstVisibleRow].getCells()[0].getText();
				var id = this.getView().byId("idNNDOTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties.firstVisibleRow]
					.getCells()[1].getId();
				this.nndoIndexId = id;
				this.getView().byId("idNNDOTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties.firstVisibleRow]
					.getCells()[2].setVisible(true);
				this.nndoBtn = this.getView().byId("idNNDOTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties
						.firstVisibleRow]
					.getCells()[2];

				//change by riji
				//console.log("selectrow:", this.allNNDOFiles.results[oEvent.getSource().getSelectedIndex()]);
				if (this.allNNDOFiles.results[oEvent.getSource().getSelectedIndex()].servicetype == "OBJ") {
					var file_id = this.allNNDOFiles.results[oEvent.getSource().getSelectedIndex()].fileid;
					//console.log("file_id", file_id);
					this.DownloadFilefromOBJ(id, this.nndoFolderName, file_id);
				} else {
					this.DownloadFilefromDMS(id, this.nndoFolderName);
				}
				//this.DownloadFile(id, "NNDO");
				//this.DownloadFile(id, this.nndoFolderName);
			}
			/*else {
			if (this.prevNNDO != undefined) {
			this.nndoBtn.setVisible(false);
			document.getElementById(this.nndoIndexId).removeChild(this.link);
			this.prevNNDO = undefined;
			}
			}*/

		},

		onIconPress: function (oEvent) {
			if (oEvent.getSource().getSelectedKey() == "Doc") {
				this.byId("itemCB").setSelectedKey("All");
				this.getView().byId("HeaderDMS").setSelectedKey("BOEDoc");
				this.getView().byId("fileUploader").setEnabled(false);
				this.getView().byId("btnUpload").setEnabled(false);
				//	this.ViewAllFilteredFiles(); //Add boe docnr
				this.OnDocSelection(oEvent);

			} else {
				this.getView().byId("fileUploader").setEnabled(true);
				this.getView().byId("btnUpload").setEnabled(true);
			}

		},

		dmsTypeChange: function (oEvent) {
			this.doctype = oEvent.getSource().getSelectedKey();
			this.ViewAllFilteredFiles();
		},
		ViewAllFilteredFiles: function () {
			if (this.byId("itemCB").getSelectedKey() == "All") {
				this.getView().byId("fileUploader").setEnabled(false);
				this.getView().byId("btnUpload").setEnabled(false);

				var oModel = new sap.ui.model.json.JSONModel();
				// Load JSON in model
				oModel.setData(this.AllFiles);
				this.getView().setModel(oModel, "AllFiles");
			} else {
				this.getView().byId("fileUploader").setEnabled(true);
				this.getView().byId("btnUpload").setEnabled(true);
				var key = this.byId("itemCB").getSelectedKey();
				var oModel = new sap.ui.model.json.JSONModel();
				var tempJSON = {
					results: []
				};
				tempJSON.results = this.AllFiles.results.filter(a => a.filename.startsWith(key));
				// Load JSON in model
				oModel.setData(tempJSON);
				this.getView().setModel(oModel, "AllFiles");
			}
		},
		ViewAllFiles: function (docnr) {

			this.DMSListCall(docnr);

		},
		sendFiletoDMS: function (folderName, fileName, file) {
			var that = this;
			jQuery.ajax({
				url: "/documentservice/docupld",
				type: "POST",
				data: JSON.stringify({
					folderName: folderName,
					fileName: fileName,
					file: file
				}),
				dataType: "json",
				contentType: "application/json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Basic " + btoa("ui5user" + ":" + "@#SsdFg!05!7*3Bvl.6iNm0%)Q!"));
				},
				success: function (data) {
					that._CloseBusyDialog();
					MessageBox.success("File Uploaded Successfully");
					that.getView().byId("fileUploader").clear();
					that.AllFiles.results.push({
						filename: fileName,
						docno: that.argsList.docnr,
						module_dms: "BOE",
						doccat: "BOE",
						doctype: "BOE",
						fileid: "",
						mimetype: "",
						filesize: "",
						servicetype: that.fileServiceType
					});
					that.UpdateDMSTable(that.argsList.docnr);
					that.ViewAllFilteredFiles();
				},
				error: function (e) {
					that._CloseBusyDialog();
					MessageBox.error("Error while uploading file");
				}
			});
		},
		sendFiletoObjectStore: function (fileName, formData) {
			//console.log("inside sendFiletoObjectStore",formData);
			var that = this;
			jQuery.ajax({
				url: "https://object_store-zany-cheetah-cn.cfapps.eu10.hana.ondemand.com/objectstore/upload",
				type: "POST",
				data: formData,
				contentType: false,
				processData: false,
				headers: {
					"Accept": "application/json",
				},
				crossDomain: true,
				success: function (data) {
					that._CloseBusyDialog(); //change by nikhila
					MessageBox.success("File Uploaded Successfully");
					//	console.log("upload OBJ", data);
					that.getView().byId("fileUploader").clear();
					var filesize = data.filesize.toString();
					that.AllFiles.results.push({ //change by riji
						filename: fileName,
						docno: that.docnr,
						module_dms: "BOE",
						doccat: "BOE",
						doctype: "BOE",
						fileid: data.fileid,
						mimetype: data.mimetype,
						filesize: filesize,
						servicetype: that.fileServiceType
					});

					that.UpdateDMSTable(that.docnr);
					that.ViewAllFilteredFiles(); //change by nikhila
				},
				error: function (e) {
					that._CloseBusyDialog();
				}
			});
		},
		onHandleUploadPress: function (oEvent) {
			/*var oFileUpload = this.getView().byId("fileUploader");
			var domRef = oFileUpload.getFocusDomRef();
			var file = domRef.files[0];*/
			this._OpenBusyDialog();

			var sid = this.getView().byId("fileUploader").sId;
			var file = sap.ui.getCore().byId(sid).getDomRef("fu").files[0];
			if (file == "" || file == undefined) {
				MessageBox.error("Please select a file");
				this._CloseBusyDialog();
			} else {
				//Get the file name and type
				this.fileName = this.doctype + "_" + this.argsList.docnr + "_" + file.name;
				this.fileType = file.type;
				//	this.folderName = "BOE";
				//change by riji
				var API_KEY = "VEtCd1JVUVl0czpSNCU/WCgqSHNGZ0RQN20zUSVn";
				var formData = new FormData();
				if (this.fileServiceType == "OBJ") {
					formData.append('api_key', API_KEY);
					formData.append('file', file);
					formData.append('client', "T0001");
					formData.append('sub_folder', this.boeFolderName);
					//console.log("fileServiceType",this.fileServiceType);
					this.sendFiletoObjectStore(this.fileName, formData);
				} else if (this.fileServiceType == "" || this.fileServiceType == "DMS") {
					var that = this;
					var reader = new FileReader();
					reader.onload = function (e) {
						var content = e.currentTarget.result;
						that.sendFiletoDMS(that.boeFolderName, that.fileName, content);
					};
					reader.readAsDataURL(file);
				}
			}

			/*var reader = new FileReader();
			reader.onload = function (e) {
				//var content = e.currentTarget.result.replace("data:" + file.type + ";base64,", "");
				var content = e.currentTarget.result;
				//call the method to make the ajax call to the webservice,
				that.sendFiletoCloud(that.boeFolderName, that.fileName, content);
			};
			reader.readAsDataURL(file);*/
		},
		/*Mass download - Riji*/
		onHandleDownloadSelectedNNDO: function (oEvent) {
			var DmsTable = this.byId("idNNDOTab");
			var selItems = DmsTable.getSelectedIndices();
			if (selItems.length > 0) {
				for (var i = 0; i < selItems.length; i++) {
					var currentRow = selItems[i];
					//this.fileName = DmsTable.getRows()[currentRow].getCells()[0].getText();
					this.fileName = DmsTable.getBinding().oList[currentRow].filename;
					this.massDownloadFilefromDMS(this.fileName, this.nndoFolderName);
					sap.ui.core.BusyIndicator.show();
				}
			} else {
				MessageBox.error("Select atleast one document");
			}
		},
		onSelectNNDOFiles: function (oEvent) {
			var DmsTable = this.byId("idNNDOTab");
			var selItems = DmsTable.getSelectedIndices();
			if (selItems.length > 0) {
				this.getView().byId("btnDownloadSelectednndo").setEnabled(true);
				this.SelectNNDORow(oEvent, selItems);
			} else {
				this.getView().byId("btnDownloadSelectednndo").setEnabled(false);
				this.nndoBtn.setVisible(false);
			}
		},
		SelectNNDORow: function (oEvent, selItems) {
			if (this.prevNNDO != undefined) {
				this.nndoBtn.setVisible(false);
				if (document.getElementById(this.nndoIndexId).hasChildNodes()) {
					document.getElementById(this.nndoIndexId).removeChild(this.link);
				}
				this.prevNNDO = undefined;
			}
			if (oEvent.getSource().getSelectedIndex() < 0 && this.prevNNDO != undefined) {
				this.nndoBtn.setVisible(false);
				if (document.getElementById(this.nndoIndexId).hasChildNodes()) {
					document.getElementById(this.nndoIndexId).removeChild(this.link);
				}
				this.prevNNDO = undefined;
			}
			if (oEvent.getSource().getSelectedIndex() >= 0) {
				//debugger;
				this.prevNNDO = oEvent.getSource().getSelectedIndex();
				this.File_Name = this.getView().byId("idNNDOTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties
					.firstVisibleRow].getCells()[0].getText();
				var id = this.getView().byId("idNNDOTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties.firstVisibleRow]
					.getCells()[1].getId();
				this.nndoIndexId = id;
				this.getView().byId("idNNDOTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties.firstVisibleRow]
					.getCells()[2].setVisible(true);
				this.nndoBtn = this.getView().byId("idNNDOTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties
						.firstVisibleRow]
					.getCells()[2];
				if (selItems.length > 1) {
					this.nndoBtn.setVisible(false);
				} else {
					this.nndoBtn.setVisible(true);
				}
			}
		},
		onHandleDownloadSelectedBOE: function (oEvent) {
			var DmsTable = this.byId("idTab");
			var selItems = DmsTable.getSelectedIndices();
			if (selItems.length > 0) {
				for (var i = 0; i < selItems.length; i++) {
					var currentRow = selItems[i];
					//this.fileName = DmsTable.getRows()[currentRow].getCells()[0].getText();
					this.fileName = DmsTable.getBinding().oList[currentRow].filename;
					this.massDownloadFilefromDMS(this.fileName, this.boeFolderName);
					sap.ui.core.BusyIndicator.show();
				}
			} else {
				MessageBox.error("Select atleast one document");
			}
		},
		onSelectBOEFiles: function (oEvent) {
			var DmsTable = this.byId("idTab");
			var selItems = DmsTable.getSelectedIndices();
			if (selItems.length > 0) {
				this.getView().byId("btnDownloadSelected").setEnabled(true);
				this.SelectBOERow(oEvent, selItems);
			} else {
				this.getView().byId("btnDownloadSelected").setEnabled(false);
				this.boeBtn.setVisible(false);
			}
		},
		massDownloadFilefromDMS: function (fileName, folderName) {
			// sap.ui.core.BusyIndicator.show()
			console.log("massDownloadFilefromDMS");
			var link = document.createElement('a');
			var that = this;
			jQuery.ajax({
				url: "/documentservice/downloadFile",
				type: "POST",
				data: JSON.stringify({
					"foldername": folderName,
					"filname": fileName
				}),
				dataType: "json",
				contentType: "application/json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Basic " + btoa("ui5user" + ":" + "@#SsdFg!05!7*3Bvl.6iNm0%)Q!"));
				},
				success: function (data) {
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (e) {
					var base64str = e.responseText;
					var binary = atob(base64str.replace(/\s/g, ''));
					var len = binary.length;
					var buffer = new ArrayBuffer(len);
					var view = new Uint8Array(buffer);
					for (var i = 0; i < len; i++) {
						view[i] = binary.charCodeAt(i);
					}
					var blob = new Blob([view], {
						type: "application/pdf"
					});
					link.download = fileName;
					var url = URL.createObjectURL(blob);
					link.href = url;
					link.click();
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		SelectBOERow: function (oEvent, selItems) {
			if (this.prevIndex != undefined) {

				this.boeBtn.setVisible(false);
				if (document.getElementById(this.indexId).hasChildNodes()) {
					document.getElementById(this.indexId).removeChild(this.link);
				}
				this.prevIndex = undefined;
			}
			if (oEvent.getSource().getSelectedIndex() >= 0) {
				this.prevIndex = oEvent.getSource().getSelectedIndex();
				//	this._OpenBusyDialog();
				this.File_Name = this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties.firstVisibleRow]
					.getCells()[0].getText();
				var id = this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties.firstVisibleRow]
					.getCells()[1].getId();
				this.indexId = id;
				this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties.firstVisibleRow].getCells()[
					2].setVisible(true);
				this.boeBtn = this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties.firstVisibleRow]
					.getCells()[2];
				//if (this.AllFiles.results.length == selItems.length) { //condition for showning delete button
				if (selItems.length > 1) {
					this.boeBtn.setVisible(false);
				} else {
					this.boeBtn.setVisible(true);
				}

			} else {
				//this.boeBtn.setVisible(false);
				if (this.prevIndex != undefined) {
					// document.getElementById(this.indexId).removeChild(this.link);
					if (document.getElementById(this.indexId).hasChildNodes()) {
						document.getElementById(this.indexId).removeChild(this.link);
					}
					this.prevIndex = undefined;
				}
			}
		},
		/*mass download --------------- riji/sumeesh */

		/*old DMS code : without multiple download --- commented for mass download*/
		/*SelectRow: function (oEvent) {
			// this.File_Name = this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex()].getCells()[0].getText();
			// this._OpenBusyDialog();
			// console.log(this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex()].getCells()[0].getText());
			// this.DownloadFile();
			if (this.prevIndex != undefined) {
				// this.getView().byId("idTab").getRows()[this.prevIndex].getCells()[2].setVisible(false);
				// var id = this.getView().byId("idTab").getRows()[this.prevIndex].getCells()[1].getId();
				// document.getElementById(id).removeChild(this.link);
				this.boeBtn.setVisible(false);
				if (document.getElementById(this.indexId).hasChildNodes()) {
					document.getElementById(this.indexId).removeChild(this.link);
				}
				// document.getElementById(this.indexId).removeChild(this.link);
				this.prevIndex = undefined;
			}

			if (oEvent.getSource().getSelectedIndex() >= 0) {
				this.prevIndex = oEvent.getSource().getSelectedIndex();
				this._OpenBusyDialog();
				// this.File_Name = this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex()].getCells()[0].getText();
				// this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex()].getCells()[2].setVisible(true);
				// var id = this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex()].getCells()[1].getId();
				this.File_Name = this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties.firstVisibleRow]
					.getCells()[0].getText();
				var id = this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties.firstVisibleRow]
					.getCells()[1].getId();
				this.indexId = id;
				this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties.firstVisibleRow].getCells()[
					2].setVisible(true);
				this.boeBtn = this.getView().byId("idTab").getRows()[oEvent.getSource().getSelectedIndex() - oEvent.getSource().mProperties.firstVisibleRow]
					.getCells()[2];
				//change by riji
			//	console.log("selectrow:", this.AllFiles.results[oEvent.getSource().getSelectedIndex()].servicetype);
				if (this.AllFiles.results[oEvent.getSource().getSelectedIndex()].servicetype == "OBJ") {
					var file_id = this.AllFiles.results[oEvent.getSource().getSelectedIndex()].fileid;
					//console.log("file_id", file_id);
					this.DownloadFilefromOBJ(id, this.boeFolderName, file_id);
				} else {
					this.DownloadFilefromDMS(id, this.boeFolderName);
				}
				//this.DownloadFile(id, "BOE");
				//this.DownloadFile(id, this.boeFolderName);
			} else {
				if (this.prevIndex != undefined) {
					// this.getView().byId("idTab").getRows()[this.prevIndex].getCells()[2].setVisible(false);
					// var id = this.getView().byId("idTab").getRows()[this.prevIndex].getCells()[1].getId();
					// document.getElementById(id).removeChild(this.link);
					this.boeBtn.setVisible(false);
					// document.getElementById(this.indexId).removeChild(this.link);
					if (document.getElementById(this.indexId).hasChildNodes()) {
						document.getElementById(this.indexId).removeChild(this.link);
					}
					this.prevIndex = undefined;
				}
			}
		},*/
		/*DownloadFilefromOBJ: function (id, folderName, file_id) {
			console.log("inside DownloadFilefromOBJ");
			var LinkId = id;
			var fileName = this.File_Name
			this.filename = fileName;
			var data, url;
			var API_KEY = "VEtCd1JVUVl0czpSNCU/WCgqSHNGZ0RQN20zUSVn";
			var that = this;
			jQuery.ajax({
				url: "https://object_store-zany-cheetah-cn.cfapps.eu10.hana.ondemand.com/objectstore/download",
				type: "POST",
				data: JSON.stringify({
					"api_key": API_KEY,
					"file_id": file_id,
					"sub_folder": folderName,
					"client": "T0001"
				}),
				contentType: "application/json",
				crossDomain: true,
				success: function (result) {
					//console.log("success", result.data);
					var fileContent = result.data;
					that.link.innerHTML = "Download";
					that.link.download = that.File_Name;
					var binary = atob(fileContent.replace(/\s/g, ''));
					var len = binary.length;
					var buffer = new ArrayBuffer(len);
					var view = new Uint8Array(buffer);
					for (var i = 0; i < len; i++) {
						view[i] = binary.charCodeAt(i);
					}
					// create the blob object with content-type "application/pdf"              
					var blob = new Blob([view], {
						type: "application/pdf"
					});
					var url = URL.createObjectURL(blob);
					that.link.href = url;

					document.getElementById(LinkId).appendChild(that.link);

					that._CloseBusyDialog();
				},
				error: function (e) {
					that._CloseBusyDialog();
				}
			});
		},

		DownloadFilefromDMS: function (id, folderName) {
				console.log("DownloadFilefromDMS");
				var LinkId = id;
				var fileName = this.File_Name
				this.filename = fileName;
				var that = this;
				jQuery.ajax({
					url: "/documentservice/downloadFile",
					type: "POST",
					data: JSON.stringify({
						"foldername": folderName,
						"filname": fileName
					}),
					dataType: "json",
					contentType: "application/json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader("Authorization", "Basic " + btoa("ui5user" + ":" + "@#SsdFg!05!7*3Bvl.6iNm0%)Q!"));
					},
					success: function (data) {
						that._CloseBusyDialog();
					},
					error: function (e) {
						
										  
																	   
															 
								
						that.link.innerHTML = "Download";
						that.link.download = that.File_Name;
						//var file = new Blob([data], {type: 'application/pdf;base64'});
						//that.link.href =  e.responseText;
						// base64 string
						var base64str = e.responseText;
						// decode base64 string, remove space for IE compatibility
						var binary = atob(base64str.replace(/\s/g, ''));
						var len = binary.length;
						var buffer = new ArrayBuffer(len);
						var view = new Uint8Array(buffer);
						for (var i = 0; i < len; i++) {
							view[i] = binary.charCodeAt(i);
						}
						// create the blob object with content-type "application/pdf"              
						var blob = new Blob([view], {
							type: "application/pdf"
						});
						var url = URL.createObjectURL(blob);
						that.link.href = url;
						//document.getElementById(LinkId).appendChild(that.link);
						link.click();
						that._CloseBusyDialog();
					}
				});
			}*/
		/*old DMS code : without multiple download --- commented for mass download*/
		//Nikhila
	});
});
