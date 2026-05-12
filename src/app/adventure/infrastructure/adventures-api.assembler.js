import { ref } from 'vue'
import { AdventureAssembler } from './adventure.assembler.js'
import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

export class AdventuresApi extends BaseApi {
    #adventuresEndpoint;

    constructor() {
        super();
        const adventuresEndpointPath = import.meta.env.VITE_ADVENTURES_ENDPOINT_PATH;
        this.#adventuresEndpoint = new BaseEndpoint(this, adventuresEndpointPath);
    }

    getAdventures(params) {
        return this.#adventuresEndpoint.getAll(params);
    }

    getAdventureById(id) {
        return this.#adventuresEndpoint.getById(id);
    }

    createAdventure(adventureData) {
        return this.#adventuresEndpoint.create(adventureData);
    }

    updateAdventure(adventureData) {
        return this.#adventuresEndpoint.update(adventureData.id, adventureData);
    }

    deleteAdventure(id) {
        return this.#adventuresEndpoint.delete(id);
    }
}
