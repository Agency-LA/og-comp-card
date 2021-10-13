import { VercelRequest, VercelResponse } from '@vercel/node'
import safe64 from 'urlsafe-base64'

import { getScreenshot } from './_lib/chromium'
import { getHtml, ParsedRequest } from './_lib/template'

const FALLBACK_OG_IMAGE =
  'https://uploads-ssl.webflow.com/60f1dac8e2e57dfb3224242c/61186719883bea9eebb2a074_og_preview.jpg'

const fileType: 'png' | 'jpeg' = 'jpeg'
const isDev = !process.env.AWS_REGION
const isHtmlDebug = process.env.OG_HTML_DEBUG === '1'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('HTTP ' + req.url)
  const q = req.query.hash

  try {
    const parsedReq = JSON.parse(
      safe64.decode(q as string).toString()
    ) as ParsedRequest
    const html = getHtml(parsedReq)
    if (isHtmlDebug) {
      res.setHeader('Content-Type', 'text/html')
      res.end(html)
      return
    }
    const file = await getScreenshot(html, fileType, isDev)
    res.statusCode = 200
    res.setHeader('Content-Type', `image/${fileType}`)
    res.setHeader(
      'Cache-Control',
      `public, s-maxage=86400, max-age=86400, stale-while-revalidate=604800`
    )
    res.end(file)
  } catch (e) {
    res.statusCode = 302
    res.redirect(302, FALLBACK_OG_IMAGE)
    console.error(e)
  }
}
