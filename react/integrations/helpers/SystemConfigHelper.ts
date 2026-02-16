export class SystemConfigHelper {
    static formatDataToSystemConfigArray(data: any) {
        return Object.entries(data).map(([key, value]) => {
            if (key === "files") return;
            return {
                key_: key,
                value: value
            };
        }).filter((item) => item !== undefined && item?.value !== undefined);
    }
}