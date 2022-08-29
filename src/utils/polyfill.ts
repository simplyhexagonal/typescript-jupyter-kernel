/**
 * typescript-jupyter-kernel/src/utils/polyfill.ts
 * 
 * THIS FILE IS NOT INTENDED FOR NORMAL USAGE
 * 
 * It is meant to be read as a string, modified with runtime replacements,
 * then injected into cell code sent to typescript-jupyter-kernel.
*/

interface Jupyter {
  escape: (input: string) => string;
  out: (...args: any[]) => void;
  raw: (...args: any[]) => void;
  dom: JSDOM;
  render: () => void;
  kernelDir: string;
  data: D3Dsv;
  html: D3Selection;
  table: (
    rows: any[][],
    hasHeaderRow: boolean,
    customTableStyles?: string,
  ) => void;
  load: {
    js: (file: string) => void;
    css: (file: string) => void;
  };
};

interface CustomGlobal extends Global {
  jupyter: Jupyter;
  window: Window;
  document: Document;
  navigator: Navigator;
}

declare const global: CustomGlobal;

import { readFileSync as jupReadFileSync } from 'fs';
import { JSDOM } from 'jsdom';
declare type D3Dsv = typeof import('d3-dsv');
declare type D3Selection = typeof import('d3-selection');

//@ts-ignore
const escape = (await import('SCRIPT_PATH_ESCAPE_UNICODE')).default;
//@ts-ignore
const data = await import('SCRIPT_PATH_D3_DSV');
//@ts-ignore
const html = await import('SCRIPT_PATH_D3_SELECTION');

const defaultTableStyles = `
  .table-class {
    border-collapse: collapse;
    font-family: Tahoma, Geneva, sans-serif;
  }
  .table-class td, .table-class th {
    padding: 15px;
  }
  .table-class th {
    background-color: #54585d;
    color: #ffffff;
    font-weight: bold;
    font-size: 13px;
    border: 1px solid #54585d;
  }
  .table-class td {
    color: #636363;
    border: 1px solid #dddfe1;
  }
  .table-class tr {
    background-color: #f9fafb;
  }
  .table-class tr:nth-child(odd) {
    background-color: #ffffff;
  }
`;

const jupyter: Jupyter = {
  escape,
  data,
  html,
  out: console.log,
  raw: (...args) => {
    console.log('<pre>'); console.log(...args); console.log('</pre>');
  },
  dom: new JSDOM('<!DOCTYPE html><body></body>', { pretendToBeVisual: true, runScripts: 'dangerously' }),
  render: () => {
    jupyter.out(jupyter.escape(jupyter.dom.serialize()));
  },
  kernelDir: 'PATH_KERNEL_DIR',
  table: (rows, hasHeaderRow = false, customTableStyles) => {
    const hexStamp = Math.floor(+new Date()).toString(16);
    const tableClass = `table-${hexStamp}`;

    const style = jupyter.html.select('body').append('style');
    const table = jupyter.html.select('body').append('table');

    style.text((customTableStyles || defaultTableStyles).replace(/table-class/g, tableClass));

    if (hasHeaderRow) {
      const [ headerRows ] = rows;

      table.selectAll('tr')
        .data([headerRows])
        .enter()
        .append('tr')
      .selectAll('th')
        .data((d) => d)
        .enter()
        .append('th')
        .text((d) => d);
    }

    table.selectAll('tr')
      .data(rows).enter()
      .append('tr')
    .selectAll('td')
      .data((d) => d).enter()
      .append('td')
      .text((d) => d);

    table.attr('class', `${tableClass}`);
  },
  load: {
    js: (file: string) => console.log(`<script>${jupReadFileSync(file, 'utf-8')}</script>`),
    css: (file: string) => console.log(`<style>${jupReadFileSync(file, 'utf-8')}</style>`),
  },
};


global.jupyter = jupyter;
global.window = jupyter.dom.window as unknown as (Window & typeof globalThis);
global.navigator = window.navigator;
global.document = window.document;
