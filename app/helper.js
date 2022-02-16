export const clickLink = async (page, xpathSelector) => {
    try {
      const links = await page.$x(xpathSelector);
      if (links.length > 0) {
        await links[0].click();
      } else {
        throw new Error(`Link not found: ${text}`);
      }
    } catch (error) {
      throw new Error(error);
    }
  };  