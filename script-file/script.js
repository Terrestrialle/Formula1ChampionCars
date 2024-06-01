document.addEventListener("DOMContentLoaded", () => {
  const carList = document.getElementById("car-list");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
  const eraSelect = document.getElementById("era-select");
  const wdcFilter = document.getElementById("wdc-filter");
  const wccFilter = document.getElementById("wcc-filter");
  const showAllFilter = document.getElementById("show-all-filter");
  const loader = document.querySelector(".loader");
  loader.classList.add("loader-hidden");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add animation class
            entry.target.classList.add('show');
            entry.target.classList.add('animate__fadeInDown');
        } else{
          entry.target.classList.remove('show');
          entry.target.classList.remove('animate__fadeInDown');
        }
    });
  });
  const hiddenElements = document.querySelectorAll(".hidden");
  hiddenElements.forEach((el) => observer.observe(el));


  class Car {
    static showDescription() {
      const descriptionBox = document.getElementById("description-box");
      document.getElementById('overlay').style.display = 'block';
      document.body.classList.add('no-scroll');
      descriptionBox.style.transition = '0.3s ease-in-out';
      descriptionBox.style.display = 'block';
    }

    static closeDescription() {
      const descriptionBox = document.getElementById("description-box");
      document.getElementById('overlay').style.display = 'none';
      descriptionBox.style.transition = '0.3s ease-in-out';
      descriptionBox.style.display = 'none';
      document.body.classList.remove('no-scroll');
    }
  }

  window.Car = Car; // Ensure Car class is globally accessible

  class MoreSetting {
    static toggleSetting() {
        const moreSett = document.getElementById("more-setting");
        const sortContainers = document.getElementsByClassName("sort-contain");
        const filterPlace = document.getElementById("filter-place");
        const checkboxContainers = document.getElementsByClassName("checkbox-container");

        if (moreSett.textContent.includes("More Setting")) {
            // Hide elements
            for (let container of sortContainers) {
                container.style.display = "none";
            }
            filterPlace.style.display = "none";
            for (let container of checkboxContainers) {
                container.style.display = "none";
            }
            moreSett.textContent = "Less Setting ▲";
        } else {
            // Show elements
            for (let container of sortContainers) {
                container.style.display = "flex";
            }
            filterPlace.style.display = "flex";
            for (let container of checkboxContainers) {
                container.style.display = "flex";
            }
            moreSett.textContent = "More Setting ▼";
        }
    }
}

// Attach the event listener to the paragraph element
document.getElementById("more-setting").onclick = MoreSetting.toggleSetting;
  

  function filterCars() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedEra = eraSelect.value;
    const wdcChecked = wdcFilter.checked;
    const wccChecked = wccFilter.checked;
    const showAllChecked = showAllFilter.checked;

    const carCards = carList.getElementsByClassName('car-card');

    for (let carCard of carCards) {
        const carYear = parseInt(carCard.getAttribute('data-year'), 10);
        const carWDC = carCard.getAttribute('data-wdc') === 'true';
        const carWCC = carCard.getAttribute('data-wcc') === 'true';
        const carName = carCard.getAttribute('data-name').toLowerCase();

        let isVisible = true;

        // Era filter
        if (selectedEra !== 'all') {
            const [startYear, endYear] = selectedEra.split('-').map(Number);
            if (carYear < startYear || carYear > endYear) {
                isVisible = false;
            }
        }

        // Show All filter
        if (!showAllChecked) {
            // WDC filter
            if (wdcChecked && !carWDC) {
                isVisible = false;
            }
            // WCC filter
            if (wccChecked && !carWCC) {
                isVisible = false;
            }
        }

        // Search term filter
        if (searchTerm && !carName.includes(searchTerm)) {
            isVisible = false;
        }

        // Apply visibility
        carCard.style.display = isVisible ? 'block' : 'none';
    }
}


  function sortBy(attribute, isNumeric = false) {
    const carCards = Array.from(carList.getElementsByClassName('car-card'));
    carCards.sort((a, b) => {
      const aValue = a.getAttribute(`data-${attribute}`);
      const bValue = b.getAttribute(`data-${attribute}`);
      return isNumeric ? aValue - bValue : aValue.localeCompare(bValue);
    });
    updateCarList(carCards);
  }

  function updateCarList(sortedCarCards) {
    carList.innerHTML = '';
    sortedCarCards.forEach(carCard => carList.appendChild(carCard));
  }

  searchInput.addEventListener('input', filterCars);
  eraSelect.addEventListener('change', filterCars);
  wdcFilter.addEventListener('change', filterCars);
  wccFilter.addEventListener('change', filterCars);
  showAllFilter.addEventListener('change', filterCars);

  sortSelect.addEventListener('change', (e) => {
    const sortByValue = e.target.value;
    switch (sortByValue) {
      case 'name':
        sortBy('name');
        break;
      case 'year':
        sortBy('year', true);
        break;
      case 'constructorPoints':
        sortBy('constructorPoints', true);
        break;
    }
  });

  championshipCars.forEach(({ name, year, team, engineName, engineConfig, compressor, engineDisplacement, 
    enginePower, transmission, tyres, chasis, weight, drivers, constructorPoints, isWDC, isWCC, image}) => {
    
    console.log(`Car: ${name}, isWDC: ${isWDC}, isWCC: ${isWCC}`);
    const carCard = document.createElement('div');
    carCard.className = 'car-card';
    carCard.setAttribute('data-name', name.toLowerCase());
    carCard.setAttribute('data-year', year);
    carCard.setAttribute('data-constructorPoints', constructorPoints);
    carCard.setAttribute('data-wdc', isWDC);
    carCard.setAttribute('data-wcc', isWCC);

    const wdcClass = isWDC ? 'wdc-true' : '';
    const wccClass = isWCC ? 'wcc-true' : '';

    carCard.innerHTML = `
      <img src="${image}" alt="${name}">
      <div class="car-card-text">
        <h2>${name}</h2>
        <div class="team-wrapper">
          <h3>${team}</h3>
          <div>
            <h4 class="WDC ${wdcClass}">WDC</h4>
            <h4 class="WCC ${wccClass}">WCC</h4>
          </div>
        </div>
        <div class="car-card-p">
          <p>${drivers.join(', ')}</p>
          <p>${year}</p>
          <p>Constructor points: ${constructorPoints}</p>
        </div>
      </div>
    `;
    // Add click event listener to show description
    carCard.addEventListener('click', () => {
      const descBox = document.getElementById("description-content");
      const descTitle = document.getElementById("desc-title");
      descTitle.textContent = `${name}`;
      descBox.innerHTML =`
      <img class="desc-image hidden animate__animated animate__fadeIn" src="${image}" alt="${name}">
      <div class="desc-text hidden animate__animated animate__fadeInUp">
        <p><span class="label">Car name</span><span class="value">${name}</span></p>
        <p><span class="label">Team</span><span class="value">${team}</span></p>
        <p><span class="label">Year</span><span class="value">${year}</span></p>
        <p><span class="label">Engine name</span><span class="value">${engineName}</span></p>
        <p><span class="label">Configuration</span><span class="value">${engineConfig}</span></p>
        <p><span class="label">Compressor</span><span class="value">${compressor}</span></p>
        <p><span class="label">Displacement</span><span class="value">${engineDisplacement}</span></p>
        <p><span class="label">Power</span><span class="value">${enginePower}</span></p>
        <p><span class="label">Transmission</span><span class="value">${transmission}</span></p>
        <p><span class="label">Chasis</span><span class="value">${chasis}</span></p>
        <p><span class="label">Weight</span><span class="value">${weight}</span></p>
        <p><span class="label">Tyres</span><span class="value">${tyres}</span></p>
        <p><span class="label">Drivers</span><span class="value">${drivers.join(`, `)}</span></p>
        <p><span class="label">Points</span><span class="value">${constructorPoints}</span></p>
      </div>
      `;
      Car.showDescription();
    });

    carList.appendChild(carCard);
  });

  // Initial filter and sort
  filterCars();
  sortBy('year', true);
  document.getElementById('overlay').addEventListener('click', closeDescriptionBox);
});
