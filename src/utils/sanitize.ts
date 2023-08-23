import xss from "xss"
import { Request, Response, NextFunction } from "express"

// Middleware function to sanitize request data against XSS
export default function sanitizeRequestData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Sanitize req.body
  if (req.body) {
    req.body = sanitizeObject(req.body)
  }

  // Sanitize req.params
  if (req.params) {
    req.params = sanitizeObject(req.params)
  }

  // Sanitize req.query
  if (req.query) {
    req.query = sanitizeObject(req.query)
  }

  next()
}

// Helper function to sanitize an object's properties against XSS
function sanitizeObject(data: Record<string, unknown>): Record<string, string> {
  const sanitizedData: Record<string, string> = {}
  for (const [key, value] of Object.entries(data)) {
    sanitizedData[key] = xss(value as string) // Explicitly cast value to string
  }
  return sanitizedData
}
