const map = L.map('map').setView([45.406, 11.88], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const toggleBtn = document.getElementById('toggle-list');
const lista = document.getElementById('lista');

toggleBtn.addEventListener('click', () => {
  lista.classList.toggle('open');
});

fetch('clienti_padova.json')
    .then(response => {
        if (!response.ok) {
        throw new Error('Impossibile caricare clienti_padova.json');
        }
        return response.json();
    })
    .then(data => {
        data.forEach((cliente, index) => {
        const lat = cliente.LatLng[0];
        const lon = cliente.LatLng[1];

            
            const wazeUrl = `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;

            const marker = L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`
                <strong>${cliente.Nome}</strong><br>
                Indirizzo: ${cliente.Indirizzo}<br><br>
                <a href="${wazeUrl}" target="_blank" style="display:inline-block;padding:6px 12px;background:#00d4ff;color:#000;border-radius:4px;text-decoration:none;font-weight:bold;">🚗 Naviga con Waze</a>
            `);

            
            const li = document.createElement('li');
            li.textContent = cliente.Nome;
            li.dataset.lat = lat;
            li.dataset.lon = lon;
            li.addEventListener('click', () => {
            map.flyTo([lat, lon], 15);
            marker.openPopup();
            window.open(wazeUrl, '_blank');
            });
            document.getElementById('company-list').appendChild(li);
        });
    })
    .catch(err => {
      console.error('Errore nel caricamento dei dati JSON:', err);
      alert('Errore nel caricamento dei dati. Controlla che il file clienti_padova.json sia nella stessa cartella e che il server funzioni.');
    });
    