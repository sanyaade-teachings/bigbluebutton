const { expect } = require('@playwright/test');
const e = require('../core/elements');
const { ELEMENT_WAIT_LONGER_TIME } = require('../core/constants');
const { MultiUsers } = require('../user/multiusers');
const { constructClipObj } = require('../core/util');

const defaultZoomLevel = '100%';
const zoomedInZoomLevel = '125%';
const maxZoomLevel = '400%';

class Eraser extends MultiUsers {
  constructor(browser, context) {
    super(browser, context);
  }

  async test() {
    await this.modPage.waitForSelector(e.whiteboard, ELEMENT_WAIT_LONGER_TIME);

    const wbBox = await this.modPage.getElementBoundingBox(e.whiteboard);
    const clipObj = constructClipObj(wbBox);
    const screenshotOptions = {
      maxDiffPixels: 1000,
      clip: clipObj,
    };

    await this.modPage.waitAndClick(e.wbShapesButton);
    await this.modPage.waitAndClick(e.wbLineShape);

    await this.modPage.page.mouse.move(wbBox.x + 0.3 * wbBox.width, wbBox.y + 0.3 * wbBox.height);
    await this.modPage.page.mouse.down();
    await this.modPage.page.mouse.move(wbBox.x + 0.7 * wbBox.width, wbBox.y + 0.7 * wbBox.height);
    await this.modPage.page.mouse.up();

    await this.modPage.waitAndClick(e.wbEraser);
    await this.modPage.page.mouse.move(wbBox.x + 0.3 * wbBox.width, wbBox.y + 0.7 * wbBox.height);
    await this.modPage.page.mouse.down();
    await this.modPage.page.mouse.move(wbBox.x + 0.7 * wbBox.width, wbBox.y + 0.3 * wbBox.height);

    await expect(this.modPage.page).toHaveScreenshot('moderator1-eraser1.png', screenshotOptions);
    await expect(this.modPage.page).toHaveScreenshot('moderator2-eraser1.png', screenshotOptions);

    await this.modPage.page.mouse.up();
    await expect(this.modPage.page).toHaveScreenshot('moderator1-eraser2.png', screenshotOptions);
    await expect(this.modPage2.page).toHaveScreenshot('moderator2-eraser2.png', screenshotOptions);
  }
}

exports.Eraser = Eraser;