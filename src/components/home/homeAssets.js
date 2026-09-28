const assetModules = import.meta.glob('./assets/*', {
    eager: true,
    query: '?url',
    import: 'default',
});

const assets = Object.fromEntries(
    Object.entries(assetModules).map(([path, url]) => [path.split('/').pop(), url])
);

export function homeAsset(name) {
    const url = assets[name];
    if (!url) throw new Error(`Missing home asset: ${name}`);
    return url;
}
