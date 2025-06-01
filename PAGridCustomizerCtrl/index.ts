/* eslint-disable */
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { cellRendererOverrides } from "./Customizer/CellRendererOverrides";
import { cellEditorOverrides } from "./Customizer/CellEditorOverrides";
import { PAOneGridCustomizer, SettingModel } from "./types";
import * as React from "react";
import { ManageBillingType } from './Dal/ManageBillingTypes';


const stateData: { Setting: SettingModel, entity: string } = { Setting: { entity: '', attributes: [], workOrderInfo: null }, entity: ''};
export class PAGridCustomizerCtrl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;

    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public async init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): Promise<void> {
        this.notifyOutputChanged = notifyOutputChanged;

        const contextObj: any = context;
        stateData.entity = contextObj.client._customControlProperties.pageType === 'EntityList' ?
            (contextObj.page?.entityTypeName ?? '') : (contextObj.client._customControlProperties.descriptor.Parameters?.TargetEntityType ?? '');
        stateData.Setting.attributes = ['ak_billingtype'];
        stateData.Setting.context = contextObj;

        //parent entity id
        if (contextObj.page.entityTypeName === 'msdyn_workorder') {
            const parentId = contextObj.page?.entityId ?? '';
            stateData.Setting.workOrderInfo = await ManageBillingType.getSubsidiaryDisacalctypesFromWorkOrder(context, parentId);
            //stateData.Setting.strDisacalctypes = disacalctypes;
        }

        const eventName = context.parameters.EventName.raw;
        if (eventName) {
            const pAGridCustomizer: PAOneGridCustomizer = { cellRendererOverrides, cellEditorOverrides };
            contextObj.factory.fireEvent(eventName, pAGridCustomizer);
        }
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        return React.createElement(React.Fragment);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return { };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
export { stateData };
