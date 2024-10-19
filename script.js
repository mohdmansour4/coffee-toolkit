<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coffee Toolkit</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        /* Additional CSS for layout */
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        #calculator-box {
            max-width: 600px;
            width: 100%;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }

        label {
            font-weight: 500;
            color: #555;
            font-size: 14px;
            display: block;
            margin-bottom: 6px;
            text-align: center;
            text-transform: uppercase;
        }

        input[type="number"] {
            width: 100%;
            padding: 10px;
            border-radius: 10px;
            border: 1px solid #d1d9e6;
            background: #f9f9fc;
            font-size: 14px;
            transition: border-color 0.3s ease;
            margin-top: 5px;
            margin-bottom: 15px;
            text-align: center;
        }

        .results {
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            margin: 10px 0;
        }

        .brew-method {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            width: 100%;
        }

        .brew-button {
            padding: 10px 20px;
            border-radius: 10px;
            border: none;
            background: #e5e9f0;
            color: #333;
            font-size: 15px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            flex: 1;
            text-align: center;
            margin: 0 5px;
            text-transform: uppercase;
        }

        .brew-button.selected {
            background: #0056D2;
            color: white;
        }

        .brew-button:hover {
            background: #80BFFF;
        }
    </style>
</head>
<body>
    <!-- Calculator Box with Brew Method and Inputs -->
    <div id="calculator-box">
        <label id="brew-method-label">Brew Method</label>
        <div class="brew-method">
            <button id="filter-button" class="brew-button selected">Filter</button>
            <button id="immersion-button" class="brew-button">Immersion</button>
        </div>

        <label id="dose-label">Dose (g):</label>
        <input type="number" id="coffee-weight">

        <label id="water-label">Water (g):</label>
        <input type="number" id="water-weight">

        <label id="bev-label">BEV (g):</label>
        <input type="number" id="beverage-mass">

        <label id="tds-label">TDS%:</label>
        <input type="number" id="tds" step="0.01">

        <div class="results">
            <p>Brew Ratio: <span id="brew-ratio-result"></span></p>
            <p>Extraction Yield: <span id="extraction-yield-result"></span></p>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
 
