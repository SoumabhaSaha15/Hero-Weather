import { forecastResponseSchema } from "../validators/forecast";
import { z } from "zod";

export type ForecastWeather = z.infer<typeof forecastResponseSchema['shape']['list']['element']>;;
export type DateGroupped = {
  dailyDate: string;
  data: ForecastWeather[];
}[];
export const DateGrouper = (list: ForecastWeather[],): DateGroupped => {
  const chunks: DateGroupped = [], dateSet = new Set<string>();
  list.forEach(({ dt_txt }) => dateSet.add(dt_txt.split(" ")[0]));
  [...dateSet].forEach((value: string) => chunks.push({ dailyDate: value, data: list.filter(({ dt_txt }) => dt_txt.startsWith(value)) }))
  return chunks;
}
