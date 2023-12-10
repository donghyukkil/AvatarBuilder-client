import getSvgDataArray from "./getSvgDataArray";

global.fetch = vi.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve("svg_data"),
  }),
);

const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe.only("test getSvgDataArray", () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    fetch.mockClear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("should fetch svg data from provided urls", async () => {
    const urls = ["http://example.com/svg1", "http://example.com/svg2"];
    const result = await getSvgDataArray(urls);

    expect(result).toEqual(["svg_data", "svg_data"]);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith("http://example.com/svg1");
    expect(fetch).toHaveBeenCalledWith("http://example.com/svg2");
  });

  test("should return empty array when no URLs are provided", async () => {
    const result = await getSvgDataArray([]);

    expect(result).toEqual([]);
    expect(fetch).toHaveBeenCalledTimes(0);
  });

  test("should log error message when fetching fails", async () => {
    global.fetch = vi.fn(() => Promise.reject("API is down"));

    const errorSpy = vi.spyOn(console, "error");

    const urls = ["http://example.com/svg1"];
    await getSvgDataArray(urls);

    expect(errorSpy).toHaveBeenCalledWith("Error fetching data");

    errorSpy.mockRestore();
  });

  test("should not log error message during normal operation", async () => {
    const errorSpy = vi.spyOn(console, "error");

    const urls = ["http://example.com/svg1", "http://example.com/svg2"];

    await getSvgDataArray(urls);

    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
