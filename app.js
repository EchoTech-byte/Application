class MapHandler {
    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
    }

    initTileLayer() {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    addMarker(lat, long, message, imageUrl, description) {
        const popupContent = `
            <div style="text-align: center;">
                <h5>${message}</h5>
                <img src="${imageUrl}" alt="${message}" style="width: 150px; height: auto; margin-bottom: 10px;"/>
                <p>${description}</p>
            </div>
        `;
        
        L.marker([lat, long])
            .addTo(this.map)
            .bindPopup(popupContent);
    }

    loadMarkersFromJson(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(marker => {
                    this.addMarker(marker.latitude, marker.longitude, marker.message, marker.imageUrl, marker.description);
                });
            })
            .catch(error => console.error("Error Loading markers:", error));
    }
}


class EcoTech extends MapHandler {
    constructor(containerId, center, zoom) {
        super(containerId, center, zoom);  
        this.hazardTreeIcon = this.HazardTreeIcon();  
    }

  
    HazardTreeIcon() {
        return L.icon({
            iconUrl: 'assets/hazard_tree.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
    }

   
    addMarker(lat, long, message, imageUrl, description) {
        const popupContent = `
            <div style="text-align: center;">
                <h5>${message}</h5>
                <img src="${imageUrl}" alt="${message}" style="width: 150px; height: auto; margin-bottom: 10px;"/>
                <p>${description}</p>
            </div>
        `;

        L.marker([lat, long], { icon: this.hazardTreeIcon })
            .addTo(this.map)
            .bindPopup(popupContent);
    }
}


const myMap = new EcoTech('map', [8.359735, 124.869206], 18);
myMap.loadMarkersFromJson('app.json');