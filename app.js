class MapHandler {
    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
        this.markers = [];
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

        const marker = L.marker([lat, long])
            .addTo(this.map)
            .bindPopup(popupContent);

        this.markers.push(marker);
        return marker;
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
        this.treeData = []; 
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

        const marker = L.marker([lat, long], { icon: this.hazardTreeIcon })
            .addTo(this.map)
            .bindPopup(popupContent);

        this.markers.push(marker);
        return marker;
    }

    createHazardTreeList(data) {
        const listContainer = document.getElementById("hazard-tree-items");
        listContainer.innerHTML = ''; 

        data.forEach((tree, index) => {
            const listItem = document.createElement("li");

            const treeImage = document.createElement("img");
            treeImage.src = tree.imageUrl;
            treeImage.alt = tree.message;
            treeImage.style.width = '50px';
            treeImage.style.height = '50px';
            treeImage.style.marginRight = '10px';
            treeImage.style.borderRadius = '5px';

            const textContainer = document.createElement("div");
            textContainer.style.display = "inline-block";
            textContainer.innerHTML = `
                <strong>${tree.message}</strong><br/>
                <small>${tree.description}</small>
            `;

            listItem.appendChild(treeImage);
            listItem.appendChild(textContainer);
            listItem.style.cursor = "pointer";

            listItem.addEventListener("click", () => {
                this.map.flyTo([tree.latitude, tree.longitude], 18, {
                    duration: 2 
                });
                this.markers[index].openPopup(); 
            });

            listContainer.appendChild(listItem);
        });
    }

    loadMarkersAndListFromJson(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.treeData = data;
                data.forEach(tree => {
                    this.addMarker(tree.latitude, tree.longitude, tree.message, tree.imageUrl, tree.description);
                });
                this.createHazardTreeList(data);
                this.setupSearch();  
            })
            .catch(error => console.error("Error Loading markers:", error));
    }

    setupSearch() {
        const searchInput = document.getElementById('studentSearchBar');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.filterTreeList(searchTerm);
        });
    }

    filterTreeList(searchTerm) {
        const listContainer = document.getElementById("hazard-tree-items");
        const filteredData = this.treeData.filter(tree => {
            return tree.message.toLowerCase().includes(searchTerm) || tree.description.toLowerCase().includes(searchTerm);
        });

    
        listContainer.innerHTML = '';
        this.createHazardTreeList(filteredData);
        

        this.markers.forEach(marker => marker.remove());
        filteredData.forEach(tree => {
            this.addMarker(tree.latitude, tree.longitude, tree.message, tree.imageUrl, tree.description);
        });
    }
}


const myMap = new EcoTech('map', [8.359735, 124.869206], 6);
myMap.loadMarkersAndListFromJson('app.json');
