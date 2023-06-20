// Функция для получения информации о покемоне и обновления UI
async function getPokemonDetails(pokemonId, container) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`
    );
    const data = await response.json();

    let pokemonType = "";
    data.types.forEach((type) => {
      pokemonType += type.type.name + " ";
    });

    container.innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Type:</strong> ${pokemonType}</p>
      <p><strong>Height:</strong> ${data.height}</p>
      <p><strong>Weight:</strong> ${data.weight}</p>
      <img src="${data.sprites.front_default}" alt="${data.name}" />
    `;
  } catch (error) {
    console.log(error);
  }
}

// Функция для отображения списка покемонов
async function displayPokemonList(url, container) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    container.innerHTML = "";

    const pokemonList = data.results;
    pokemonList.forEach((pokemon) => {
      const listItem = document.createElement("li");
      listItem.textContent = pokemon.name;

      listItem.addEventListener("click", () => {
        getPokemonDetails(pokemon.name, container.nextElementSibling);
      });

      container.appendChild(listItem);
    });

    const nextUrl = data.next;
    const prevUrl = data.previous;

    const previousBtn = document.getElementById("previous");
    const nextBtn = document.getElementById("next");

    if (nextUrl !== null) {
      nextBtn.addEventListener("click", () => {
        displayPokemonList(nextUrl, container);
      });
      nextBtn.style.display = "block";
    } else {
      nextBtn.style.display = "none";
    }

    if (prevUrl !== null) {
      previousBtn.addEventListener("click", () => {
        displayPokemonList(prevUrl, container);
      });
      previousBtn.style.display = "block";
    } else {
      previousBtn.style.display = "none";
    }
  } catch (error) {
    console.log(error);
  }
}

// Получаем контейнер для отображения информации о покемонах
const pokemonDetailsContainer = document.getElementById(
  "pokemon-details-container"
);

// Получаем список покемонов из API и отображаем его
displayPokemonList(
  "https://pokeapi.co/api/v2/pokemon",
  document.getElementById("pokemon-list")
);

// Добавляем обработчики событий для кнопок "Previous" и "Next"
document.getElementById("previous").addEventListener("click", () => {
  displayPokemonList(
    document.getElementById("previous").dataset.url,
    document.getElementById("pokemon-list")
  );
});

document.getElementById("next").addEventListener("click", () => {
  displayPokemonList(
    document.getElementById("next").dataset.url,
    document.getElementById("pokemon-list")
  );
});
