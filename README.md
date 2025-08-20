⚡ PowerTips

PowerTips is a React-based sports predictions app that displays previous, upcoming, and daily highlighted predictions for football matches. The application is designed to be responsive, visually engaging, and easy to use, offering bettors and sports enthusiasts a quick glance at reliable predictions.

🚀 Features
🏠 Home Page (Home.jsx)

The Home page is the main dashboard of the app, displaying:

VIP Section

Highlights the Telegram VIP group for exclusive tips.

Provides a call-to-action button for users to join.

Game of the Day

Dynamically selects and displays the featured prediction of the day.

Shows game name, prediction, odds, and date in a colorful gradient card.

Previous Predictions

A responsive table showing past game predictions.

Includes game name, prediction, odds, result, and date.

Hover tooltips on results (Won / Lost) for extra clarity.

Results are color-coded:

🟢 Green → Won

🔴 Red → Lost

Upcoming Predictions

Displays scheduled games with pending predictions.

Similar format to the previous predictions table, but marked as ⏳ Pending in yellow.

📊 Data Handling

Predictions are stored in arrays of objects (gamesData and upcomingGames).

Data is sorted by date so the most recent games appear first.

Dates are formatted with toLocaleDateString for a clean, readable output.

The app automatically detects today’s date to highlight the Game of the Day.

🛠️ Tech Stack

React.js – Frontend framework.

Tailwind CSS – Responsive and modern styling.

JavaScript (ES6+) – Logic for sorting, filtering, and formatting data.

📱 Responsiveness

The UI adapts to mobile, tablet, and desktop devices, making predictions easy to follow across platforms.

🔗 Links

📢 Join the VIP Telegram Group: PowerTips [Telegram](https://t.me/powertipsterbets)