document.addEventListener("DOMContentLoaded", () => {
    const filterButton = document.getElementById("filter-button");
    const immersionButton = document.getElementById("immersion-button");
    const coffeeWeightInput = document.getElementById("coffee-weight");
    const waterWeightInput = document.getElementById("water-weight");
    const beverageMassInput = document.getElementById("beverage-mass");
    const tdsInput = document.getElementById("tds");
    const brewRatioResult = document.getElementById("brew-ratio-result");
    const extractionYieldResult = document.getElementById("extraction-yield-result");

    let selectedBrewMethod = "filter";

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
    }

    // Listen for external commands (e.g., from the Carrd page)
    window.addEventListener("message", (event) => {
        if (event.data === "switch-to-arabic") {
            updateLanguage(true);
        } else if (event.data === "switch-to-english") {
            updateLanguage(false);
        }
    });

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

    // Add event listeners to inputs
    coffeeWeightInput.addEventListener("input", calculateBrewParameters);
    waterWeightInput.addEventListener("input", calculateBrewParameters);
    beverageMassInput.addEventListener("input", calculateBrewParameters);
    tdsInput.addEventListener("input", calculateBrewParameters);
});
