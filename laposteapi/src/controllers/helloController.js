export class HelloController {
  static index(_request, response) {
    response.json({
      success: true,
      message: "Hello, world!"
    });
  }
}
