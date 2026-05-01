import { EditObservationType } from "@/components/observations/EditObservationModal";
import { NewObservationType } from "@/components/observations/NewObservationModal";
import { ObservationType } from "@/types/dto.type";
import axios, { AxiosResponse, isAxiosError } from "axios";

const handleErrorApi = <T>(error: unknown) => {
  if (axios.isAxiosError(error)) {
    const tokenExpired = error.response?.data?.error === "TokenExpiredError";

    return {
      data: [] as unknown as T,
      error: true,
      message: tokenExpired
        ? "Sesion vencida"
        : ((error.response?.data?.message ?? "") as string),
    };
  } else {
    return {
      data: [] as unknown as T,
      error: true,
      message: "Error no controlado handleErrorApi",
    };
  }
};

const handleResponseApi = <T>(response: AxiosResponse) => ({
  data: response.data.data as T,
  error: false,
  message: "",
});
// Crea una instancia de Axios con la URL base configurada en el archivo .env
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // Tiempo de espera para las solicitudes
});

export async function addObservation(
  accessToken: string,
  observation: NewObservationType & { patient_id: string }
) {
  try {
    const response = await api.post(
      `/patients/${observation.patient_id}/observations`,
      observation,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return handleResponseApi<ObservationType>(response);
  } catch (error) {
    return handleErrorApi<ObservationType>(error);
  }
}

export async function updateObservation(
  accessToken: string,
  observation: EditObservationType
) {
  try {
    const response = await api.put(`/observations/${observation.id}`, observation, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return handleResponseApi<ObservationType>(response);
  } catch (error) {
    return handleErrorApi<ObservationType>(error);
  }
}

export async function removeObservation(
  accessToken: string,
  observationId: string
) {
  try {
    const response = await api.delete(`/observations/${observationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponseApi<ObservationType>(response);
  } catch (error) {
    return handleErrorApi<ObservationType>(error);
  }
}

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    if (isAxiosError(error)) {
      return Promise.reject(error);
    }

    // signOut();
    return Promise.reject(new Error(error));
  }
);
