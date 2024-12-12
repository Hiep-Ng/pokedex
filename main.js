console.log('connected');

function randomID() {
    return Math.floor(Math.random() * 1010) + 1;
}

// Map Pokémon types to radial gradient backgrounds
const typeGradients = {
    normal: "radial-gradient(circle at 50% 0%, #A8A77A 36%, #ffffff 36%)",
    fire: "radial-gradient(circle at 50% 0%, #EE8130 36%, #ffffff 36%)",
    water: "radial-gradient(circle at 50% 0%, #6390F0 36%, #ffffff 36%)",
    electric: "radial-gradient(circle at 50% 0%, #F7D02C 36%, #ffffff 36%)",
    grass: "radial-gradient(circle at 50% 0%, #7AC74C 36%, #ffffff 36%)",
    ice: "radial-gradient(circle at 50% 0%, #96D9D6 36%, #ffffff 36%)",
    fighting: "radial-gradient(circle at 50% 0%, #C22E28 36%, #ffffff 36%)",
    poison: "radial-gradient(circle at 50% 0%, #A33EA1 36%, #ffffff 36%)",
    ground: "radial-gradient(circle at 50% 0%, #E2BF65 36%, #ffffff 36%)",
    flying: "radial-gradient(circle at 50% 0%, #A98FF3 36%, #ffffff 36%)",
    psychic: "radial-gradient(circle at 50% 0%, #F95587 36%, #ffffff 36%)",
    bug: "radial-gradient(circle at 50% 0%, #A6B91A 36%, #ffffff 36%)",
    rock: "radial-gradient(circle at 50% 0%, #B6A136 36%, #ffffff 36%)",
    ghost: "radial-gradient(circle at 50% 0%, #735797 36%, #ffffff 36%)",
    dragon: "radial-gradient(circle at 50% 0%, #6F35FC 36%, #ffffff 36%)",
    dark: "radial-gradient(circle at 50% 0%, #705746 36%, #ffffff 36%)",
    steel: "radial-gradient(circle at 50% 0%, #B7B7CE 36%, #ffffff 36%)",
    fairy: "radial-gradient(circle at 50% 0%, #D685AD 36%, #ffffff 36%)",
};

// Fetch Pokémon and Species Data
async function fetchPokemon() {
    const id = randomID();
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

    try {
        const [response, speciesResponse] = await Promise.all([fetch(url), fetch(speciesUrl)]);

        if (!response.ok || !speciesResponse.ok) {
            throw new Error('Not found!!!');
        } else {
            const pokemonData = await response.json();
            const speciesData = await speciesResponse.json();

            console.log(pokemonData, speciesData);
            displayStat(pokemonData);
            updatePokedex(pokemonData, speciesData);
        }
    } catch (error) {
        console.log('Fetch không ra!!!', error);
    }
}

// Display Pokémon Card and Set Background
function displayStat(pokemon) {
    const cardDisplay = document.getElementById("card-display");

    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const hp = pokemon.stats.find(stat => stat.stat.name === "hp").base_stat;
    const atk = pokemon.stats.find(stat => stat.stat.name === "attack").base_stat;
    const def = pokemon.stats.find(stat => stat.stat.name === "defense").base_stat;
    const speed = pokemon.stats.find(stat => stat.stat.name === "speed").base_stat;

    const type1 = pokemon.types[0].type.name;
    const type2 = pokemon.types[1]?.type.name || null;

    const img = pokemon.sprites.other["official-artwork"].front_default;

    // Set the card background based on type1
    const gradient = typeGradients[type1] || "radial-gradient(circle at 50% 0%, #cccccc 36%, #ffffff 36%)";
    cardDisplay.style.background = gradient;

    cardDisplay.innerHTML = `
        <p class="hp">
                <span>HP</span>
                ${hp}
            </p>
            <div class="imageContainer">
            <img src="${img}" alt="thumb">
            </div>
            <h2 class="name">
                ${name}
            </h2>
            <div class="type">
                <span class="type1">${type1}</span>
                <span class="type2">${type2}</span>
            </div>
            <div class="stat">
                <div>
                    <h3>${atk}</h3>
                    <p>Attack</p>
                </div>

                <div>
                    <h3>${def}</h3>
                    <p>Defense</p>
                </div>

                <div>
                    <h3>${speed}</h3>
                    <p>Speed</p>
                </div>
            </div>
    `;


}

// Update Pokédex Information
function updatePokedex(pokemon, species) {
    const pokedex = document.getElementById("pokedex");
    pokedex.innerHTML = ""; // why this took me so long?

    const description = species.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text.replace(/\s+/g, " ");
    const eggGroups = species.egg_groups
        .map(group => group.name.charAt(0).toUpperCase() + group.name.slice(1))
        .join(", ");
    const captureRate = species.capture_rate;
    const habitat = species.habitat ? species.habitat.name.charAt(0).toUpperCase() + species.habitat.name.slice(1) : "Unknown";

    pokedex.innerHTML = `
    <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    <p><strong>Description:</strong> ${description}</p>
    <p><strong>Egg Groups:</strong> ${eggGroups}</p>
    <p><strong>Capture Rate:</strong> ${captureRate}</p>
    <p><strong>Habitat:</strong> ${habitat}</p>
    `;
}

document.getElementById("generate-card").addEventListener("click", fetchPokemon);
fetchPokemon()