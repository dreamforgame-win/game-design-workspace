/**
 * Directive type definitions for the rendering pipeline
 */

export interface DirectiveNode {
  name: string
  attributes: Record<string, string>
  children: string // raw content between ::: markers
}

/**
 * Supported directive names
 */
export type DirectiveName =
  | 'battleflow'
  | 'timeline'
  | 'card'
  | 'warning'
  | 'system'
  | 'feature'

/**
 * Feature status values for :::feature directive
 */
export type FeatureStatus = 'design' | 'dev' | 'done' | 'cut'
