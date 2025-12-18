maptilersdk.config.apiKey = maptilerApiKey;

/* Preprocess campgrounds to reduce payload and speed up rendering */
const minimalCampgrounds = {
    type: 'FeatureCollection',
    features: campgrounds.features.map(f => ({
        type: 'Feature',
        geometry: f.geometry,
        properties: { popUpMarkup: f.properties.popUpMarkup }
    }))
};

const map = new maptilersdk.Map({
    container: 'cluster-map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: [24.9916, -28.4793], // fallback center
    zoom: 5
});

map.on('load', () => {
    map.addSource('campgrounds', {
        type: 'geojson',
        data: minimalCampgrounds,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 40
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#00BCD4', 10,
                '#2196F3', 30,
                '#3F51B5'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15, 10,
                20, 30,
                25
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgrounds',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    /* Autofocus on all campground points after tiles are ready */
    map.on('idle', () => {
        if (!minimalCampgrounds.features.length) return;

        const bounds = new maptilersdk.LngLatBounds();
        minimalCampgrounds.features.forEach(f =>
            bounds.extend(f.geometry.coordinates)
        );

        map.fitBounds(bounds, {
            padding: 60,
            maxZoom: 9,   // prevents zooming into a single campsite
            duration: 800
        });
    });

    /* Cluster zoom */
    map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties.cluster_id;
        const zoom = await map.getSource('campgrounds').getClusterExpansionZoom(clusterId);

        map.easeTo({
            center: features[0].geometry.coordinates,
            zoom
        });
    });

    /* Popup for unclustered points */
    map.on('click', 'unclustered-point', (e) => {
        const { popUpMarkup } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maptilersdk.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpMarkup)
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', 'clusters', () => map.getCanvas().style.cursor = '');
});


