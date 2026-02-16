import React, { useEffect, useRef, useState } from 'react';
import { useMenus } from "../hooks/useMenus.js";
import { Tree } from 'primereact/tree';
import { ContextMenu } from 'primereact/contextmenu';
import { Button } from 'primereact/button';
import { MenuForm } from "./MenuForm.js";
import { generateUUID } from "../../../services/utilidades.js";
import { useMenuSave } from "../hooks/useMenuSave.js";
import { Toast } from 'primereact/toast';
import { useMenuItems } from "../../layout/menu/hooks/useMenuItems.js";
export const MenusApp = () => {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeKey, setSelectedNodeKey] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [formData, setFormData] = useState(undefined);
  const {
    menus,
    refetch
  } = useMenus();
  const {
    saveMenus,
    toast
  } = useMenuSave();
  const {
    refetch: refetchLoggedUserMenus
  } = useMenuItems();
  const cm = useRef(null);
  const reconstructMenuTree = nodesToProcess => {
    return nodesToProcess.map((node, index) => {
      const menuData = {
        ...node.data,
        label: node.label.replace(/\(Sistema\)/g, '').trim(),
        order: index,
        items: node.children ? reconstructMenuTree(node.children) : []
      };
      return menuData;
    });
  };
  const handleSaveMenuStructure = async () => {
    const reconstructed = reconstructMenuTree(nodes);
    await saveMenus(reconstructed);
    refetch();
    refetchLoggedUserMenus();
  };
  const handleAdd = () => {
    setFormMode('create');
    setFormData(undefined);
    setDialogVisible(true);
  };
  const handleEdit = () => {
    if (selectedNode) {
      setFormMode('edit');
      setFormData({
        id: selectedNode.data.id,
        label: selectedNode.data.label,
        icon: selectedNode.data.icon,
        dynamic_form_id: selectedNode.data.dynamic_form_id
      });
      setDialogVisible(true);
    }
  };
  const handleDelete = () => {
    if (selectedNode?.data.system_menu) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se puede eliminar un menú del sistema',
        life: 3000
      });
      return;
    }
    if (selectedNode) {
      const deleteNodeRecursive = currentNodes => {
        return currentNodes.filter(node => {
          if (node.key === selectedNode.key) {
            return false;
          }
          if (node.children) {
            node.children = deleteNodeRecursive(node.children);
          }
          return true;
        });
      };
      setNodes(prevNodes => deleteNodeRecursive([...prevNodes]));
      setSelectedNode(null);
    }
  };
  const handleFormSubmit = data => {
    if (formMode === 'create') {
      const newKey = generateUUID();
      const newNode = {
        key: newKey,
        label: data.label,
        data: {
          ...data,
          id: undefined
        },
        icon: data.icon ? () => iconTemplate(data.icon) : undefined,
        children: []
      };
      if (selectedNode) {
        const addChildRecursive = currentNodes => {
          return currentNodes.map(node => {
            if (node.key === selectedNode.key) {
              return {
                ...node,
                children: [...(node.children || []), newNode]
              };
            }
            if (node.children) {
              return {
                ...node,
                children: addChildRecursive(node.children)
              };
            }
            return node;
          });
        };
        setNodes(prevNodes => addChildRecursive(prevNodes));
      } else {
        setNodes(prevNodes => [...prevNodes, newNode]);
      }
    } else {
      const updateNodeRecursive = currentNodes => {
        return currentNodes.map(node => {
          if (node.key === selectedNode?.key) {
            return {
              ...node,
              label: data.label,
              data: {
                ...node.data,
                ...data
              },
              icon: data.icon ? () => iconTemplate(data.icon) : undefined
            };
          }
          if (node.children) {
            return {
              ...node,
              children: updateNodeRecursive(node.children)
            };
          }
          return node;
        });
      };
      setNodes(prevNodes => updateNodeRecursive(prevNodes));
    }
  };
  const menu = [{
    label: 'Añadir submenú',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus me-1"
    }),
    command: handleAdd
  }, {
    label: 'Editar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-edit me-1"
    }),
    command: handleEdit
  }, {
    label: 'Eliminar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-trash me-1"
    }),
    command: handleDelete
  }];
  const iconTemplate = iconClass => {
    return iconClass ? /*#__PURE__*/React.createElement("i", {
      className: `${iconClass} me-1`
    }) : null;
  };
  const processItems = items => {
    if (!items || !Array.isArray(items)) return [];
    return items.map(item => {
      const processedItem = {
        id: item.id?.toString(),
        key: item.key || item.id?.toString(),
        data: item,
        label: item.system_menu ? `${item.label} (Sistema)` : item.label
      };
      if (item.icon) {
        processedItem.icon = () => iconTemplate(item.icon);
      }
      if (item.items && item.items.length > 0) {
        processedItem.children = processItems(item.items);
      }
      return processedItem;
    });
  };
  const processedItems = processItems(menus);
  useEffect(() => {
    if (processedItems.length > 0 && nodes.length === 0) {
      setNodes(processedItems);
    }
  }, [menus]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-0"
  }, "Men\xFAs"), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar \xC1rbol",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-save me-1"
    }),
    onClick: handleSaveMenuStructure
  })), /*#__PURE__*/React.createElement(ContextMenu, {
    model: menu,
    ref: cm
  }), /*#__PURE__*/React.createElement(Tree, {
    value: nodes,
    dragdropScope: "demo",
    onDragDrop: e => {
      if (e.dragNode.data.system_menu) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se puede ordenar un menú del sistema',
          life: 3000
        });
        return;
      }
      setNodes(e.value);
    },
    selectionMode: "single",
    selectionKeys: selectedNodeKey,
    onSelectionChange: e => setSelectedNodeKey(e.value),
    contextMenuSelectionKey: selectedNodeKey,
    onContextMenuSelectionChange: e => setSelectedNodeKey(e.value),
    onContextMenu: e => {
      setSelectedNode(e.node);
      cm.current?.show(e.originalEvent);
    }
  }), /*#__PURE__*/React.createElement(MenuForm, {
    visible: dialogVisible,
    onHide: () => setDialogVisible(false),
    onSubmit: handleFormSubmit,
    defaultValues: formData,
    mode: formMode,
    isSystemMenu: selectedNode?.data?.system_menu && formMode === 'edit'
  })));
};