type AddressGeneratorKind =
  | 'us'
  | 'uk'
  | 'hk'
  | 'sg'
  | 'california'
  | 'newzealand'
  | 'spain'

type RegionValue = string

type RegionOption = {
  value: RegionValue
  label: string
}

const QUICK_COUNTS = [5, 10, 15] as const
const DEFAULT_COUNT = 5
const MIN_COUNT = 1
const MAX_COUNT = 200

const usStates = ['CA', 'NY', 'TX', 'FL', 'WA', 'IL', 'MA', 'CO']
const usCities = ['Los Angeles', 'New York', 'Houston', 'Miami', 'Seattle', 'Chicago', 'Boston', 'Denver']
const usStreets = ['Main St', 'Oak Ave', 'Maple Dr', 'Sunset Blvd', 'Pine St', 'Cedar Ln', 'Broadway', 'Lakeview Rd']

const ukTowns = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol', 'Liverpool']
const ukCounties = ['Greater London', 'Greater Manchester', 'West Midlands', 'West Yorkshire', 'Bristol', 'Merseyside']
const ukStreets = ['High Street', 'Station Road', 'Church Lane', 'Mill Road', 'Park Avenue', 'Victoria Street']
const ukPostcodes = ['SW1A 1AA', 'M1 1AE', 'B1 1TB', 'LS1 4AP', 'BS1 5AH', 'L1 8JQ']

const hkDistricts = ['Central', 'Wan Chai', 'Tsim Sha Tsui', 'Mong Kok', 'Sha Tin', 'Tsuen Wan']
const hkBuildings = ['Prosperity Tower', 'Harbour View Mansion', 'Golden Plaza', 'Sunshine Court', 'Jade Heights', 'Ocean Centre']
const hkStreets = ["Nathan Road", "Queen's Road Central", 'Hennessy Road', 'Argyle Street', 'Castle Peak Road', 'Des Voeux Road']

const sgDistricts = ['Bukit Merah', 'Toa Payoh', 'Jurong East', 'Bedok', 'Ang Mo Kio', 'Tampines']
const sgStreets = ['Ang Mo Kio Ave 3', 'Jurong West St 52', 'Bedok North Rd', 'Toa Payoh Lor 1', 'Tampines St 21', 'Bukit Merah View']

const californiaCities = ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Sacramento', 'Irvine']
const californiaStreets = ['Sunset Blvd', 'Market St', 'El Camino Real', 'Palm Ave', 'Mission St', 'Ocean Ave']

const nzRegions: RegionOption[] = [
  { value: 'all', label: '所有地区' },
  { value: 'north', label: '北岛' },
  { value: 'south', label: '南岛' },
]
const nzNorthCities = ['Auckland', 'Wellington', 'Hamilton', 'Tauranga']
const nzNorthSuburbs = ['Mount Eden', 'Newtown', 'Hillcrest', 'Papamoa']
const nzSouthCities = ['Christchurch', 'Dunedin', 'Queenstown', 'Invercargill']
const nzSouthSuburbs = ['Riccarton', 'North East Valley', 'Frankton', 'Windsor']
const nzStreets = ['Queen Street', 'Victoria Street', 'High Street', 'George Street', 'King Street', 'Albert Road']

const spainRegions: RegionOption[] = [
  { value: 'all', label: '所有地区' },
  { value: 'madrid', label: '马德里' },
  { value: 'catalonia', label: '加泰罗尼亚' },
  { value: 'andalusia', label: '安达卢西亚' },
  { value: 'valencia', label: '瓦伦西亚' },
]
const spainCitiesByRegion: Record<string, string[]> = {
  madrid: ['Madrid', 'Alcobendas', 'Getafe'],
  catalonia: ['Barcelona', 'Girona', 'Tarragona'],
  andalusia: ['Sevilla', 'Malaga', 'Granada'],
  valencia: ['Valencia', 'Alicante', 'Castellon'],
}
const spainProvinceByRegion: Record<string, string> = {
  madrid: 'Comunidad de Madrid',
  catalonia: 'Cataluna',
  andalusia: 'Andalucia',
  valencia: 'Comunitat Valenciana',
}
const spainStreetPrefixes = ['Calle', 'Avenida', 'Plaza', 'Paseo', 'Camino']
const spainStreetNames = ['Mayor', 'Gran Via', 'de la Paz', 'del Sol', 'de la Estacion', 'de la Constitucion']

function clampCount(count: number): number {
  if (!Number.isFinite(count)) return DEFAULT_COUNT
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.floor(count)))
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDigits(length: number): string {
  return Array.from({ length }, () => String(randomInt(0, 9))).join('')
}

function genUSAddress() {
  return `${randomInt(100, 9999)} ${pick(usStreets)}, ${pick(usCities)}, ${pick(usStates)} ${randomDigits(5)}`
}

function genUKAddress() {
  return `${randomInt(1, 280)} ${pick(ukStreets)}, ${pick(ukTowns)}, ${pick(ukCounties)}, ${pick(ukPostcodes)}`
}

function genHKAddress() {
  return `Flat ${randomInt(1, 25)}${String.fromCharCode(64 + randomInt(1, 6))}, ${randomInt(1, 48)}/F, ${pick(hkBuildings)}, ${randomInt(1, 380)} ${pick(hkStreets)}, ${pick(hkDistricts)}, Hong Kong`
}

function genSGAddress() {
  return `Blk ${randomInt(1, 999)} #${randomInt(1, 25)}-${randomInt(1, 999).toString().padStart(3, '0')}, ${pick(sgStreets)}, ${pick(sgDistricts)}, Singapore ${randomDigits(6)}`
}

function genCaliforniaAddress() {
  return `${randomInt(100, 9999)} ${pick(californiaStreets)}, ${pick(californiaCities)}, CA ${randomDigits(5)}`
}

function selectNzRegion(region: string): 'north' | 'south' {
  if (region === 'north' || region === 'south') return region
  return Math.random() < 0.5 ? 'north' : 'south'
}

function genNzAddress(region: string) {
  const selected = selectNzRegion(region)
  const city = selected === 'north' ? pick(nzNorthCities) : pick(nzSouthCities)
  const suburb = selected === 'north' ? pick(nzNorthSuburbs) : pick(nzSouthSuburbs)
  return `${randomInt(1, 299)} ${pick(nzStreets)}, ${suburb}, ${city} ${randomInt(1000, 9999)}, New Zealand`
}

function selectSpainRegion(region: string): keyof typeof spainCitiesByRegion {
  if (region in spainCitiesByRegion) return region as keyof typeof spainCitiesByRegion
  const keys = Object.keys(spainCitiesByRegion) as Array<keyof typeof spainCitiesByRegion>
  return pick(keys)
}

function genSpainAddress(region: string) {
  const selected = selectSpainRegion(region)
  const city = pick(spainCitiesByRegion[selected])
  return `${pick(spainStreetPrefixes)} ${pick(spainStreetNames)}, ${randomInt(1, 180)}, ${randomInt(10000, 52999)} ${city}, ${spainProvinceByRegion[selected]}`
}

export function getAddressRegionOptions(kind: AddressGeneratorKind): RegionOption[] {
  if (kind === 'newzealand') return nzRegions
  if (kind === 'spain') return spainRegions
  return []
}

export function getQuickAddressCounts(): readonly number[] {
  return QUICK_COUNTS
}

export function normalizeAddressCount(count: number): number {
  return clampCount(count)
}

export function generateAddresses(kind: AddressGeneratorKind, count: number, region = 'all'): string[] {
  const n = clampCount(count)
  if (kind === 'us') return Array.from({ length: n }, genUSAddress)
  if (kind === 'uk') return Array.from({ length: n }, genUKAddress)
  if (kind === 'hk') return Array.from({ length: n }, genHKAddress)
  if (kind === 'sg') return Array.from({ length: n }, genSGAddress)
  if (kind === 'california') return Array.from({ length: n }, genCaliforniaAddress)
  if (kind === 'newzealand') return Array.from({ length: n }, () => genNzAddress(region))
  return Array.from({ length: n }, () => genSpainAddress(region))
}

export function listAllAddresses(kind: AddressGeneratorKind, region = 'all'): string[] {
  if (kind === 'newzealand') {
    const regions = region === 'all' ? ['north', 'south'] : [region]
    return regions.flatMap((regionKey) => {
      const cities = regionKey === 'north' ? nzNorthCities : nzSouthCities
      const suburbs = regionKey === 'north' ? nzNorthSuburbs : nzSouthSuburbs
      return cities.flatMap((city) =>
        suburbs.map((suburb, i) => `${50 + i} ${nzStreets[i % nzStreets.length]}, ${suburb}, ${city} ${2000 + i}, New Zealand`),
      )
    })
  }
  if (kind === 'spain') {
    const regionKeys =
      region === 'all' ? (Object.keys(spainCitiesByRegion) as Array<keyof typeof spainCitiesByRegion>) : [selectSpainRegion(region)]
    return regionKeys.flatMap((regionKey) =>
      spainCitiesByRegion[regionKey].map(
        (city, i) =>
          `${spainStreetPrefixes[i % spainStreetPrefixes.length]} ${spainStreetNames[i % spainStreetNames.length]}, ${20 + i}, ${28000 + i * 13} ${city}, ${spainProvinceByRegion[regionKey]}`,
      ),
    )
  }
  const seeds = generateAddresses(kind, 30, region)
  return Array.from(new Set(seeds))
}
