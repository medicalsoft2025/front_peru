export class FormBuilderDataMapper {
  static toStoreDynamicFormParams = data => {
    return {
      config: data.config,
      name: data.configName
    };
  };
  static toUpdateDynamicFormParams = data => {
    return {
      config: data.config,
      name: data.configName
    };
  };
}
export class DynamicFormMapper {
  static toFormBuilderData = data => {
    return {
      config: data.config,
      configName: data.name
    };
  };
}