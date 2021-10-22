import core from 'puppeteer-core'

import { getOptions } from './options'

type FileType = 'png' | 'jpeg'

let _page: core.Page | null

async function getPage(isDev: boolean) {
  if (_page) {
    return _page
  }
  const options = await getOptions(isDev)
  const browser = await core.launch(options)
  _page = await browser.newPage()
  return _page
}

export async function getScreenshot(
  html: string,
  type: FileType,
  isDev: boolean
) {
  const page = await getPage(isDev)
  await page.setViewport({ width: 2400, height: 1260 })
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.waitForTimeout(1000)
  const file = await page.screenshot({ type })
  return file
}
