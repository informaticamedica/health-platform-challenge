import csvParser from "csv-parser";
import fs from "fs";

const loincSet: Set<string> = new Set();

/**
 * Carga los códigos LOINC desde un archivo CSV y los guarda en el conjunto `loincSet`.
 * @param filePath Ruta del archivo CSV.
 * @returns Promesa que se resuelve cuando la carga está completa.
 */
export const loadLoincCodes = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row: { LOINC_NUM: string }) => {
        if (row.LOINC_NUM) {
          loincSet.add(row.LOINC_NUM);
        }
      })
      .on("end", () => {
        console.log("Archivo CSV cargado en memoria.");
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

/**
 * Devuelve el conjunto de códigos LOINC cargados.
 * @returns Conjunto de códigos LOINC.
 */
export const getLoinCodecSet = (): Set<string> => loincSet;
/**
 * Busca un código LOINC en el archivo CSV y devuelve la fila correspondiente.
 * @param filePath Ruta del archivo CSV.
 * @param loincCode Código LOINC a buscar.
 * @returns Promesa que se resuelve con la fila encontrada o `null` si no se encuentra.
 */
export const findLoincCode = (
  loincCode: string,
  filePath: string = "src/db/csv/Loinc.csv"
): Promise<{ LOINC_NUM: string; COMPONENT: string } | null> => {
  return new Promise((resolve, reject) => {
    let foundRow: { LOINC_NUM: string; COMPONENT: string } | null = null;
    const readStream = fs
      .createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row: { LOINC_NUM: string; COMPONENT: string }) => {
        if (row.LOINC_NUM === loincCode) {
          foundRow = row;
          // Stop reading the file once the code is found
          readStream.destroy();
        }
      })
      .on("end", () => {
        resolve(foundRow);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

/**
 * Carga el contenido del archivo CSV de LOINC en un vector.
 * @param filePath Ruta del archivo CSV.
 * @returns Promesa que se resuelve con el contenido del archivo CSV en un vector.
 */
export const loadLoincCsvToArray = (
  filePath: string = "src/db/csv/Loinc.csv"
): Promise<Array<{ LOINC_NUM: string; COMPONENT: string }>> => {
  return new Promise((resolve, reject) => {
    const results: Array<{ LOINC_NUM: string; COMPONENT: string }> = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row: { LOINC_NUM: string; COMPONENT: string }) => {
        results.push(row);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};
