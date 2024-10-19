document.addEventListener("DOMContentLoaded", () => {
    const englishToggle = document.getElementById("english-toggle");
    const arabicToggle = document.getElementById("arabic-toggle");
    const filterButton = document.getElementById("filter-button");
    const immersionButton = document.getElementById("immersion-button");
    const coffeeWeightInput = document.getElementById("coffee-weight");
    const waterWeightInput = document.getElementById("water-weight");
    const beverageMassInput = document.getElementById("beverage-mass");
    const tdsInput = document.getElementById("tds");
    const brewRatioResult = document.getElementById("brew-ratio-result");
    const extractionYieldResult = document.getElementById("extraction-yield-result");
    const resultsSection = document.querySelector(".results");

    let selectedBrewMethod = "filter"; // Default brew method

    // Function to switch language
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

        // Update result labels
        resultsSection.children[0].firstChild.textContent = `${textContent.brewRatio}: `;
        resultsSection.children[1].firstChild.textContent = `${textContent.extractionYield}: `;

        // Update page direction for RTL
        document.body.dir = isArabic ? "rtl" : "ltr";
    }

    // Switch to English
    englishToggle.addEventListener("click", () => {
        englishToggle.classList.add("selected");
        arabicToggle.classList.remove("selected");
        updateLanguage(false); // Switch to English
        document.getElementById("content-frame").src = "https://mohdmansour4.github.io/coffee-toolkit/"; // English URL
    });

    // Switch to Arabic
    arabicToggle.addEventListener("click", () => {
        arabicToggle.classList.add("selected");
        englishToggle.classList.remove("selected");
        updateLanguage(true); // Switch to Arabic
        document.getElementById("content-frame").src = "https://mohdmansour4.github.io/coffee-toolkit/ar"; // Arabic URL
    });

    // Toggle for brew method selection
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

        // Update Brew Ratio and Extraction Yield colors
        brewRatioResult.style.color = "#000000"; // Always black for brew ratio
        if (extractionYield >= 18 && extractionYield <= 22) {
            extractionYieldResult.style.color = "#00b300"; // Green for 18% - 22%
        } else {
            extractionYieldResult.style.color = "#ff0000"; // Red for less than 18% or greater than 22%
        }

        // Display the results
        brewRatioResult.textContent = brewRatio;
        extractionYieldResult.textContent = `${extractionYield}%`;
    }

    // Input Event Listeners
    coffeeWeightInput.addEventListener("input", calculateBrewParameters);
    waterWeightInput.addEventListener("input", calculateBrewParameters);
    beverageMassInput.addEventListener("input", calculateBrewParameters);
    tdsInput.addEventListener("input", calculateBrewParameters);
});
