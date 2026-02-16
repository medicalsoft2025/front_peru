import React, { useState } from "react";
import { DynamicForm } from "../../components/DynamicForm";
import { demoData } from "../jsons/demoData";
import { historiaCardiologia } from "../../forms/clinical-records/historiaCardiologia";
import { complexContainerRules } from "../jsons/complex-container-rules";
import { fieldArrayDemo } from "../jsons/field-array-demo";
import { ultraComplexForm } from "../jsons/demo";
import { asyncDemo } from "../jsons/async-demo";
import { fieldsDemo } from "../jsons/fields-demo";
import { tableArrayDemo } from "../jsons/table-array-demo";

export const UserForm = () => {
    const [loading, setLoading] = useState(false);

    const onSubmit = (data: any) => {
        setLoading(true);
        console.log("Form Data:", data);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <DynamicForm
            onSubmit={onSubmit}
            config={asyncDemo}
            loading={loading}
            data={demoData}
        />
    );
};
