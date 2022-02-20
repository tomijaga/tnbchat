declare module 'tinyurl' {
  export const shorten: (string: string) => Promise<string>;
}
