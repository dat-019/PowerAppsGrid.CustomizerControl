/* eslint-disable */
export interface WorkOrderProduct {
    id: string; // Unique identifier for the Work Order Product
    ak_billingtype: number; // Optionset field for Billing Type
    msdyn_workorder: string; // Lookup field to the parent Work Order
}

export interface WorkOrder {
    id: string; // Unique identifier for the Work Order
    ak_servicereceivercode: string; // Service Receiver Code field
}

export class ManageBillingType {
    /**
     * Fetch a single Work Order Product by ID.
     * @param context The PCF context object.
     * @param id The ID of the Work Order Product to fetch.
     * @returns A promise resolving to the Work Order Product.
     */
    public static async getWorkOrderProductById(context: ComponentFramework.Context<any>, id: string): Promise<WorkOrderProduct> {
        try {
            const result = await context.webAPI.retrieveMultipleRecords(
                "msdyn_workorderproduct",
                `?$filter=msdyn_workorderproductid eq ${id}`
            );

            if (result.entities.length === 0) {
                throw new Error(`Work Order Product with ID ${id} not found.`);
            }

            const entity = result.entities[0];
            return {
                id: entity["msdyn_workorderproductid"],
                ak_billingtype: entity["ak_billingtype"],
                msdyn_workorder: entity["_msdyn_workorder_value"]
            };
        } catch (error) {
            console.error(`Error fetching Work Order Product with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Fetch the parent Work Order's ak_servicereceivercode for a given Work Order Product.
     * @param context The PCF context object.
     * @param workOrderProductId The ID of the Work Order Product.
     * @returns A promise resolving to the ak_servicereceivercode of the parent Work Order.
     */
    public static async getParentWorkOrderServiceReceiverCode(context: ComponentFramework.Context<any>, workOrderProductId: string): Promise<string> {
        try {
            // Fetch the Work Order Product to get the parent Work Order ID
            const workOrderProduct = await this.getWorkOrderProductById(context, workOrderProductId);

            if (!workOrderProduct.msdyn_workorder) {
                throw new Error(`Work Order Product with ID ${workOrderProductId} does not have a parent Work Order.`);
            }

            // Fetch the parent Work Order to get the ak_servicereceivercode
            const result = await context.webAPI.retrieveMultipleRecords(
                "msdyn_workorder",
                `?$filter=msdyn_workorderid eq ${workOrderProduct.msdyn_workorder}`
            );

            if (result.entities.length === 0) {
                throw new Error(`Parent Work Order with ID ${workOrderProduct.msdyn_workorder} not found.`);
            }

            const entity = result.entities[0];
            return entity["ak_servicereceivercode"];
        } catch (error) {
            console.error(`Error fetching parent Work Order's ak_servicereceivercode for Work Order Product ID ${workOrderProductId}:`, error);
            throw error;
        }
    }

    /**
     * Fetch the predefined value of the Subsidiary's im_disacalctypes field.
     * @param context The PCF context object.
     * @param workOrderProductId The ID of the Work Order Product.
     * @returns A promise resolving to the im_disacalctypes value of the associated Subsidiary.
     */
    public static async getSubsidiaryDisacalctypes(
        context: ComponentFramework.Context<any>,
        workOrderProductId: string
    ): Promise<string> {
        try {
            // Step 1: Fetch the Work Order Product to get the parent Work Order ID
            const workOrderProduct = await this.getWorkOrderProductById(context, workOrderProductId);

            if (!workOrderProduct.msdyn_workorder) {
                console.log(`Work Order Product with ID ${workOrderProductId} does not have a parent Work Order.`);
                return ""; // Return empty string if no parent Work Order
            }

            // Step 2: Fetch the Work Order to get the associated Sales Area Data ID
            const workOrderResult = await context.webAPI.retrieveMultipleRecords(
                "msdyn_workorder",
                `?$filter=msdyn_workorderid eq ${workOrderProduct.msdyn_workorder}`
            );

            if (workOrderResult.entities.length === 0) {
                console.log(`Work Order with ID ${workOrderProduct.msdyn_workorder} not found.`);
                return ""; // Return empty string if no Work Order found
            }

            const salesAreaDataId = workOrderResult.entities[0]["_ak_salesareadataid_value"];
            if (!salesAreaDataId) {
                console.log(`Work Order with ID ${workOrderProduct.msdyn_workorder} does not have associated Sales Area Data.`);
                return ""; // Return empty string if no Sales Area Data ID found
            }

            // Step 3: Fetch the Sales Area Data to get the associated Sales Organization ID
            const salesAreaDataResult = await context.webAPI.retrieveMultipleRecords(
                "im_salesareadata",
                `?$filter=im_salesareadataid eq ${salesAreaDataId}`
            );

            if (salesAreaDataResult.entities.length === 0) {
                console.log(`Sales Area Data with ID ${salesAreaDataId} not found.`);
                return ""; // Return empty string if no Sales Area Data found
            }

            const salesOrganizationId = salesAreaDataResult.entities[0]["_im_salesorganizationid_value"];
            if (!salesOrganizationId) {
                console.log(`Sales Area Data with ID ${salesAreaDataId} does not have associated Sales Organization.`);
                return ""; // Return empty string if no Sales Organization ID found
            }

            // Step 4: Fetch the Sales Organization to get the associated Subsidiary ID
            const salesOrganizationResult = await context.webAPI.retrieveMultipleRecords(
                "im_salesorganization",
                `?$filter=im_salesorganizationid eq ${salesOrganizationId}`
            );

            if (salesOrganizationResult.entities.length === 0) {
                console.log(`Sales Organization with ID ${salesOrganizationId} not found.`);
                return ""; // Return empty string if no Sales Organization found
            }

            const subsidiaryId = salesOrganizationResult.entities[0]["_im_subsidiaryid_value"];
            if (!subsidiaryId) {
                console.log(`Sales Organization with ID ${salesOrganizationId} does not have associated Subsidiary.`);
                return ""; // Return empty string if no Subsidiary ID found
            }

            // Step 5: Fetch the Subsidiary to get the im_disacalctypes value
            const subsidiaryResult = await context.webAPI.retrieveMultipleRecords(
                "im_subsidiary",
                `?$filter=im_subsidiaryid eq ${subsidiaryId}`
            );

            if (subsidiaryResult.entities.length === 0) {
                console.log(`Subsidiary with ID ${subsidiaryId} not found.`);
                return ""; // Return empty string if no Subsidiary found
            }

            const disacalctypes = subsidiaryResult.entities[0]["im_disacalctypes"];
            if (!disacalctypes) {
                console.log(`Subsidiary with ID ${subsidiaryId} does not have a value for im_disacalctypes.`);
                return ""; // Return empty string if no im_disacalctypes value found
            }

            return disacalctypes;
        } catch (error) {
            console.error(`Error fetching Subsidiary's im_disacalctypes for Work Order Product ID ${workOrderProductId}:`, error);
            throw error;
        }
    }

     /**
     * Fetch the parent Work Order's ak_servicereceivercode and, if it matches 930760001,
     * fetch the predefined value of the Subsidiary's im_disacalctypes field.
     * @param context The PCF context object.
     * @param workOrderProductId The ID of the Work Order Product.
     * @returns A promise resolving to an object containing the ak_servicereceivercode and, if applicable, the im_disacalctypes value.
     */
     public static async getSubsidiaryDisacalctypes_1(
        context: ComponentFramework.Context<any>,
        workOrderProductId: string
    ): Promise<{ ak_servicereceivercode: string; im_disacalctypes?: string }> {
        try {
            // Step 1: Fetch the Work Order Product to get the parent Work Order ID
            const workOrderProduct = await this.getWorkOrderProductById(context, workOrderProductId);

            if (!workOrderProduct.msdyn_workorder) {
                throw new Error(`Work Order Product with ID ${workOrderProductId} does not have a parent Work Order.`);
            }

            // Step 2: Fetch the parent Work Order to get the ak_servicereceivercode
            const workOrderResult = await context.webAPI.retrieveMultipleRecords(
                "msdyn_workorder",
                `?$filter=msdyn_workorderid eq ${workOrderProduct.msdyn_workorder}`
            );

            if (workOrderResult.entities.length === 0) {
                throw new Error(`Parent Work Order with ID ${workOrderProduct.msdyn_workorder} not found.`);
            }

            const workOrder = workOrderResult.entities[0];
            const ak_servicereceivercode = workOrder["ak_servicereceivercode"];

            // If ak_servicereceivercode is not 930760001, return it directly
            if (ak_servicereceivercode !== 930760001) {
                return { ak_servicereceivercode };
            }

            // Step 3: Fetch the associated Sales Area Data ID
            const salesAreaDataId = workOrder["_ak_salesareadataid_value"];
            if (!salesAreaDataId) {
                throw new Error(`Work Order with ID ${workOrderProduct.msdyn_workorder} does not have associated Sales Area Data.`);
            }

            // Step 4: Fetch the Sales Area Data to get the associated Sales Organization ID
            const salesAreaDataResult = await context.webAPI.retrieveMultipleRecords(
                "ak_salesareadata",
                `?$filter=ak_salesareadataid eq ${salesAreaDataId}`
            );

            if (salesAreaDataResult.entities.length === 0) {
                throw new Error(`Sales Area Data with ID ${salesAreaDataId} not found.`);
            }

            const salesOrganizationId = salesAreaDataResult.entities[0]["_im_salesorganizationid_value"];
            if (!salesOrganizationId) {
                throw new Error(`Sales Area Data with ID ${salesAreaDataId} does not have associated Sales Organization.`);
            }

            // Step 5: Fetch the Sales Organization to get the associated Subsidiary ID
            const salesOrganizationResult = await context.webAPI.retrieveMultipleRecords(
                "im_salesorganization",
                `?$filter=im_salesorganizationid eq ${salesOrganizationId}`
            );

            if (salesOrganizationResult.entities.length === 0) {
                throw new Error(`Sales Organization with ID ${salesOrganizationId} not found.`);
            }

            const subsidiaryId = salesOrganizationResult.entities[0]["_im_subsidiaryid_value"];
            if (!subsidiaryId) {
                throw new Error(`Sales Organization with ID ${salesOrganizationId} does not have associated Subsidiary.`);
            }

            // Step 6: Fetch the Subsidiary to get the im_disacalctypes value
            const subsidiaryResult = await context.webAPI.retrieveMultipleRecords(
                "im_subsidiary",
                `?$filter=im_subsidiaryid eq ${subsidiaryId}`
            );

            if (subsidiaryResult.entities.length === 0) {
                throw new Error(`Subsidiary with ID ${subsidiaryId} not found.`);
            }

            const im_disacalctypes = subsidiaryResult.entities[0]["im_disacalctypes"];
            if (!im_disacalctypes) {
                throw new Error(`Subsidiary with ID ${subsidiaryId} does not have a value for im_disacalctypes.`);
            }

            return { ak_servicereceivercode, im_disacalctypes };
        } catch (error) {
            console.error(`Error fetching Work Order details for Work Order Product ID ${workOrderProductId}:`, error);
            throw error;
        }
    }

     /**
     * Fetch the predefined value of the Subsidiary's im_disacalctypes field.
     * @param context The PCF context object.
     * @param workOrderId The ID of the Work Order Product.
     * @returns A promise resolving to the im_disacalctypes value of the associated Subsidiary.
     */
     public static async getSubsidiaryDisacalctypesFromWorkOrder(
        context: ComponentFramework.Context<any>,
        workOrderId: string
    ): Promise<{ ak_servicereceivercode: string; im_disacalctypes: string}> {
        try {

            // Step 1: Fetch the Work Order to get the associated Sales Area Data ID
            const workOrderResult = await context.webAPI.retrieveMultipleRecords(
                "msdyn_workorder",
                `?$filter=msdyn_workorderid eq ${workOrderId}`
            );

            if (workOrderResult.entities.length === 0) {
                console.log(`Work Order with ID ${workOrderId} not found.`);
                return { ak_servicereceivercode: "", im_disacalctypes: "" }; // Return empty strings for required properties
            }

            const workOrder = workOrderResult.entities[0];
            const servicereceivercode = workOrder["ak_servicereceivercode"];

            const salesAreaDataId = workOrderResult.entities[0]["_ak_salesareadataid_value"];
            if (!salesAreaDataId) {
                console.log(`Work Order with ID ${workOrderId} does not have associated Sales Area Data.`);
                return { ak_servicereceivercode: servicereceivercode, im_disacalctypes: "" }; // Return empty string if no Sales Area Data ID found
            }

            // Step 2: Fetch the Sales Area Data to get the associated Sales Organization ID
            const salesAreaDataResult = await context.webAPI.retrieveMultipleRecords(
                "im_salesareadata",
                `?$filter=im_salesareadataid eq ${salesAreaDataId}`
            );

            if (salesAreaDataResult.entities.length === 0) {
                console.log(`Sales Area Data with ID ${salesAreaDataId} not found.`);
                return { ak_servicereceivercode: servicereceivercode, im_disacalctypes: "" }; // Return empty string if no Sales Area Data found
            }

            const salesOrganizationId = salesAreaDataResult.entities[0]["_im_salesorganizationid_value"];
            if (!salesOrganizationId) {
                console.log(`Sales Area Data with ID ${salesAreaDataId} does not have associated Sales Organization.`);
                return { ak_servicereceivercode: servicereceivercode, im_disacalctypes: "" }; // Return empty string if no Sales Organization ID found
            }

            // Step 3: Fetch the Sales Organization to get the associated Subsidiary ID
            const salesOrganizationResult = await context.webAPI.retrieveMultipleRecords(
                "im_salesorganization",
                `?$filter=im_salesorganizationid eq ${salesOrganizationId}`
            );

            if (salesOrganizationResult.entities.length === 0) {
                console.log(`Sales Organization with ID ${salesOrganizationId} not found.`);
                return { ak_servicereceivercode: servicereceivercode, im_disacalctypes: "" }; // Return empty string if no Sales Organization found
            }

            const subsidiaryId = salesOrganizationResult.entities[0]["_im_subsidiaryid_value"];
            if (!subsidiaryId) {
                console.log(`Sales Organization with ID ${salesOrganizationId} does not have associated Subsidiary.`);
                return { ak_servicereceivercode: servicereceivercode, im_disacalctypes: "" }; // Return empty string if no Subsidiary ID found
            }

            // Step 4: Fetch the Subsidiary to get the im_disacalctypes value
            const subsidiaryResult = await context.webAPI.retrieveMultipleRecords(
                "im_subsidiary",
                `?$filter=im_subsidiaryid eq ${subsidiaryId}`
            );

            if (subsidiaryResult.entities.length === 0) {
                console.log(`Subsidiary with ID ${subsidiaryId} not found.`);
                return { ak_servicereceivercode: servicereceivercode, im_disacalctypes: "" }; // Return empty string if no Subsidiary found
            }

            const disacalctypes = subsidiaryResult.entities[0]["im_disacalctypes"];
            if (!disacalctypes) {
                console.log(`Subsidiary with ID ${subsidiaryId} does not have a value for im_disacalctypes.`);
                return { ak_servicereceivercode: servicereceivercode, im_disacalctypes: "" }; // Return empty string if no im_disacalctypes value found
            }

            return { ak_servicereceivercode: servicereceivercode, im_disacalctypes: disacalctypes };;
        } catch (error) {
            console.error(`Error fetching Subsidiary's im_disacalctypes for Work Order ID ${workOrderId}:`, error);
            throw error;
        }
    }

    public static WhiteListOptionSetValuesByLabel(defaultOptions: any[], allowedValues: Array<number>): any[] {
        const originalOptions = [...defaultOptions]; // Create a copy of the original options
        defaultOptions = defaultOptions.filter((option: any) => {
            const text = option.text.trim(); // Extract and trim the text
            const isWhiteListed = allowedValues.some(b => parseInt(text.substr(0, text.indexOf(" "))) === b);
            return isWhiteListed; // Keep only whitelisted options
        });
        return defaultOptions;
    }
}