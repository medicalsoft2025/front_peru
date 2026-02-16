import { DynamicFormContainerConfig } from "../../interfaces/models";

export const fieldsDemo: DynamicFormContainerConfig = {
    containers: [
        {
            hasSubmitButton: true,
            fields: [
                {
                    type: "select",
                    label: "Test select normal",
                    name: "testnormal",
                    options: [
                        {
                            label: "Test 1",
                            value: 1
                        },
                        {
                            label: "Test 2",
                            value: 2
                        }
                    ]
                },
                {
                    type: "tree-select",
                    label: "Test select en cascada",
                    name: "test",
                    treeOptions: [
                        {
                            key: "australia",
                            label: 'Australia',
                            children: [
                                {
                                    key: "new shouth wales",
                                    label: 'New South Wales',
                                    children: [
                                        { label: 'Sydney', key: "sydney" },
                                        { label: 'Newcastle', key: "newcastle" },
                                        { label: 'Wollongong', key: "wollongong" }
                                    ]
                                },
                                {
                                    key: "0-1",
                                    label: 'Queensland',
                                    children: [
                                        { label: 'Brisbane', key: "brisbane" },
                                        { label: 'Townsville', key: "townsville" }
                                    ]
                                },

                            ]
                        },
                        {
                            key: "canada",
                            label: 'Canada',
                            children: [
                                {
                                    key: "canada-quebec",
                                    label: 'Quebec',
                                    children: [
                                        { label: 'Montreal', key: "montreal" },
                                        { label: 'Quebec City', key: "quebec city" }
                                    ]
                                },
                                {
                                    key: "canada-ontario",
                                    label: 'Ontario',
                                    children: [
                                        { label: 'Ottawa', key: "ottawa" },
                                        { label: 'Toronto', key: "toronto" }
                                    ]
                                },

                            ]
                        },
                        {
                            key: "united states",
                            label: 'United children',
                            children: [
                                {
                                    key: "united states-california",
                                    label: 'California',
                                    children: [
                                        { label: 'Los Angeles', key: "los angeles" },
                                        { label: 'San Diego', key: "san diego" },
                                        { label: 'San Francisco', key: "san francisco" }
                                    ]
                                },
                                {
                                    key: "united states-florida",
                                    label: 'Florida',
                                    children: [
                                        { label: 'Jacksonville', key: "jacksonville" },
                                        { label: 'Miami', key: "miami" },
                                        { label: 'Tampa', key: "tampa" },
                                        { label: 'Orlando', key: "orlando" }
                                    ]
                                },
                                {
                                    key: "united states-texas",
                                    label: 'Texas',
                                    children: [
                                        { label: 'Austin', key: "austin" },
                                        { label: 'Dallas', key: "dallas" },
                                        { label: 'Houston', key: "houston" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "chips",
                    label: "Test chips",
                    name: "testchips"
                },
                {
                    type: "rating",
                    label: "Test rating",
                    name: "testrating"
                },
                {
                    type: "slider",
                    required: true,
                    label: "Test slider",
                    name: "testslider",
                }
            ]
        }
    ]
}