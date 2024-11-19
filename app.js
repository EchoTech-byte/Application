class EcoTech{
    constructor(containerId, center, zoom){
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
    }
    initTileLayer() {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | EcoTech BSIT Second Year'
        }).addTo(this.map);
    }
   
    
       HazardTreeIcon() {
            return L.icon({
                iconUrl: 'assets/hazard_tree.png', 
                iconSize: [32, 32],
                iconAnchor: [16, 32], 
                popupAnchor: [0, -32] 
            });
        }
    
    
        addMarker(lat, long, message) {
            const marker = L.marker([lat, long], { icon: this.hazardTreeIcon })
                .addTo(this.map)
                .bindPopup(message);
        }
    

        loadMarkersFromJson(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    data.forEach(marker => {
                        this.addMarker(marker.latitude, marker.longitude, marker.message);
                    });
                })
                .catch(error => console.error("Error Loading markers:", error));
        }
    }
    
   
    const myMap = new EcoTech('map', [8.359735, 124.869206], 18);
    

    myMap.loadMarkersFromJson('app.json');
    