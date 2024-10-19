document.addEventListener("DOMContentLoaded", () => {
    const filterButton = document.getElementById("filter-button");
    const immersionButton = document.getElementById("immersion-button");
    const coffeeWeightInput = document.getElementById("coffee-weight");
    const waterWeightInput = document.getElementById("water-weight");
    const beverageMassInput = document.getElementById("beverage-mass");
    const tdsInput = document.getElementById("tds");
    const brewRatioResult = document.getElementById("brew-ratio-result");
    const extractionYieldResult = document.getElementById("extraction-yield-result");

    let selectedBrewMethod = "filter"; // Default brew method

    // Brew Method Selection
    filterButton.addEventListener("click", () => {
        selectedBrewMethod = "filter";
        filterButton.classList.add("selected");
        immersionButton.classList.remove("selected");
        calculateBrewParameters();
    });

    immersionButton.addEventListener("click", () => {
        selectedBrewMethod = "immersion";
        immersionButton.classList.add("selected");
        filterButton.classList.remove("selected");
        calculateBrewParameters();
    });

    function calculateBrewParameters() {
        const coffeeWeight = parseFloat(coffeeWeightInput.value);
        const waterWeight = parseFloat(waterWeightInput.value);
        const beverageMass = parseFloat(beverageMassInput.value);
        const tds = parseFloat(tdsInput.value);

        if (isNaN(coffeeWeight) || isNaN(waterWeight) || isNaN(beverageMass) || isNaN(tds)) return;

        const brewRatio = (waterWeight / coffeeWeight).toFixed(2);
        let extractionYield;
        if (selectedBrewMethod === "filter") {
            extractionYield = ((beverageMass / coffeeWeight) * tds).toFixed(2);
        } else if (selectedBrewMethod === "immersion") {
            extractionYield = (tds * brewRatio).toFixed(2);
        }

        brewRatioResult.textContent = brewRatio;
        extractionYieldResult.textContent = `${extractionYield}%`;
    }

    // Add event listeners to inputs to recalculate when values change
    coffeeWeightInput.addEventListener("input", calculateBrewParameters);
    waterWeightInput.addEventListener("input", calculateBrewParameters);
    beverageMassInput.addEventListener("input", calculateBrewParameters);
    tdsInput.addEventListener("input", calculateBrewParameters);
});
