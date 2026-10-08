import { reservationDrivePrograms } from '../data/driveReservations.js';
import { exhibitionReservations } from '../data/exhibitionReservations.js';
import { programReservations } from '../data/programReservations.js';
import {
    experienceFinderExhibitions,
    experienceFinderPrograms,
    experienceFinderRecommendationGroups,
    experienceFinderSourcePreferences,
    experienceTypeCategories,
} from '../data/experienceFinder.js';
import { paths } from '../router/routePaths.js';

const locationSlugs = { '고양': 'goyang', '서울': 'seoul', '하남': 'hanam', '부산': 'busan' };

const mappedSources = [
    ...experienceFinderExhibitions.flatMap((item) => {
        const location = exhibitionReservations[item.locationSlug] ?? [];
        const content = location.find((entry) => entry.id === item.representativeId);
        if (!content) return [];

        return [{
            sourceType: 'reservationExhibition',
            sourceId: content.id,
            sourceIds: item.memberIds.map((id) => `reservationExhibition:${item.locationSlug}:${id}`),
            id: `reservationExhibition:${item.locationSlug}:${content.id}`,
            category: item.category,
            locationSlugs: [item.locationSlug],
            preferences: item.preferences,
            title: content.title,
            description: content.description,
            image: content.image,
            detailRoute: paths.exhibitionReservation,
        }];
    }),
    ...experienceFinderPrograms.flatMap((item) => {
        const content = (programReservations[item.locationSlug] ?? [])
            .find((entry) => entry.id === item.representativeId);
        if (!content) return [];

        return [{
            sourceType: 'programReservation',
            sourceId: content.id,
            sourceIds: item.memberIds.map((id) => `programReservation:${item.locationSlug}:${id}`),
            id: `programReservation:${item.locationSlug}:${content.id}`,
            category: 'program',
            locationSlugs: [item.locationSlug],
            preferences: item.preferences,
            title: item.title ?? content.title,
            description: content.description,
            image: content.image,
            detailRoute: paths.programReservation,
        }];
    }),
    ...reservationDrivePrograms.flatMap((program) => program.locations.map((item) => {
        const locationSlug = locationSlugs[item.location];
        return locationSlug && {
            sourceType: 'driveReservation',
            sourceId: item.id,
            id: `driveReservation:${locationSlug}:${item.id}`,
            category: 'testDrive',
            locationSlugs: [locationSlug],
            preferences: experienceFinderSourcePreferences.driveReservations[item.id] || [],
            title: item.title,
            description: item.description,
            image: item.image,
            detailRoute: paths.reservations,
        };
    })),
].filter(Boolean);

const recommendationGroupByMember = new Map(
    experienceFinderRecommendationGroups.flatMap((group) =>
        group.members.map((member) => [member, group])
    )
);

const recommendationSources = (() => {
    const groupedSources = [];
    const emittedGroups = new Set();

    for (const source of mappedSources) {
        const sourceLocation = source.locationSlugs[0];
        const sourceKey = `${source.sourceType}:${sourceLocation}:${source.sourceId}`;
        const group = recommendationGroupByMember.get(sourceKey);

        if (!group) {
            groupedSources.push(source);
            continue;
        }

        if (emittedGroups.has(group.id)) continue;
        emittedGroups.add(group.id);

        const groupSources = mappedSources.filter((candidate) => {
            const candidateKey = `${candidate.sourceType}:${candidate.locationSlugs[0]}:${candidate.sourceId}`;
            return group.members.includes(candidateKey);
        });
        const representative = groupSources.find((candidate) => {
            const candidateKey = `${candidate.sourceType}:${candidate.locationSlugs[0]}:${candidate.sourceId}`;
            return candidateKey === group.representative;
        }) || groupSources[0] || source;

        groupedSources.push({
            ...representative,
            id: `experienceFinder:${group.id}`,
            locationSlugs: [...new Set(groupSources.flatMap((item) => item.locationSlugs))],
            preferences: [...new Set(groupSources.flatMap((item) => item.preferences))],
            sourceIds: groupSources.map((item) => `${item.sourceType}:${item.locationSlugs[0]}:${item.sourceId}`),
        });
    }

    return groupedSources;
})();

export function getExperienceRecommendations({ experienceType, location, preference }) {
    const categories = experienceTypeCategories[experienceType];
    if (!categories || !location) return [];

    return recommendationSources
        .filter((item) => categories.includes(item.category))
        .filter((item) => location === 'all' || item.locationSlugs.includes(location))
        .map((item, index) => ({
            ...item,
            locationSlugs: location === 'all' ? item.locationSlugs : [location],
            preferenceMatch: item.preferences.includes(preference),
            originalOrder: index,
        }))
        .sort(
            (a, b) =>
                Number(b.preferenceMatch) - Number(a.preferenceMatch) ||
                a.originalOrder - b.originalOrder
        );
}
