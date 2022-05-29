const app = require('./app');

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(
    `Server started on http://localhost:${port}; ` +
      `press Ctrl-C to terminate. `
  );
});
