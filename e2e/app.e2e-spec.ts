import { MyTextAppPage } from './app.po';

describe('my-text-app App', function() {
  let page: MyTextAppPage;

  beforeEach(() => {
    page = new MyTextAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
