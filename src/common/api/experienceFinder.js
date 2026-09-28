import { exhibitions, programs } from '../data/content.js';
import { experienceFinderContent, experienceTypeCategories } from '../data/experienceFinder.js';
import { paths } from '../router/routePaths.js';

const sources = {
    exhibition: { items: exhibitions, detailRoute: paths.exhibition },
    program: { items: programs, detailRoute: paths.program },
};

export function getExperienceRecommendations({ experienceType, location, preference }) {
    const categories = experienceTypeCategories[experienceType];
    if (!categories || !location) return [];

    return experienceFinderContent
        .filter((item) => categories.includes(item.category))
        .filter((item) => location === 'all' || item.locationSlugs.includes(location))
        .map((item, index) => {
            const source = sources[item.sourceType];
            const content = source?.items.find((entry) => entry.id === item.sourceId);
            const title = item.title ?? content?.subtitle ?? content?.title;
            if (!title) return null;

            return {
                id: item.id ?? `${item.sourceType}:${item.sourceId}`,
                sourceType: item.sourceType,
                sourceId: item.sourceId,
                title,
                description: item.description ?? content?.description,
                image: item.image ?? content?.image,
                detailRoute: item.detailRoute ?? (content && source?.detailRoute?.(item.sourceId)),
                category: item.category,
                locationSlugs: item.locationSlugs,
                preferences: item.preferences,
                reservationStatus: item.reservationStatus,
                reservationRoute: item.reservationRoute,
                preferenceMatch: item.preferences.includes(preference),
                originalOrder: index,
            };
        })
        .filter(Boolean)
        .sort(
            (a, b) =>
                Number(b.preferenceMatch) - Number(a.preferenceMatch) ||
                a.originalOrder - b.originalOrder
        );
}
