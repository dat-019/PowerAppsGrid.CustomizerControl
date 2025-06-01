
/* eslint-disable */
import { stateData } from '..';
import { CellRendererOverrides, CellRendererProps, GetRendererParams } from '../types';
import * as React from "react";

export const cellRendererOverrides: CellRendererOverrides = {
     ["OptionSet"]: (props: CellRendererProps, rendererParams: GetRendererParams) => renderCustomOptionsetControl(props, rendererParams),
}

function renderCustomOptionsetControl(props: CellRendererProps, rendererParams: GetRendererParams) {
    const columnName = rendererParams.colDefs[rendererParams.columnIndex].name.toLowerCase();
    console.log("render optionset", rendererParams.rowData);
    if (stateData.Setting.attributes.length > 0 && stateData.Setting.attributes.indexOf(columnName) > -1) {
        const onCellClicked = (event?: React.MouseEvent<HTMLElement, MouseEvent> | MouseEvent) => {
            if(props.startEditing) props.startEditing();
            console.log("onCellClicked----------");
        }
        return (<div onClick={onCellClicked}>
                    { props.formattedValue }
               </div>)
    }

    return null;
}