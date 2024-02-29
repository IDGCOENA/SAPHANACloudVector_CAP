sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v4/ODataModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
  async  function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {

             

       const responseModel  = new JSONModel({
		    FILENAME: null,
            TEXT : null,
			SCORING: null,
            SENTIMENT :null
        });
        this.getView().setModel(responseModel,"responseModel");

	

            },

           onSubmit: async function()
            {
    
		const localModel = this.getView().getModel();
		var oGlobalBusyDialog = new sap.m.BusyDialog();
        oGlobalBusyDialog.open();
		try {
			const response = await fetch(`/odata/v4/gen-ai/connectToGenAI`, {
				method: "POST",
				headers: {
					//"X-CSRF-Token": httpHeader["X-CSRF-Token"],
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					prompt: this.byId("area1").getValue(),
				})
			});
			if (response.ok) {
				const result = (await response.json()) ;
				this.getView().getModel("responseModel").setData(result.value.Response)
				oGlobalBusyDialog.close();
                console.log("success")
				
			}
		} catch (error) {
			oGlobalBusyDialog.close();
			MessageToast.show(error);
			console.log(error);
		} finally {
			oGlobalBusyDialog.close();
		}
            }
        });
    });
