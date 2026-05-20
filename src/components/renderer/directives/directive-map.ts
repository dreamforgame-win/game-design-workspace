import { BattleFlow } from './BattleFlow'
import { Timeline } from './Timeline'
import { CardDirective } from './Card'
import { WarningDirective } from './Warning'
import { SystemDirective } from './System'
import { FeatureDirective } from './Feature'
import { Loop } from './Loop'
import { Balance } from './Balance'
import { Economy } from './Economy'
import { Matrix } from './Matrix'
import { Stats } from './Stats'

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
  'directive-loop': Loop,
  'directive-balance': Balance,
  'directive-economy': Economy,
  'directive-matrix': Matrix,
  'directive-stats': Stats,
}
