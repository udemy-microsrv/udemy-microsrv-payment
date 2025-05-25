export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3001', 10),
  },
});
