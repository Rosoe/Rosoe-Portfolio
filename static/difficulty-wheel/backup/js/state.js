const State = {
    difficulties: {},

    initialize() {
        Object.entries(categories).forEach(([category, { subcategories }]) => {
            Object.keys(subcategories).forEach(sub => {
                this.difficulties[`${category}-${sub}`] = 1;
            });
        });
    },

    getCategoryOpacity(category) {
        const subRatings = Object.entries(this.difficulties)
            .filter(([key]) => key.startsWith(category))
            .map(([, value]) => value);
        return (subRatings.reduce((a, b) => a + b, 0) / subRatings.length) / 10;
    }
};
