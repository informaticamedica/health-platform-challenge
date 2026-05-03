import ConditionModel, { ConditionRecord } from "../models/condition.model";

const ConditionService = {
  async list() {
    return ConditionModel.findAll();
  },

  async listByPatient(patientId: string) {
    return ConditionModel.findAllByPatient(patientId);
  },

  async create(input: Omit<ConditionRecord, "id">) {
    return ConditionModel.create(input);
  },

  async update(
    id: string,
    input: Omit<ConditionRecord, "id" | "created_by">
  ) {
    return ConditionModel.update(id, input);
  },
};

export default ConditionService;
