const convert = (envVariable: any) => {
  const varString = envVariable

  // Convert the var string to a number (if it's defined and valid)
  const variable: number | undefined = varString
    ? parseInt(varString, 10)
    : undefined

  if (variable !== undefined && isNaN(variable)) {
    // Handle the case where the PORT value is not a valid number
    console.error("Invalid PORT value:", varString)
    return undefined
  } else {
    return variable
  }
}
export default convert
