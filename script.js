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

    // Text content for language switching
    const languageText = {
        ar: {
            brewMethod: "طريقة التحضير",
            dose: "الجرعة (جرام):",
            water: "الماء (جرام):",
            bev: "المشروب (جرام):",
            tds: "التركيز TDS%:",
            filter: "التقطير",
            immersion: "الغمر الكلي",
            brewRatio: "الريشيو (نسبة القهوة الى الماء)",
            extractionYield: "نسبة الاستخلاص"
        },
        en: {
            brewMethod: "Brew Method",
            dose: "Dose (g):",
            water: "Water (g):",
            bev: "BEV (g):",
            tds: "TDS%:",
            filter: "Filter",
            immersion: "Immersion",
            brewRatio: "Brew Ratio",
            extractionYield: "Extraction Yield"
        }
    };

    // Function to update language dynamically
    function updateLanguage(isArabic) {
        const textContent = isArabic ? languageText.ar : languageText.en;

        document.getElementById("brew-method-label").textContent = textContent.brewMethod;
        document.getElementById("dose-label").textContent = textContent.dose;
        document.getElementById("water-label").textContent = textContent.water;
        document.getElementById("bev-label").textContent = textContent.bev;
        document.getElementById("tds-label").textContent = textContent.tds;
        filterButton.textContent = textContent.filter;
        immersionButton.textContent = textContent.immersion;

        // Update results section labels
        document.querySelector(".results p:nth-child(1)").firstChild.textContent = `${textContent.brewRatio}: `;
        document.querySelector(".results p:nth-child(2)").firstChild.textContent = `${textContent.extractionYield}: `;

        // Switch text direction based on the language
        document.body.setAttribute("dir", isArabic ? "rtl" : "ltr");
    }

    // Listen for external commands to switch languages
    window.addEventListener("message", (event) => {
        if (event.data === "switch-to-arabic") {
            updateLanguage(true);
        } else if (event.data === "switch-to-english") {
            updateLanguage(false);
        }
    });

    // Brew Method Selection Function
    function selectBrewMethod(method) {
        selectedBrewMethod = method;
        filterButton.classList.toggle("selected", method === "filter");
        immersionButton.classList.toggle("selected", method === "immersion");
        calculateBrewParameters();
    }

    // Add event listeners for brew method buttons
    filterButton.addEventListener("click", () => selectBrewMethod("filter"));
    immersionButton.addEventListener("click", () => selectBrewMethod("immersion"));

    // Function to calculate brew parameters
    function calculateBrewParameters() {
        const coffeeWeight = parseFloat(coffeeWeightInput.value);
        const waterWeight = parseFloat(waterWeightInput.value);
        const beverageMass = parseFloat(beverageMassInput.value);
        const tds = parseFloat(tdsInput.value);

        if (isNaN(coffeeWeight) || isNaN(waterWeight) || isNaN(beverageMass) || isNaN(tds)) return;

        const brewRatio = (waterWeight / coffeeWeight).toFixed(2);
        let extractionYield;

        // Calculate extraction yield based on selected method
        if (selectedBrewMethod === "filter") {
            extractionYield = ((beverageMass / coffeeWeight) * tds).toFixed(2);
        } else if (selectedBrewMethod === "immersion") {
            extractionYield = (tds * brewRatio).toFixed(2);
        }

        // Update the results on the screen
        brewRatioResult.style.color = "#000000"; // Always black for brew ratio
        brewRatioResult.textContent = brewRatio;

        // Set color based on extraction yield value
        extractionYieldResult.style.color = (extractionYield >= 18 && extractionYield <= 22) ? "#00b300" : "#ff0000";
        extractionYieldResult.textContent = `${extractionYield}%`;
    }

    // Add event listeners to inputs for live calculations
    [coffeeWeightInput, waterWeightInput, beverageMassInput, tdsInput].forEach(input => {
        input.addEventListener("input", calculateBrewParameters);
    });
});
