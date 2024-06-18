class HelloController {
  static index(_request, response) {
    response.json({
      success: true,
      message: "Hello, world!"
    });
  }
}

module.exports = HelloController;