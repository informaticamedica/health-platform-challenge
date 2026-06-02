import { ansi } from './ansi';

type StartupInfo = {
  port: number;
  dbConnected: boolean;
  databaseUrl?: string;
};

const formatDatabaseTarget = (databaseUrl?: string): string => {
  if (!databaseUrl) return 'Base de datos desconocida';

  try {
    const url = new URL(databaseUrl);
    const database = url.pathname.replace(/^\//, '') || 'sin nombre';
    return `${database} @ ${url.host}`;
  } catch {
    return 'Base de datos desconocida';
  }
};

export const logStartup = ({ port, dbConnected, databaseUrl }: StartupInfo): void => {
  const now = new Date().toLocaleString('es-AR', { hour12: false });
  const baseUrl = `http://localhost:${port}`;
  const swaggerUrl = `${baseUrl}/docs`;
  const databaseStatus = dbConnected
    ? ansi.green(formatDatabaseTarget(databaseUrl))
    : ansi.red('Sin conexion');

  console.log('');
  console.log(ansi.bold(ansi.green('  Emergencias API lista para usar')));
  console.log(ansi.gray('  ─────────────────────────────────────────────'));
  console.log(`${ansi.bold('  Hora de inicio')} : ${ansi.cyan(now)}`);
  console.log(`${ansi.bold('  API')}            : ${ansi.blue(baseUrl)}`);
  console.log(`${ansi.bold('  Swagger')}        : ${ansi.magenta(swaggerUrl)}`);
  console.log(`${ansi.bold('  Base de datos')}  : ${databaseStatus}`);
  console.log(ansi.gray('  ─────────────────────────────────────────────'));
};
