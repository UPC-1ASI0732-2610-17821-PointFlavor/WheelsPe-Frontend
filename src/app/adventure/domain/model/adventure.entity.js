export class Adventure{
    constructor({
                    id = null,
                    title = '',
                    description = '',
                    location = '',
                    categoryId = null,
                    price = null,
                    rating = 0,
                    images = [],
                    tags = [],
                    vehicleName = '',
                    startLocation = '',
                    endLocation = '',
                    type = '',
                    duration = 0,
                    difficulty = '',
                    featured = false,
                    maxCapacity = 0,
                    ownerId = null,
                    imageUrl = ''
                } = {}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.categoryId = categoryId;
        this.price = price;
        this.rating = rating;
        this.images = images;
        this.tags = tags;
        this.vehicleName = vehicleName;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.type = type;
        this.duration = duration;
        this.difficulty = difficulty;
        this.featured = featured;
        this.maxCapacity = maxCapacity;
        this.ownerId = ownerId;
        this.imageUrl = imageUrl;
    }
}