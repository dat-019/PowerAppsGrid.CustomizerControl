/* eslint-disable */
import * as React from "react";
import { Icon } from "@fluentui/react/lib/Icon";
import { Dropdown, IDropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { ISelectableOption } from '@fluentui/react/lib/utilities/selectableOption';

export interface ICustomOptionSetControlProps {
    defaultvalue : number | null;
    dropDownOptions: any[];
    onchange: (value: number | null) => void;
    columnWidth?: number; // Add columnWidth as an optional prop
    }

export const CustomOptionSetControl = ({defaultvalue, dropDownOptions, onchange, columnWidth}: ICustomOptionSetControlProps) : JSX.Element => {  
    const option = dropDownOptions.find((option: any) => option.key == value);
    const isDisabled = false;
    const [value, setValue] = React.useState(defaultvalue);
    const _onSelectedChanged = (event: any, option?: IDropdownOption) => {       
      const val = (option?.key == null || option?.key===-1) ? null : option?.key as number;   
     onchange(val);
     setValue(val);
    }

    const _renderOption =(option: ISelectableOption | undefined, className ?:string) : JSX.Element => {             
        const color =  option?.data?.color || "gray";
        return (
             <div className="dynamics_cell">         
                <span className="optionset_label">{option?.text || ""}</span>&nbsp;
                {isDisabled && <Icon iconName="Uneditable" />}
            </div>
        );
      }

      const _renderOptionWithoutIcon =(option: ISelectableOption | undefined, className ?:string) : JSX.Element => {             
        return (
              <div className="dynamics_cell">
                <span>{option?.text || ""}</span>
            </div>
        );
      }
  
      const _onRenderOption = (option: ISelectableOption | undefined): JSX.Element => {
        return _renderOption(option, isDisabled ? "dynamics_cell_container_disabled" : "dynamics_cell_container")
      };

      const _onRenderOptionWithoutIcon = (option: ISelectableOption | undefined): JSX.Element => {
        return _renderOptionWithoutIcon(option, "option");
      };
     
      const _onRenderTitle = (options: IDropdownOption[] | undefined): JSX.Element => {
        const option = (options || [])[0];
        return _renderOptionWithoutIcon(option, "option");
            
      };
   
    return <Dropdown   
            options={dropDownOptions}
            selectedKey={value}
            onChange={_onSelectedChanged}
            onRenderTitle = {_onRenderTitle}
            onRenderOption = {_onRenderOptionWithoutIcon}
            //disabled={isDisabled}
            //className="ComboBox"
            //styles = {dropdownStyles}
        />
    
};