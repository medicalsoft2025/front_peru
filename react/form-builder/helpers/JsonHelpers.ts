import { TreeNode } from "primereact/treenode";
import { DynamicFieldConfig, DynamicFormContainerConfig, DynamicFormElementConfig } from "../../../react/dynamic-form/interfaces/models";

export class JsonHelpers {

    static convertContainerToElementNode(container: DynamicFormContainerConfig, path: string): TreeNode {
        return {
            key: path,
            data: container,
            label: container.label || container.name || container.type || "Elemento",
            children: [],
        };
    }

    static convertFieldToElementNode(field: DynamicFieldConfig, path: string): TreeNode {
        return {
            key: path,
            data: field,
            label: field.label || field.name || field.type || "Campo",
            children: [],
        };
    }

    static convertConfigToElementsTree(config: DynamicFormElementConfig, path: string, parentDataPath: string = "", onNode?: (key: string, data: any) => void): TreeNode[] {
        const elementsTree: TreeNode[] = [];
        const seen = new Set();
        const usedPaths = new Map<string, number>();

        // Priority for unified 'children'.
        let allChildren: any[] = [];
        if (config.children !== undefined) {
            allChildren = config.children;
        } else {
            // Legacy fallback: ensure no duplicate references (though we aim to move away from this)
            allChildren = [
                ...(config.fields || []),
                ...(config.containers || [])
            ];
        }

        allChildren.forEach(child => {
            if (!child || seen.has(child)) return;
            seen.add(child);

            const isContainer = ["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(child.type);

            // Generate unique path among siblings
            let baseIdentifier = (child.label || child.name || child.type || "element");
            let identifier = baseIdentifier;
            let counter = usedPaths.get(baseIdentifier) || 0;
            if (counter > 0) {
                identifier = `${baseIdentifier}_${counter}`;
            }
            usedPaths.set(baseIdentifier, counter + 1);

            const currentPath = path + "." + identifier;

            if (isContainer) {
                let thisContainerKey = currentPath;
                const containerName = child.name || "";

                if (containerName) {
                    thisContainerKey = parentDataPath ? `${parentDataPath}.${containerName}` : containerName;
                }

                let nextDataPath = parentDataPath;
                const isDataContainer = child.type && ["form", "array", "objectArray"].includes(child.type);

                if (isDataContainer && containerName) {
                    if (child.type && ["array", "objectArray"].includes(child.type)) {
                        nextDataPath = parentDataPath ? `${parentDataPath}.${containerName}.*` : `${containerName}.*`;
                    } else {
                        nextDataPath = parentDataPath ? `${parentDataPath}.${containerName}` : containerName;
                    }
                }

                const containerNode: TreeNode = JsonHelpers.convertContainerToElementNode(child, currentPath);
                containerNode.key = thisContainerKey;
                if (onNode) onNode(thisContainerKey, child);

                const children = JsonHelpers.convertConfigToElementsTree(child, currentPath, nextDataPath, onNode);
                containerNode.children = children;
                elementsTree.push(containerNode);
            } else {
                const fieldName = child.name || "field";
                const fieldDataPath = parentDataPath ? `${parentDataPath}.${fieldName}` : fieldName;

                const fieldNode: TreeNode = JsonHelpers.convertFieldToElementNode(child, currentPath);
                fieldNode.key = fieldDataPath;
                if (onNode) onNode(fieldDataPath, child);

                // Allow fields to have children in the tree
                if (child.children !== undefined || child.fields !== undefined || child.containers !== undefined) {
                    fieldNode.children = JsonHelpers.convertConfigToElementsTree(child, currentPath, fieldDataPath, onNode);
                }

                elementsTree.push(fieldNode);
            }
        });

        return elementsTree;
    }

    static updateConfigPaths(config: DynamicFormElementConfig, searchPath: string, replacePath: string) {
        const traverse = (obj: any) => {
            if (!obj || typeof obj !== 'object') return;

            for (const key in obj) {
                const value = obj[key];
                if (typeof value === 'string') {
                    if (value === searchPath) {
                        obj[key] = replacePath;
                    } else if (value.startsWith(searchPath + ".")) {
                        obj[key] = value.replace(searchPath + ".", replacePath + ".");
                    }
                } else if (Array.isArray(value)) {
                    // Traverse arrays and also check if elements are strings that need replacing
                    value.forEach((item, index) => {
                        if (typeof item === 'string') {
                            if (item === searchPath) {
                                (value as any)[index] = replacePath;
                            } else if (item.startsWith(searchPath + ".")) {
                                (value as any)[index] = item.replace(searchPath + ".", replacePath + ".");
                            }
                        } else {
                            traverse(item);
                        }
                    });
                } else {
                    traverse(value);
                }
            }
        };
        traverse(config);
    }

    static findParentAndIndex(config: DynamicFormElementConfig, target: any): { parent: any, array: any[], index: number } | null {
        const traverse = (obj: any): any => {
            if (!obj) return null;

            if (obj.children && obj.children.includes(target)) {
                return { parent: obj, array: obj.children, index: obj.children.indexOf(target) };
            }

            if (obj.fields && obj.fields.includes(target)) {
                return { parent: obj, array: obj.fields, index: obj.fields.indexOf(target) };
            }

            if (obj.containers) {
                const idx = obj.containers.indexOf(target);
                if (idx !== -1) {
                    return { parent: obj, array: obj.containers, index: idx };
                }
                for (const child of obj.containers) {
                    const result = traverse(child);
                    if (result) return result;
                }
            }

            if (obj.children) {
                for (const child of obj.children) {
                    const result = traverse(child);
                    if (result) return result;
                }
            }
            return null;
        };
        return traverse(config);
    }

    static findParentAndIndexByKey(config: DynamicFormElementConfig, targetKey: string): { parent: any, array: any[], index: number, target: any } | null {
        const tempTree = JsonHelpers.convertConfigToElementsTree(config, "root");
        const node = JsonHelpers.findNodeByKey(tempTree, targetKey);
        if (!node) return null;

        const res = JsonHelpers.findParentAndIndex(config, node.data);
        return res ? { ...res, target: node.data } : null;
    }

    static findNodeByKey(treeNodes: TreeNode[], key: string): TreeNode | null {
        for (const node of treeNodes) {
            if (node.key === key) return node;
            if (node.children) {
                const found = JsonHelpers.findNodeByKey(node.children, key);
                if (found) return found;
            }
        }
        return null;
    }

    static reconstructConfigFromTree(treeNodes: TreeNode[]): DynamicFormElementConfig[] {
        return treeNodes.map(node => {
            const config = node.data; // Preserve original reference

            // Always set children array if there are nodes, or empty array to signal unified mode
            if (node.children && node.children.length > 0) {
                config.children = JsonHelpers.reconstructConfigFromTree(node.children);
            } else {
                config.children = [];
            }

            // Aggressive cleanup: remove legacy arrays to prevent duplication
            delete (config as any).fields;
            delete (config as any).containers;
            return config;
        });
    }

    static findDataByKey(config: DynamicFormElementConfig, key: string): any {
        const tempTree = JsonHelpers.convertConfigToElementsTree(config, "root");
        const node = JsonHelpers.findNodeByKey(tempTree, key);
        return node ? node.data : null;
    }

    static evaluateCondition(condition: any, allData: any, rootData: any, parentData: any): boolean {
        if (!allData) return false;

        let path = condition.field;
        let targetData = allData;

        if (path && typeof path === 'string') {
            if (path.startsWith('$root.')) {
                path = path.replace('$root.', '');
                targetData = rootData;
            } else if (path.startsWith('$parent.')) {
                path = path.replace('$parent.', '');
                targetData = parentData;
            }
        }

        if (!targetData) return false;

        // Support nested paths like "arrayConfig.format"
        const val = path.split('.').reduce((obj: any, key: string) => obj?.[key], targetData);

        switch (condition.operator) {
            case "equals": return val === condition.value;
            case "notEquals": return val !== condition.value;
            case "in": return Array.isArray(condition.value) && condition.value.includes(val);
            case "notIn": return Array.isArray(condition.value) && !condition.value.includes(val);
            case "contains": return (typeof val === 'string' || Array.isArray(val)) && val.includes(condition.value);
            case "notContains": return !((typeof val === 'string' || Array.isArray(val)) && val.includes(condition.value));
            case "isEmpty": return val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0);
            case "isNotEmpty": return !(val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0));
            default: return false;
        }
    }

    static evaluateRule(rule: any, allData: any, rootData: any, parentData: any): boolean {
        if (!rule.conditions || rule.conditions.length === 0) return true;
        const logic = rule.logic || "and";

        if (logic === "and") {
            return rule.conditions.every((c: any) => JsonHelpers.evaluateCondition(c, allData, rootData, parentData));
        } else {
            return rule.conditions.some((c: any) => JsonHelpers.evaluateCondition(c, allData, rootData, parentData));
        }
    }

    static getEffectiveField(field: any, allData: any, rootData: any, parentData: any): any {
        let computedField = { ...field };

        // Legacy visibility check
        if (field.visible && typeof field.visible === 'object' && allData) {
            const visibleMap = field.visible as { [key: string]: any[] };
            let legacyVisible = true;
            Object.keys(visibleMap).forEach(depKey => {
                const validValues = visibleMap[depKey];
                const depValue = allData[depKey];
                if (!validValues.includes(depValue)) {
                    legacyVisible = false;
                }
            });
            computedField.visible = legacyVisible && (field.visible !== false);
        }

        // Rules-based properties
        if (field.rules && allData) {
            field.rules.forEach((rule: any) => {
                if (JsonHelpers.evaluateRule(rule, allData, rootData, parentData)) {
                    computedField = { ...computedField, ...rule.effect };
                }
            });
        }

        return computedField;
    }

    /**
     * Validates a configuration object against its metadata.
     * Returns an array of error messages. Empty array means valid.
     */
    static validateConfigAgainstMetadata(config: any, metadata: any, path: string = "", rootData?: any, parentData?: any): string[] {
        const errors: string[] = [];
        if (!config || typeof config !== 'object') {
            errors.push(`${path || 'Raíz'}: Debe ser un objeto válido.`);
            return errors;
        }

        metadata.fields.forEach((field: any) => {
            const effectiveField = JsonHelpers.getEffectiveField(field, config, rootData || config, parentData);
            const value = config[effectiveField.key];
            const fieldLabel = effectiveField.label || effectiveField.key;
            const fullPath = path ? `${path} -> ${fieldLabel}` : fieldLabel;

            // 0. Skip visibility if hidden (optional, but consistent with UI)
            if (effectiveField.visible === false) return;

            // 1. Check required
            if (effectiveField.required && (value === undefined || value === null || value === "")) {
                errors.push(`${fullPath}: Es obligatorio.`);
            }

            // 2. Check types (basic)
            if (value !== undefined && value !== null) {
                // Check options restriction
                if (effectiveField.options && Array.isArray(effectiveField.options)) {
                    const optionValues = effectiveField.options.map((opt: any) => opt.value);
                    if (!optionValues.includes(value)) {
                        errors.push(`${fullPath}: Valor inválido "${value}". Debe ser uno de: ${optionValues.join(", ")}.`);
                    }
                }

                switch (effectiveField.inputType) {
                    case "number":
                        if (typeof value !== "number") errors.push(`${fullPath}: Debe ser un número.`);
                        break;
                    case "checkbox":
                        if (typeof value !== "boolean") errors.push(`${fullPath}: Debe ser un booleano.`);
                        break;
                    case "text":
                    case "textarea":
                    case "select":
                    case "treeSelect":
                        if (typeof value !== "string") errors.push(`${fullPath}: Debe ser una cadena de texto.`);
                        break;
                    case "objectArray":
                    case "keyValueTable":
                        if (!Array.isArray(value)) {
                            errors.push(`${fullPath}: Debe ser un arreglo.`);
                        } else if (effectiveField.fields) {
                            // Recursively validate array items
                            value.forEach((item, index) => {
                                const itemErrors = JsonHelpers.validateConfigAgainstMetadata(item, { fields: effectiveField.fields }, `${fullPath}[${index}]`, rootData, config);
                                errors.push(...itemErrors);
                            });
                        }
                        break;
                    case "nestedObject":
                        if (typeof value !== "object" || Array.isArray(value)) {
                            errors.push(`${fullPath}: Debe ser un objeto.`);
                        } else if (effectiveField.fields) {
                            const nestedErrors = JsonHelpers.validateConfigAgainstMetadata(value, { fields: effectiveField.fields }, fullPath, rootData, config);
                            errors.push(...nestedErrors);
                        }
                        break;
                }
            }
        });

        // Special check for recursion if the object has 'children' (standard for our elements)
        if (config.children && Array.isArray(config.children)) {
            const childrenField = metadata.fields.find((f: any) => f.key === "children");
            if (childrenField && childrenField.fields) {
                config.children.forEach((child: any, index: number) => {
                    const childErrors = JsonHelpers.validateConfigAgainstMetadata(child, { fields: childrenField.fields }, `${path ? path + ' -> ' : ''}Hijo[${index}]`, rootData || config, config);
                    errors.push(...childErrors);
                });
            }
        }

        return errors;
    }

    /**
     * Generates a unique name for a child element based on existing siblings.
     */
    static getAvailableName(existingChildren: any[], baseName: string): string {
        if (!baseName) return "";
        let name = baseName;
        let counter = 1;
        const names = new Set(existingChildren.map((c: any) => c.name).filter((n: any) => !!n));

        while (names.has(name)) {
            name = `${baseName}_${counter}`;
            counter++;
        }
        return name;
    }

    static collectAllNames(config: any, names: Set<string> = new Set()) {
        if (!config || typeof config !== 'object') return names;
        if (config.name) names.add(config.name);

        const children = [...(config.children || []), ...(config.fields || []), ...(config.containers || [])];
        children.forEach((child: any) => JsonHelpers.collectAllNames(child, names));

        return names;
    }

    static uniquifyConfigRecursive(configToImport: any, existingNames: Set<string>) {
        if (!configToImport || typeof configToImport !== 'object') return;

        if (configToImport.name) {
            let baseName = configToImport.name;
            let newName = baseName;
            let counter = 1;
            while (existingNames.has(newName)) {
                newName = `${baseName}_${counter}`;
                counter++;
            }
            configToImport.name = newName;
            existingNames.add(newName);
        }

        const children = [...(configToImport.children || []), ...(configToImport.fields || []), ...(configToImport.containers || [])];
        children.forEach((child: any) => JsonHelpers.uniquifyConfigRecursive(child, existingNames));
    }
}