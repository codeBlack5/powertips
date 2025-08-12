import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const leagues = [
  { name: "Premier League", code: "PL" },
  { name: "La Liga", code: "PD" },
  { name: "Bundesliga", code: "BL1" },
  { name: "Serie A", code: "SA" },
];

const Filters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <select
        value={filters.league}
        onChange={(e) => setFilters((f) => ({ ...f, league: e.target.value }))}
        className="p-2 border rounded"
      >
        <option value="">All Leagues</option>
        {leagues.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>

      <DatePicker
        selected={new Date(filters.date)}
        onChange={(date) =>
          setFilters((f) => ({ ...f, date: date.toISOString().split("T")[0] }))
        }
        className="p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Search teams..."
        value={filters.search}
        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        className="p-2 border rounded w-64"
      />
    </div>
  );
};

export default Filters;