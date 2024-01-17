const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const pokemonData = document.querySelector('.pokemon__data');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonName = document.querySelector('.btn-name');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const buttonBio = document.querySelector('.btn-bio');
const buttonType = document.querySelector('.btn-type');
const buttonSize = document.querySelector('.btn-size');
const buttonGen = document.querySelector('.btn-gen');
const buttonAbility = document.querySelector('.btn-ability');

let searchPokemon = 1;

const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
};

const renderPokemonInfo = (name, number) => {
  pokemonName.innerHTML = name;
  pokemonNumber.innerHTML = number;
  input.value = '';
  searchPokemon = number;
};

const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';

  const data = await fetchPokemon(pokemon);

  if (data) {
    pokemonImage.style.display = 'block';
    renderPokemonInfo(data.name, data.id);
    pokemonImage.src = data.sprites.front_default;
  } else {
    pokemonImage.style.display = 'none';
    renderPokemonInfo('Not found', '');
  }
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

// buttonNext.addEventListener('click', () => {
//   searchPokemon += 1;
//   renderPokemon(searchPokemon);
// });

buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  fetchPokemon(searchPokemon).then((data) => {
    if (data) {
      renderPokemon(data.id);
    }
  });
});


document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    buttonPrev.click();
  } else if (event.key === 'ArrowRight') {
    buttonNext.click();
  }
});

const fetchFlavorTextForPokemon = async (pokemonId) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
  if (response.status === 200) {
    const data = await response.json();
    const selectedFlavorTextEntry = data.flavor_text_entries.find(entry => entry.language.name === 'en');
    if (selectedFlavorTextEntry) {
      const flavorText = selectedFlavorTextEntry.flavor_text;
      return flavorText;
    }
  }
  throw new Error('Bio not found');
};

buttonBio.addEventListener('click', () => {
  fetchFlavorTextForPokemon(searchPokemon)
    .then((flavorText) => {
      pokemonData.innerHTML = `${flavorText}`;
    })
    .catch((error) => {
      console.error(error);
      pokemonData.textContent = 'Bio not available';
    });
});

const fetchPokemonTypes = async (pokemonId) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  
  if (response.status === 200) {
    const data = await response.json();
    const types = data.types.map((type) => type.type.name);
    return types;
  }

  throw new Error('Types not found');
};

buttonType.addEventListener('click', () => {
  fetchPokemonTypes(searchPokemon)
    .then((types) => {
      const typeString = types.join(', ');
      pokemonData.innerHTML = `Types: ${typeString}`;
    })
    .catch((error) => {
      console.error(error);
      pokemonData.textContent = 'Types not available';
    });
});

// buttonName.addEventListener('click', () => {
//   fetchPokemon(searchPokemon).then((data) => {
//     if (data) {
//       renderPokemonInfo(data.name, data.id);
//       pokemonImage.src = data.sprites.front_default;
//     }
//   });
// });

buttonName.addEventListener('click', () => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${searchPokemon}/`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Failed to fetch Pokémon data');
      }
    })
    .then((data) => {
      if (data) {
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        input.value = '';
        searchPokemon = data.id;
        pokemonImage.src = data.sprites.front_default;
      }
    })
    .catch((error) => {
      console.error(error);
      pokemonName.innerHTML = 'Not found';
      pokemonNumber.innerHTML = '';
    });
});



buttonSize.addEventListener('click', () => {
  fetchPokemonSize(searchPokemon);
});

function fetchPokemonSize(pokemonId) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch size data');
      }
      return response.json();
    })
    .then((sizeData) => {
      const heightDecimetres = sizeData.height;
      const weightHectograms = sizeData.weight;
      const heightInMeters = heightDecimetres / 10;
      const weightInKilograms = weightHectograms / 10;
      const heightAndWeightText = `Height: ${heightInMeters} m / Weight: ${weightInKilograms} kg (dm: ${heightDecimetres}, hg: ${weightHectograms})`;
      pokemonData.innerHTML = heightAndWeightText;
    })
    .catch((error) => {
      console.error('Error:', error);
      pokemonData.innerHTML = 'Failed to fetch size data';
    });
}


buttonGen.addEventListener('click', () => {
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${searchPokemon}`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Failed to fetch species data');
      }
    })
    .then((speciesData) => {
      const generation = speciesData.generation.name;
      pokemonData.innerHTML = `Generation: ${generation}`;
    })
    .catch((error) => {
      console.error(error);
      pokemonData.innerHTML = 'Generation information not available';
    });
});

buttonAbility.addEventListener('click', () => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${searchPokemon}`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Failed to fetch Pokemon data');
      }
    })
    .then((pokemonData) => {
      // Check if the Pokemon data contains ability information
      if (pokemonData.abilities && pokemonData.abilities.length > 0) {
        const abilityURL = pokemonData.abilities[0].ability.url;
        return fetch(abilityURL);
      } else {
        throw new Error('No ability information available');
      }
    })
    .then((abilityResponse) => {
      if (abilityResponse.status === 200) {
        return abilityResponse.json();
      } else {
        throw new Error('Failed to fetch ability data');
      }
    })
    .then((abilityData) => {
      const abilityName = abilityData.name;
      const flavorTextEntries = abilityData.effect_entries.find((entry) => entry.language.name === 'en');
      if (flavorTextEntries) {
        const flavorText = flavorTextEntries.effect;
        pokemonData.innerHTML = `${abilityName.toUpperCase()}: ${flavorText}`;
      } else {
        throw new Error('No flavor text available for the ability');
      }
    })
    .catch((error) => {
      console.error(error);
      pokemonData.innerHTML = 'Ability flavor text not available';
    });
});

function appendTextToContainer(container, text) {
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  container.appendChild(paragraph);
}


renderPokemon(searchPokemon);
