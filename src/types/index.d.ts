declare module '*.json' {
  const value: any
  export default value
}

type Partial<T> = {
  [P in keyof T]?: T[P];
}
