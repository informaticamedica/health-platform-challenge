export type FhirObservation = {
  resourceType: "Observation";
  status: string;
  code: { text: string };
};
