import { BattleFlow } from './BattleFlow'
import { Timeline } from './Timeline'
import { CardDirective } from './Card'
import { WarningDirective } from './Warning'
import { SystemDirective } from './System'
import { FeatureDirective } from './Feature'

/**
 * Maps directive element names (from hast) to React components.
 * Keys match the tagName produced by remarkDirectiveToHast:
 *   directive-battleflow → BattleFlow
 *   directive-timeline   → Timeline
 *   etc.
 */
export const directiveComponentMap: Record<string, React.ComponentType<any>> = {
  'directive-battleflow': BattleFlow,
  'directive-timeline': Timeline,
  'directive-card': CardDirective,
  'directive-warning': WarningDirective,
  'directive-system': SystemDirective,
  'directive-feature': FeatureDirective,
}
