import { useEffect, useMemo, useState, type ReactNode } from "react"
import { CircleAlert } from "lucide-react"

import { eyebrowClass, linkClass, NewTabHint } from "@/components/editorial"
import { Page, PageHeader } from "@/components/page"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarHeatmap } from "@/pages/weather/calendar-heatmap"
import { RainfallChart } from "@/pages/weather/rainfall-chart"
import { TemperatureChart } from "@/pages/weather/temperature-chart"
import {
  groupByYear,
  loadWeatherData,
  type WeatherData,
} from "@/pages/weather/weather-data"
import { WindRoseChart } from "@/pages/weather/wind-rose-chart"
import { WindSpeedChart } from "@/pages/weather/wind-speed-chart"
import { YearRail, YearStats } from "@/pages/weather/year-summary"

const errorMessage = (cause: unknown) =>
  `Error loading data: ${cause instanceof Error ? cause.message : String(cause)}`

/** A numbered part of the page: a mono label ruled off to the right. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className={eyebrowClass}>{title}</h2>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  )
}

export default function WeatherPage() {
  const [data, setData] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [year, setYear] = useState<string | null>(null)

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

  const years = useMemo(() => (data ? groupByYear(data) : []), [data])
  // Opens on the latest complete year: a partial year's records mislead.
  const selected =
    years.find((entry) => entry.year === year) ??
    years.findLast((entry) => !entry.partial) ??
    years.at(-1)
  const [first, last] = [years[0], years.at(-1)]
  const span = first && last ? `${first.year}–${last.year}` : undefined
  const readings = data
    ? `${data.temperature.length.toLocaleString("en-IE")} days of readings, updated monthly.`
    : "Updated monthly."

  return (
    <Page className="gap-10 md:pb-14">
      <PageHeader
        meta={span ? `Claremorris · ${span}` : "Claremorris"}
        description={`Recorded at the Claremorris Met Éireann station, about 2 km south of my home town in County Mayo, Ireland. ${readings}`}
      />

      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      {selected ? (
        <>
          <Section title="01 — The year">
            <YearRail years={years} selected={selected} onSelect={setYear} />
            <YearStats years={years} selected={selected} />
          </Section>
          <Section title="02 — Every day">
            <CalendarHeatmap year={selected} />
          </Section>
          <Section title="03 — Temperature & humidity">
            <TemperatureChart data={selected.temperature} />
          </Section>
          <Section title="04 — Wind">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,25rem),1fr))] items-start gap-4">
              <WindRoseChart
                data={selected.windRose}
                year={selected.year}
                partial={selected.partial}
              />
              <WindSpeedChart data={selected.wind} />
            </div>
          </Section>
          <Section title="05 — Rainfall">
            <RainfallChart data={selected.rain} />
          </Section>
        </>
      ) : (
        !error &&
        Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-[28rem] rounded-xl" />
        ))
      )}

      <p className="text-center text-sm text-muted-foreground">
        Weather data provided by Met Éireann under the{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Creative Commons Attribution 4.0 International License
          <NewTabHint />
        </a>
      </p>
    </Page>
  )
}
