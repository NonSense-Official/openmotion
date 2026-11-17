import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import DefaultNavbar from './DefaultNavbar';
import ElementNavbar from './ElementNavbar';
import SettingNavbar from './SettingNavbar';
import SelectNavbar from './SelectNavbar';
import LiveShapeNavbar from './LiveShapeNavbar';
import EditPointsNavbar from './EditPointsNavbar';
import DrawingNavbar from './DrawingNavbar';
import TextEditNavbar from './TextEditNavbar';

export default function TopHeaderBar({
  mode,
  onExit,
  onOpenSettings,
  onOpenExport,
  onBack,
  onDone,
  title,
  layer,
  ...restProps
}) {
  const activeToolMode = useEditorStore((state) => state.activeToolMode);
  const activeSubpanel = useEditorStore((state) => state.activeSubpanel);
  const selectedLayerIds = useEditorStore((state) => state.selectedLayerIds);

  let currentMode = mode;
  if (!currentMode) {
    if (activeToolMode === 'liveshape') {
      currentMode = 'liveshape';
    } else if (activeToolMode === 'editpoints') {
      currentMode = 'editpoints';
    } else if (activeToolMode === 'drawing') {
      currentMode = 'drawing';
    } else if (activeToolMode === 'textedit') {
      currentMode = 'textedit';
    } else if (activeSubpanel) {
      currentMode = 'setting';
    } else if (selectedLayerIds && selectedLayerIds.length > 1) {
      currentMode = 'select';
    } else if (selectedLayerIds && selectedLayerIds.length === 1) {
      currentMode = 'element';
    } else {
      currentMode = 'default';
    }
  }

  const renderActiveNavbar = () => {
    switch (currentMode) {
      case 'element':
        return (
          <ElementNavbar
            layer={layer}
            onBack={onBack}
            {...restProps}
          />
        );
      case 'setting':
        return (
          <SettingNavbar
            title={title}
            onBack={onBack}
            {...restProps}
          />
        );
      case 'select':
        return (
          <SelectNavbar
            onCancel={onBack}
            {...restProps}
          />
        );
      case 'liveshape':
        return (
          <LiveShapeNavbar
            title={title}
            onDone={onDone}
            onBack={onBack}
            {...restProps}
          />
        );
      case 'editpoints':
        return (
          <EditPointsNavbar
            title={title}
            onDone={onDone}
            onBack={onBack}
            {...restProps}
          />
        );
      case 'drawing':
        return (
          <DrawingNavbar
            title={title}
            onDone={onDone}
            onBack={onBack}
            {...restProps}
          />
        );
      case 'textedit':
        return (
          <TextEditNavbar
            layer={layer}
            onDone={onDone}
            onOk={onDone}
            {...restProps}
          />
        );
      case 'default':
      default:
        return (
          <DefaultNavbar
            onExit={onExit}
            onOpenSettings={onOpenSettings}
            onOpenExport={onOpenExport}
            {...restProps}
          />
        );
    }
  };

  return (
    <header id="am-top-container">
      {renderActiveNavbar()}
    </header>
  );
}
