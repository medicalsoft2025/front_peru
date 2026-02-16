import { TreeNode } from "primereact/treenode";
import { DynamicFieldConfig, DynamicFormContainerConfig } from "../../../react/dynamic-form/interfaces/models";

export class JsonHelpers {

    static convertContainerToElementNode(container: DynamicFormContainerConfig) {
        return {
            label: container.label || "Container",
            children: [],
        };
    }

    static convertFieldToElementNode(field: DynamicFieldConfig) {
        return {
            label: field.label || "Field",
            children: [],
        };
    }

    static convertConfigToElementsTree(config: DynamicFormContainerConfig) {
        const elementsTree: TreeNode[] = [];

        config.containers?.forEach(container => {
            const containerNode: TreeNode = JsonHelpers.convertContainerToElementNode(container);

            const children = JsonHelpers.convertConfigToElementsTree(container);
            containerNode.children = children;

            elementsTree.push(containerNode);
        });

        config.fields?.forEach(field => {
            const fieldNode: TreeNode = JsonHelpers.convertFieldToElementNode(field);
            elementsTree.push(fieldNode);
        });

        return elementsTree;
    }

}