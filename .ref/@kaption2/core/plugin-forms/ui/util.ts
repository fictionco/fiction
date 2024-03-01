export const deviceModes = ['desktop', 'mobile', 'tablet', 'landscape'] as const
export type DeviceMode = typeof deviceModes[number]
