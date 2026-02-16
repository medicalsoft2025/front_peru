import React, { useEffect, useRef, useState } from 'react';
import { useMenus } from '../hooks/useMenus';
import { TreeNode } from 'primereact/treenode';
import { Tree } from 'primereact/tree';
import { ContextMenu } from 'primereact/contextmenu';
import { Button } from 'primereact/button';
import { MenuForm, MenuFormData } from './MenuForm';
import { generateUUID } from '../../../services/utilidades';
import { useMenuSave } from '../hooks/useMenuSave';
import { Toast } from 'primereact/toast';
import { useMenuItems } from '../../layout/menu/hooks/useMenuItems';

export const MenusApp = () => {

    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
    const [selectedNodeKey, setSelectedNodeKey] = useState<string>("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [formData, setFormData] = useState<MenuFormData | undefined>(undefined);

    const { menus, refetch } = useMenus();
    const { saveMenus, toast } = useMenuSave();
    const { refetch: refetchLoggedUserMenus } = useMenuItems();

    const cm = useRef<ContextMenu>(null);

    const reconstructMenuTree = (nodesToProcess: TreeNode[]): any[] => {
        return nodesToProcess.map((node, index) => {
            const menuData: any = {
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
            const deleteNodeRecursive = (currentNodes: TreeNode[]): TreeNode[] => {
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

    const handleFormSubmit = (data: MenuFormData) => {
        if (formMode === 'create') {
            const newKey = generateUUID()
            const newNode: TreeNode = {
                key: newKey,
                label: data.label,
                data: { ...data, id: undefined },
                icon: data.icon ? (() => iconTemplate(data.icon)) : undefined,
                children: []
            };

            if (selectedNode) {
                const addChildRecursive = (currentNodes: TreeNode[]): TreeNode[] => {
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
            const updateNodeRecursive = (currentNodes: TreeNode[]): TreeNode[] => {
                return currentNodes.map(node => {
                    if (node.key === selectedNode?.key) {
                        return {
                            ...node,
                            label: data.label,
                            data: { ...node.data, ...data },
                            icon: data.icon ? (() => iconTemplate(data.icon)) : undefined
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


    const menu = [
        {
            label: 'Añadir submenú',
            icon: <i className='fa fa-plus me-1'></i>,
            command: handleAdd
        },
        {
            label: 'Editar',
            icon: <i className='fa fa-edit me-1'></i>,
            command: handleEdit
        },
        {
            label: 'Eliminar',
            icon: <i className='fa fa-trash me-1'></i>,
            command: handleDelete
        }
    ];

    const iconTemplate = (iconClass: string) => {
        return iconClass ? <i className={`${iconClass} me-1`}></i> : null;
    };

    const processItems = (items: any[]) => {
        if (!items || !Array.isArray(items)) return [];

        return items.map((item) => {
            const processedItem: TreeNode = {
                id: item.id?.toString(),
                key: item.key || item.id?.toString(),
                data: item,
                label: item.system_menu ? `${item.label} (Sistema)` : item.label,
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

    return (<>
        <Toast ref={toast} />
        <div>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h2 className='mb-0'>Menús</h2>
                <Button label="Guardar Árbol" icon={<i className='fa fa-save me-1'></i>} onClick={handleSaveMenuStructure} />
            </div>

            <ContextMenu model={menu} ref={cm} />
            <Tree
                value={nodes}
                dragdropScope="demo"
                onDragDrop={(e: any) => {
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
                }}
                selectionMode="single"
                selectionKeys={selectedNodeKey}
                onSelectionChange={(e) => setSelectedNodeKey(e.value as string)}
                contextMenuSelectionKey={selectedNodeKey}
                onContextMenuSelectionChange={(e) => setSelectedNodeKey(e.value as string)}
                onContextMenu={(e: any) => {
                    setSelectedNode(e.node);
                    cm.current?.show(e.originalEvent);
                }}
            />

            <MenuForm
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                onSubmit={handleFormSubmit}
                defaultValues={formData}
                mode={formMode}
                isSystemMenu={selectedNode?.data?.system_menu && formMode === 'edit'}
            />
        </div>
    </>);
};