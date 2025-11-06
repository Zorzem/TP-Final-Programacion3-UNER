import app from './reservas.js'

process.loadEnvFile();

app.listen(process.env.PUERTO, () => {
  console.log(`Servidor arriba en el puerto ${process.env.PUERTO}`);
})