# stdlib-calculator
Scientific Calculator made using stdlib library for Showcase for GSoC 2025


# stdlib-calculator
Scientific Calculator made using stdlib library for Showcase for GSoC 2025

## 🚀 Features
- Basic arithmetic operations (`+`, `-`, `*`, `/`)
- Scientific functions: `√`, reciprocal, percentage
- Logarithmic and exponential functions (`ln`, `eˣ`)
- Support for both FP32 (single-precision) and FP64 (double-precision) calculations
- Keyboard and clipboard support (copy/paste)
- Error handling and precision rounding

## 🔧 Setup & Run

### Prerequisites
- [Node.js](https://nodejs.org/) (only needed if you're running a local server)
- A modern browser (Chrome, Firefox, Edge, etc.)

### 1. Clone the repository
```bash
git clone https://github.com/sahil20021008/stdlib-calculator.git
cd stdlib-calculator
```

### 2. Install Dependencies
Install all the dependencies mentioned in `package.json` file:

`npm install`

### 3. Build the Project
Run the following command to create a production-ready bundled version of the calculator:

`npm run build`


This will create a single bundle.js file in the dist/ directory 

### 4. Start a local server
To serve the project locally in a browser, run:


`npm start`


This runs a static web server (e.g., using webcheck) and opens the calculator at http://localhost:&lt;port&gt; in your default browser.

### 5. Clean Build Artifacts (Optional)
To clean up generated files and reset the environment:


`npm run clean`


This will remove the build and temporary files