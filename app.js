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
    
}
const Mymap = new EcoTech('map', [8.359735, 124.869206], 18);