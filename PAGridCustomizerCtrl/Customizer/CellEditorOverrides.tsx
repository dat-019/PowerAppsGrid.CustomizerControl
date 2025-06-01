/* eslint-disable */
import { CellEditorOverrides, CellEditorProps, GetEditorParams, RECID } from '../types';
import { stateData } from '../index';
import { CustomOptionSetControl } from '../Controls/OptionsetControl';
import * as React from 'react';
import { ManageBillingType } from '../Dal/ManageBillingTypes';
import { GenerateSequence } from '../Dal/GenerateSequence';

enum ServiceReceiverCode {
    ExternalCustomer = 930760000,
    KärcherInternal = 930760001
}

const legacyCalculationTypeCodes = GenerateSequence(8, 71);

export const cellEditorOverrides: CellEditorOverrides = {
    ["Text"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Email"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Phone"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Ticker"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["URL"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["TextArea"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Lookup"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Customer"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Owner"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["MultiSelectPicklist"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["OptionSet"]: (props: CellEditorProps, col: GetEditorParams) => renderCustomOptionsetControl(props, col),
    ["TwoOptions"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Duration"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Language"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Multiple"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["TimeZone"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Integer"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Currency"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Decimal"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["FloatingPoint"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["AutoNumber"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["DateOnly"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["DateAndTime"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Image"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["File"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["Persona"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["RichText"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col),
    ["UniqueIdentifier"]: (props: CellEditorProps, col: GetEditorParams) => renderControl(props, col)
}

function renderControl(props: CellEditorProps, col: GetEditorParams) {
    const columnName = col.colDefs[col.columnIndex].name.toLowerCase();
    if (stateData.Setting.attributes.length > 0 && stateData.Setting.attributes.indexOf(columnName) > -1) {
    }
    return null;
}

function renderOptionSetControlAsync(props: CellEditorProps, col: GetEditorParams) {
    const columnName = col.colDefs[col.columnIndex].name.toLowerCase();
    if (stateData.Setting.attributes.length > 0 && stateData.Setting.attributes.indexOf(columnName) > -1) {
        const [options, setOptions] = React.useState<any[]>([]);
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
            const fetchOptions = async () => {
                //const columnName = col.colDefs[col.columnIndex].name.toLowerCase();
                const selectedRowId = col.rowData?.[RECID];
                const context = stateData.Setting.context;
                let disacalctypes = new Array<string>();
                //get custom optionset values
                const strDisacalctypes = selectedRowId 
                    ? await ManageBillingType.getSubsidiaryDisacalctypes(context, selectedRowId) 
                    : "";
                if (strDisacalctypes) {
                    console.log("Subsidiary's im_disacalctypes:", strDisacalctypes);
                    disacalctypes = strDisacalctypes.replace(';',',').split(',');
                }
                const defaultOptions = Array.isArray((col.colDefs[col.columnIndex] as any).customizerParams.dropDownOptions)
                                        ? (col.colDefs[col.columnIndex] as any).customizerParams.dropDownOptions
                                        : [];
                if (!disacalctypes || disacalctypes.length === 0) {
                    setOptions(defaultOptions);
                }
                else {
                    const filteredOptions = defaultOptions.filter((option: any) => {
                        return disacalctypes.some((disacalctype: any) => disacalctype === option.key);
                    });
                    console.log("Filtered Options:", filteredOptions);

                    if (!filteredOptions || filteredOptions.length === 0) {
                        console.warn("No filtered options available.");
                        setOptions([]);
                    } else {
                        setOptions(filteredOptions);
                    }
                }
                setLoading(false);
            };

            fetchOptions();
        }, [col]);

        if (loading || !options || options.length === 0) {
            return <div>Loading options...</div>; // Provide a fallback UI
        }

        const defaultValue = props.value as number;
        const onChange = (value: number | null) => {
            col.onCellValueChanged(value);
        };

        return (
            <CustomOptionSetControl
                defaultvalue={defaultValue}
                dropDownOptions={options}
                onchange={onChange}
            />
        );    
    }
    
    return null;
}

function renderOptionSetControlSync(props: CellEditorProps, col: GetEditorParams) {
    const columnName = col.colDefs[col.columnIndex].name.toLowerCase();
    if (stateData.Setting.attributes.length > 0 && stateData.Setting.attributes.indexOf(columnName) > -1) {
        const selectedRowId = col.rowData?.[RECID];
        const context = stateData.Setting.context;

        // Initialize variables for options and loading
        let options: any[] = [];
        let loading = true;

        // Return a placeholder while loading
        const loadingUI = <div>Loading options...</div>;

        // Fetch options asynchronously
        ManageBillingType.getSubsidiaryDisacalctypes(context, selectedRowId ?? "")
            .then((strDisacalctypes) => {
                let disacalctypes: string[] = [];
                if (strDisacalctypes) {
                    console.log("Subsidiary's im_disacalctypes:", strDisacalctypes);
                    disacalctypes = strDisacalctypes.replace(';', ',').split(',');
                }

                const defaultOptions = Array.isArray((col.colDefs[col.columnIndex] as any).customizerParams.dropDownOptions)
                    ? (col.colDefs[col.columnIndex] as any).customizerParams.dropDownOptions
                    : [];

                if (!disacalctypes || disacalctypes.length === 0) {
                    options = defaultOptions;
                } else {
                    const filteredOptions = defaultOptions.filter((option: any) => {
                        return disacalctypes.some((disacalctype: any) => disacalctype === option.key);
                    });

                    console.log("Filtered Options:", filteredOptions);

                    if (!filteredOptions || filteredOptions.length === 0) {
                        console.warn("No filtered options available.");
                        options = [];
                    } else {
                        options = filteredOptions;
                    }
                }

                loading = false;

                // Trigger a re-render by calling the parent component's state update
                //col.onCellValueChanged(options);

                const defaultValue = props.value as number;
                const onChange = (value: number | null) => {
                    col.onCellValueChanged(value);
                };

                return (
                    <CustomOptionSetControl
                        defaultvalue={defaultValue}
                        dropDownOptions={options}
                        onchange={onChange}
                    />
                );
            })
            .catch((error) => {
                console.error("Error fetching options:", error);
                loading = false;
            });

        // Return loading UI while waiting for the data
        // if (loading) {
        //     return loadingUI;
        // }

        // const defaultValue = props.value as number;
        // const onChange = (value: number | null) => {
        //     col.onCellValueChanged(value);
        // };

        // return (
        //     <CustomOptionSetControl
        //         defaultvalue={defaultValue}
        //         dropDownOptions={options}
        //         onchange={onChange}
        //     />
        // );
    }
    return null;
}

function renderCustomOptionsetControl(props: CellEditorProps, col: GetEditorParams) {
    let options: any[] = [];
    const columnName = col.colDefs[col.columnIndex].name.toLowerCase();
    if (stateData.Setting.attributes.length > 0 && stateData.Setting.attributes.indexOf(columnName) > -1) {

        if (stateData.Setting.context.page.entityTypeName === 'msdyn_workorder') {
            const context = stateData.Setting.context;
            const columnWidth = col.colDefs[col.columnIndex].width;
            const defaultValue = props.value as number;

            if (stateData.Setting.workOrderInfo.ak_servicereceivercode === ServiceReceiverCode.KärcherInternal) {
                
                let disacalctypes: any[] = [];
                if (stateData.Setting.workOrderInfo.im_disacalctypes && stateData.Setting.workOrderInfo.im_disacalctypes !== "") {
                    disacalctypes = stateData.Setting.workOrderInfo.im_disacalctypes
                        .replace(';', ',')
                        .split(',')
                        .map((n: string | undefined): number => parseInt(n?.trim() || '', 10))
                        .filter((n: number): boolean => !isNaN(n));
                    console.log("Disacalctypes:", disacalctypes);
                }
                const allowedValues = [ 29, ...disacalctypes ]; 

                const defaultOptions = Array.isArray((col.colDefs[col.columnIndex] as any).customizerParams.dropDownOptions)
                    ? (col.colDefs[col.columnIndex] as any).customizerParams.dropDownOptions
                    : [];

                if (!disacalctypes || disacalctypes.length === 0) {
                    options = defaultOptions;
                } else {
                    const filteredOptions = defaultOptions.filter((option: any) => {
                        const text = option.text.trim(); // Extract and trim the text
                        const isWhiteListed = allowedValues.some(b => parseInt(text.substr(0, text.indexOf(" "))) === b);
                        return isWhiteListed; // Keep only whitelisted options
                    });

                    console.log("Filtered Options:", filteredOptions);

                    if (!filteredOptions || filteredOptions.length === 0) {
                        console.warn("No filtered options available.");
                        options = defaultOptions;
                    } else {
                        
                        options = filteredOptions;
                    }
                }
            }
            else if(stateData.Setting.workOrderInfo.ak_servicereceivercode === ServiceReceiverCode.ExternalCustomer) {
                 // Remove "29 Internal Service" of workorder service receiver is no "Kärcher Internal"
                const defaultOptions = Array.isArray((col.colDefs[col.columnIndex] as any).customizerParams.dropDownOptions)
                    ? (col.colDefs[col.columnIndex] as any).customizerParams.dropDownOptions
                    : [];
                options = defaultOptions.filter((option: any) => {
                    const text = option.text.trim(); 
                    return parseInt(text.substr(0, text.indexOf(" "))) !== 29; // Remove "29 Internal Service"
                });

                const BlackListOptionSetValuesByLabel = [ 29, ...legacyCalculationTypeCodes ];
                const filteredOptions = options.filter((option: any) => {
                    const text = option.text.trim(); // Extract and trim the text
                    const isBlackListed = BlackListOptionSetValuesByLabel.some(b => parseInt(text.substr(0, text.indexOf(" "))) === b);
                    return !isBlackListed; // Keep only non-blacklisted options
                });
                console.log("Filtered Options:", filteredOptions);
                if (!filteredOptions || filteredOptions.length === 0) {
                    console.warn("No filtered options available.");
                    //options = [];
                } else {
                    options = filteredOptions;
                }
            }
            
            const onChange = (value: number | null) => {
                col.onCellValueChanged(value);
                col.stopEditing(false);
            };
            return (
                <CustomOptionSetControl
                    defaultvalue={defaultValue}
                    dropDownOptions={options}
                    onchange={onChange}
                    columnWidth={columnWidth}
                />
            );            

        }
    }
    return null;
}