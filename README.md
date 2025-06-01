# PAGrid.CustomizerControl

## Overview

**PAGrid.CustomizerControl** is a Power Apps Component Framework (PCF) control designed to provide advanced grid customization capabilities for Microsoft Dynamics 365 and Dataverse model-driven apps. It enables developers and customizers to override cell rendering and editing behaviors, integrate custom business logic, and enhance user experience in Power Apps grids.

This project is tailored for scenarios where standard grid controls are insufficient, offering extensibility for complex business requirements, custom UI, and integration with backend services.

Specifically, the control supports dynamic filtering of dropdown/optionset values in grid columns, allowing you to display only a relevant subset of options based on custom business logic or project-specific requirements. This enables more contextual and streamlined data entry experiences for end users.

---

## Features

- **Custom Cell Rendering**: Override how grid cells are displayed using custom React components.
- **Custom Cell Editing**: Provide tailored cell editors for specific columns or data types.
- **Optionset Control**: Enhanced dropdown/optionset support for grid cells, including the ability to filter and display a subset of optionset values dynamically based on custom business logic or project requirements.
- **Business Logic Integration**: Connect to Dataverse/Dynamics 365 WebAPI for data operations (e.g., sequence generation, billing type management).
- **Styling**: Custom CSS for grid and cell appearance.
- **Configurable via ControlManifest**: Expose properties and configuration through the PCF manifest.

---

## Project Structure

```
PAGrid.CustomizerControl/
├── package.json                # Project metadata and dependencies
├── tsconfig.json               # TypeScript configuration
├── pcfconfig.json              # PCF build configuration
├── eslint.config.mjs           # Linting rules
├── PAGrid.CustomizerControl.pcfproj # PCF project file
├── PAGridCustomizerCtrl/
│   ├── ControlManifest.Input.xml   # PCF control manifest
│   ├── index.ts                   # Main control entry point
│   ├── types.ts                   # Shared type definitions
│   ├── Controls/
│   │   └── OptionsetControl.tsx   # Custom optionset (dropdown) control
│   ├── Customizer/
│   │   ├── CellEditorOverrides.tsx    # Custom cell editor logic
│   │   └── CellRendererOverrides.tsx  # Custom cell renderer logic
│   ├── Dal/
│   │   ├── GenerateSequence.ts        # Sequence generation logic (WebAPI)
│   │   └── ManageBillingTypes.tsx     # Billing type management logic
│   └── css/
│       └── style.css              # Custom styles
├── generated/
│   └── ManifestTypes.d.ts         # Auto-generated manifest types
```

---

## Key Components

### Main Entry Point
- **index.ts**: Initializes the control, manages lifecycle, and wires up custom renderers/editors.

### Type Definitions
- **types.ts**: Shared TypeScript types/interfaces for props, state, and data models.

### Customization Logic
- **Customizer/CellRendererOverrides.tsx**: Implements custom cell rendering logic. Extend this to change how specific columns or data types are displayed.
- **Customizer/CellEditorOverrides.tsx**: Implements custom cell editing logic. Extend this to provide custom editors (e.g., dropdowns, date pickers).

### Controls
- **Controls/OptionsetControl.tsx**: A reusable dropdown/optionset control for use in cell editors.

### Data Access Layer (DAL)
- **Dal/GenerateSequence.ts**: Handles sequence number generation via Dataverse WebAPI.
- **Dal/ManageBillingTypes.tsx**: Manages billing type data, including fetching and updating records.

### Styling
- **css/style.css**: Custom styles for the grid and its components.

### Configuration & Metadata
- **ControlManifest.Input.xml**: Defines control properties, resources, and configuration for Power Apps.
- **package.json, tsconfig.json, pcfconfig.json**: Project, TypeScript, and PCF build settings.

---

## Setup & Build Instructions

### Prerequisites
- Node.js (LTS recommended)
- npm or yarn
- Power Apps CLI (`pac`)
- Access to a Dataverse environment for deployment/testing

### Install Dependencies
```powershell
npm install
```

### Build the Control
```powershell
npm run build
```

### Test Locally
You can use the [PCF Test Harness](https://github.com/microsoft/pcf-samples/tree/main/samples/TS_GridControl) or deploy to a sandbox environment for testing.

### Deploy to Power Apps
1. **Build the solution** (creates a deployable ZIP):
   ```powershell
   pac solution pack --zipfile Solution/PAGridCustomizerCtrl/bin/Debug/PAGridCustomizerCtrl.zip --folder Solution/PAGridCustomizerCtrl/src
   ```
2. **Import the solution** into your Dataverse environment via Power Platform admin center.

---

## Usage

1. Add the control to a grid in your model-driven app via the Power Apps designer.
2. Configure properties as defined in `ControlManifest.Input.xml` (see Power Apps UI for available options).
3. The control will automatically apply custom cell renderers and editors as implemented.

---

## Customization & Extension Points

- **Custom Cell Renderers**: Extend `CellRendererOverrides.tsx` to add or modify how specific columns are displayed.
- **Custom Cell Editors**: Extend `CellEditorOverrides.tsx` to provide new editors for data entry.
- **Optionset Logic**: Update `OptionsetControl.tsx` for custom dropdown behaviors.
- **Business Logic**: Add/modify data access logic in the `Dal/` folder for integration with Dataverse or external APIs.
- **Styling**: Update `css/style.css` for custom look and feel.
- **Manifest Properties**: Expose new configuration options via `ControlManifest.Input.xml`.

---

## API & Customization Examples

### Example: Custom Cell Renderer
```tsx
// In Customizer/CellRendererOverrides.tsx
export function renderCustomColumn(cellProps) {
  if (cellProps.columnKey === 'custom_field') {
    return <span className="custom-style">{cellProps.value}</span>;
  }
  // ...default rendering
}
```

### Example: Custom Cell Editor
```tsx
// In Customizer/CellEditorOverrides.tsx
export function editCustomColumn(cellProps) {
  if (cellProps.columnKey === 'custom_field') {
    return <OptionsetControl options={cellProps.options} value={cellProps.value} onChange={cellProps.onChange} />;
  }
  // ...default editing
}
```

### Example: Sequence Generation
```ts
// In Dal/GenerateSequence.ts
export async function generateSequence(entityName: string): Promise<number> {
  // Call Dataverse WebAPI to get next sequence
}
```

---

## Solution & Integration

- **Solution Packaging**: The `Solution/` folder contains the solution project and XMLs for deployment.
- **Integration**: Designed for seamless integration with Dynamics 365/Dataverse grids.
- **Extensibility**: Add new files/components as needed for further customization.

---

## References
- [Power Apps Component Framework Documentation](https://learn.microsoft.com/power-apps/developer/component-framework/overview)
- [PCF CLI Reference](https://learn.microsoft.com/power-apps/developer/component-framework/cli-reference)
- [Dataverse WebAPI](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/overview)

---

## License
See `package.json` for license details.

---
