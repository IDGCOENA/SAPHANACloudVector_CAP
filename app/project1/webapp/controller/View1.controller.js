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
            TEXT : null,
            SENTIMENT :null
        });
        this.getView().setModel(responseModel,"responseModel");

	

            },

           onSubmit: async function()
            {
       //         const oDataModel = this.getView().getModel("gen-ai") ;
		const localModel = this.getView().getModel();
		var oGlobalBusyDialog = new sap.m.BusyDialog();
        oGlobalBusyDialog.open();
	//	localModel.setProperty("/TEXT", this.byId("area1").getValue());
	//	localModel.setProperty("/SENTIMENT", "HAPPY");

	/*	$.ajax({
			type:"GET",
			url:"/odata/v4/gen-ai/ProductResponse",
			headers:"x-CSRF-token":
		})*/

		
		//const httpHeader = oDataModel.getHttpHeaders();

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
			
				/*var i = 0;
				
				localModel.setProperty("/TEXT", result.value.Response[0].TEXT);
				localModel.setProperty(
					"/SENTIMENT",
					result.value.Response[0].SENTIMENT
				);
				localModel.setProperty("/TEXT", result.value.Response[1].TEXT);
				localModel.setProperty(
					"/SENTIMENT",
					result.value.Response[1].SENTIMENT
				);*/

				var oData = {
					Response: [{
							TEXT: "1",
							SENTIMENT: "xyz"
						}, {
							TEXT: "1",
							SENTIMENT: "xyz"
						}
	
					]
				};
				oGlobalBusyDialog.close();
                console.log("success")
				
			}
		} catch (error) {
			console.log(error);
		} finally {
			//responsePreparation.setBusy(false);
		}
            }
        });
    });
