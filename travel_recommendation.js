const searchForm = document.querySelector('.search-form');
const clearBtn = document.querySelector('.clearBtn');
const recContainer = document.querySelector('.container-recommendations');
const resultsToDisplay = 4;

const getQuery = function () {
  const searchInput = searchForm.querySelector('#search');
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    alert('Please enter a destination or keyword');
    return;
  }
  searchInput.value = '';
  return query;
};

const findRecommendation = async function () {
  try {
    const query = getQuery();
    if (!query) return;
    const response = await fetch('travel_recommendation_api.json');
    const data = await response.json();
    const recommendations = [];
    Object.entries(data).forEach(([key, value]) => {
      if (key.includes(query)) {
        if (key === 'countries') {
          value.forEach((el) => {
            el.cities.forEach((city) => recommendations.push(city));
            return;
          });
        }
        value.forEach((el) => recommendations.push(el));
      } else {
        if (key === 'countries') {
          value.forEach((el) => {
            el.cities.forEach((city) => {
              if (
                city.name.toLowerCase().includes(query) ||
                city.description.toLowerCase().includes(query)
              ) {
                recommendations.push(city);
              }
            });
          });
        } else {
          value.forEach((el) => {
            if (
              el.name.toLowerCase().includes(query) ||
              el.description.toLowerCase().includes(query)
            ) {
              recommendations.push(el);
            }
          });
        }
      }
    });

    recommendations.splice(resultsToDisplay);
    return recommendations;
  } catch (error) {
    console.error(error);
  }
};

const clearRecommendations = function () {
  recContainer.innerHTML = '';
};

const displayRecommendation = function (recommendations) {
  if (recommendations.length === 0) {
    alert(
      'No recommendations to display. Please enter countries, temples or beaches'
    );
    return;
  }
  clearRecommendations();

  for (let i = 0; i < recommendations.length; i++) {
    const html = `
			<div class="recommendation">
				<div class="rec-img-container">
					<img class="rec-img" src="./images/${recommendations[i].imageUrl}" />
				</div>
				<div class="rec-info">
					<h3>${recommendations[i].name}</h3>
				<p>
					${recommendations[i].description}
				</p>
					<button>Visit</button>
				</div>
			</div>
		`;
    recContainer.insertAdjacentHTML('afterbegin', html);
  }
};

const recommendPlace = async function () {
  try {
    const recommendations = await findRecommendation();
    if (!recommendations) return;
    displayRecommendation(recommendations);
  } catch (error) {
    console.error(error);
  }
};

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  recommendPlace();
});

clearBtn.addEventListener('click', clearRecommendations);
