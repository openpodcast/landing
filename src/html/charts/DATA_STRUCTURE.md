# Charts Page Data Structure

This document describes the data structure and placeholders used in the charts page template.

## Template Placeholders

### Podcast Information
- `{{PODCAST_NAME}}` - The name of the podcast
- `{{PODCAST_SLUG}}` - URL-friendly version of podcast name (e.g., "the-tech-talk-podcast")
- `{{PODCAST_IMAGE}}` - URL to podcast artwork/cover image

### Chart Data (JSON)
`{{CHART_DATA_JSON}}` - JSON object for Chart.js line chart

**Important:** The backgroundColor should use the `gradient` variable that's created in the JavaScript. This creates a top-to-bottom gradient fade effect.

Example structure:
```json
{
  "labels": ["Nov 20", "Nov 27", "Dec 4", "Dec 11", "Dec 18", "Dec 25", "Jan 1", "Jan 8"],
  "datasets": [
    {
      "label": "US Charts",
      "data": [25, 18, 15, 12, 10, 15, 12, 10],
      "borderColor": "#3b82f6",
      "backgroundColor": gradient,
      "tension": 0.4,
      "fill": "start",
      "pointRadius": 4,
      "pointHoverRadius": 6,
      "pointBackgroundColor": "#3b82f6",
      "pointBorderColor": "#fff",
      "pointBorderWidth": 2
    }
  ]
}
```

**Note:** When generating the JSON, use the variable name `gradient` (without quotes) for backgroundColor instead of a color string.

### Chart Table Rows
`{{CHART_TABLE_ROWS}}` - HTML rows for the detailed chart positions table

Each row should be generated using the row-template.html and concatenated together.

## SQL Query Structure

The cronjob should execute a query similar to:

```sql
SELECT
    p.id as podcast_id,
    p.name as podcast_name,
    p.slug as podcast_slug,
    p.description,
    p.image_url,
    p.subscriber_count,
    p.frequency,
    p.rating,
    cp.date,
    cp.country_code,
    cp.country_name,
    cp.platform,  -- 'spotify' or 'apple'
    cp.position,
    cp.category,
    cp.type,  -- 'podcast' or 'episode'
    cp.episode_title,  -- NULL if type is 'podcast'
    cp.change_value,
    cp.previous_position
FROM podcasts p
LEFT JOIN chart_positions cp ON p.id = cp.podcast_id
WHERE cp.date >= DATE_SUB(NOW(), INTERVAL 8 WEEKS)
ORDER BY p.id, cp.date DESC, cp.position ASC
```

## Row Template Variables

For each chart position entry, use these variables:

```javascript
{
  date: "Dec 18, 2024",
  countryFlag: "/images/flags/us.svg",
  countryName: "United States",
  type: "podcast", // or "episode"
  typeLabel: "Podcast", // or "Episode"
  typeColor: "bg-blue-100 text-blue-800", // or "bg-yellow-100 text-yellow-800" for episodes
  position: "12",
  positionColor: getPositionColor(12),  // See helper function below
  category: "Technology",
  changeIcon: getChangeIcon(3),  // See helper function below
  changeValue: "+3",
  changeColor: "text-green-600"  // or "text-red-600" or "text-gray-500"
}
```

## Helper Functions for Cronjob

```javascript
// Position color based on rank
function getPositionColor(position) {
  if (position <= 5) return "bg-green-100 text-green-800";
  if (position <= 10) return "bg-blue-100 text-blue-800";
  if (position <= 20) return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-700";
}

// Change icon based on direction
function getChangeIcon(changeValue) {
  if (changeValue > 0) return "↑ ";
  if (changeValue < 0) return "↓ ";
  return "— ";
}

// Change color based on direction
function getChangeColor(changeValue) {
  if (changeValue > 0) return "text-green-600";
  if (changeValue < 0) return "text-red-600";
  return "text-gray-500";
}

// Type color based on type
function getTypeColor(type) {
  return type === "podcast"
    ? "bg-blue-100 text-blue-800"
    : "bg-yellow-100 text-yellow-800";
}
```

## Chart Data Generation

For the line chart, aggregate chart positions by date:

```javascript
// Example chart data generation
function generateChartData(positions) {
  const labels = getUniqueDates(positions);  // Last 8 weeks
  const datasets = [];

  // Group by country/platform
  const grouped = groupBy(positions, p => `${p.country}-${p.platform}`);

  for (const [key, data] of Object.entries(grouped)) {
    datasets.push({
      label: key,
      data: labels.map(date => findPositionForDate(data, date)),
      borderColor: getColorForDataset(key),
      backgroundColor: getColorForDataset(key, 0.1),
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6
    });
  }

  return { labels, datasets };
}
```

## File Naming Convention

Generated HTML files should follow this pattern:
- `/charts/{podcast-slug}.html`

Example:
- `/charts/the-tech-talk-podcast.html`
- `/charts/engineering-kiosk.html`

## Cronjob Workflow

1. Query database for all podcasts with chart data
2. For each podcast:
   - Load template.html
   - Replace podcast information placeholders
   - Generate chart data JSON
   - Generate table rows using row-template.html
   - Replace `{{CHART_DATA_JSON}}` with JSON
   - Replace `{{CHART_TABLE_ROWS}}` with generated rows
   - Write to `/charts/{slug}.html`
3. Generate index page with list of all tracked podcasts
