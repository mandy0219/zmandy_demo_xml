	sap.ui.define([
		"sap/ui/core/mvc/Controller"
	], function(Controller) {
		"use strict";

		var oModel;
		var sCurrentPath; // current path
		var sCurrentEmp; // cureent employee

		return Controller.extend("zmandy_demo_xml.ZMANDY_DEMO_XML_VIEW", {

			onInit: function() {
				oModel = new sap.ui.model.odata.ODataModel('https://mcd1809.nttdata-taiwan.com:44310/sap/opu/odata/sap/ZMANDY_DEMO_SRV/',true);
				this.getView().setModel(oModel);
			},

			openDialog: function() {
				var oView = this.getView();

				// Open dialog
				var oEmpDialog = oView.byId("employeeDialog");
				if (!oEmpDialog) {
					oEmpDialog = sap.ui.xmlfragment(oView.getId(),
						"ZMANDY_DEMO_XML_VIEW.view.EmployeeDialog");
					oView.addDependent(oEmpDialog);
				}

				oEmpDialog.open();

				// Attach press event for CancelButton
				var oCancelButton = oView.byId("CancelButton");
				oCancelButton.attachPress(function() {
					oEmpDialog.close();
				});
			},

			// onCreate event
			onCreate: function() {
				var oView = this.getView();

				this.openDialog();
				var oEmployeeDialog = oView.byId("employeeDialog");
				oEmployeeDialog.setTitle("Create Employee");
				oView.byId("EmpId").setEditable(true);
				oView.byId("SaveEdit").setVisible(false);
				oView.byId("SaveCreate").setVisible(true);

				// clear
				oView.byId("EmpId").setValue("");
				oView.byId("EmpName").setValue("");
				oView.byId("EmpAddr").setValue("");

				// commit save
				oView.byId("SaveCreate").attachPress(function() {
					var oNewEntry = {
						"Empid": "",
						"Empname": "",
						"Empaddr": ""
					};

					// populate value from form
					oNewEntry.Empid = oView.byId("EmpId").getValue();
					oNewEntry.Empname = oView.byId("EmpName").getValue();
					oNewEntry.Empaddr = oView.byId("EmpAddr").getValue();

					// Commit creation operation
					oModel.create("/EmployeeSet", oNewEntry, {
						success: function() {
							sap.m.MessageToast.show("Created successfully.");
						},
						error: function(oError) {
							window.console.log("Error", oError);
						}
					});

					// close dialog
					if (oEmployeeDialog) {
						oEmployeeDialog.close();
					}
				});
			},

			onEdit: function() {
				// no employee was selected
				if (!sCurrentEmp) {
					sap.m.MessageToast.show("No Employee was selected.");
					return;
				}

				var oView = this.getView();

				this.openDialog();
				var oEmployeeDialog = oView.byId("employeeDialog");
				oEmployeeDialog.setTitle("Edit Employee");
				oView.byId("EmpId").setEditable(false);
				oView.byId("SaveEdit").setVisible(true);
				oView.byId("SaveCreate").setVisible(false);

				// populate fields
				oView.byId("EmpId").setValue(oModel.getProperty(sCurrentPath + "/Empid"));
				oView.byId("EmpName").setValue(oModel.getProperty(sCurrentPath + "/Empname"));
				oView.byId("EmpAddr").setValue(oModel.getProperty(sCurrentPath + "/Empaddr"));

				// Attach save event
				oView.byId("SaveEdit").attachPress(function() {
					var oChanges = {
					    "Empid": "",	
						"Empname": "",
						"Empaddr": ""
					};

					// populate value from form
					oChanges.Empid = oView.byId("EmpId").getValue();
					oChanges.Empname = oView.byId("EmpName").getValue();
					oChanges.Empaddr = oView.byId("EmpAddr").getValue();

					// commit creation
					oModel.update(sCurrentPath, oChanges, {
						success: function() {
							sap.m.MessageToast.show("Changes were saved successfully.");
						},
						error: function(oError) {
							window.console.log("Error", oError);
						}
					});

					// close dialog
					if (oEmployeeDialog) {
						oEmployeeDialog.close();
					}
				});
			},

			// onDelete event
			onDelete: function() {
				var that = this;

				// no employee was selected
				if (!sCurrentEmp) {
					sap.m.MessageToast.show("No Employee was selected.");
					return;
				}

				var oDeleteDialog = new sap.m.Dialog();
				oDeleteDialog.setTitle("Deletion");

				var oText = new sap.m.Label({
					text: "Are you sure to delete employee [" + sCurrentEmp + "]?"
				});
				oDeleteDialog.addContent(oText);

				oDeleteDialog.addButton(
					new sap.m.Button({
						text: "Confirm",
						press: function() {
							that.deleteEmployee();
							oDeleteDialog.close();
						}
					})
				);

				oDeleteDialog.open();
			},

			// deletion operation
			deleteEmployee: function() {
				oModel.remove(sCurrentPath, {
					success: function() {
						sap.m.MessageToast.show("Deletion successful.");
					},
					error: function(oError) {
						window.console.log("Error", oError);
					}
				});
			},

			onItemPress: function(evt) {
				var oContext = evt.getSource().getBindingContext();
				sCurrentPath = oContext.getPath();
				sCurrentEmp = oContext.getProperty("Empname");
			}
		});


/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zmandy_demo_xml.ZMANDY_DEMO_XML_VIEW
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zmandy_demo_xml.ZMANDY_DEMO_XML_VIEW
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zmandy_demo_xml.ZMANDY_DEMO_XML_VIEW
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zmandy_demo_xml.ZMANDY_DEMO_XML_VIEW
*/
//	onExit: function() {
//
//	}

});