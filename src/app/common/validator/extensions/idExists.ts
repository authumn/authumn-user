export const idExists = {
  async: true,
  type: 'number',
  validate: async (schema: boolean, data) => {
    return false
  }
}
