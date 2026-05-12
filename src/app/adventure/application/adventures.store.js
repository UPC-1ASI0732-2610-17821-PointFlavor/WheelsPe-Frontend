import { ref } from "vue";
import { AdventureRouteApi } from "../infrastructure/adventure-route-api.js";

const adventures = ref([]);
const adventuresLoaded = ref(false);
const errors = ref([]);

export default function useAdventuresStore() {

    async function fetchAdventures() {
        try {
            const data = await AdventureRouteApi.listRoutes();
            adventures.value = data;
            adventuresLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
            console.error("Error fetching adventures:", error);
        }
    }

    function getAdventureById(id) {
        return adventures.value.find(a => a.id === Number(id));
    }

    async function addAdventure(adventure) {
        try {
            const newAdventure = await AdventureRouteApi.createRoute(adventure);
            adventures.value.push(newAdventure);
            return newAdventure;
        } catch (error) {
            errors.value.push(error);
            console.error("Error adding adventure:", error);
            throw error;
        }
    }

    async function updateAdventure(id, updatedData) {
        try {
            const updatedAdventure = await AdventureRouteApi.updateRoute(id, updatedData);
            const index = adventures.value.findIndex(a => a.id === id);
            if (index !== -1) adventures.value[index] = updatedAdventure;
            return updatedAdventure;
        } catch (error) {
            errors.value.push(error);
            console.error("Error updating adventure:", error);
            throw error;
        }
    }

    async function deleteAdventure(id) {
        try {
            await AdventureRouteApi.deleteRoute(id);
            adventures.value = adventures.value.filter(a => a.id !== id);
        } catch (error) {
            errors.value.push(error);
            console.error("Error deleting adventure:", error);
            throw error;
        }
    }

    return {
        adventures,
        adventuresLoaded,
        errors,
        fetchAdventures,
        getAdventureById,
        addAdventure,
        updateAdventure,
        deleteAdventure
    };
}
