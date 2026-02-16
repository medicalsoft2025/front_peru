import { BaseApiService } from "../../../services/api/classes/baseApiService.js";
import { cleanJsonObject } from "../../../services/utilidades.js";
export class MenuService extends BaseApiService {
  constructor() {
    super("medical", "menus");
  }
  withSubmenus() {
    return this.httpClient.get("medical/menus/submenus");
  }
  save(menus) {
    return this.httpClient.post("medical/menus/save", cleanJsonObject({
      menus
    }));
  }
}