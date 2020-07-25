/**
 * Create close button for expanding info box.
 */
function createCloseButtonElement() {
  const buttonElement = document.createElement('button');
  buttonElement.innerText = 'Close';
  buttonElement.onclick = function() { closeInfo(); };
  buttonElement.className = 'misc-button';
  return buttonElement;
}

/**
 * Creates a map and adds it to the page.
 */
function createMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    // center: {lat: 37.412177, lng: -121.959926},
    center : {lat : 37.39, lng : -121.945},
    zoom : 13,
  });
  const GRTStartMarker = new google.maps.Marker({
    position : {lat : 37.423404, lng : -121.975947},
    map : map,
    title : 'Guadalupe River Trail start',
  });

  const GRTBridgeMarker = new google.maps.Marker({
    position : {lat : 37.40097, lng : -121.94195},
    map : map,
    title : 'Guadalupe River Trail bridge',
  });

  const GRTAirportMarker = new google.maps.Marker({
    position : {lat : 37.3545, lng : -121.91279},
    map : map,
    title : 'Guadalupe River Trail airport terminus',
  });

  GRTStartMarker.addListener('click', function() {
    closeInfo();
    if (window.innerWidth >= 1600) {
      document.getElementById('map').style.width = '50%';
    }
    const mapInfoContainer = document.getElementById('half-content-container');
    mapInfoContainer.innerHTML =
        '<a href="/images/IMG_2686.jpg">' +
        '<img src="/images/IMG_2686.jpg" style="width: 100%" /></a>';
    mapInfoContainer.appendChild(createPElement(
        'Me at the start of the trail! I ride here frequently.'));
    mapInfoContainer.appendChild(createPElement(
        'The bike is a white Poseidon Expressway-SXL, a flat bar ' +
        'road bike with fixed gears (46T/16T gear ratio), ' +
        'a 6061 aluminum frame, and 700x25mm tires.'));
    mapInfoContainer.appendChild(createCloseButtonElement());
  });

  GRTBridgeMarker.addListener('click', function() {
    closeInfo();
    if (window.innerWidth >= 1600) {
      document.getElementById('map').style.width = '50%';
    }
    const mapInfoContainer = document.getElementById('half-content-container');
    mapInfoContainer.innerHTML =
        '<a href="/images/IMG_2744.jpg">' +
        '<img src="/images/IMG_2744.jpg" style="width: 100%" /></a>';
    mapInfoContainer.appendChild(
        createPElement('River Oaks Bridge across the Guadalupe River ' +
                       'connecting the lower and upper trails.'));
    mapInfoContainer.appendChild(createCloseButtonElement());
  });

  GRTAirportMarker.addListener('click', function() {
    closeInfo();
    if (window.innerWidth >= 1600) {
      document.getElementById('map').style.width = '50%';
    }
    const mapInfoContainer = document.getElementById('half-content-container');
    mapInfoContainer.innerHTML =
        '<a href="/images/IMG_2751.jpg">' +
        '<img src="/images/IMG_2751.jpg" style="width: 100%" /></a>';
    mapInfoContainer.appendChild(
        createPElement('The trail passes right next to Mineta San Jose ' +
                       'International Airport!'));
    mapInfoContainer.appendChild(createCloseButtonElement());
  });

  const GRTPath = new google.maps.Polyline({
    path : GRTCoordinates,
    geodesic : true,
    strokeColor : '#FF0000',
    strokeOpacity : 1.0,
    strokeWeight : 2,
  });

  GRTPath.setMap(map);
}

function closeInfo() {
  document.getElementById('half-content-container').innerHTML = '';
  document.getElementById('map').style.width = '100%';
}

// Holds the current indices of both slideshows
let curShowIdxs = [ 0, 0 ];

/**
 * Change picture for either slideshow.
 */
function changeSlide(slideshowNum, direction) {
  const show = [
    [ 'IMG_8732.jpg', 'IMG_8795.jpg', 'IMG_8819.jpg' ],
    [ 'IMG_2715.jpg', 'IMG_2718.jpg', 'IMG_2722.jpg' ],
  ];
  curShowIdxs[slideshowNum] =
      (((curShowIdxs[slideshowNum] + direction) % 3) + 3) % 3;
  const img = '/images/' + show[slideshowNum][curShowIdxs[slideshowNum]];
  if (!slideshowNum) {
    document.getElementById('show0').src = img;
    document.getElementById('show0-link').href = img;
  } else {
    document.getElementById('show1').src = img;
    document.getElementById('show1-link').href = img;
  }
}

window.addEventListener('resize', function() {
  if (window.innerWidth < 1600) {
    document.getElementById('map').style.width = '100%';
  } else if (document.getElementById('half-content-container').innerHTML !==
             '') {
    document.getElementById('map').style.width = '50%';
  }
});