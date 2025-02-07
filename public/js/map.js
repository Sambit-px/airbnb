mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/dark-v11', // Map style
  center: listing.geometry.coordinates, // Set to the listing coordinates
  zoom: 9, // Initial zoom
});

// Create the custom Airbnb-style marker with the Home Icon
const marker = new mapboxgl.Marker({
  element: createAirbnbStyleMarker(), // Custom marker element
})
  .setLngLat(listing.geometry.coordinates) // Set the coordinates of the marker
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`))
  .addTo(map);

// Function to create the custom Airbnb-style marker
function createAirbnbStyleMarker() {
  const element = document.createElement('div');
  
  // Style the div to create the circular marker like Airbnb's
  element.className = 'airbnb-marker'; 
  element.style.width = '70px'; // Size of the marker
  element.style.height = '70px';
  element.style.borderRadius = '50%'; // Circular background
  element.style.backgroundColor = '#FF5A5F'; // Airbnb's signature red color
  element.style.display = 'flex';
  element.style.alignItems = 'center';
  element.style.justifyContent = 'center';
  element.style.position = 'relative';
  element.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  element.style.cursor = 'pointer';
  
  // Create the Material Icon for the home icon
  const icon = document.createElement('span');
  icon.className = 'material-icons';  // Class for Google Material Icons
  icon.innerHTML = 'home';  // Use the 'home' icon
  icon.style.fontSize = '36px';  // Icon size
  icon.style.color = 'white';  // White icon color
  
  element.appendChild(icon);

  // Add the "pin" triangle at the bottom (for the tail of the marker)
  const pin = document.createElement('div');
  pin.style.position = 'absolute';
  pin.style.bottom = '0';
  pin.style.left = '50%';
  pin.style.transform = 'translateX(-50%)';
  pin.style.width = '0';
  pin.style.height = '0';
  pin.style.borderLeft = '10px solid transparent';
  pin.style.borderRight = '10px solid transparent';
  pin.style.borderTop = '15px solid #FF5A5F'; // Same color as the circular background
  element.appendChild(pin);

  return element;
}
