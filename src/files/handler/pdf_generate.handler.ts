import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { v4 } from 'uuid';
import * as puppeteer from 'puppeteer';
import * as ejs from 'ejs';

@Injectable()
export class PdfGenerateHandler {
  async pdfGenerate(
    template: string,
    data: object = {},
    options: puppeteer.PDFOptions = {},
    isFile = false,
  ) {
    const filePath = join(process.cwd(), 'views/pdf', `${template}.ejs`);
    const fileOutput = join(
      process.cwd(),
      `public/generated/${template}`,
      `${v4()}.pdf`,
    );

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      const html = await readFile(filePath, { encoding: 'utf8' });
      const content = ejs.render(html, data);

      await page.setContent(content);

      options = {
        path: isFile ? fileOutput : undefined,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: false,
        landscape: false,
        margin: {
          left: '0mm',
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
        },
        ...options,
      };

      const buffer = await page.pdf(options).catch((e) => {
        console.log('e', e);
      });
      await browser.close();
      return isFile ? fileOutput : buffer;
    } catch (e) {
      console.log(e);
    }
  }
}
