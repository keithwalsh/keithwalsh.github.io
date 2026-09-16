import { useEffect, useState } from "react"
import { CalendarDays, CircleAlert, RefreshCw } from "lucide-react"

import { Page, PageHeader } from "@/components/page"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { RainfallChart } from "@/pages/weather/rainfall-chart"
import { TemperatureChart } from "@/pages/weather/temperature-chart"
import {
  availableYears,
  loadWeatherData,
  rowsForYear,
  type WeatherData,
} from "@/pages/weather/weather-data"
import { WindRoseChart } from "@/pages/weather/wind-rose-chart"
import { WindSpeedChart } from "@/pages/weather/wind-speed-chart"

const errorMessage = (cause: unknown) =>
  `Error loading data: ${cause instanceof Error ? cause.message : String(cause)}`

export default function WeatherPage() {
  const [data, setData] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [year, setYear] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  useEffect(() => {
    let cancelled = false
    loadWeatherData()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((cause) => {
        if (!cancelled) setError(errorMessage(cause))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const refresh = async () => {
    setIsRefreshing(true)
    try {
      setData(await loadWeatherData(true))
      setError(null)
      setLastRefresh(new Date())
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      setIsRefreshing(false)
    }
  }

  const years = data ? availableYears(data.temperature) : []
  const selectedYear = year && years.includes(year) ? year : years[0]

  return (
    <Page>
      <PageHeader
        title="Weather Visualizations"
        description="The below data was recorded from the Claremorris Met Éireann meteorological station, situated about 2 Km south of the centre of the town (my home town), in county Mayo, Ireland. The weather data is updated monthly."
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={selectedYear} onValueChange={setYear} disabled={!data}>
          <SelectTrigger className="w-32" aria-label="Year">
            <CalendarDays />
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={refresh}
              disabled={!data || isRefreshing}
            >
              <RefreshCw className={cn(isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {lastRefresh
              ? `Last refreshed at ${lastRefresh.toLocaleTimeString()}`
              : "Reload the latest data"}
          </TooltipContent>
        </Tooltip>
      </div>

      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      {data && selectedYear ? (
        <div
          className={cn(
            "grid items-start gap-4 transition-opacity lg:grid-cols-2",
            isRefreshing && "opacity-60"
          )}
        >
          <TemperatureChart
            key={`temperature-${selectedYear}`}
            data={rowsForYear(data.temperature, selectedYear)}
          />
          <WindSpeedChart
            key={`wind-${selectedYear}`}
            data={rowsForYear(data.wind, selectedYear)}
          />
          <WindRoseChart
            key={`rose-${selectedYear}`}
            data={data.windRoseByYear[selectedYear]}
            year={selectedYear}
          />
          <RainfallChart
            key={`rain-${selectedYear}`}
            data={rowsForYear(data.rain, selectedYear)}
          />
        </div>
      ) : (
        !error && (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-[28rem] rounded-xl" />
            ))}
          </div>
        )
      )}

      <p className="text-center text-sm text-muted-foreground">
        Weather data provided by Met Éireann under the{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Creative Commons Attribution 4.0 International License
        </a>
      </p>
    </Page>
  )
}
