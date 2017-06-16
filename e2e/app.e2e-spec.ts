import { PevcPage } from './app.po';

describe('pevc App', () => {
  let page: PevcPage;

  beforeEach(() => {
    page = new PevcPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
