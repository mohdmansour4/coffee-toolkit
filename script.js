document.addEventListener("DOMContentLoaded", () => {
    const filterButton = document.getElementById("filter-button");
    const immersionButton = document.getElementById("immersion-button");
    const coffeeWeightInput = document.getElementById("coffee-weight");
    const waterWeightInput = document.getElementById("water-weight");
    const beverageMassInput = document.getElementById("beverage-mass");
    const tdsInput = document.getElementById("tds");
    const brewRatioResult = document.getElementById("brew-ratio-result");
    const extractionYieldResult = document.getElementById("extraction-yield-result");

    let selectedBrewMethod = "filter"; // Default to filter method

    // Function to update language based on the input
    function updateLanguage(isArabic) {
        const arabicText = {
            brewMethod: "طريقة التحضير",
            dose: "الجرعة (جرام):",
            water: "الماء (جرام):",
            bev: "المشروب (جرام):",
            tds: "التركيز TDS%:",
            filter: "التقطير",
            immersion: "الغمر الكلي",
            brewRatio: "الريشيو (نسبة القهوة الى الماء)",
            extractionYield: "نسبة الاستخلاص"
        };

        const englishText = {
            brewMethod: "Brew Method",
            dose: "Dose (g):",
            water: "Water (g):",
            bev: "BEV (g):",
            tds: "TDS%:",
            filter: "Filter",
            immersion: "Immersion",
            brewRatio: "Brew Ratio",
            extractionYield: "Extraction Yield"
        };

        const textContent = isArabic ? arabicText : englishText;
        document.getElementById("brew-method-label").textContent = textContent.brewMethod;
        document.getElementById("dose-label").textContent = textContent.dose;
        document.getElementById("water-label").textContent = textContent.water;
        document.getElementById("bev-label").textContent = textContent.bev;
        document.getElementById("tds-label").textContent = textContent.tds;
        filterButton.textContent = textContent.filter;
        immersionButton.textContent = textContent.immersion;
        document.querySelector(".results p:nth-child(1)").firstChild.textContent = `${textContent.brewRatio}: `;
        document.querySelector(".results p:nth-child(2)").firstChild.textContent = `${textContent.extractionYield}: `;
    }

    // Listen for external commands to switch languages
    window.addEventListener("message", (event) => {
        console.log("Received message:", event.data); // For debugging
        if (event.data === "switch-to-arabic") {
            updateLanguage(true);
        } else if (event.data === "switch-to-english") {
            updateLanguage(false);
        }
    });

    // Brew Method Selection
    function selectBrewMethod(method) {
        selectedBrewMethod = method;
        if (method === "filter") {
            filterButton.classList.add("selected");
            immersionButton.classList.remove("selected");
        } else if (method === "immersion") {
            immersionButton.classList.add("selected");
            filterButton.classList.remove("selected");
        }
        calculateBrewParameters();
    }

    filterButton.addEventListener("click", () => {
        selectBrewMethod("filter");
    });

    immersionButton.addEventListener("click", () => {
        selectBrewMethod("immersion");
    });

    // Function to calculate brew parameters
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

        // Update the results on the screen
        brewRatioResult.style.color = "#000000"; // Brew Ratio always in black
        brewRatioResult.textContent = brewRatio;

        if (extractionYield >= 18 && extractionYield <= 22) {
            extractionYieldResult.style.color = "#00b300"; // Green for optimal range
        } else {
            extractionYieldResult.style.color = "#ff0000"; // Red for outside optimal range
        }
        extractionYieldResult.textContent = `${extractionYield}%`;
    }

    // Add event listeners to inputs for live calculation
    coffeeWeightInput.addEventListener("input", calculateBrewParameters);
    waterWeightInput.addEventListener("input", calculateBrewParameters);
    beverageMassInput.addEventListener("input", calculateBrewParameters);
    tdsInput.addEventListener("input", calculateBrewParameters);
});
