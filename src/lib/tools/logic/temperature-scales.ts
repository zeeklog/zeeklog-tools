export const convertCelsiusToKelvin = (t: number) => t + 273.15
export const convertKelvinToCelsius = (t: number) => t - 273.15
export const convertFahrenheitToKelvin = (t: number) => (t + 459.67) * (5 / 9)
export const convertKelvinToFahrenheit = (t: number) => t * (9 / 5) - 459.67
export const convertRankineToKelvin = (t: number) => t * (5 / 9)
export const convertKelvinToRankine = (t: number) => t * (9 / 5)
export const convertDelisleToKelvin = (t: number) => 373.15 - (2 / 3) * t
export const convertKelvinToDelisle = (t: number) => (3 / 2) * (373.15 - t)
export const convertNewtonToKelvin = (t: number) => t * (100 / 33) + 273.15
export const convertKelvinToNewton = (t: number) => (t - 273.15) * (33 / 100)
export const convertReaumurToKelvin = (t: number) => t * (5 / 4) + 273.15
export const convertKelvinToReaumur = (t: number) => (t - 273.15) * (4 / 5)
export const convertRomerToKelvin = (t: number) => (t - 7.5) * (40 / 21) + 273.15
export const convertKelvinToRomer = (t: number) => (t - 273.15) * (21 / 40) + 7.5
