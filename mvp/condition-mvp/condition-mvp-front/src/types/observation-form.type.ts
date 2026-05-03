import { ComponentObservationTypeDto } from "@/types/dto.type";

export interface NewObservationType {
  category: string;
  code: string;
  value: string;
  date: string;
  components: ComponentObservationTypeDto[];
}

export interface EditObservationType {
  id: string;
  category: string;
  code: string;
  value: string;
  date: string;
  components: ComponentObservationTypeDto[];
}
