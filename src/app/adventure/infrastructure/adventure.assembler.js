import { Adventure } from "../domain/model/adventure.entity.js";
import { AdventureRoute } from "../domain/model/adventure-route.entity.js";

export class AdventureAssembler {
    static toEntityFromResource(resource = {}) {
        // Normalize resource fields to entity
        return new Adventure({
            id: resource.id ?? resource._id ?? null,
            title: resource.title ?? resource.name ?? '',
            description: resource.description ?? '',
            location: resource.location ?? resource.endLocation ?? resource.destination ?? '',
            categoryId: resource.categoryId ?? null,
            price: resource.price ?? resource.estimatedCost ?? null,
            rating: resource.rating ?? 0,
            images: resource.images ?? (resource.photos ?? []),
            tags: resource.tags ?? [],
            // Preserve original fields for editing
            vehicleName: resource.vehicleName,
            startLocation: resource.startLocation,
            endLocation: resource.endLocation,
            type: resource.type,
            duration: resource.duration,
            difficulty: resource.difficulty,
            featured: resource.featured,
            maxCapacity: resource.maxCapacity,
            ownerId: resource.ownerId,
            imageUrl: resource.imageUrl
        });
    }

    static toRouteEntity(data) {
        if (!data) return null;
        return new AdventureRoute(data);
    }

    static toRouteCollection(dataArray) {
        if (!Array.isArray(dataArray)) return [];
        return dataArray.map(item => this.toRouteEntity(item));
    }

    static toEntitiesFromResponse(response) {
        if (!response) {
            console.error('Adventures response error: response is null or undefined');
            return [];
        }

        let resources = [];

        if (Array.isArray(response)) {
            // Si response ya es un array directo
            resources = response;
        } else if (Array.isArray(response.data)) {
            resources = response.data;
        } else if (Array.isArray(response.data?.adventures)) {
            resources = response.data.adventures;
        } else {
            console.warn('No adventures found in response', response);
            return [];
        }

        return resources.map(r => this.toEntityFromResource(r));
    }
}

