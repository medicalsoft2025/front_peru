import { FormBuilderData } from "../../form-builder/interfaces/types";
import { DynamicFormModel } from "../interfaces/models";
import { StoreDynamicFormParams, UpdateDynamicFormParams } from "../interfaces/types";

export class FormBuilderDataMapper {
    static toStoreDynamicFormParams = (data: FormBuilderData): StoreDynamicFormParams => {
        return {
            config: data.config,
            name: data.configName
        };
    }

    static toUpdateDynamicFormParams = (data: FormBuilderData): Partial<UpdateDynamicFormParams> => {
        return {
            config: data.config,
            name: data.configName
        };
    }
}

export class DynamicFormMapper {
    static toFormBuilderData = (data: DynamicFormModel): FormBuilderData => {
        return {
            config: data.config,
            configName: data.name
        };
    }
}