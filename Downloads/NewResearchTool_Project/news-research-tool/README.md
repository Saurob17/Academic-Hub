# News Research Tool

## Overview
The News Research Tool is a web application designed to help users gather and analyze news articles from various URLs. It provides a user-friendly interface for inputting URLs, processing the content, and retrieving answers to questions based on the articles.

## Project Structure
```
news-research-tool
├── src
│   ├── main.py          # Main application script using Streamlit
│   └── retrieval.ipynb  # Jupyter Notebook for data retrieval and processing
├── .env                 # Environment variables (e.g., API keys)
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd news-research-tool
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Set up your environment variables:
   - Create a `.env` file in the root directory and add your API keys and other necessary configurations.

## Usage

1. Run the Streamlit application:
   ```
   streamlit run src/main.py
   ```

2. Open your web browser and navigate to `http://localhost:8501`.

3. Input the URLs of the news articles you want to analyze in the sidebar.

4. Ask questions related to the content of the articles, and the tool will provide answers based on the retrieved information.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.