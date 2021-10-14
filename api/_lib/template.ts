import { readFileSync } from "fs";

const css = readFileSync(`${__dirname}/template.css`).toString("utf8");
const times = readFileSync(`${__dirname}/../_fonts/times.ttf`).toString(
  "base64"
);

export type ParsedRequest = [string, number, string, string[]];

export function getHtml(parsedReq: ParsedRequest) {
  const [alias, age, location, photos] = parsedReq;

  return `
<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Comp Card</title>
    <style>
        @font-face {
            font-family: Times;
            font-style:  normal;
            font-weight: normal;
            src: url(data:font/ttf;charset=utf-8;base64,${times}) format('truetype');
        }
    </style>
    <style>
        ${css}
    </style>
    <body>
        <div class="container space-x-4">
            <div class="img lg" style="background-image: url('${
              photos[0]
            }');"></div>

            <div class="profile">
                <div class="header">

                    <div class="title text-bg">
                        <h1>${alias}</h1>
                    </div>

                    <div class="subtitle space-x-4">
                        <div class="text-bg sm">
                            <h2 class="purple">${age}</h2>
                        </div>

                        <div class="text-bg sm">
                            <h2>${location}</h2>
                        </div>
                    </div>

                </div>

                <div class="gallery space-x-4">
                    ${photos
                      .slice(1)
                      .map(
                        (img) =>
                          `<div class="img sm" style="background-image: url('${img}');"></div>`
                      )
                      .join("")}
                </div>
            </div>
        </div>
    </body>
</html>`;
}
