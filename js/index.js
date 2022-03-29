import "bootstrap/dist/js/bootstrap.bundle";
import "core-js/stable";
import "regenerator-runtime/runtime";

// Importing Icons
import instructionsIcon from "../icons/instructions.png";
import ingredientsIcon from "../icons/ingredients.png";
import errorIcon from "../icons/error.png";

// DOM Selections
const searchForm = document.querySelector("form");
const searchResultContainer = document.querySelector(
  ".search-result-container"
);
const modalBody = document.querySelector(".modal-body");
const baseUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=pizza`;

// Declaring Global Variables
let searchQuery = "";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to get the Meals
const getMeals = async () => {
  try {
    const baseUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;
    const response = await fetch(baseUrl);

    if (!response.ok)
      throw new Error(`Something Went Wrong ${response.status}`);

    const data = await response.json();

    if (data.meals === null) throw new Error(`No results found for your query`);

    generateSearchResults(data.meals);
  } catch (err) {
    console.error(`Something Went Wrong 🙁🙁🙁 ${err.message}, Try Again!`);
    renderMealsErrorMessage(
      `${err.message}, Try searching with some other keywords`
    );
  }
};

// Function to render Meals Search Result
const generateSearchResults = (results) => {
  let generatedCardHtml = "";
  results.map((result) => {
    generatedCardHtml += `
    <div class="col-lg-3 col-md-6 mb-3">
          <div class="card h-100" style="width: 100%">
            <img src="${result.strMealThumb}" class="card-img-top" alt="${result.strMeal}" />
            <div class="card-body meal-detail" meal-id=${result.idMeal}>
              <h5 class="card-title">${result.strMeal}</h5>
              <p class="card-text">
              Meal Type: <span class="text-success">${result.strArea}</span>
              </p>
              <a href="" class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#mealModal">View Meal</a>
            </div>
          </div>
        </div>
    `;
  });

  searchResultContainer.innerHTML = generatedCardHtml;
};

// Function to render Error Message for Meals Search Result
const renderMealsErrorMessage = function (msg) {
  const errorHtml = `
  <div class="col-lg-12 text-center">
    <img src="${errorIcon}" alt="error" />
    <p>${msg}</p>
  </div>
  `;

  searchResultContainer.innerHTML = errorHtml;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to get Meal By Id
const getMealById = async (mealID) => {
  try {
    const baseUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`;
    const response = await fetch(baseUrl);

    if (!response.ok)
      throw new Error(`Something Went Wrong ${response.status}`);

    const data = await response.json();

    if (!data) throw new Error(`No Data Found`);

    generateMealDetails(data.meals[0]);
  } catch (err) {
    console.error(`Something Went Wrong 🙁🙁🙁 ${err.message}, Try Again!`);
    renderMealErrorMessage(`${err.message}, Try Again!`);
  }
};

// Function to render Meal Details
const generateMealDetails = (result) => {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (result[`strIngredient${i}`]) {
      ingredients.push(
        `${result[`strIngredient${i}`]} - ${result[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  modalBody.innerHTML = `
  <section id="meal-info">
  <div class="container border meal-info-container mt-4 mb-4">
    <!-- Heading Container -->
    <div class="row border meal-heading-container text-center mb-3 p-3">
      <div class="col-lg-12">
        <img src="${result.strMealThumb}" alt="${
    result.strMeal
  }" class="meal-image" />
        <h5 class="mt-1">${result.strMeal}</h5>
      </div>
    </div>

    <!-- Instructions Container -->
    <div class="row border meal-instructions-container text-center mb-3 p-3">
      <div class="col-lg-12">
        <img src="${instructionsIcon}" alt="instructions" class="icon" />
        <h5>Instructions</h5>
        <p>${result.strInstructions}</p>
      </div>
    </div>

    <!-- Ingredients Container -->
    <div class="row border meal-ingredients-container text-center mb-3 p-3">
      <div class="col-lg-12">
        <img src="${ingredientsIcon}" alt="ingredients" class="icon" />
        <h5>Ingredients</h5>
      </div>
      ${ingredients
        .map((ing) => {
          return `<div class="col-lg-6 col-md-6">
                <p>${ing}</p>
                </div>`;
        })
        .join("")}
    </div>

    <!-- Watch Video Container -->
    <div class="row watch-video-container text-center mb-3 p-3">
      <div class="col-lg-12">
        <a href="${
          result.strYoutube
        }" target="_blank" class="btn btn-outline-warning">Watch Video</a>
      </div>
    </div>
  </div>
  </section>
  `;
};

// Function to render Error Message for Meal Details
const renderMealErrorMessage = (msg) => {
  const errorHtml = `
  <section id="error-info">
  <div class="container error-info-container mt-4 mb-4">
    <div class="row">
      <div class="col-lg-12 text-center">
        <img src="${errorIcon}" alt="error" />
        <p>${msg}</p>
      </div>
    </div>
  </div>
  </section>`;

  modalBody.innerHTML = errorHtml;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Event Listener to get the list of Meals
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = e.target.querySelector("input").value;

  getMeals();
});

// Event Listener to get a particular Meal Details
searchResultContainer.addEventListener("click", (e) => {
  e.preventDefault();

  const mealInfo = e.target.parentNode;
  let mealId = mealInfo.classList.contains("meal-detail")
    ? mealInfo.getAttribute("meal-id")
    : "";

  getMealById(mealId);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Current year for the Copyright
document.querySelector("#year").innerHTML = new Date().getFullYear();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
