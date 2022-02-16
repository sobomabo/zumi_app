export function successResponse(data) {
  return {
    success: true,
    data
  }
}

export function failedResponse(errors) {
  return {
    success: false,
    errors
  }
}