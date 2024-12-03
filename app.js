// Main MapHandler Class that handles map initialization and marker operations
class MapHandler {
    constructor(containerId, center, zoom) {
        // Encapsulation: Initialize the map with the given container ID, center coordinates, and zoom level.
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer(); // Adds the tile layer to the map
        this.markers = []; // Array to store all markers added to the map
    }


    initTileLayer() {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map); // Add the tile layer to the map
    }


    addMarker(lat, long, message, imageUrl, description) {
        const popupContent = `
            <div style="text-align: center;">
                <h5>${message}</h5>
                <img src="${imageUrl}" alt="${message}" style="width: 150px; height: auto; margin-bottom: 10px;"/>
                <p>${description}</p>
            </div>
        `;

        // Create and add the marker with the given coordinates and popup content
        const marker = L.marker([lat, long])
            .addTo(this.map)
            .bindPopup(popupContent); // Bind the popup to the marker

        this.markers.push(marker); // Add marker to the list of markers
        return marker; // Return the created marker
    }

    // Abstraction: Load markers from a JSON file URL (Hide the complexity of fetching and processing data)
    loadMarkersFromJson(url) {
        fetch(url) // Fetch data from the provided URL
            .then(response => response.json()) // Parse the response as JSON
            .then(data => {
                // Iterate through the data and add each marker to the map
                data.forEach(marker => {
                    this.addMarker(marker.latitude, marker.longitude, marker.message, marker.imageUrl, marker.description);
                });
            })
            .catch(error => console.error("Error Loading markers:", error)); // Log any errors during fetching
    }
}

// EcoTech Class that extends MapHandler with hazard tree-specific functionality
class EcoTech extends MapHandler {
    constructor(containerId, center, zoom) {
        super(containerId, center, zoom); // Inheritance: Call the parent constructor to initialize the map
        this.hazardTreeIcon = this.HazardTreeIcon(); // Custom icon for hazard trees
        this.treeData = []; // Store the tree data loaded from JSON
    }


    HazardTreeIcon() {
        return L.icon({
            iconUrl: 'assets/hazard_tree.png', // URL of the icon image
            iconSize: [32, 32], // Size of the icon
            iconAnchor: [16, 32], // Position of the icon anchor point
            popupAnchor: [0, -32] // Position of the popup relative to the icon
        });
    }

    // Polymorphism: Override the addMarker function to use the hazard tree icon (different marker icon)
    addMarker(lat, long, message, imageUrl, description) {
        const popupContent = `
            <div style="text-align: center;">
                <h5>${message}</h5>
                <img src="${imageUrl}" alt="${message}" style="width: 150px; height: auto; margin-bottom: 10px;"/>
                <p>${description}</p>
            </div>
        `;

        // Create and add the marker using the custom hazard tree icon
        const marker = L.marker([lat, long], { icon: this.hazardTreeIcon })
            .addTo(this.map)
            .bindPopup(popupContent); // Bind the popup to the marker

        this.markers.push(marker); // Add the marker to the list of markers
        return marker; // Return the created marker
    }


    createHazardTreeList(data) {
        const listContainer = document.getElementById("hazard-tree-items");
        listContainer.innerHTML = ''; // Clear the current list

        data.forEach((tree, index) => {
            const listItem = document.createElement("li");

            // Create an image for the tree in the list
            const treeImage = document.createElement("img");
            treeImage.src = tree.imageUrl;
            treeImage.alt = tree.message;
            treeImage.style.width = '50px';
            treeImage.style.height = '50px';
            treeImage.style.marginRight = '10px';
            treeImage.style.borderRadius = '5px';

            // Create text container for the tree's message and description
            const textContainer = document.createElement("div");
            textContainer.style.display = "inline-block";
            textContainer.innerHTML = `
                <strong>${tree.message}</strong><br/>
                <small>${tree.description}</small>
            `;

            // Append the image and text to the list item
            listItem.appendChild(treeImage);
            listItem.appendChild(textContainer);
            listItem.style.cursor = "pointer"; // Add a cursor pointer for interactivity

            // Add click event to fly to the tree's marker on the map
            listItem.addEventListener("click", () => {
                this.map.flyTo([tree.latitude, tree.longitude], 18, {
                    duration: 2 // Smooth transition to the tree's marker
                });
                this.markers[index].openPopup(); // Open the marker's popup
            });

            // Append the list item to the list container
            listContainer.appendChild(listItem);
        });
    }

    // Abstraction: Load markers and the list of hazard trees from JSON (simplify data processing and display)
    loadMarkersAndListFromJson(url) {
        fetch(url) // Fetch data from the URL
            .then(response => response.json()) // Parse the response as JSON
            .then(data => {
                this.treeData = data; // Store the data in treeData array
                data.forEach(tree => {
                    // Add markers for each tree on the map
                    this.addMarker(tree.latitude, tree.longitude, tree.message, tree.imageUrl, tree.description);
                });
                // Create the hazard tree list in the sidebar
                this.createHazardTreeList(data);
                // Setup search functionality
                this.setupSearch();  
            })
            .catch(error => console.error("Error Loading markers:", error)); // Log any errors during fetching
    }


    setupSearch() {
        const searchInput = document.getElementById('studentSearchBar');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase(); // Get the search term in lowercase
            this.filterTreeList(searchTerm); // Call the filter function
        });
    }

    // Polymorphism: Filter the list of trees based on the search term (modify existing list based on input)
    filterTreeList(searchTerm) {
        const listContainer = document.getElementById("hazard-tree-items");
        const filteredData = this.treeData.filter(tree => {
            return tree.message.toLowerCase().includes(searchTerm) || tree.description.toLowerCase().includes(searchTerm);
        });

        listContainer.innerHTML = ''; // Clear the current list
        // Re-create the list with the filtered data
        this.createHazardTreeList(filteredData);

        // Remove existing markers and add only the filtered markers to the map
        this.markers.forEach(marker => marker.remove());
        filteredData.forEach(tree => {
            this.addMarker(tree.latitude, tree.longitude, tree.message, tree.imageUrl, tree.description);
        });
    }
}

// Instantiate the EcoTech class and load markers and list from a JSON file
const myMap = new EcoTech('map', [8.359735, 124.869206], 6);
myMap.loadMarkersAndListFromJson('app.json');

