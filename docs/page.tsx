"use client"

import dynamic from "next/dynamic"
import "swagger-ui-react/swagger-ui.css"
import spec from "@/swagger.json"

const SwaggerUI = dynamic<any>(
  () => import("swagger-ui-react"),
  { ssr: false }
)

export default function DocsPage() {
  return <SwaggerUI spec={spec} />
}