import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const API_BASE_URL = 'https://plex-parser.ru-rating.ru/cars?'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('_limit') || '12'
    const page = searchParams.get('_page') || '1'
    const query = searchParams.get('q') || ''

    const apiUrl = new URL(API_BASE_URL)
    apiUrl.searchParams.append('_limit', limit)
    apiUrl.searchParams.append('_page', page)
    if (query) {
      apiUrl.searchParams.append('q', query)
    }

    const response = await fetch(apiUrl.toString(), {
      headers: {}
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
