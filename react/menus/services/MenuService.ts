import { BaseApiService } from "../../../services/api/classes/baseApiService";
import { cleanJsonObject } from "../../../services/utilidades";


export class MenuService extends BaseApiService {
    constructor() {
        super("medical", "menus");
    }

    withSubmenus() {
        return this.httpClient.get("medical/menus/submenus");
    }

    save(menus: any[]) {
        return this.httpClient.post("medical/menus/save", cleanJsonObject({ menus }));
    }
}