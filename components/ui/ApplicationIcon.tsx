import {
  IconBuildingFactory2,
  IconCandy,
  IconFlask2,
  IconMilk,
  IconPill,
  IconRecycle,
  IconToolsKitchen2,
} from '@tabler/icons-react'

import type { IconKey } from '@/content/applications'

const MAP = {
  food: IconToolsKitchen2,
  dairy: IconMilk,
  chocolate: IconCandy,
  chemical: IconFlask2,
  pharma: IconPill,
  wastewater: IconRecycle,
  industrial: IconBuildingFactory2,
} as const satisfies Record<IconKey, unknown>

/** One icon family, one stroke weight, across the whole site. */
export function ApplicationIcon({ name, className }: { name: IconKey; className?: string }) {
  const Glyph = MAP[name]
  return <Glyph className={className} size={30} stroke={1.5} aria-hidden="true" />
}
