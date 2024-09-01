const GEO_LOCATION_API_KEY = "6fb574fd227442b59ebee7499085e702";
let map;

async function getIpAddressInfo(ipAddrress) {
  const ipInfo = await fetch(
    `https://api.ipgeolocation.io/ipgeo?apiKey=${GEO_LOCATION_API_KEY}&ip=${ipAddrress}`
  );
  return ipInfo.json();
}

function displayIpInfo({ ip, country_name, organization, time_zone, city }) {
  document.querySelector(".search-result")?.remove();
  const infoContainer = document
    .querySelector("#search-result-template")
    .content.cloneNode(true);
  infoContainer.querySelector(".ip-address p").textContent = ip;
  infoContainer.querySelector(
    ".location p"
  ).textContent = `${city}, ${country_name}`;
  infoContainer.querySelector(".isp p").textContent = organization;

  infoContainer.querySelector(
    ".timezone p"
  ).textContent = `UTC ${time_zone.offset}`;

  document.querySelector(".search-bar").appendChild(infoContainer);
}

function focusMap({ latitude, longitude }) {
  if (!map) {
    map = L.map("map").setView([latitude, longitude], 13);
  } else {
    map.setView([latitude, longitude], 13);
  }

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.marker([latitude, longitude]).addTo(map);
}

window.addEventListener("DOMContentLoaded", async () => {
  const info = await getIpAddressInfo("");
  focusMap(info);
  displayIpInfo(info);

  document
    .querySelector(".search-button")
    .addEventListener("click", async () => {
      const text = document.querySelector(".input-search").value;
      const response = await getIpAddressInfo(text);
      focusMap(response);
      displayIpInfo(response);
    });
});
